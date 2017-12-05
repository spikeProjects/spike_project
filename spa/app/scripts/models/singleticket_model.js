define([
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper',
    'helpers/delivery_helper'
], function(Foobunny, gc, globals, EventHelper, DeliveryHelper) {
    'use strict';

    var SingleTicketModel = Foobunny.BaseModel.extend({
        initialize: function(singleListingId) {
            console.log('--SingleTicketModel-- in initialize()', this);

            this.urlHeaders = gc.url_headers || {};

            this.url = '/shape/inventory/listings/v1/' + singleListingId;

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

        validate: function(attrs) {
            var validateMessage;
            // Throw an error if the event id in the URL does not match the event id returned
            // by the API. The single ticket listing does not have event id as an input
            // parameter.
            if (attrs.eventId !== Number(gc.event_id)) {
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
            if (this.get('splitOption') === 0) {
                var splitVector = this.get('splitVector').split(',').map(Number);
                this.set('splitVector', splitVector);
            }
        },

        updateTotalCost: function() {
            this.set('totalCost', (this.get('usePrice').amount * this.get('qty')).toFixed(2));
        },

        parse: function(result) {

            var listing = result.ListingResponse.listing,
                featureType,
                seatNumbersArray,
                deliveryMethods,
                currentDate,
                nextDate,
                deliveryIds = [17, 22],
                withFees = globals.PDO.withFees,
                deliveryMethodList = {};

            listing.usePrice = (withFees ? listing.displayPricePerTicket : listing.currentPrice);

            // Create split vector array from response string
            if (listing.splitOption > 0) {
                // Convert split vector from string to array of integers
                listing.splitVector = listing.splitVector.split(',').map(Number);
                listing.qty = listing.splitVector[0];
            } else {
                listing.qty = Number(listing.splitVector);
            }
            listing.totalCost = listing.qty * listing.usePrice.amount;

            // Add single ticket section to globals for parsing in ticketlist_view
            globals.singleTicketSection = listing.sectionId;
            deliveryMethods = listing.deliveryMethods;

            // For UPS delivery, choose the delivery type closer to the event date except
            // id = 17 for Pickup
            // 22 for UPS worldwide
            for (var index = 0; index < listing.deliveryMethods.length; index++) {
                if (deliveryMethods[index].id && _.indexOf(deliveryIds, deliveryMethods[index].id) === -1) {
                    if (!listing.deliveryDate) {
                        listing.deliveryDate = deliveryMethods[index].accurateDeliveryDateTime;
                    } else {
                        currentDate = new Date(listing.deliveryDate).getTime();
                        nextDate = new Date(deliveryMethods[index].accurateDeliveryDateTime).getTime();

                        if (nextDate > currentDate) {
                            listing.deliveryDate = deliveryMethods[index].accurateDeliveryDateTime;
                        }
                    }
                }
            }

            // create delivery id, name mapping
            _.each(listing.deliveryMethods, function(deliveryMethod) {
                var name = DeliveryHelper.getDeliveryMethodName(deliveryMethod.id, deliveryMethod.name);
                deliveryMethodList[deliveryMethod.id] = name;
            });

            listing.deliveryTypeList = _.map(DeliveryHelper.combinePaperDelivery(_.keys(deliveryMethodList), 'deliveryMethod'), function(id) {
                return {
                    id: id,
                    deliveryAttribute: deliveryMethodList[id]
                };
            });

            // Convert the deliveryMethods to deliveryTypeList making it easy on the templates.
            listing.listingAttributeList = listing.listingAttributesList.map(function(listingAttribute) {

                featureType = EventHelper.checkFeatureType(listingAttribute.id);

                return {
                    id: listingAttribute.id,
                    listingAttribute: listingAttribute.name,
                    featureIcon: featureType.featureIcon,
                    valueType: featureType.valueType
                };
            });

            listing.singleTicket = true;

            //add the count of categorized and un-categorized ticket feature types to make it easier on dust
            listing.iconCounts = _.countBy(listing.listingAttributeList, function(attribute) {
                if (!attribute) {
                    return;
                }
                return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
            });

            if (listing.seatNumbers) {
                seatNumbersArray = listing.seatNumbers.split(',') || [];
                listing.seatNumbersArray = seatNumbersArray;

                listing.seats = [{
                    'ticketSeatId': '',
                    'seatNumber': listing.seatNumbers,
                    'listingId': listing.listingId,
                    'row': listing.row,
                    'seatNumbersArray': seatNumbersArray,
                    'seatNumberFirst': seatNumbersArray[0],
                    'seatNumberLast': seatNumbersArray[seatNumbersArray.length - 1]
                }];
            } else {
                listing.seats = [{
                    'ticketSeatId': null,
                    'seatNumber': null,
                    'listingId': listing.listingId,
                    'row': listing.row,
                    'seatNumbersArray': null,
                    'seatNumberFirst': null,
                    'seatNumberLast': null
                }];
            }
            // Work around for setting the bucket.
            if (gc.tktbkt) {
                listing.valueBucket = gc.tktbkt;
            }

            return listing;
        }
    });
    return SingleTicketModel;
});
