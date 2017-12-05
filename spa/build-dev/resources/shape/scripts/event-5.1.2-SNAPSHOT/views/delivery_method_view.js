define([
    'foobunny',
    'global_context',
    'models/singlelisting_model',
    'helpers/event_helper'
    ], function(Foobunny, gc, SingleListingModel, EventHelper) {
        'use strict';

        var DeliveryMethodView = Foobunny.BaseView.extend({
            initialize: function() {
                this.render();
                this.subscribeEvent('buildyourorder:getDeliveryDate', this.callSingleListing);
            },

            template: gc.appFolder + '/delivery_method',

            uiEl: {
                $deliverySpinner: '.delivery-spinner',
                $deliveryDate: '.deliverydate'
            },

            show: function() {
                this.uiEl.$deliveryDate.removeClass('hide');
            },

            callSingleListing: function(byoTicketModel) {
                var singleTicketPromise,
                    deliveryDate = byoTicketModel.get('deliveryDate'),
                    listingId = byoTicketModel.get('listingId'),
                    error,
                    self = this;

                this.uiEl.$deliverySpinner.removeClass('hide');

                // If delivery Date is present for Single ticket mode, do not make another api call
                if (deliveryDate) {
                    this.model = byoTicketModel;
                    this.displayDate();
                } else {
                    this.model = new SingleListingModel(listingId);

                    singleTicketPromise = this.model.fetch();

                    singleTicketPromise.done(function(response) {
                        if (response && response.deliveryMethods) {
                            byoTicketModel.setSilent('deliveryDate', response.deliveryMethods[0].estimatedDeliveryTime);
                            self.displayDate();
                        } else {
                            self.uiEl.$deliverySpinner.addClass('hide');
                        }
                    }).fail(function(errorResponse) {
                        self.uiEl.$deliverySpinner.addClass('hide');

                        if (errorResponse) {
                            error = errorResponse.responseJSON;

                            if (error && error.code === 'inventory.listings.listingAlreadySold' || error.code === 'inventory.listings.invalidListingid') {
                                self.publishEvent('deliveryMethodView:byoTicketExpired', byoTicketModel);
                                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
                            }
                        }
                    });
                }
            },

            displayDate: function() {
                var self = this;

                this.render();
                setTimeout(function() {
                    self.show();
                },0);
            }

        });

    return DeliveryMethodView;
});
