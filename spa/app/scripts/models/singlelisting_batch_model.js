/* global _ */
define([
    'foobunny',
    'globals',
    'global_context',
    'common-batchModel',
    'collections/listingcontroller_collection',
    'models/buyerpays_model',
    'helpers/event_helper',
    'i18n'
], function(Foobunny, globals, gc, BatchModel, ListingCollection, BuyerPaysModel, EventHelper, i18n) {
    'use strict';

    /*
        06/17/2016: Single ticket view is using the listings/v1 data structure to render.
        The inventory/listings/v2 data structure is different from inventory/listings/v1.
        Hence, we are going to have to re-structure the data to match what is being returned by the
        inventory/listings/v1 so that we can render the single ticket view.

        Note: The inventory/listings/v2 is missing certain pieces of information. Hence, we cannot
        move to inventory/listings/v2 just yet. Also, moving to inventory/listings/v2 would mean that
        we should get the data structure from the search inventory also aligned. It is not a simple
        change to move from search/inventory/v2 and inventory/listings/v1 combination to
        search/inventory/v2/listings and inventory/listings/v2 combination. It will require a significant
        amount of effort.

        Solution: Introduction of the ListingModel. This model will be an interface between the various
        APIs and the views. All the data that is required by the views/templates should come *ONLY* from
        this model and nowhere else. This solution requires some thought and a lot of work.
    */

    var SingleListingBatchModel = BatchModel.extend({
        initialize: function(params, options) {

            options = options || {};
            params = params || {};

            this.collections = {
                listings: new ListingCollection()
            };

            this.models = {
                buyerPays: new BuyerPaysModel()
            };

            BatchModel.prototype.initialize.apply(this, arguments, options);
        },

        fetch: function(listings, options) {
            this.urlHeaders = _.extend(this.urlHeaders, gc.url_headers || {}, {
                Timeout: 15000
            });

            // Set whether the blended logic was applied or not.
            this.setSilent('blendedApplied', listings[0].ticketSeatId ? true : false);

            this.collections.listings.setListings(listings);
            this.models.buyerPays.setListings(listings);

            return BatchModel.prototype.fetch.call(this, options);
        },

        setListings: function(listings) {
            this.collections.listings.setListings(listings);
            this.models.buyerPays.setListings(listings);
        },

        checkApiErrors: function(responses) {
            var thisResponse,
                errorObject = {
                    error: false
                };

            for (var i = 0; i < responses.length; i++) {
                thisResponse = responses[i];
                if (thisResponse.batchRequestId) {
                    if (thisResponse.batchRequestId === '-1' || thisResponse.status !== '200') {
                        EventHelper.logAppState('fetch', null, {
                            'apiName': thisResponse.batchRequestId,
                            'apiStatus': thisResponse.status,
                            'apiResponse': thisResponse.body
                        });
                        errorObject.error = true;
                        errorObject.status = thisResponse.status;
                        errorObject.statusText = thisResponse.body;
                        break;
                    }
                }
            }

            return errorObject;
        },

        collateSingleListing: function() {
            var listing = {},
                listings,
                buyerPays;

            // Get the Listings Information from the listings collection.
            listings = this.collections.listings.get('listings');
            buyerPays = this.models.buyerPays.get('buyerPaysResponse');

            listing = _.extend(listing, {}, this.getListingDetails(listings));
            listing = _.extend(listing, {}, this.getListingPrice(listing.quantity, buyerPays));

            listing.singleTicket = true;
            listing.usePrice = (globals.PDO.withFees ? listing.displayPricePerTicket : listing.currentPrice);
            listing.totalCost = listing.qty * listing.usePrice.amount;
            listing.deliveryTypeList = listing.deliveryMethods;

            listing.listingAttributeList = this.getListingsAttributeList(listings);

            //add the count of categorized and un-categorized ticket feature types to make it easier on dust
            listing.iconCounts = _.countBy(listing.listingAttributeList, function(attribute) {
                if (!attribute) {
                    return;
                }
                return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
            });
            // Work around for setting the bucket.
            if (gc.tktbkt) {
                listing.valueBucket = gc.tktbkt;
            }

            return listing;
        },

        getListingDetails: function(listings) {
            // NOTE: The zone id is not available from the listing controller api.
            // Altnerative solution might be to update the ticket details to find out
            // the zone id if it is not available (?)

            var listingObj = listings[0],
                seats = this.getSeats(listings),
                seatNumbersArray = (this.get('blendedApplied') ? _.map(seats, function(element) {
                        return element.seat;
                    }) : listingObj.seats.split(',')),
                qty = this.getTotalQuantity(listings),
                seatNumberLast = seatNumbersArray.length > 1 ? seatNumbersArray[seatNumbersArray.length - 1] : '',

                returnObj = {
                    listingId: listingObj.listingId,
                    eventId: listingObj.event.eventId,
                    eventName: listingObj.event.name,
                    currencyCode: listingObj.pricePerProduct.currency,
                    totalTickets: qty,
                    sectionId: listingObj.venueConfigSectionsId,
                    sectionName: listingObj.scrubbedSectionName || listingObj.products[0].section,
                    row: listingObj.products[0].row,
                    quantity: qty,
                    qty: qty,
                    seatNumbers: seatNumbersArray.join(', '),
                    seatNumbersArray: seatNumbersArray,
                    seatNumberFirst: seatNumbersArray[0],
                    seatNumberLast: seatNumberLast,
                    seats: seats,
                    splitVector: (this.get('blendedApplied') ? [qty] : listings[0].splitVector.split(',')),
                    // Deliverymethod is being hard code because the phase 1 of the blended for 76ers is only going to be instant download.
                    deliveryMethods: [{
                        id: 2,
                        name: i18n.get('event.common.deliveryType.2'),
                        deliveryAttribute: i18n.get('event.common.deliveryType.2')
                    }]
                };

            return returnObj;
        },

        getListingPrice: function(quantity, priceObj) {
            var totalPrices = priceObj.totalPrices,
                returnObj = {};

            // For Blended we are going to show the average price per ticket.
            // Since the API does not provide it we have to calculate it.
            for (var i = 0; i < totalPrices.length; i++) {
                if (totalPrices[i].categoryId === 1) {
                    returnObj.displayPricePerTicket = totalPrices[i].cost;
                } else if (totalPrices[i].categoryId === 8) {
                    returnObj.currentPrice = totalPrices[i].cost;
                }
            }

            returnObj.displayPricePerTicket.amount = (parseFloat(returnObj.displayPricePerTicket.amount) / quantity).toFixed(2);

            return returnObj;
        },

        getListingsAttributeList: function(listings) {
            var seatTraits = {},
                listingTraits,
                thisTrait,
                featureType;

            for (var i = 0; i < listings.length; i++) {
                if (!listings[i].traits) {
                    continue;
                }
                listingTraits = listings[i].traits;

                for (var j = 0; j < listingTraits.length; j++) {
                    thisTrait = listingTraits[j];

                    // Convert string to number.
                    thisTrait.id = Number(thisTrait.id);
                    if (seatTraits[thisTrait.id]) {
                        continue;
                    }
                    seatTraits[thisTrait.id] = thisTrait;
                }
            }

            seatTraits = _.map(seatTraits, function(thisTrait, key) {
                featureType = EventHelper.checkFeatureType(thisTrait.id);

                return {
                    id: thisTrait.id,
                    listingAttribute: thisTrait.name,
                    featureIcon: featureType.featureIcon,
                    valueType: featureType.valueType
                };
            });

            return seatTraits;
        },

        getSeats: function(listings) {
            var seats = [],
                seat1,
                seat2;

            for (var i = 0; i < listings.length; i++) {
                for (var j = 0; j < listings[i].products.length; j++) {
                    listings[i].products[j].listingId = listings[i].listingId;
                    listings[i].products[j].ticketSeatId = listings[i].products[j].productId;
                    listings[i].products[j].seatNumber = listings[i].products[j].seat;
                }
                seats = seats.concat(listings[i].products);
            }

            return seats.sort(function(a, b) {
                seat1 = Number(a.seat);
                seat2 = Number(b.seat);
                if (seat1 < seat2) { return -1; }
                if (seat1 > seat2) { return 1; }
            });
        },

        getTotalQuantity: function(listings) {
            var qty = 0;

            for (var i = 0; i < listings.length; i++) {
                qty += listings[i].products.length;
            }

            return qty;
        }
    });

    return SingleListingBatchModel;

});
