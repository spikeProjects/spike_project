/* global _ */
define([
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var BuyerPaysModel = Foobunny.BaseModel.extend({
        url: '/shape/pricing/aip/v1/buyerpays',
        method: 'POST',
        data: {
            buyerPaysRequest: {
                listings: []
            }
        },

        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
        },

        setListings: function(listings) {
            this.addListingToRequest(listings);
        },

        addListingToRequest: function(listings) {
            var thisListing,
                requestListings = [];

            for (var i = 0; i < listings.length; i++) {
                thisListing = listings[i];
                if (thisListing.quantity) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'quantity': thisListing.quantity
                    });
                } else if (thisListing.ticketSeatId) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'itemId': thisListing.ticketSeatId
                    });
                }
            }
            this.data.buyerPaysRequest.listings = requestListings;
        }
    });

    return BuyerPaysModel;

});
