define([
    'foobunny',
    'global_context',
    'models/singlelisting_model',
    'helpers/event_helper'
], function(Foobunny, gc, SingleListingModel, EventHelper) {
    'use strict';

    var SimilarTicketModel = SingleListingModel.extend({
        initialize: function() {
            this.url = '';
            this.urlHeaders = gc.url_headers || {};
        },

        prepareUpgradeUrl: function(ticketData) {
            var url = '/shape/recommendations/ticket/v2/alternatelistings/replacement?numberOfListings=1&eventId=' + gc.event_id;

            url += '&seatQuantity=' + ticketData.qty;
            this.qty = ticketData.qty;

            url += '&currentPrice=' + ticketData.price;

            url += '&listingId=' + ticketData.listingId;

            this.url = url;
        },

        fetchFail: function(error) {
            var logdata;

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

        parse: function(result) {
            var listing = result;
            if (result.listing) {
                listing = SingleListingModel.prototype.parse(result.listing[0].listing);
            }

             return listing;
        }
    });
    return SimilarTicketModel;
});
