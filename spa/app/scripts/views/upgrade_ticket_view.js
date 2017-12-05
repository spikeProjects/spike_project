/* global _ */
define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/upgrade_ticket_model',
    'views/delivery_method_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'helpers/map_helper'
], function(Foobunny, Hammer, globals, gc, UpgradeTicketModel, DeliveryMethodView, i18n, currencyFormatUtil, EventHelper, CartHelper, MapHelper) {
    'use strict';

    var UpgradeTicketView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/upgrade_ticket',

        events: {
            'click .upgrade-button.add-upgrade': 'addUpgradeTicket',
            'click .upgrade-button.remove-upgrade': 'removeUpgradeTicket',
            'click .upgrade-box ': 'openUpgradeDetails',
            'click .upgrade-see-more-container .upgrade-see-more': 'displayMoreFeatures',
            'click .upgrade-seatmap': 'displayMapOverlay',
            'click .compare-seats-button': 'displayMapOverlay',
            'click .upgrade-pip .upgrade-vfs': 'enlargeUpgradeVfs'
        },

        uiEl: {
            $upgradeContainer: '.upgrade-ticket-container',
            $upgradeListingSpinner: '.upgrade-listing-spinner',
            $upgradeBox: '.upgrade-box',
            $upgradedBoxDiff: '.upgrade-box .price-diff',
            $upgradedText: '.upgrade-box .upgraded-text',
            $expandArrow: '.upgrade-box .expand-arrow',
            $collapseArrow: '.upgrade-box .collapse-arrow',
            $upgradeHeader: '.upgrade-header ',
            $upgradeDifference: '.upgrade-ticket-container .price-diff',
            $upgradeVfs: '.upgrade-vfs',
            $noVfsText: '.novfs-text',
            $upgradeSeatMap: '.upgrade-seatmap',
            $compareSeat: '.compare-seats-button',
            $upgradeMap: '.upgrade-seatmap',
            $upgradeSeatNumberText: '.seat-info-text .seatInfo',
            $upgradeSeatNumbers: '.seat-info-text .seatNumbers',
            $upgradeNoSeatNumberText: '.seat-info-text .noseatInfo',
            $upgradeFeatureIcons: '.upgrade-feature-icons-wrapper',
            $upgradeMoreFeatures: '.upgrade-ticket-container .view-more-container',
            $upgradeMoreText: '.upgrade-see-more-container .upgrade-see-more-text',
            $upgradeMoreIcon: '.upgrade-see-more-container .upgrade-see-more-icon',
            $upgradeAmount: '.upgrade-ticket-container .upgrade-amount',
            $checkIcon: '.selected-check',
            $upgrade: '.upgrade-button',
            $upgradeButton: '.upgrade-button .button-text',
            $ticketNotAvailable: '.ticket-notavailable',
            $ticketNotAvailableMessage: '.ticket-notavailable .ticket-msg',
            $spinner: '.upgrade-button .upgrade-spinner'
        },

        initialize: function() {
            this.oldTicketInfoAvailable = true;
            this.originalTicketModel = null;

            this.subscribeEvent('buildyourorder:displayUpgrade', this.fetchUpgradeTicket);
            this.subscribeEvent('byoListingInfo:oldTicketInfo', this.processOldTicketData);
            this.subscribeEvent('byoListingInfo:oldTicketInfoError', this.handleOldTicketError);
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.handleTicketExpired);
            this.subscribeEvent('buildyourorder:hidden', this.byoClosed);

            $(window).resize(_.bind(this.layoutSettings, this));
        },

        context: function() {
            return {
                globals: globals
            };
        },

        afterRender: function() {
            Hammer(this.el);
        },

        hideUpgrade: function() {
            this.$el.addClass('hide');
            this.publishEvent('upgradeTicket:hidden');
        },

        showUpgrade: function() {
            var ticketInfo = {};

            $('#event-byo-container .upsell-header').removeClass('hide');
            this.$el.removeClass('hide');
            this.publishEvent('upgradeTicket:displayed', this.model);
            this.upgradeMapClone();

            if (globals.upgradeTicket.isTicketUpgraded) {
                this.disabledUpgradeMap();
            } else {
                ticketInfo.id = this.originalTicketModel.get('listingId');
                ticketInfo.price = this.originalTicketModel.get('usePrice').amount;
                this.upgradeDisplayOmniture(ticketInfo);

                if (this.isStaticMap()) {
                    this.disabledUpgradeMap();
                }
            }
        },

        displayMapOverlay: function(evt) {
            if (this.isStaticMap()) {
                return;
            }

            var target = $(evt.currentTarget);

            globals.isByoMapOverlayDisplayed = true;
            this.publishEvent('upgradeTicket:displayMapOverlay');

            if (target.hasClass('compare-seats-button')) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Compare Button Clicked', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Map Thumbnail Clicked', pageload: false});
            }
        },

        fetchUpgradeTicket: function(originalTicketModel) {
            var upgradeTicketPromise,
                qty,
                listingData = {},
                self = this;

            this.originalTicketModel = originalTicketModel;

            this.$el.removeClass('ticket-error').addClass('disabled');

            this.uiEl.$upgradeListingSpinner.removeClass('hide');

            if (globals.upgradeTicket.isTicketUpgraded) {
                if (this.model && this.model.get('sectionId') === originalTicketModel.get('sectionId')) {
                    this.updateSeatInfo();
                } else {
                    this.model = originalTicketModel;
                    this.updateUpgradeView(originalTicketModel);
                }

            } else {
                this.model = new UpgradeTicketModel();
                qty = parseInt(originalTicketModel.get('qty'));
                listingData.listingId = originalTicketModel.get('listingId');
                listingData.price = originalTicketModel.get('usePrice').amount;
                if (qty < 1) {
                    listingData.qty = globals.byo.quantity ? globals.byo.quantity : originalTicketModel.get('splitVector')[0];
                } else {
                    listingData.qty = globals.byo.quantity ? globals.byo.quantity : qty;
                }

                this.model.setSilent('originalTicketListingId', originalTicketModel.get('listingId'));

                this.model.prepareUpgradeUrl(listingData);

                upgradeTicketPromise = this.model.fetch();

                upgradeTicketPromise.done(function(response) {
                    if (_.isEmpty(response) || response.listingError) {
                        self.hideUpsellHeader();
                        self.hideUpgrade();
                        return;
                    }

                    self.oldTicketInfoAvailable = true;
                    self.updateUpgradeView(originalTicketModel);
                }).fail(function() {
                    self.hideUpsellHeader();
                    self.hideUpgrade();
                });
            }
        },

        updateUpgradeView: function(originalTicketModel) {
            if (this.selectedTicketNotAvailable) {
                return;
            }

            var self = this,
                qty = parseInt(originalTicketModel.get('qty')),
                originalTicketPrice = parseFloat(originalTicketModel.get('usePrice').amount),
                price = parseFloat(this.model.get('usePrice').amount),
                sectionId = this.model.get('sectionId'),
                priceDiff = (price - originalTicketPrice).toFixed(2);

            this.model.setSilent({
                qty: qty,
                quantity: qty,
                priceDiff: priceDiff
            });

            this.$el.removeClass('disabled');

            this.render();

            priceDiff = EventHelper.formatPrice(priceDiff, false);
            setTimeout(function() {
                self.updateSeatInfo();
                // Get the VFS
                if (MapHelper.isStaticMap()) {
                    // Override success method with vfsfail()
                    EventHelper.showVfs(self.uiEl.$upgradeVfs.find('img')[0], 'medium', sectionId, self.vfsFailure.bind(self), self.vfsFailure.bind(self));
                } else {
                    EventHelper.showVfs(self.uiEl.$upgradeVfs.find('img')[0], 'medium', sectionId, self.vfsSuccess.bind(self), self.vfsFailure.bind(self));
                }
                self.showUpgrade();
            }, 0);
        },

        vfsSuccess: function() {
        },

        vfsFailure: function() {
            this.uiEl.$upgradeVfs.addClass('upgrade-no-vfs');
            this.uiEl.$noVfsText.removeClass('hide');
            this.uiEl.$upgradeVfs.find('.upgrade-image').attr('src', globals.noVfsImgUrl);
        },

        addUpgradeTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.uiEl.$upgrade.addClass('disabled');

            if (EventHelper.useCart()) {
                this.addToCart();
            } else {
                EventHelper.setUrlParam('oldtktid', this.model.get('originalTicketListingId'));
                //ticket rank is undefined for upgrade ticket so remove it from url params
                EventHelper.removeUrlParam('ticketRank');

                this.addUpgradeSuccess();
            }
        },

        addToCart: function() {
            var self = this,
                addPromise,
                deletePromise;

            this.$el.addClass('adding-to-cart');
            this.uiEl.$spinner.removeClass('hide');

            addPromise = CartHelper.addToCart(this.model);
            addPromise.done(function() {
                self.addUpgradeSuccess();

                // Remove the original listing from the cart. If failed, then retry to remove it.
                deletePromise = CartHelper.deleteFromCart(self.originalTicketModel);
            }).fail(function() {
                self.addUpgradeFailure();
            }).always(function() {
                self.uiEl.$spinner.addClass('hide');
                self.$el.removeClass('adding-to-cart');
            });
        },

        addUpgradeSuccess: function() {
            var self = this,
                upgradeTag = 'Upgraded',
                upgradeDisplay = 'Upgrade Clicked';

            globals.upgradeTicket.isTicketUpgraded = true;
            this.publishEvent('upgradeTicket:add', this.model);

            setTimeout(function() {
                self.$el.addClass('upgrade-selected');
                self.uiEl.$checkIcon.removeClass('hide');
                self.uiEl.$upgradedBoxDiff.addClass('hide');
                self.uiEl.$upgradedText.removeClass('hide');
                self.uiEl.$upgrade.removeClass('add-upgrade disabled').addClass('remove-upgrade');
                self.disabledUpgradeMap();
                if (globals.byo.upsellAccordion && EventHelper.isMobile()) {
                    self.uiEl.$upgradeHeader.addClass('hide');
                } else {
                    self.uiEl.$upgradeHeader.addClass('invisible');
                }
                self.uiEl.$upgradeButton.text(i18n.get('event.common.byo.listing.removeupgrade'));

                if (!EventHelper.isMobile()) {
                    $('#event-build-your-order .byo-event-info').removeClass('hide');
                }
            },10);

            // animate
            if (!EventHelper.isMobile()) {
                $('#event-byo-container').animate({scrollTop: 0}, 400);
            } else if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgraded-Accordion';
                upgradeDisplay = 'Upgrade-Accordion Clicked';
                this.openUpgradeDetails();
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + this.model.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: upgradeTag + ' ListingId: ' + this.model.get('listingId'),
                    ticketId: 'ListingId Selected: ' + this.model.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                    originalListingId: 'Original ListingId:' + this.originalTicketModel.get('listingId'),
                    originalListingPrice: 'Original Listing Price: ' + this.originalTicketModel.get('usePrice').amount
                }
            });

        },

        addUpgradeFailure: function() {
            this.showTicketNotAvailable('event.upgradeticket.upgradenotavailable');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade Ticket Sold Out', pageload: false});
        },

        removeUpgradeTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.uiEl.$upgrade.addClass('disabled');

            if (EventHelper.useCart()) {
                this.removeFromCart();
            } else {
                EventHelper.removeUrlParam('oldtktid');

                this.removeUpgradeSuccess();
            }
        },

        removeFromCart: function() {
            var addPromise,
                deletePromise,
                self = this;

            this.$el.addClass('adding-to-cart');
            this.uiEl.$spinner.removeClass('hide');

            addPromise = CartHelper.addToCart(this.originalTicketModel);
            addPromise.done(function() {
                self.removeUpgradeSuccess();

                // Remove the original listing from the cart.
                deletePromise = CartHelper.deleteFromCart(self.model);
                deletePromise.fail(function() {
                    self.publishEvent('buildyourorder:notickets');
                    CartHelper.resetCart();
                    gc.cart_id = null;
                    EventHelper.removeUrlParam('cart_id');
                });
            }).fail(function() {
                self.removeUpgradeFailure();
            }).always(function() {
                self.uiEl.$spinner.addClass('hide');
                self.$el.removeClass('adding-to-cart');
            });
        },

        removeUpgradeSuccess: function() {
            if (!this.oldTicketInfoAvailable) {
                this.showTicketNotAvailable('event.upgradeticket.originalnotavailable');
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
            } else {
                var self = this;

                globals.upgradeTicket.isTicketUpgraded = false;
                this.publishEvent('upgradeTicket:remove', this.model);

                setTimeout(function() {
                    self.$el.removeClass('upgrade-selected');
                    self.uiEl.$checkIcon.addClass('hide');
                    self.uiEl.$upgradedBoxDiff.removeClass('hide');
                    self.uiEl.$upgradedText.addClass('hide');
                    self.uiEl.$upgrade.removeClass('remove-upgrade disabled').addClass('add-upgrade');
                    self.uiEl.$upgradeHeader.removeClass('invisible');
                    self.uiEl.$upgradeButton.text(i18n.get('event.common.byo.listing.upgrade'));
                    if (!EventHelper.isMobile()) {
                        $('#event-build-your-order .byo-event-info').removeClass('hide');
                    }
                    self.enabledUpgradeMap();
                },10);

                if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                    this.openUpgradeDetails();
                }
            }
        },

        removeUpgradeFailure: function() {
            this.showTicketNotAvailable('event.upgradeticket.originalnotavailable');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$upgradeMoreFeatures.hasClass('expand')) {
                this.uiEl.$upgradeFeatureIcons.removeClass('hide');
                this.uiEl.$upgradeMoreFeatures.addClass('hide');
                this.uiEl.$upgradeMoreFeatures.removeClass('expand');
                this.uiEl.$upgradeMoreText.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$upgradeMoreIcon.text('+');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$upgradeFeatureIcons.addClass('hide');
                this.uiEl.$upgradeMoreFeatures.removeClass('hide');
                this.uiEl.$upgradeMoreFeatures.addClass('expand');
                this.uiEl.$upgradeMoreText.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$upgradeMoreIcon.text('-');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        updateSeatInfo: function() {
            var seatTextString = '',
                infoTextString = '',
                qtySelected = this.model.get('qty'),
                seatNumbersArray = this.model.get('seatNumbersArray'),
                seatNumbers = seatNumbersArray ? seatNumbersArray.join(', ') : [],
                isSeatNumberAvailable = (seatNumbers &&
                                        seatNumbers !== '' &&
                                        seatNumbers !== 'General Admission'),
                listingAttributeList = this.model.get('listingAttributeList') || [],
                listingAttributeListLength = listingAttributeList.length;

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
                    this.uiEl.$upgradeSeatNumberText.text(infoTextString);
                    this.uiEl.$upgradeSeatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$upgradeNoSeatNumberText.text(i18n.get('event.common.ticketdetails.seatstogether.text'));
                }
            } else {
                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$upgradeSeatNumberText.text(i18n.get('event.common.ticketdetails.seat.one'));
                    this.uiEl.$upgradeSeatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$upgradeNoSeatNumberText.text(i18n.get('event.common.ticketdetails.seatprintedonticket.text'));
                }
            }
        },

        processOldTicketData: function(oldTicketModel) {
            var originalTicketPrice = parseFloat(oldTicketModel.get('usePrice').amount),
                price = parseFloat(this.model.get('usePrice').amount),
                ticketInfo = {},
                priceDiff = (price - originalTicketPrice).toFixed(2);

            this.model.setSilent({
                priceDiff: priceDiff
            });

            ticketInfo.id = oldTicketModel.get('listingId');
            ticketInfo.price = oldTicketModel.get('usePrice').amount;

            this.uiEl.$upgradedBoxDiff.find('.price_value').text(priceDiff);
            this.uiEl.$upgradeDifference.find('.price_value').text(priceDiff);

            this.upgradeDisplayOmniture(ticketInfo);
        },

        handleOldTicketError: function() {
            this.oldTicketInfoAvailable = false;
        },

        showTicketNotAvailable: function(msgId) {
            var self = this;

            this.uiEl.$ticketNotAvailableMessage.text(i18n.get(msgId));
            this.uiEl.$upgradeContainer.slideUp(500, function() {
                self.uiEl.$ticketNotAvailable.slideDown(500);
                self.$el.removeClass('upgrade-selected').addClass('ticket-error');
            });
        },

        byoClosed: function() {
            this.selectedTicketNotAvailable = false;
            this.hideUpgrade();
        },

        handleTicketExpired: function() {
            this.selectedTicketNotAvailable = true;

            this.hideUpsellHeader();

            this.hideUpgrade();
        },

        hideUpsellHeader: function() {
            if ($('#event-byo-container .parking-component').length < 1) {
                $('#event-byo-container .upsell-header').addClass('hide');
            }
        },

        openUpgradeDetails: function() {
            if (this.uiEl.$upgradeBox.hasClass('expand')) {
                this.uiEl.$upgradeBox.removeClass('expand');
                this.uiEl.$expandArrow.removeClass('hide');
                this.uiEl.$collapseArrow.addClass('hide');
                this.uiEl.$upgradeContainer.slideUp(500);
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Upgrade Accordion Closed', pageload: false});
            } else {
                this.uiEl.$upgradeBox.addClass('expand');
                this.uiEl.$expandArrow.addClass('hide');
                this.uiEl.$collapseArrow.removeClass('hide');
                this.uiEl.$upgradeContainer.slideDown(500);
                this.addMarkersToMap();
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Upgrade Accordion Opened', pageload: false});
            }
        },

        layoutSettings: function() {
            if (!globals.byo.upsellAccordion) {
                return;
            }

            if (!EventHelper.isMobile()) {
                if (globals.upgradeTicket.isTicketUpgraded) {
                    this.uiEl.$upgradeHeader.addClass('invisible').removeClass('hide');
                } else {
                    this.uiEl.$upgradeHeader.removeClass('hide');
                }

                this.uiEl.$upgradeContainer.css('display', '');
                this.uiEl.$upgradeContainer.removeClass('hide');
            } else {
                this.uiEl.$collapseArrow.addClass('hide');
                this.uiEl.$expandArrow.removeClass('hide');
                this.uiEl.$upgradeContainer.addClass('hide');
                this.uiEl.$upgradeBox.removeClass('expand');
            }
        },

        upgradeMapClone: function() {
            var byoSvgMap,
                svgimg,
                svgns = 'http://www.w3.org/2000/svg',
                xlink = 'http://www.w3.org/1999/xlink',
                whiteColor = '#FFFFFF',
                removeMapColors = {
                    'fill': whiteColor,
                    'fill-opacity': 0.2,
                    'stroke': whiteColor,
                    'stroke-width': 0,
                    'stroke-opacity': 0
                };

            this.uiEl.$upgradeSeatMap.children().eq(1).remove();
            this.uiEl.$upgradeSeatMap.append($('#seatmap').find('.svgcontainer').html());

            byoSvgMap = this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon'); //getting the mapSVG

            if (EventHelper.getBrowserName().isSafari()) {
                //Safari does not repaint the image el inside SVG..
                //BYOSeatMap Repainting Fix
                byoSvgMap.find('image').remove(); //removing image el from SVG

                //creating an image element and adding it to the SVG
                svgimg = document.createElementNS(svgns, 'image');
                svgimg.setAttribute('height', '100%');
                svgimg.setAttribute('width', '100%');
                svgimg.setAttributeNS(xlink, 'href', $('#seatmap').blueprint.getmapurl());
                byoSvgMap.prepend(svgimg);
            }

            if (!$('#seatmap').blueprint.isMapStatic()) {
                //for interactive map remove colors using blank map function
                this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon').find('path').css(removeMapColors);
            }

            this.addMarkersToMap();
        },

        addSelectedMarker: function(byoSvgMap) {
            if (!this.originalTicketModel.get('sectionId') || this.isStaticMap()) {
                return;
            }
            var sectionPos;
            // selected marker
            byoSvgMap.append(MapHelper.createMarkerTags('upgrademap-selected-marker', 'selected'));
            // get selectedSectionPosition inside the byo svg map
            sectionPos = this.uiEl.$upgradeSeatMap.find('#' + this.originalTicketModel.get('sectionId'))[0].getBBox();
            // centering the map marker inside the section
            byoSvgMap.find('#upgrademap-selected-marker').attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');
        },


        addUpgradeMarker: function(byoSvgMap) {
            if (!this.model.get('sectionId') || this.isStaticMap()) {
                return;
            }
            var sectionPos;
            // upgrade marker
            byoSvgMap.append(MapHelper.createMarkerTags('upgrademap-upgrade-marker', 'upgrade'));
            // get upgrade Section Coordinates
            sectionPos = this.uiEl.$upgradeSeatMap.find('#' + this.model.get('sectionId'))[0].getBBox();

            // centering the upgrade map marker inside the section
            if (this.model.get('sectionId') === this.originalTicketModel.get('sectionId')) {
                sectionPos.x = sectionPos.x + 100;
                sectionPos.y = sectionPos.y + 100;
            }
            byoSvgMap.find('#upgrademap-upgrade-marker').attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');
        },

        addMarkersToMap: function() {
            var byoSvgMap = this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon');

            byoSvgMap.find('#upgrademap-selected-marker').remove();
            byoSvgMap.find('#upgrademap-upgrade-marker').remove();
            this.addSelectedMarker(byoSvgMap);
            this.addUpgradeMarker(byoSvgMap);
        },

        isStaticMap: function() {
            return $('#seatmap').blueprint.isMapStatic();
        },

        enlargeUpgradeVfs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var target = $(evt.currentTarget);

            if (target.hasClass('upgrade-no-vfs')) {
                return;
            }

            this.publishEvent('showWindowVfs', this.model.get('sectionId'));

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade VFS Clicked', pageload: false});
        },

        disabledUpgradeMap: function() {
            this.uiEl.$compareSeat.addClass('disabled');
            this.uiEl.$upgradeSeatMap.addClass('disabled');
        },

        enabledUpgradeMap: function() {
            this.uiEl.$compareSeat.removeClass('disabled');
            this.uiEl.$upgradeSeatMap.removeClass('disabled');
        },

        upgradeDisplayOmniture: function(oldTicketInfo) {
            var upgradeTag = 'Upgrade-offered',
                upgradeDisplay = 'Upgrade Displayed';

            if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgrade-Accordion-offered';
                upgradeDisplay = 'Upgrade-Accordion Displayed';
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + this.model.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: upgradeTag + ' ListingId: ' + this.model.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                    originalListingId: oldTicketInfo ? 'Original ListingId:' + oldTicketInfo.id : '',
                    originalListingPrice: oldTicketInfo ? 'Original Listing Price: ' + oldTicketInfo.price : ''
                }
            });
        }

    });

    return UpgradeTicketView;
});

