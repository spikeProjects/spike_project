/* global _*/
define('event-singlelisting-model', [
    'foobunny',
    'global_context',
    'globals'
], function(Foobunny, gc, globals) {
    'use strict';

    var SingleListingModel = Foobunny.BaseModel.extend({

        defaults: {
            parkingListingId: ''
        },

        initialize: function() {
            console.log('-- Parking Model -- initialize');
            this.urlHeaders = gc.url_headers || {};
            this.key = 'parkingSingleListingModel';
        },

        loadMockData: function() {
            this.url = 'parkingpass.json';
            this.urlHeaders = {};
            return this.fetch();
        },

        parse: function(response) {
            var listing = response,
                currentDate,
                nextDate,
                deliveryIds = [17, 22],
                deliveryMethods = listing.deliveryMethods;

            if (typeof deliveryMethods !== 'undefined' && deliveryMethods.length) {
                // For UPS delivery, choose the delivery type closer to the event date but do NOT use
                // id = 17 for Pickup or id = 22 for UPS worldwide
                for (var index = 0; index < deliveryMethods.length; index++) {
                    if (deliveryMethods[index].id && _.indexOf(deliveryIds, deliveryMethods[index].id) === -1) {
                        if (!listing.deliveryDate) {
                            listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                            listing.deliveryDescription = deliveryMethods[index].name;
                        } else {
                            currentDate = new Date(listing.deliveryDate).getTime();
                            nextDate = new Date(deliveryMethods[index].estimatedDeliveryTime).getTime();

                            if (nextDate > currentDate) {
                                listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                                listing.deliveryDescription = deliveryMethods[index].name;
                            }
                        }
                    }
                }

                listing.deliveryTypeList = deliveryMethods.map(function(deliveryMethod) {
                    return {
                        id: deliveryMethod.id
                    };
                });
            }

            // TODO: We should not be referencing the GC object as this GC object might not be available in other apps.
            if (globals.PDO.withFees) {
                listing.usePrice = listing.buyerSeesPerProduct;
            } else {
                listing.usePrice = listing.pricePerProduct;
            }

            listing.listingId = Number(listing.id);

            return listing;
        },

        url: function() {
            return '/shape/inventory/listings/v2/' + this.get('parkingListingId');
        }

    });

    return SingleListingModel;

});
