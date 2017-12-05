/*global _ */
define([
    'foobunny',
    'hammer',
    'models/filter_model',
    'models/singlelisting_model',
    'models/buyer_cost_model',
    'models/singlelisting_batch_model',
    'views/ticketdetails_view',
    'helpers/event_helper',
    'helpers/cart_helper',
    'global_context',
    'globals',
    'sh_currency_format'
], function(Foobunny, Hammer, FilterModel, SingleListingModel, BuyerCostModel, SingleListingBatchModel, TicketdetailsView, EventHelper, CartHelper, gc, globals, currencyFormatUtil) {
    'use strict';

    var SingleticketView = Foobunny.BaseView.extend({

        el: '#single-ticket',

        template: gc.appFolder + '/single_ticket',

        events: {
            'tap .single-ticket-see-more ' : 'showMoreTickets',
            'tap .find-another-ticket' : 'showAllTickets'
        },

        modelEvents: {
            'change:singleTicketError': 'displayErrorMesage',

            FilterModel: {
                'change:withFees': 'updatePrice'
            }
        },

        uiEl: {
            $ticketWrapper: '.single-ticket-wrapper',
            $seeMore: '.single-ticket-see-more'
        },

        initialize: function() {
            console.log('--SingleTicketView-- in initialize', this);

            if (gc.ticket_id) {
                this.model = new SingleListingModel(gc.ticket_id);
            } else {
                this.model = new SingleListingBatchModel();
            }
            this.model.on('invalid', this.errorOnFetchedData, this);

            // Please use the following approach to adding subModels since the Global FilterModel
            // is going to be added by the framework before the code gets here.
            this.subModels.BuyerCostModel = new BuyerCostModel();

            // Resize the single ticket mode to ensure the entire single ticket section is
            // available.
            this.debouncedResize = _.debounce(this.layoutSettings, 250);

            this.subscribeEvent('singleticket:error', this.closeSingleTicketMode);
            // TODO: Rename the event to say ticket details opened (?)
            this.subscribeEvent('ticketdetails:highlighted', this.layoutSettings);
            this.subscribeEvent('eventlayout:map-hidden', this.layoutSettings);

            $(window).resize(_.bind(this.debouncedResize, this));
        },

        unSubscribeFilterModelEvents: function() {
            this.subModels.FilterModel.off('change:withFees', this.updatePrice);
        },

        fetchData: function() {
            var self = this,
                fetchDeferred = $.Deferred(),
                singleTicketPromise,
                listings,
                cartPromise;

            if (gc.ticket_id) {
                singleTicketPromise = this.fetchDataSingleTicket();
                singleTicketPromise.done(function() {
                    fetchDeferred.resolve();
                }).fail(function() {
                    fetchDeferred.reject();
                });
            } else {
                // Get the Cart, then fetch the listing based on the cart items.
                CartHelper.setCartId(gc.cart_id);
                cartPromise = CartHelper.getCart();
                cartPromise.done(function(response, status, xhr) {
                    // Check if the listings are valid. If not, then show error.
                    // TODO/Verify: If the TICKET in the cart is invalid then return an error.
                    // If other tickets are valid in the cart then they might be parking or other types of tickets.
                    listings = CartHelper.invalidListingsInCart(Number(gc.event_id));
                    if (listings) {
                        self.errorOnFetchedData(self.model, xhr);
                        fetchDeferred.reject();
                        return;
                    }

                    listings = CartHelper.getItemsFromCart(Number(gc.event_id));
                    if (listings.length === 0) {
                        self.errorOnFetchedData(self.model, xhr);
                        fetchDeferred.reject();
                        return;
                    }

                    self.model.setSilent({
                        multipleListing: CartHelper.multipleListingsInCart(Number(gc.event_id)),
                        listingInCart: true
                    });

                    singleTicketPromise = self.fetchDataSingleListing(listings);
                    singleTicketPromise.done(function() {
                        fetchDeferred.resolve();
                    }).fail(function() {
                        fetchDeferred.reject();
                    });
                }).fail(function(xhr, status, statusText) {
                    self.errorOnFetchedData(self.model, xhr);
                    fetchDeferred.reject();
                });
            }

            return fetchDeferred.promise();
        },

        fetchDataSingleTicket: function() {
            var self = this,
                singleTicketFetchPromise;

            singleTicketFetchPromise = this.model.fetch({validate: true});

            singleTicketFetchPromise.done(function() {
                self.model.set('multipleListing', false);
                if (!self.model.validationError) {
                    self.addSingleTicket(false);
                }
            }).fail(function(error) {
                globals.upgradeTicket.isTicketUpgraded = false;
                self.errorOnFetchedData(self.model, error);
            });
            return singleTicketFetchPromise;
        },

        fetchDataSingleListing: function(listings) {
            var self = this,
                errorObject = {},
                singleTicketFetchPromise = this.model.fetch(listings, {validate: true});

            singleTicketFetchPromise.done(function(response) {
                // Check for batching api errors
                errorObject = self.model.checkApiErrors(response.responses);
                if (errorObject.error) {
                    self.errorOnFetchedData(self.model, errorObject);
                } else {
                    self.model.setSilent(self.model.collateSingleListing());
                    self.addSingleTicket(false);
                }
            }).fail(function(error) {
                self.errorOnFetchedData(self.model, error);
            });

            return singleTicketFetchPromise;
        },

        // This function will be called when the API fails or the MODEL is invalid.
        // When the API fails the error will be an object which will be passed by
        // the Ajax call. If the MODEL is invalid then the error will be a string
        // which is created by the MODEL.
        errorOnFetchedData: function(model, error) {
            var singleTicketError = true;

            if (model.validationError) {
                EventHelper.track({pageView: '', appInteraction: model.validationError, pageload: false});
            } else if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 404) {
                if (error.responseJSON) {
                    switch (error.responseJSON.code) {
                        case 'purchase.cart.badRequest':
                        case 'purchase.cart.cartDoesnotBelongsToUser':
                        case 'purchase.cart.usercartCannotBeAccessed':
                            singleTicketError = false;
                            break;
                    }
                }

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Ticket Sold Out', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Ticket Error', pageload: false});
            }

            if (singleTicketError) {
                this.model.set('singleTicketError', singleTicketError);
            } else {
                // Log into splunk (?)
                this.closeSingleTicketMode();
            }
        },

        removeSingleTicketUrlParams: function() {
            // Remove the BYO url parameter.
            globals.byo.quantity = '';
            EventHelper.removeUrlParams(['byo', 'byo_qty', 'ticket_id', 'ticketRank']);
        },

        displayErrorMesage: function() {
            if (!this.model.get('singleTicketError')) {
                return;
            }

            var self = this;

            this.render();

            this.showTicketTimer = setTimeout(function() {
                // Hide ticket view if listing is not available but event is active
                self.showAllTickets();
            }, 5000);
        },

        addSingleTicket: function(expanded) {
            var self = this,
                renderPromise;

            this.model.set('ticketRank', globals.OMN.ticketRank || '');
            this.ticketView = new TicketdetailsView({
                    model: this.model,
                    qty: this.model.get('qty')
                });

            renderPromise = this.ticketView.render();

            renderPromise.done(function() {
                var ticketItem = self.ticketView.$el.find('.ticket-item'),
                    qty = this.model.get('qty');

                // If BYO is present in the URL then launch the BYO page.
                if (EventHelper.isBYOEnabled() && gc.showBYO) {
                    this.publishEvent('buildyourorder:listing', this.model);
                    // Resetting this to null to ensure that the BYO does not get
                    // launched automatically again.
                    gc.showBYO = null;
                }

                if (expanded) {
                    ticketItem.addClass('container-open');
                    ticketItem.find('.ticket-details-container').show();
                    self.ticketView.showVfs(
                        ticketItem,
                        self.model.get('sectionId')
                    );
                    globals.ticketIdActive = true;
                } else {
                    ticketItem.removeClass('container-open');
                    ticketItem.find('.ticket-details-container').hide();
                    globals.ticketIdActive = false;
                }

                self.uiEl.$ticketWrapper.empty().append(self.ticketView.el);

                // Un-hide the see other tickets button.
                self.uiEl.$seeMore.removeClass('hide');

                self.layoutSettings();
            });
        },

        layoutSettings: function() {
            var eventContainerHeight = $('#eventContainer').outerHeight(),
                sortFilterHeaderHeight = $('#sortfilter_header').outerHeight(),
                footerMessageHeight = $('.serviceFeeInfo').outerHeight(),
                singleTicketHeight = eventContainerHeight - sortFilterHeaderHeight - footerMessageHeight;
            // Update the height of the this.$el for mobile because we may have messages on the
            // footer of the event layout.
            this.$el.css('height', singleTicketHeight);
        },

        getBuyerCost: function(qty, successCallBack, errorCallBack) {
            var buyerCostResponse,
                buyercost = {
                    'buyerCostRequest': {
                           'listingId': this.model.get('listingId'),
                           'quantity': qty,
                           'deliveryMethodId' : this.model.get('deliveryMethodList') && this.model.get('deliveryMethodList').length > 0 ? this.model.get('deliveryMethodList')[0] : this.model.get('deliveryMethods')[0].id
                    }
                };
            this.subModels.BuyerCostModel.fetch({
                data: JSON.stringify(buyercost),
                type: 'POST'
            }).done(function(data) {
                buyerCostResponse = data.buyerCostResponse;
                if (successCallBack) {
                    successCallBack(buyerCostResponse);
                }
            }).fail(function(error) {
                if (errorCallBack) {
                    errorCallBack();
                }
                EventHelper.logAppState('getBuyerCost', error);
            });

            return buyerCostResponse;
        },

        updatePrice: function(model, withFees) {
            if (withFees) {
                this.model.set('usePrice', this.model.get('displayPricePerTicket'));
            } else {
                this.model.set('usePrice', this.model.get('currentPrice'));
            }

            this.addSingleTicket(globals.ticketIdActive);
        },

        showAllTickets: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }

            clearTimeout(this.showTicketTimer);

            this.closeSingleTicketMode();

            // omniture tracking only when user clicked on find another ticket button
            if (evt && $(evt.currentTarget).hasClass('find-another-ticket')) {
                EventHelper.track({pageView: 'NON-GA ticket id expired', appInteraction: 'Find another ticket', pageload: false});
            }
        },

        showMoreTickets: function(evt) {
            var self = this;

            evt.stopPropagation();
            evt.preventDefault();

            this.$el.slideUp(400, function() {
                self.closeSingleTicketMode();
            });
        },

        closeSingleTicketMode: function() {
            this.$el.addClass('hide');

            gc.ticket_id = null;

            this.publishEvent('ticketlist:resize');
            this.publishEvent('ticketlist:seeall');
            this.removeSingleTicketUrlParams();

            this.unSubscribeFilterModelEvents();
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SingleticketView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return SingleticketView;
});
