/* global _ */
define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'views/byomap_tooltip_view',
    'views/byo_listing_info_view',
    'views/byo_listing_map_view',
    'views/upgrade_ticket_view',
    'views/parkingpass_view',
    'views/similar_ticket_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'helpers/map_helper'
], function(Foobunny, Hammer, globals, gc, ByomapTooltipView, ByoListingInfoView, ByoListingMapView, UpgradeTicketView, ParkingPassView, SimilarTicketView, i18n, currencyFormatUtil, EventHelper, CartHelper, MapHelper) {
    'use strict';

    var byoSvgMap,
        isBlankMap = false,
        upgradeSectionId,
        selectedSectionId;

    var BuildYourOrderView = Foobunny.BaseView.extend({

        el: '#event-byo-container',

        template: gc.appFolder + '/build_your_order',

        events: {
            'tap .close-icon .sh-iconset-close': 'hide',
            'tap #event-build-your-order': 'hideByoMapTooltip',
            'click .accordion-checkout': 'goToCheckout',
            'scroll': 'stickyCheckout',
            'tap .byo-black-overlay-screen': 'hideMapOverlay',
            'tap .byo-upgrade-map-wrapper': 'hideMapOverlay',
            'click .byo-upgrade-map-wrapper .upgrade': 'displayTooltip',
            'click .byo-upgrade-map-wrapper .selected': 'displayTooltip'
        },

        uiEl: {
            $upgradeTooltip: '.upgradeTooltip',
            $selectedTooltip: '.selectedTooltip',
            $byoupgrademapwrapper: '.byo-upgrade-map-wrapper',
            $byoblackoverlayscreen: '.byo-black-overlay-screen',
            $byoupgradeseatmap: '.byo-upgrade-seatmap',
            $buildyourorder: '#event-build-your-order',
            $currentListing: '.current-listing',
            $parkingDetails: '.parking-container',
            $upSellContainer: '.upsell-info',
            $upgradeTicket: '.upgrade-listing',
            $checkout: '.checkout',
            $similarTicketContainer: '.similar-ticket-container'
        },

        initialize: function(options) {
            this.parkingComponentSelected = false;

            this.subModels = {};
            this.subViews = {};

            this.subViews.listingView = new ByoListingInfoView({
                el: '#event-build-your-order .listing-info',
                eventData: options.eventData
            });

            this.subViews.listingMapView = new ByoListingMapView({
                el: '#event-build-your-order .seat-info'
            });

            this.subViews.similarTicketView = new SimilarTicketView({
                el: '#event-build-your-order .similar-ticket-container'
            });

            if (globals.upgradeTicket.display) {
                this.subViews.upgradeView = new UpgradeTicketView({
                    el: '#event-build-your-order .upgrade-listing'
                });
            }

            // Subscribe to an event to build and show the view.
            this.subscribeEvent('buildyourorder:listing', this.updateView);
            this.subscribeEvent('similarTicket:remove', this.hide);
            this.subscribeEvent('buildyourorder:hide', this.hide);
            this.subscribeEvent('upgradeTicket:displayMapOverlay', this.constructUpgradeMap);

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

        hideMapOverlay: function() {
            globals.isByoMapOverlayDisplayed = false;
            this.$el.removeClass('zIndex');
            $('body').removeClass('overlay-active');

            this.uiEl.$selectedTooltip.removeClass('below');
            this.uiEl.$upgradeTooltip.removeClass('below');

            this.uiEl.$byoblackoverlayscreen.addClass('hide');
            this.uiEl.$byoupgrademapwrapper.addClass('hide');
            this.$el.removeClass('byo-hide-scroll');
        },

        mapClone: function() {
            var svgns = 'http://www.w3.org/2000/svg',
                xlink = 'http://www.w3.org/1999/xlink',
                svgimg;

            this.uiEl.$byoupgradeseatmap.append($('#seatmap').find('.svgcontainer').html());

            byoSvgMap = this.uiEl.$byoupgradeseatmap.find('svg'); // getting the mapSVG

            if (EventHelper.getBrowserName().isSafari()) {
                // Safari does not repaint the image el inside SVG..
                // BYOSeatMap Repainting Fix
                byoSvgMap.find('image').remove(); // removing image el from SVG

                // creating an image element and adding it to the SVG
                svgimg = document.createElementNS(svgns, 'image');
                svgimg.setAttribute('height', '100%');
                svgimg.setAttribute('width', '100%');
                svgimg.setAttributeNS(xlink, 'href', $('#seatmap').blueprint.getmapurl());
                byoSvgMap.prepend(svgimg);
            }
        },

        displayTooltip: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var target = $(evt.currentTarget);

            if (target.hasClass('selectedTooltip')) {
                this.uiEl.$upgradeTooltip.removeClass('tooltip-selected');
                this.uiEl.$selectedTooltip.addClass('tooltip-selected');
            } else {
                this.uiEl.$selectedTooltip.removeClass('tooltip-selected');
                this.uiEl.$upgradeTooltip.addClass('tooltip-selected');
            }
        },

        constructUpgradeMap: function() {
            this.$el.addClass('zIndex');
            if (this.uiEl.$byoupgradeseatmap.find('svg').length === 0) {
                this.mapClone();
            }

            if (MapHelper.isStaticMap()) {
                return;
            }

            if (!isBlankMap) {
                this.blankMap();
            }

            selectedSectionId = this.subViews.listingMapView.model.get('sectionId');
            upgradeSectionId = this.subViews.listingMapView.upgradeModel.get('sectionId');

            this.uiEl.$byoupgrademapwrapper.removeClass('hide');
            this.uiEl.$byoupgradeseatmap.find('#selected-marker').remove();
            this.uiEl.$byoupgradeseatmap.find('#upgrade-marker').remove();

            this.addMarkers(selectedSectionId, 'selected-marker', 'selected');
            this.addMarkers(upgradeSectionId, 'upgrade-marker', 'upgrade');

            this.displayOverlayScreen();
            this.$el.addClass('byo-hide-scroll');

            this.openTooltips();
        },

        addMarkers: function(sectionId, id, type) {
            // sectionId for the markers to be positioned
            // div id for the markers and type is 'upgrade' or 'selected'

            if (!sectionId) {
                return;
            }
            var sectionPos;

            byoSvgMap.append(MapHelper.createMarkerTags(id, type));
            // get selectedSectionPosition inside the byo svg map
            sectionPos = this.uiEl.$byoupgradeseatmap.find('#' + sectionId)[0].getBBox();

            if (type === 'upgrade' && selectedSectionId === upgradeSectionId) {
                sectionPos.x = sectionPos.x + 100;
                sectionPos.y = sectionPos.y + 100;
            }

            // centering the map marker inside the section
            byoSvgMap.find('#' + id).attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');

        },

        openTooltips: function() {
            // check if sectionId is present before rendering the tooltips
            if (selectedSectionId) {
                this.subViews.selectedTooltip = new ByomapTooltipView({
                    el: '.byo-upgrade-map-wrapper .selectedTooltip',
                    model: this.subViews.listingMapView.model
                });
                this.subViews.selectedTooltip.render();
                this.uiEl.$selectedTooltip.removeClass('hide');
            }

            if (upgradeSectionId) {
                this.subViews.upgradeTooltip = new ByomapTooltipView({
                    el: '.byo-upgrade-map-wrapper .upgradeTooltip',
                    model: this.subViews.listingMapView.upgradeModel
                });
                this.subViews.upgradeTooltip.render();
                this.uiEl.$upgradeTooltip.removeClass('hide');
            }

            this.repositionTooltips();
        },

        repositionTooltips: function() {
            var tooltipWidth = this.uiEl.$upgradeTooltip.width(),
                selectedMarker = this.uiEl.$byoupgradeseatmap.find('#selected-marker'),
                upgradeMarker = this.uiEl.$byoupgradeseatmap.find('#upgrade-marker'),
                windowWidth = $('html').width(),
                customOffsetAbove = 85,
                customOffsetBelow = 25,
                sMarkerPosition,
                uMarkerPosition,
                mapWrapperTop = parseFloat(this.uiEl.$byoupgrademapwrapper.css('top'));

            if (selectedMarker.length) {
                sMarkerPosition = selectedMarker.find('.seat-filled').offset();
            }

            if (upgradeMarker.length) {
                uMarkerPosition = upgradeMarker.find('.seat-filled').offset();

                // Preventing the tooltips overlap
                if (sMarkerPosition.top < uMarkerPosition.top) {
                    this.uiEl.$selectedTooltip.addClass('below');
                    this.uiEl.$upgradeTooltip.removeClass('below');
                    this.uiEl.$selectedTooltip.css({'top': sMarkerPosition.top - mapWrapperTop - customOffsetAbove}); // positioning the tooltip above the marker
                    this.uiEl.$upgradeTooltip.css({'top': uMarkerPosition.top - mapWrapperTop + customOffsetBelow}); // positioning the tooltip below the marker
                } else {
                    this.uiEl.$upgradeTooltip.addClass('below');
                    this.uiEl.$selectedTooltip.removeClass('below');
                    this.uiEl.$upgradeTooltip.css({'top': uMarkerPosition.top - mapWrapperTop - customOffsetAbove});
                    this.uiEl.$selectedTooltip.css({'top': sMarkerPosition.top - mapWrapperTop + customOffsetBelow});
                }

                // Preventing the tooltips go outside the viewport
                if (sMarkerPosition.left + (tooltipWidth / 2) > windowWidth) {
                    this.uiEl.$selectedTooltip.css({'right': '0px'});
                } else if (sMarkerPosition.left - (tooltipWidth / 2) < 0) {
                    this.uiEl.$selectedTooltip.css({'left': '0px'});
                } else {
                    this.uiEl.$selectedTooltip.css({'left': sMarkerPosition.left - (tooltipWidth / 2)});
                }

                if (uMarkerPosition.left + (tooltipWidth / 2) > windowWidth) {
                    this.uiEl.$upgradeTooltip.css({'right': '0px'});
                } else if (uMarkerPosition.left - (tooltipWidth / 2) < 0) {
                    this.uiEl.$upgradeTooltip.css({'left': '0px'});
                } else {
                    this.uiEl.$upgradeTooltip.css({'left': uMarkerPosition.left - (tooltipWidth / 2)});
                }
            }
        },

        displayOverlayScreen: function() {
            $('body').addClass('overlay-active');
            this.uiEl.$byoblackoverlayscreen.removeClass('hide');
        },

        blankMap: function() {
            var whiteColor = '#FFFFFF',
                removeMapColors = {
                    'fill': whiteColor,
                    'fill-opacity': 0.2,
                    'stroke': whiteColor,
                    'stroke-width': 0,
                    'stroke-opacity': 0
                };
            this.uiEl.$byoupgradeseatmap.find('path').css(removeMapColors);
            isBlankMap = true;
        },

        isStaticMap: function() {
            return $('#seatmap').blueprint.isMapStatic();
        },

        show: function() {
            var ticketIdLabel = 'ListingId Selected: ',
                ticketIds = this.subModels.ticketListing.get('listingId') || '',
                ticketRank = this.subModels.ticketListing.get('ticketRank') || '',
                self = this;

            if (!EventHelper.isMobile()) {
                $('#eventInfo').hide('fast');
                $('#event-byo-container').addClass('upgrade-height');
                this.$el.removeClass('byo-close-animation').addClass('no-scroll-bar').removeClass('hide');
                setTimeout(function() {
                    self.$el.removeClass('no-scroll-bar');
                }, 700);
            } else {
                this.$el.removeClass('hide');
                this.$el.animate({top: 0}, 'slow');
            }

            if (globals.upgradeTicket.display) {
                this.uiEl.$upSellContainer.removeClass('hide');
                this.publishEvent('buildyourorder:displayUpgrade', this.subModels.ticketListing);
            }

            // Create and show upsell container if add parking pass component
            if (EventHelper.showParkingAddon()) {
                if (!this.subViews.parkingpassView) {
                    this.subViews.parkingpassView = new ParkingPassView({
                        el: '#event-build-your-order .parking-container'
                    });
                }
                this.uiEl.$upSellContainer.removeClass('hide');
            }

            this.publishEvent('buildyourorder:displayed', true, this.subModels.ticketListing);

            // Add the seat ids to the omniture only for blended event since the seats will
            // only be available in case of blendings.
            if (EventHelper.isBlendedEvent()) {
                if (EventHelper.isBlendedLogicApplied() === true) {
                    ticketIds = _.map(this.subModels.ticketListing.get('seats'), function(element) {
                        return element.ticketSeatId;
                    }).join();
                    ticketIdLabel = 'SeatId Selected: ';
                } else {
                    // We are getting the listingId from the 1st element of the seats in non-blended mode.
                    // Since we are defining the variable ticketIds with a value we do not have to
                    // to check for existings of the seats[0] element for assigning it. However, if there is
                    // an occurrence where the listing does not have the seats array we still want the page
                    // to handle this gracefully. Hence the try/catch block.
                    try {
                        ticketIds = this.subModels.ticketListing.get('seats')[0].listingId;
                    } catch(e) {}
                }
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Viewed Ticket Details',
                pageload: false,
                filterType: ticketIdLabel + ticketIds + '; Ticket Rank: ' + ticketRank,
                userExperienceSnapshot: {
                    blendedListing: 'Blended Listing: ' + this.subModels.ticketListing.get('multipleListing'),
                    ticketId: ticketIdLabel + ticketIds,
                    ticketRank: 'Ticket Rank: ' + ticketRank,
                    originalListingId: 'Original ListingId:' + ticketIds,
                    originalListingPrice: 'Original Listing Price: ' + this.subModels.ticketListing.get('usePrice').amount
                }
            });
        },

        hide: function(evt) {
            var self = this,
                deletePromise,
                cartModels = [];

            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }

            if (globals.isByoMapOverlayDisplayed) {
                // on backButton action by the user, hide mapoverlay if it is active
                $('body').removeClass('overlay-active');
                this.uiEl.$byoupgrademapwrapper.addClass('hide');
                this.uiEl.$byoblackoverlayscreen.addClass('hide');
                this.$el.removeClass('byo-hide-scroll');
                globals.isByoMapOverlayDisplayed = false;
            }

            globals.byo.quantity = '';
            globals.upgradeTicket.isTicketUpgraded = false;

            EventHelper.removeUrlParams(['byo', 'byo_qty', 'oldtktid']);

            this.uiEl.$similarTicketContainer.addClass('hide');
            this.uiEl. $checkout.removeClass('disabled');
            $('#event-build-your-order .listing-checkout').removeClass('disabled');

            if (!gc.ticket_id) {
                // EventHelper.removeUrlParam('tktbkt');
                EventHelper.removeUrlParams(['ticket_id', 'ticketRank']);
            }

            if (gc.cart_id && !gc.ticket_id) {
                if (EventHelper.isBlendedEvent()) {
                    if (globals.event_meta.parkingEventId) {
                        cartModels = CartHelper.getItemsByEvent(globals.event_meta.parkingEventId);
                    }
                    if (cartModels.length <= 0) {
                        EventHelper.removeUrlParam('cart_id');
                        gc.cart_id = null;
                        CartHelper.resetCart();
                    }
                } else {
                    // Remove ALL the TICKETS for this event.
                    // TODO: Use the deleteByType for deleting all tickets in one call.
                    //       This is especially needed for BLENDED.
                    deletePromise = CartHelper.deleteFromCart(this.subModels.ticketListing);
                }
            }

            this.publishEvent('buildyourorder:hidden');

            if (!EventHelper.isMobile()) {
                $('#eventInfo').slideDown('fast');
                $('#event-byo-container').removeClass('upgrade-height');

                this.$el.animate({
                    height: '0'
                }, 400, function() {
                    // We should always be at the top of parking details when we 'show' the content again
                    self.$el.scrollTop(0);
                    self.$el.addClass('hide');
                    self.$el.css('height', '');
                });
            } else {
                this.$el.animate({top: '101%'}, 'slow', function() {
                    self.$el.addClass('hide');
                });
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Closed Ticket Details',
                pageload: false,
                userExperienceSnapshot: {
                    ticketId: '',
                    ticketRank: '',
                    quantityL: '',
                    SimilarSelectedListingId: '',
                    upgradeListingId: '',
                    upgradedListingPrice: '',
                    originalListingId: '',
                    originalListingPrice: '',
                    blendedListing: '',
                    parkingListingId: '',
                    parkingPrice: ''
                }
            });
        },

        hideByoMapTooltip: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            this.$el.find('.byomap-tooltip').addClass('hide');
        },

        updateView: function(listing) {
            // Add BYO to the URL.
            EventHelper.setUrlParam('byo', 1);
            if (listing.get('valueBucket')) {
                EventHelper.setUrlParam('tktbkt', listing.get('valueBucket'));
            }

            // Re-assign the model to the "new" incoming model.
            this.subModels.ticketListing = listing;

            if (!globals.upgradeTicket.isTicketUpgraded) {
                this.uiEl.$upgradeTicket.removeClass('upgrade-selected');
            }

            this.layoutSettings();
            this.show();

            // Publish Event to pushState for BYO as open
            if (window.history.state === null) {
                this.publishEvent('event:pushState', {
                    eventName: 'buildyourorder:toggle',
                    eventData: null
                });
            }
        },

        layoutSettings: function() {
            if (!this.$el.is(':visible')) {
                return;
            }

            // If the BYO is visible then we need to keep it visible for responsiveness.
            this.$el.css({top: 0});

            if (EventHelper.isMobile()) {
                this.publishEvent('globalHeader:hide');
            }

            // if byo upgrade map overlay is visible reposition the tooltips wrt the markers
            if (this.uiEl.$byoupgrademapwrapper.is(':visible')) {
                this.repositionTooltips();
            }
        },

        goToCheckout: function() {
            this.publishEvent('buildyourorder:checkout');
        },

        stickyCheckout: function() {
            if (!EventHelper.isMobile() || globals.byo.upsellAccordion) {
                return;
            }

            var $checkoutButton = $('#event-build-your-order .listing-checkout'),
                eventHeaderHeight = $('#event-details').outerHeight(),
                upSellTop = this.uiEl.$upSellContainer.offset().top,
                elTop = $checkoutButton.offset().top;

            if (elTop <= eventHeaderHeight && !$checkoutButton.hasClass('sticky')) {
                $checkoutButton.addClass('sticky');
            } else if (upSellTop >= ($checkoutButton.outerHeight() + eventHeaderHeight + 10)) {
                $checkoutButton.removeClass('sticky');
            }

        }
    });

    return BuildYourOrderView;

});
