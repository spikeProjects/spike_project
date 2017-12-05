define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'url-parser',
    'collections/inventory_collection',
    'event-parkingpass-component'
], function(Foobunny, Hammer, globals, gc, i18n, currencyFormatUtil, EventHelper, CartHelper, urlParser, InventoryCollection, ParkingPass) {
    'use strict';

    var ParkingPassView = Foobunny.BaseView.extend({

        parkingPassDecorator: {},

        uiEl: {
            $parkingDetails: '.parking-container'
        },

        initialize: function() {
            this.subscribeEvent('buildyourorder:displayed', this.setParkingPass);
            this.subscribeEvent('buildyourorder:hidden', this.hide);
            this.subscribeEvent('parkingpass:more', this.displayMoreParkingPasses);
            this.subscribeEvent('parkingpass:displayed', this.displayed);
            this.subscribeEvent('parkingpass:add', this.trackAddParking);
            this.subscribeEvent('parkingpass:remove', this.trackRemoveParking);
        },

        context: function() {
            return {
                globals: globals
            };
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        setParkingPass: function() {
            var parkingAttributes;
            parkingAttributes = this.setParkingAttributes();
            // The following is a hack to get around the problem of creating multiple instances of the
            // parking pass component and also to avoid multiple listeners being added resulting in
            // multiple callbacks happening.
            if (_.isEmpty(this.parkingPassDecorator)) {
                this.createParkingPassComponent(parkingAttributes);
            } else {
                this.parkingPassDecorator.displayParkingPass(parkingAttributes);
            }
        },

        createParkingPassComponent: function(parkingAttributes) {
            this.parkingPassDecorator = new ParkingPass({
                'element': '.parking-container',
                'attributes': parkingAttributes,
                'add': this.add.bind(this),
                'remove': this.remove.bind(this),
                'more': this.more
            });
        },

        add: function(model) {
            var addPromise = CartHelper.addToCart(model),
                self = this;

            addPromise.always(self.cleanUpParamsAfterCart);
            return addPromise;
        },

        remove: function(model) {
            var deletePromise = CartHelper.deleteFromCart(model),
                self = this;

            deletePromise.always(self.cleanUpParamsAfterCart);
            return deletePromise;
        },

        cleanUpParamsAfterCart: function() {
            EventHelper.removeUrlParams(['park_id','park_qty']);
            gc.parkingListingId = null;
            gc.parkingQty = null;
        },

        displayMoreParkingPasses: function() {
            var parkingUrl = globals.parking_event_url.replace('{{parkingEventId}}', globals.event_meta.parkingEventId);

            if (this.$el.find('.parking-component').hasClass('active')) {
                return false;
            }
            // Going to More Parking Options is set to 1 even if subsequent request are for more tickets
            // because if we set higher and event is out of that package order, then they will get a sold out
            // message even if there are other single tickets available.
            parkingUrl += '&qty=1';

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'More Parking Options Clicked',
                pageload: false
            });

            setTimeout(function() {
                urlParser.redirect(parkingUrl);
            }, 250);
        },

        displayed: function(model) {
            var ticketIdLabel = 'Parking-offered ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-offered price: ',
                price = model.get('price');

            // TODO: publish displayed message here?
            EventHelper.track({
                pageView: 'Ticket Listings', appInteraction:
                'Add Parking Displayed',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingOfferedListingId: ticketIdLabel + ticketId,
                    parkingOfferedPrice: priceLabel + price
                }
            });
        },

        trackAddParking: function(model) {
            var ticketIdLabel = 'Parking-added ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-added price: ',
                price = model.get('price');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Add Parking Clicked',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingListingId: ticketIdLabel + ticketId,
                    parkingPrice: priceLabel + price
                }
            });
        },

        trackRemoveParking: function(model) {
            var ticketIdLabel = 'Parking-removed ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-removed price: ',
                price = model.get('price');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Remove Parking Clicked',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingListingId: ticketIdLabel + ticketId,
                    parkingPrice: priceLabel + price
                }
            });
        },

        setParkingAttributes: function() {
            var parkingAttributes = {
                    parkingEventId: globals.event_meta.parkingEventId,
                    parkingSelected: false,
                    parkingInCart: false,
                    qty: 1,
                    priceType: (globals.PDO.withFees ? globals.price_type.CURRENT : globals.price_type.LISTING),
                    status: 'AVAILABLE'
                },
                parkingItems,
                error = {};

            if (gc.parkingListingId) {
                parkingAttributes.parkingListingId = gc.parkingListingId;
                parkingAttributes.qty = gc.parkingQty;
                parkingAttributes.parkingSelected = true;
            } else if (gc.cart_id) {
                parkingItems = CartHelper.getItemsByEvent(parkingAttributes.parkingEventId);
                if (parkingItems.length > 0) {
                    parkingAttributes.status = parkingItems[0].get('status');
                    if (parkingAttributes.status !== 'AVAILABLE') {
                        CartHelper.deleteFromCart(parkingItems[0]);
                        error.xhr = this.setCartError(parkingAttributes.status, parkingItems[0].get('listingId'));
                        this.publishEvent('parkingpass:error', error);
                    } else {
                        parkingAttributes.parkingListingId = parkingItems[0].get('listingId');
                        parkingAttributes.qty = parkingItems[0].get('quantity');
                        parkingAttributes.parkingInCart = true;
                    }
                }
            }
            return parkingAttributes;
        },

        setCartError: function(status, listingId) {
            var error = {};
            if (status === 'UNAVAILABLE') {
                error = {
                            "code": "purchase.cart.quantityUnavailable",
                            "description": "QUANTITY UNAVAILABLE",
                            "requestId": "",
                            "data": {
                                "listingId": listingId
                            }
                        };
            } else if (status === 'UNACCEPTABLE') {
                error = {
                            "code": "purchase.cart.quantityUnacceptable",
                            "description": "QUANTITY UNACCEPTABLE",
                            "requestId": "",
                            "data": {
                                "listingId": listingId
                            }
                        };
            }
            return error;
        }

    });

    return ParkingPassView;

});
