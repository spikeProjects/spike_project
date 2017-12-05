define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/singlelisting_model',
    'models/event_model',
    'views/delivery_method_view',
    'views/parking_added_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper'

], function(Foobunny, Hammer, globals, gc, SingleListingModel, EventModel, DeliveryMethodView, ParkingAddedView, i18n, currencyFormatUtil, EventHelper, CartHelper) {
    'use strict';

    var ByoListingInfoView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/byo_listing_info',

        events: {
            'tap .checkout': 'byoCheckout',
            'tap .see-more-container .see-more-byo': 'displayMoreFeatures',
            'change .byo-quantity': 'updateByoQuantity'
        },

        uiEl: {
            $listingInfoContainer: '.listing-info-wrapper',
            $currentListing: '.current-listing',
            $upgradeText: '.upgraded-wrapper',
            $seatNumberText: '.seat-info-text .seatInfo',
            $seatNumbers: '.seat-info-text .seatNumbers',
            $noSeatNumberText: '.seat-info-text .noseatInfo',
            $moreFeatures: '.seat-feature .feature-disclosures .more-features',
            $seeFeaures: '.see-more-container .see-more-text',
            $seeFeauresIcon: '.see-more-container .see-more-icon',
            $deliveryDate: '.delivery-container .delivery-date',
            $qtySelector: '.byo-quantity',
            $byoQtyText: '.qty-box .selected-qty',
            $totalParking: '.total-parking',
            $totalParkingQuantity: '.total-parking-quantity',
            $totalParkingSection: '.total-parking-section',
            $totalParkingAmount: '.total-parking-price',
            $totalParkingCurrency: '.total-parking-info .currency',
            $totalParkingEachText: '.total-parking-info .each',
            $checkoutButton: '.checkout',
            $blurredText: '.blurred-text',
            $byoEventInfo: '.byo-event-info'
        },

        initialize: function(options) {
            this.subViews = {
                deliveryView: new DeliveryMethodView({
                    el: '.current-listing .delivery-date'
                }),
                parkingAddedView: new ParkingAddedView({
                    el: '.listing-info-wrapper .total-parking-container'
                })
            };

            this.subModels = {
                eventModel: options.eventData
            };

            this.subscribeEvent('buildyourorder:displayed', this.displayListingInfo);
            this.subscribeEvent('buildyourorder:checkout', this.byoCheckout);
            this.subscribeEvent('upgradeTicket:add', this.updateByoListing);
            this.subscribeEvent('similarTicket:add', this.updateByoListing);
            this.subscribeEvent('upgradeTicket:remove', this.removeUpgradedTicket);
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.showDisabledInfo);
        },

        context: function() {
            var dynamic_context = {
                globals: globals,
                features: this.iconFeatures
            };
            // TODO: remove this after superbowl, specific code only for that
            if (gc.event_id === '9626707') {
                if (globals.staticImagesInTicketList.events[gc.event_id] && globals.staticImagesInTicketList.events[gc.event_id].byoImages[0]) {
                    dynamic_context['superbowlStaticImage'] = {
                        imageUrl:  gc.staticUrl + globals.staticImagesInTicketList.events[gc.event_id].byoImages[0].imageUrl,
                        imageAlt: i18n.get(globals.staticImagesInTicketList.events[gc.event_id].byoImages[0].imageAltKey)
                    };
                }
            }
            return dynamic_context;
        },

        afterRender: function() {
            Hammer(this.el);
        },

        displayListingInfo: function(hideGlobalHeader, ticketModel, onPageLoad) {
            this.model = ticketModel;

            var feature = this.model.get('listingAttributeList') || [],
                iconFeature = [],
                disclosures = [];

            if (!EventHelper.useCart()) {
                if (globals.upgradeTicket.isTicketUpgraded === true) {
                    EventHelper.setUrlParam('ticket_id', this.model.get('listingId'));
                } else {
                    EventHelper.setUrlParams([
                        {
                            name: 'ticket_id',
                            value: this.model.get('listingId')
                        },
                        {
                            name: 'ticketRank',
                            value: this.model.get('ticketRank')
                        }
                    ]);
                }
            }

            // re-arrange listingAttribute to display in BYO page
            for (var index = 0; index < feature.length; index++) {
                if (feature[index].featureIcon) {
                    if (feature[index].featureIcon === 'none') {
                        if (disclosures.length < 1) {
                            feature[index].displayAlertIcon = true;
                        }
                        disclosures.push(feature[index]);
                    } else {
                        iconFeature.push(feature[index]);
                    }
                }
            }

            this.iconFeatures = iconFeature.concat(disclosures);
            this.model.set('deliveryType', this.model.get('deliveryTypeList'));

            this.render();

            // fetch single ticket for EDD
            this.displayDeliveryDate();

            this.setOnloadQty();

            // if Single ticket mode and ticket is Upgraded make single listing api call for old ticket
            if (EventHelper.isSingleTicketMode() && globals.upgradeTicket.isTicketUpgraded && !onPageLoad) {
                this.getOldTicketListing();
            }

            // display parking
            if (globals.parking.isAddedToCart) {
                this.publishEvent('buildyourorder:showParking');
            }

        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$moreFeatures.hasClass('expand')) {
                this.uiEl.$moreFeatures.slideUp(400);
                this.uiEl.$moreFeatures.removeClass('expand');
                this.uiEl.$seeFeaures.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$seeFeauresIcon.text('+');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$moreFeatures.slideDown(400);
                this.uiEl.$moreFeatures.addClass('expand');
                this.uiEl.$seeFeaures.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$seeFeauresIcon.text('-');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        setOnloadQty: function() {
            var splitVector = this.model.get('splitVector'),
                preserveByoQty = parseInt(globals.byo.quantity),
                quantity = preserveByoQty ? preserveByoQty : this.model.get('qty'),
                qtyText = i18n.get('event.common.tickets.text');

            if (splitVector.length > 1) {
                if (quantity > 0) {
                    if (quantity === 1) {
                        qtyText = i18n.get('event.common.ticket.text');
                    }

                    this.uiEl.$byoQtyText.text(quantity + ' ' + qtyText);
                    this.uiEl.$qtySelector.val(quantity);
                    EventHelper.setUrlParam('byo_qty', quantity);
                } else {
                    quantity = splitVector[0];
                    if (quantity === 1) {
                        qtyText = i18n.get('event.common.ticket.text');
                    }

                    this.uiEl.$byoQtyText.text(quantity + ' ' + qtyText);
                    EventHelper.setUrlParam('byo_qty', quantity);
                }
            } else {
                EventHelper.setUrlParam('byo_qty', quantity);
            }
            this.updateSeatText(quantity);
        },

        updateByoQuantity: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var qty = this.uiEl.$qtySelector.val(),
                oldModel = this.model.clone(),
                addPromise,
                deletePromise,
                self = this;

            if (EventHelper.useCart()) {
                this.uiEl.$checkoutButton.addClass('disabled');

                // Delete the existing item from the cart.
                deletePromise = CartHelper.deleteFromCart(this.model);
                deletePromise.done(function() {
                    // Now add the same item with the new quantity.
                    self.model = oldModel.clone();
                    self.model.setSilent('qty', qty);
                    addPromise = CartHelper.addToCart(self.model);
                    addPromise.done(function() {
                        self.updateQtyInCartSuccess();
                    }).fail(function() {
                        self.updateQtyInCartFailed();
                    }).always(function() {
                        self.uiEl.$checkoutButton.removeClass('disabled');
                    });
                }).fail(function() {
                    self.updateQtyInCartFailed();
                    self.uiEl.$checkoutButton.removeClass('disabled');
                });
            } else {
                this.updateQtyInCartSuccess();
            }
        },

        updateQtyInCartSuccess: function() {
            var qty = this.uiEl.$qtySelector.val(),
                splitVector,
                qtyText = i18n.get('event.common.tickets.text');

            if (qty === '1') {
                qtyText = i18n.get('event.common.ticket.text');
            }

            EventHelper.setUrlParam('byo_qty', qty);
            this.model.set('qty', qty);

            if (globals.upgradeTicket.isTicketUpgraded === true) {
                splitVector = this.originalListing.get('splitVector');

                if (splitVector.indexOf(Number(qty)) !== -1) {
                    globals.byo.quantity = qty;
                }
            } else {
                globals.byo.quantity = qty;
            }

            // show quantity selected on the label
            this.uiEl.$byoQtyText.text(qty + ' ' + qtyText);
            // update seat info text
            this.updateSeatText(qty);

            // Update Upgraded Ticket
            if (globals.upgradeTicket.display) {
                this.publishEvent('buildyourorder:displayUpgrade', this.model);
            }

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Selected Quantity', pageload: false, filterType: 'Selected QuantityL: ' + qty, userExperienceSnapshot: {quantityL: 'QuantityL: ' + qty}});
        },

        updateQtyInCartFailed: function() {
            CartHelper.resetCart();
            gc.cart_id = null;
            EventHelper.removeUrlParam('cart_id');

            this.publishEvent('buildyourorder:notickets');
        },

        updateSeatText: function(qtySelected) {
            var seatTextString = '',
                infoTextString = '',
                seatNumbersArray = this.model.get('seatNumbersArray'),
                listingAttributeList = this.model.get('listingAttributeList') || [],
                listingAttributeListLength = listingAttributeList.length,
                seatNumbers,
                isSeatNumberAvailable;

            if (seatNumbersArray[0] === 'General Admission') {
                seatNumbers = seatNumbersArray[0];
            } else {
                seatNumbers = seatNumbersArray ? seatNumbersArray.join(', ') : [];
            }

            isSeatNumberAvailable = (seatNumbers &&
                                    seatNumbers !== '' &&
                                    seatNumbers !== 'General Admission');

            this.model.set('qty', qtySelected);

            // Update the string to be displayed in the ticket details.
            if (parseInt(qtySelected) > 1) {
                infoTextString = i18n.get('event.common.ticketdetails.seats.info', {qty: qtySelected});

                // Check if ticket has piggyback attribute
                if (listingAttributeListLength > 0) {
                    for (var attributeId = 0; attributeId < listingAttributeListLength; attributeId++) {
                        if (listingAttributeList[attributeId].id === 501) {
                            infoTextString = i18n.get('event.common.ticketdetails.seats.piggyback.info', {qty: qtySelected});
                            break;
                        }
                    }
                }

                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$seatNumberText.text(infoTextString);
                    this.uiEl.$seatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$noSeatNumberText.text(i18n.get('event.common.ticketdetails.seatstogether.text'));
                }
            } else {
                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$seatNumberText.text(i18n.get('event.common.ticketdetails.seat.one'));
                    this.uiEl.$seatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$noSeatNumberText.text(i18n.get('event.common.ticketdetails.seatprintedonticket.text'));
                }
            }
        },

        displayDeliveryDate: function() {
            // Make single listing API call only if delivery type is not instant Download
            if (this.model.get('deliveryTypeList') && this.model.get('deliveryTypeList').length > 0 && this.model.get('deliveryTypeList')[0].id === 2) {
                return;
            }

            this.publishEvent('buildyourorder:getDeliveryDate', this.model);
        },

        byoCheckout: function(evt) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            var self = this,
                cartModels;

            if (EventHelper.useCart() && !EventHelper.isBlendedEvent() && !EventHelper.showParkingAddon()) {
                cartModels = CartHelper.getEventListingsFromCart(gc.event_id);
                if (cartModels.length > 1) {
                    // ERROR: We cannot send this transaction to XO since the cart has more than 1 regular listings.
                    console.log('Cart has more than 1 regular listing', cartModels);
                }
            } else {
                setTimeout(function() {
                    self.publishEvent('url:checkout', {
                        tid: self.model.get('listingId'),
                        qty: self.model.get('qty')
                    });
                }, 300);
            }

            if (!gc.ticket_id) {
                EventHelper.setUrlParam('cb', '1');
            }

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout', pageload: false});
        },

        updateByoListing: function(upgradeModel) {
            this.originalListing = this.model;
            this.ticketUpgraded = true;

            this.displayListingInfo('', upgradeModel, true);
        },

        removeUpgradedTicket: function(upgradeModel) {
            var upgradeTag = 'Upgrade-removed',
                upgradeDisplay = 'Remove Upgrade Clicked';

            this.ticketUpgraded = false;
            this.displayListingInfo('', this.originalListing, true);

            if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgrade-removed-Accordion';
                upgradeDisplay = 'Remove Upgrade-Accordion Clicked';
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + upgradeModel.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + upgradeModel.get('usePrice').amount,
                userExperienceSnapshot: {
                    ticketId: 'ListingId Selected: ' + this.originalListing.get('listingId'),
                    upgradeListingId: upgradeTag + ' ListingId: ' + upgradeModel.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + upgradeModel.get('usePrice').amount
                }
            });
        },

        getOldTicketListing: function() {
            var singleTicketPromise,
                singleTicketModel = new SingleListingModel(globals.upgradeTicket.oldTicketListingId),
                self = this;

                // If delivery Date is present for Single ticket mode, do not make another api call
                singleTicketPromise = singleTicketModel.fetch();

                singleTicketPromise.done(function() {
                    self.originalListing = singleTicketModel;
                    self.publishEvent('byoListingInfo:oldTicketInfo', self.originalListing);
                }).fail(function() {
                    self.publishEvent('byoListingInfo:oldTicketInfoError');
                });
        },

        showDisabledInfo: function() {
            this.uiEl.$listingInfoContainer.addClass('hide');
            this.uiEl.$checkoutButton.addClass('disabled');
            $('#event-build-your-order').find('.accordion-checkout').addClass('disabled');
            this.uiEl.$blurredText.removeClass('hide');
        }

    });
    return ByoListingInfoView;
});
