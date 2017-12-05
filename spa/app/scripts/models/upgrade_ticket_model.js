define([
    'foobunny',
    'global_context',
    'globals',
    'models/singlelisting_model',
    'helpers/event_helper'
], function(Foobunny, gc, globals, SingleListingModel, EventHelper) {
    'use strict';

    var UpgradeTicketModel = SingleListingModel.extend({
        initialize: function() {
            this.url = '';
            this.urlHeaders = gc.url_headers || {};
        },

        prepareUpgradeUrl: function(byoTicketData) {
            var url = '/shape/recommendations/ticket/v2/alternatelistings/upsell?numberOfListings=1&eventId=' + gc.event_id + '&algorithmId=' + globals.upgradeTicket.apiAlgorithmId;

            //filter quantity
            url += '&seatQuantity=' + byoTicketData.qty;
            this.qty = byoTicketData.qty;

            url += '&currentPrice=' + byoTicketData.price;

            url += '&listingId=' + byoTicketData.listingId;

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

                listing.quantity = this.qty;
            }

            return listing;
        }
    });
    return UpgradeTicketModel;
});
