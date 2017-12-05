define([
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper',
    'helpers/delivery_helper'
], function(Foobunny, gc, globals, EventHelper, DeliveryHelper) {
    'use strict';

    var SingleListingModel = Foobunny.BaseModel.extend({
        initialize: function(singleListingId) {
            this.urlHeaders = gc.url_headers || {};

            this.url = '/shape/inventory/listings/v2/' + singleListingId;

            this.on('change:qty change:usePrice', this.updateTotalCost);
        },

        defaults: {
            'singleTicketError': false // to display Error Message
        },

        // Overwriting the base class fetchFail since we want to reset the
        // gc.ticket_id to null.
        fetchFail: function(error) {
            var logdata;
            gc.ticket_id = null;
            Foobunny.BaseModel.prototype.fetchFail.apply(this, arguments);

            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        validate: function(attrs, options) {
            var validateMessage;
            // Throw an error if the event id in the URL does not match the event id returned
            // by the API. The single ticket listing does not have event id as an input
            // parameter.
            if (Number(attrs.eventId) !== Number(gc.event_id)) {
                validateMessage = 'Event id does not match listing';
            }

            // If the validateMessage is not null then it means that we have an error
            // and hence we have to clear the gc.ticket_id.
            if (!!validateMessage) {
                gc.ticket_id = null;
            }

            return validateMessage;
        },

        isQtyAvailableOnThisTicket: function(qty) {
            return this.fetched && this.get('splitVector').indexOf(qty) >= 0;
        },

        // In Single Ticket GA we are showing the drop down irrespective of whether the
        // ticket has vector splits or not. Hence, we need to convert non vector into
        // vector splits.
        convertIntoVector: function() {
            if (this.get('splitOption') === 'MULTIPLES') {
                var splitVector = this.get('splitVector').map(Number);
                this.set('splitVector', splitVector);
            }
        },

        updateTotalCost: function() {
            this.set('totalCost', (this.get('usePrice').amount * this.get('qty')).toFixed(2));
        },

        parse: function(result) {

            var listing = result,
                featureType,
                deliveryMethods,
                currentDate,
                nextDate,
                ticketRow = '',
                iconFeature = [],
                disclosures = [],
                seats = [],
                deliveryIds = [17, 22],
                withFees = globals.PDO.withFees,
                deliveryMethodList = {};

            listing.usePrice = (withFees ? listing.buyerSeesPerProduct : listing.pricePerProduct);

            // Create split vector array from response string
            if (listing.splitOption !== 'NONE') {
                // Convert split vector from string to array of integers
                listing.splitVector = listing.splitVector.split(',').map(Number);
                listing.qty = listing.splitVector[0];
            } else {
                // listing.qty = Number(listing.splitVector);
                listing.qty = listing.quantity;
            }
            listing.totalCost = listing.qty * listing.usePrice.amount;

            // Add single ticket section to globals for parsing in ticketlist_view
            globals.singleTicketSection = listing.venueConfigSectionId;

            listing.listingId = listing.id;
            listing.sectionName = listing.scrubbedSectionName;
            listing.sectionId = listing.venueConfigSectionId;
            listing.singleTicket = true;

            for (var index = 0; index < listing.products.length; index++) {
                if (listing.products[index].productType !== 'PARKING_PASS') {
                    ticketRow = listing.products[index].row;

                    if (typeof(listing.products[index].seat) === 'undefined') {
                        listing.products[index].seat = 'General Admission';
                        seats.push(listing.products[index].seat);
                        break;
                    }
                    seats.push(listing.products[index].seat);
                }
            }

            listing.seatNumbersArray = seats;

            listing.seatNumbers = listing.seatNumbersArray.join(', ');

            listing.seatNumberFirst = listing.seatNumbersArray[0];

            listing.seatNumberLast = listing.seatNumbersArray[listing.seatNumbersArray.length - 1];


            deliveryMethods = listing.deliveryMethods;

            if (listing.deliveryMethods && listing.deliveryMethods.length > 0) {
                // For UPS delivery, choose the delivery type closer to the event date except
                // id = 17 for Pickup
                // 22 for UPS worldwide
                for (index = 0; index < listing.deliveryMethods.length; index++) {
                    if (deliveryMethods[index].id && _.indexOf(deliveryIds, deliveryMethods[index].id) === -1) {
                        if (!listing.deliveryDate) {
                            listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                        } else {
                            currentDate = new Date(listing.deliveryDate).getTime();
                            nextDate = new Date(deliveryMethods[index].estimatedDeliveryTime).getTime();

                            if (nextDate > currentDate) {
                                listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                            }
                        }
                    }
                }

                // create delivery id, name mapping
                _.each(listing.deliveryMethods, function(deliveryMethod) {
                    var name = DeliveryHelper.getDeliveryMethodName(deliveryMethod.id, deliveryMethod.name);
                    deliveryMethodList[deliveryMethod.id] = name;
                });

                listing.deliveryTypeList = listing.deliveryMethods.map(function(deliveryMethod) {
                    var name = DeliveryHelper.getDeliveryMethodName(deliveryMethod.id, deliveryMethod.name);

                    return {
                        id: deliveryMethod.id, // TODO  let the API to return deliveryTypeId
                        deliveryAttribute: name
                    };
                });
            }

            // Convert the deliveryMethods to deliveryTypeList making it easy on the templates.
            if (listing.ticketTraits) {
                listing.listingAttributeList = listing.ticketTraits.map(function(listingAttribute) {

                    featureType = EventHelper.checkFeatureType(Number(listingAttribute.id));

                    if (listingAttribute.id === '501') {
                        for (var index = 0; index < listing.products.length; index++) {
                            if (listing.products[index].productType !== 'PARKING_PASS') {
                                if (listing.products[index].row !== listing.products[index + 1].row) {
                                    ticketRow = listing.products[index].row + ', ' + listing.products[index + 1].row;
                                    break;
                                }
                            }
                        }
                    }

                    return {
                        id: listingAttribute.id,
                        listingAttribute: listingAttribute.name,
                        featureIcon: featureType.featureIcon,
                        valueType: featureType.valueType
                    };
                });

                //add the count of categorized and un-categorized ticket feature types to make it easier on dust
                listing.iconCounts = _.countBy(listing.listingAttributeList, function(attribute) {
                    if (!attribute) {
                        return;
                    }
                    return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
                });

                // re-arrange listingAttribute to display in BYO page
                for (index = 0; index < listing.listingAttributeList.length; index++) {
                    if (listing.listingAttributeList[index].featureIcon) {
                        if (listing.listingAttributeList[index].featureIcon === 'none') {
                            if (disclosures.length < 1) {
                                listing.listingAttributeList[index].displayAlertIcon = true;
                            }
                            disclosures.push(listing.listingAttributeList[index]);
                        } else {
                            iconFeature.push(listing.listingAttributeList[index]);
                        }
                    }
                }

                listing.features = iconFeature.concat(disclosures);
            }

            if (listing.seatNumbers) {
                listing.seats = [{
                    'ticketSeatId': null,
                    'listingId': listing.id,
                    'row': ticketRow,
                    'seatNumber': listing.seatNumbers,
                    'seatNumbersArray': listing.seatNumbersArray,
                    'seatNumberFirst': listing.seatNumberFirst,
                    'seatNumberLast': listing.seatNumberLast
                }];
            } else {
                listing.seats = [{
                    'ticketSeatId': null,
                    'listingId': listing.id,
                    'row': ticketRow,
                    'seatNumber': null,
                    'seatNumbersArray': null,
                    'seatNumberFirst': null,
                    'seatNumberLast': null
                }];
            }

            // Work around for setting the bucket.
            if (gc.tktbkt) {
                listing.valueBucket = gc.tktbkt;
            }

            if (listing.businessGUID) {
                listing.businessGuid = listing.businessGUID;
            }

            return listing;
        }
    });
    return SingleListingModel;
});
