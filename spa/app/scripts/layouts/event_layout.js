/* global SH,_ */
define([
    'foobunny',
    'hammer',
    'models/filter_model',
    'views/quantity_filter_view',
    'views/filter_view',
    'views/seller_view',
    'views/event_details_view',
    'views/enlarge_vfs_view',
    'views/seatmap_view',
    'views/seatmap_tooltip_view',
    'views/singleticket_view',
    'views/sortfilter_header_view',
    'views/ticketlist_view',
    'views/event_disclosure_view',
    'views/primarypartner_view',
    'views/buildyourorder_view',
    'views/map_take_over_control_view',
    'collections/inventory_collection',
    'helpers/event_helper',
    'global_context',
    'globals',
    'jquery-drawer-component'
], function(Foobunny, Hammer, FilterModel, QuantityFilterView, FilterView, SellerView, EventDetailsView, EnlargeVfsView, SeatmapView, SeatmapTooltipView, SingleTicketView, SortFilterHeaderView, TicketlistView, EventDisclosureView, PrimaryPartnerView, BuildYourOrderView, MapTakeoverControlView, InventoryCollection, EventHelper, gc, globals, jqueryDrawer) {
    'use strict';

    var FALSE = false,
        TRUE = true,
        mapTakeover = EventHelper.getUrlQuery('mapto'),
        mapTakeoverPositionStart = 'split';
    var EventLayout = Foobunny.Layout.extend({

        initialize: function(options) {

            console.log('--EventLayout-- in initialize()', this);
            var self = this,
                p0,
                experience = {abValue: {}},
                deliveryMethodsStr = 'Delivery Methods: ',
                seatFeaturesStr = 'Seat Features: ',
                sidzid = '',
                seatsStr = '',
                primaryPerformerId,
                mboxKeys = ['showWithFees', 'quantityQuestion', 'priceSliderPositionOutside', 'displayBYO', 'displayUpgrade', 'upsellAccordion', 'blendedLogicApplied', 'quantitySelectorStyle_11_2016', 'DefaultSort', 'mapto'];


            this.mapType = options.mapType;
            this.mapReadyPromise = $.Deferred(); // setup a promise to resolve when the map is loaded
            SH.mbox = SH.mbox || {};

            EventHelper.setStaticImageDetails();

            this.views = {
                // filter: new FilterView(),
                eventDetails: new EventDetailsView(),
                eventDisclosure: new EventDisclosureView(),
                enlargeVfs: new EnlargeVfsView(),
                seatmap: new SeatmapView({
                    nodeId: options.nodeId,
                    configId: options.configId,
                    mapType: options.mapType,
                    version: options.version,
                    viewFromSection: options.viewFromSection,
                    staticImageUrl: options.staticImageUrl
                }),
                seatmapTooltipView: new SeatmapTooltipView(),
                ticketlist: new TicketlistView(),
                // sortFilterHeader: new SortFilterHeaderView(),
                // TODO: Make primaryPartnerView as SubView of EventInfoView
                primarypartner: new PrimaryPartnerView()
            };

            if (EventHelper.hasBsfFeature()) {
                this.views.bsf = new SellerView();
            }
            // RITESH: Un-comment when the ticket recommendations related AB tests are
            // completed and we have a clear winner.
            // if (EventHelper.isSingleTicketMode()) {
            //     this.views.singleTicket = new SingleTicketView();
            // }

            sidzid = globals.OMN.sid || globals.OMN.zid;

            if (sidzid) {
                seatsStr = (globals.OMN.zonesEnabled === true) ? 'Zones: ' + sidzid : 'Sections: ' + sidzid;
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.dt) {
                if (globals.OMN.dt.search('1') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Electronic, ';
                }
                if (globals.OMN.dt.search('2') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Instant Download, ';
                }
                if (globals.OMN.dt.search('5') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'UPS, ';
                }
                if (globals.OMN.dt.search('4') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Pickup, ';
                }
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.categ) {
                if (globals.OMN.categ.search('6') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Aisle, ';
                }
                if (globals.OMN.categ.search('2') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Wheelchair accessible, ';
                }
                if (globals.OMN.categ.search('4') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Parking pass included, ';
                }
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.excl) {
                if (globals.OMN.excl.search('1') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Exclude obstructed view, ';
                }
            }

            seatFeaturesStr = seatFeaturesStr.trim().replace(/(^,)|(,$)/g, '');
            deliveryMethodsStr = deliveryMethodsStr.trim().replace(/(^,)|(,$)/g, '');

            if (globals.OMN.urlSortOption) {
                globals.OMN.urlSortOption = globals.OMN.urlSortOption.split('+');
            }

            this.preserveFiltersObject = {
                userExperienceSnapshot: {
                    quantity: parseInt(globals.OMN.qty) > 0 ? 'Quantity: ' + globals.OMN.qty : '',
                    quantityL: parseInt(globals.OMN.byoqty) > 0 ? 'QuantityL: ' + globals.OMN.byoqty : '',
                    ticketId: globals.OMN.listingId ? 'ListingId Selected: ' + globals.OMN.listingId : '',
                    PDO: globals.OMN.withFees === true ? 'Price With Fees' : '',
                    zoneOrSection: globals.OMN.zonesEnabled === true ? 'Zone Selection' : '',
                    priceSliderMin: globals.OMN.minPrice > -1 ? 'Min Price: ' + globals.OMN.minPrice : '',
                    priceSliderMax: globals.OMN.maxPrice > -1 ? 'Max Price: ' + globals.OMN.maxPrice : '',
                    seats: (sidzid !== undefined) ? seatsStr : '',
                    deliveryMethods: (globals.OMN.dt) ? deliveryMethodsStr : '',
                    seatFeatures: (globals.OMN.excl || globals.OMN.categ) ? seatFeaturesStr : '',
                    sortTab: (globals.OMN.urlSortOption) ? (globals.OMN.urlSortOption[0] + ' sorting ' + globals.OMN.urlSortOption[1]) : ''
                }
            };

            // four api calls are made from this app, promise p2 contains both search inventory and meta data promise
            p0 = $.Deferred();
            this.p1 = this.views.seatmap.fetchDataPromise;
            this.p2 = this.views.ticketlist.fetchDataPromise || $.Deferred();
            this.p3 = this.views.eventDetails.fetchDataPromise;

            // Add the key TicketRecommendation only if the event has reco enabled.
            if (globals.TicketReco.hasTicketReco) {
                mboxKeys.push('TicketRecommendation');
            }

            // Call Mbox if ABTesting is going on.
            // We are supposed to call the MboxUtil only after the event details is available.
            // Which PDO Experience to show will come from the Mbox call. Right now we are getting
            // the PDO Experience from the EventHelper -> Global Registry.
            $.when(this.p3).done(function eventDetailsDone() {
                if (self.views.eventDetails.model.get('expiredInd') === true) {
                    p0.resolve();
                    return;
                }

                primaryPerformerId = self.views.eventDetails.model.getPrimaryPerformerId();

                if (EventHelper.isABTestActive()) {
                    if (gc.mboxCalled) {
                        // Needs to be adjusted once price slider AB is completed.
                        if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                            experience.abValue.priceSliderPositionOutside = false;
                        } else {
                            experience.abValue.priceSliderPositionOutside = globals.priceSlider.displayOutside;
                        }

                        experience.abValue.quantityQuestion = (globals.quantityOverlay.quantityQuestion === 'true');

                        // Needs to be adjusted once the AB for MLB is completed. This will be done in the viewSelectorController.js
                        experience.abValue.TicketRecommendation = globals.TicketReco.showTicketReco;

                        // Is the user in the BYO test
                        experience.abValue.ABdisplay = globals.byo.ABdisplay;

                        // Display upgrades
                        experience.abValue.displayUpgrade = globals.upgradeTicket.display;
                        experience.abValue.upsellAccordion = globals.byo.upsellAccordion;

                        experience.abValue.blendedLogicApplied = globals.inventoryCollection.blendedLogicApplied;

                        experience.abValue.mapZoneSelection = globals.zones_enabled;

                        experience.abValue.DefaultSort = gc.urlSortOption;

                        // Display/hide feesToggle
                        // experience.abValue.displayWithFeesToggle = globals.displayWithFeesToggle;

                        self.mboxPromise = $.Deferred().resolve(experience);
                    } else {
                        self.mboxPromise = EventHelper.makeMboxCall(
                            self,
                            EventHelper.constructMboxData(self.views.eventDetails.model),
                            SH.mbox,
                            mboxKeys);
                    }
                    self.mboxPromise.always(function mboxAlways(params) {
                        EventHelper.setUrlParam('mbox', '1');

                        // IMPORTANT: Since the code contains setup for multiple campaigns we will need the TNT to
                        // return ALL the values until such time the code is adjusted.
                        // MLB Campaign setup -
                        // 1. Event page sends the ancestors data to MBOX.
                        // 2. MBOX determines whether to test or not based on parameters.
                        // 3a. If we are testing then send the appropriate response back - VALUEBARLOWEST or DEFAULT.
                        // 3b. If we are not testing then do not send TicketRecommendation. We will show VALUEBARLOWEST.

                        // We want to show the ticket reco experience only if the event has
                        // ticket reco enabled otherwise we are going to show the default.
                        if (globals.TicketReco.hasTicketReco) {
                            // If we have received something back from the MBOX then validate the value and use it.
                            if (params.abValue.TicketRecommendation &&
                                globals.TicketReco.experience[params.abValue.TicketRecommendation]) {
                                globals.TicketReco.showTicketReco = params.abValue.TicketRecommendation;
                            } else {
                                globals.TicketReco.showTicketReco = globals.TicketReco.experience.VALUEBARLOWEST;
                            }
                        } else {
                            globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                        }
                        // Set the recoState in the URL Params
                        EventHelper.setUrlParam('rS', globals.TicketReco.setRecoExperience[globals.TicketReco.showTicketReco]);

                        // Display/hide feesToggle ABTest
                        // if (_.isBoolean(params.abValue.displayWithFeesToggle)) {
                        //     globals.displayWithFeesToggle = params.abValue.displayWithFeesToggle;
                        // } else {
                        //     globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();
                        // }
                        // EventHelper.setUrlParam('dwft', globals.displayWithFeesToggle); //dwft - displayWithFeesToggle

                        // TODO: Remove this once the AB test for WithFees has been put to rest.
                        globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();

                        if (_.isBoolean(params.abValue.ABdisplay)) {
                            globals.byo.ABdisplay = params.abValue.ABdisplay;
                        } else {
                            globals.byo.ABdisplay = EventHelper.isBYOEnabled();
                        }
                        EventHelper.setUrlParam('abbyo', globals.byo.ABdisplay);

                        // Needs to be adjusted once price slider AB is completed.
                        if (EventHelper.isMobile() || globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                            globals.priceSlider.displayOutside = false;
                        } else {
                            if (_.isBoolean(params.abValue.priceSliderPositionOutside)) {
                                globals.priceSlider.displayOutside = params.abValue.priceSliderPositionOutside;
                            } else {
                                globals.priceSlider.displayOutside = EventHelper.getSliderPosition();
                            }
                        }
                        EventHelper.setUrlParam('sliderpos', globals.priceSlider.displayOutside);

                        if (_.isBoolean(params.abValue.quantityQuestion)) {
                            globals.quantityOverlay.quantityQuestion = params.abValue.quantityQuestion;
                        } else {
                            globals.quantityOverlay.quantityQuestion = EventHelper.isQuantityOverlayEnabled();
                        }
                        EventHelper.setUrlParam('qtyq', globals.quantityOverlay.quantityQuestion);

                        if (_.isBoolean(params.abValue.mapZoneSelection)) {
                            globals.zones_enabled = params.abValue.mapZoneSelection;
                        } else {
                            globals.zones_enabled = EventHelper.isMapZoneSelected();
                        }

                        // if mbox responds and contains a value of blendedLogicApplied
                        if (params.abValue.blendedLogicApplied !== undefined) {
                            globals.inventoryCollection.blendedLogicApplied = params.abValue.blendedLogicApplied;
                            EventHelper.setUrlParam('bla', params.abValue.blendedLogicApplied);
                        }

                        if (_.isBoolean(params.abValue.quantitySelectorStyle_11_2016)) {
                            self.setQuantitySelectorStyle_11_2016(params.abValue.quantitySelectorStyle_11_2016);
                        } else {
                            self.setQuantitySelectorStyle_11_2016(EventHelper.isEnabledQuantitySelectorStyle_11_2016());
                        }

                        if (_.isBoolean(params.abValue.mapTakeover)) {
                            EventHelper.setUrlParam('mapto', params.abValue.mapTakeover);
                            mapTakeover = params.abValue.mapTakeover;
                            mapTakeoverPositionStart = params.abValue.mapTakeoverPosition || mapTakeoverPositionStart;
                            if (EventHelper.isMapTakeOverEnabled()) {
                                self.$el.off('tap', '#arrowButton');
                                self.initializeMapTakeOver(mapTakeoverPositionStart);
                            }
                        }

                        if (globals.inventoryCollection.blendedEvent === true) {
                            globals.upgradeTicket.display = false;
                        } else {
                            if (_.isBoolean(params.abValue.displayUpgrade)) {
                                globals.upgradeTicket.display = params.abValue.displayUpgrade;
                            } else {
                                globals.upgradeTicket.display = EventHelper.isUpgradeEnabled();
                            }
                            EventHelper.setUrlParam('dUpg', globals.upgradeTicket.display);
                        }

                        if (!EventHelper.isMobile()) {
                            globals.byo.upsellAccordion = false;
                        } else {
                            if (_.isBoolean(params.abValue.upsellAccordion)) {
                                globals.byo.upsellAccordion = params.abValue.upsellAccordion;
                            }
                            EventHelper.setUrlParam('dUAccr', globals.byo.upsellAccordion);
                        }

                        // The following is rule specific to 76ers launch. This will be changed
                        // in future impl's.
                        //
                        //  If Parking Pass is not enabled in the global registry no one gets it
                        // If Parking Pass enabled AND performer is on alwaysOn global registry, enable parkingPass
                        if (_.contains(EventHelper.getParkingPerformers(), primaryPerformerId.toString())) {
                            globals.parkingPass.enabled = true;
                        } else {
                            // Performers not on the "list" go through the AB
                            if (_.isBoolean(params.abValue.parkingPass)) {
                                globals.parkingPass.enabled = params.abValue.parkingPass;
                            } else {
                                globals.parkingPass.enabled = EventHelper.getParkingFeatureState();
                            }
                        }

                        self.setDefaultSort(params.abValue.DefaultSort);

                        self.views.sortFilterHeader = new SortFilterHeaderView();
                        self.views.sortFilterHeader.render();
                        // TO DO: revisit after price slider A/B test
                        self.views.filter = new FilterView();
                        self.views.filter.setSeatTraits(self.views.eventDetails.model);
                        self.views.filter.render();
                        self.views.sortFilterHeader.bindUIElements(); // filter view replaces the drop down filter dom elements of SortFilterHeaderView

                        self.views.buildyourorder = new BuildYourOrderView({
                            eventData: self.views.eventDetails.model
                        });
                        self.views.buildyourorder.render();

                        // RITESH: Remove this when the ticket recommendations AB tests are completed.
                        if (EventHelper.isSingleTicketMode()) {
                            self.views.singleTicket = new SingleTicketView();
                            self.views.singleTicket.render();
                        }
                        self.layoutSettings();
                        self.updateBottomContainer({});

                        self.p2a = self.views.ticketlist.fetchData();
                        self.p2a.done(function() {
                            self.p2.resolve();
                        }).fail(function(error) {
                            self.p2.reject(error);
                        });
                    });
                } else {
                    // Display the parking pass for the alwaysOn (76ers) and for non-76ers get the value from the global registry.
                    // If you have to entirely disable the feature then remove all the values from alwaysOn and set the
                    // feature to false in global registry.
                    // If parking pass enabled (default: false), performers not on the "list" go through the AB. If no AB, then fall back to global registry.
                    globals.parkingPass.enabled = _.contains(EventHelper.getParkingPerformers(), primaryPerformerId.toString()) || EventHelper.getParkingFeatureState();

                    // TODO: tech debt cleanup after 76ers blended testing is completed
                    if ((globals.inventoryCollection.blendedLogicApplied === 'true' || globals.inventoryCollection.blendedLogicApplied === true) && globals.inventoryCollection.blendedPerformers[primaryPerformerId] === true) {
                        globals.inventoryCollection.blendedLogicApplied = true;
                    } else {
                        globals.inventoryCollection.blendedLogicApplied = false;
                    }
                    // RITESH: Remove this when the ticket recommendations AB tests are completed.
                    if (globals.TicketReco.hasTicketReco) {
                        globals.TicketReco.showTicketReco = EventHelper.showRecoExperience();
                    } else {
                        globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                    }

                    globals.byo.ABdisplay = EventHelper.isBYOEnabled();
                    globals.quantityOverlay.quantityQuestion = EventHelper.isQuantityOverlayEnabled();

                    if (!EventHelper.isMobile()) {
                        globals.byo.upsellAccordion = false;
                    }

                    if (globals.inventoryCollection.blendedEvent === true) {
                        globals.upgradeTicket.display = false;
                    } else {
                        globals.upgradeTicket.display = EventHelper.isUpgradeEnabled();
                    }

                    // TODO: Remove this once the AB test for WithFees has been put to rest.
                    globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();

                    self.setDefaultSort();

                    self.setQuantitySelectorStyle_11_2016(EventHelper.isEnabledQuantitySelectorStyle_11_2016());

                    EventHelper.setUrlParam('mapto', mapTakeover);

                    self.views.sortFilterHeader = new SortFilterHeaderView();
                    self.views.sortFilterHeader.render();
                    // TO DO: revisit after price slider A/B test
                    self.views.filter = new FilterView();
                    self.views.filter.setSeatTraits(self.views.eventDetails.model);
                    self.views.filter.render();

                    self.views.buildyourorder = new BuildYourOrderView({
                        eventData: self.views.eventDetails.model
                    });
                    self.views.buildyourorder.render();

                    // RITESH: Remove this when the ticket recommendations AB tests are completed.
                    if (EventHelper.isSingleTicketMode()) {
                        self.views.singleTicket = new SingleTicketView();
                        self.views.singleTicket.render();
                    }

                    self.updateBottomContainer({});

                    self.p2a = self.views.ticketlist.fetchData();
                    self.p2a.done(function() {
                        self.p2.resolve();
                    }).fail(function(error) {
                        self.p2.reject(error);
                    });
                }

                p0.resolve();
            });

            // publish the app:render-ready event - all api's fetched at this point
            $.when(p0, this.p1, this.p2, this.p3).then(function() {
                // finally fire the app:render-ready event
                self.publishEvent('app:render-ready');
                self.setOnLoadTracking(self.views.eventDetails.model);

//                if (!gc.quantityDirty && !globals.event_meta.isParking && globals.quantityOverlay.quantityQuestion && !gc.userComingBack && self.model.get('qty') === '-1' && !EventHelper.isSingleTicketMode() && self.views.ticketlist.subCollections.ticketlist.length > 0) {
                var layoutType = (EventHelper.isBlendedEvent())? 'blended' : 'non-blended';
                var eventType = (globals.event_meta.isParking)? 'parking-pass' : 'default';
                if (EventHelper.quantityQuestionEnabled({eventType: eventType}) === true) {

                    // Quantity filter theme switch for blended and non blended non-ga
                    var urlParamQtyBtnCount = EventHelper.getUrlQuery('qtyBtnCount');


                    var qtyFilterArgs = {};

                    if(EventHelper.isBlendedEvent()) {

                        qtyFilterArgs = {
                            filterId: 'qty_container',
                            filterClass: 'qty_content',
                            type: 'overlay',
                            qtySelected:  self.model.get('qty'),
                            quantityVector: self.model.get('quantityVector'),
                            maxButtonCount: urlParamQtyBtnCount || EventHelper.getFeatureFn('event.qqBlendedMaxQty', 'string')() || globals.quantityOverlay.quantityBtnMaxCount,
                            minButtonCount: globals.quantityOverlay.quantityBtnInitialCount,
                            disableUnavailableQuantities: false,
                            navigation: true
                        };
                    } else {
                        // this is going to go away, only to support the default / current selector buttons 12345+
                        qtyFilterArgs = {
                            filterId: 'qty_container',
                            filterClass: 'qty_content flex-center',
                            type: 'overlay',
                            maxButtonCount: 5,
                            minButtonCount: 4,
                            navigation: false,
                            qtySelected:  self.model.get('qty'),
                            quantityVector: self.model.get('quantityVector'),
                            extraButtons: [
                                {"label":'5+', "value":'5+', buttonClass: 'qty-button qty_index'}
                            ]
                        };
                    }

                    // end Quantity filter theme switch
                    // check if there are tickets available before displaying quantity question
                    if(self.views.ticketlist.subCollections.ticketlist.length > 0) {
                        $('#eventInfo').addClass('quantityQuestionHeader');
                        self.views.qtyfilter = new QuantityFilterView(qtyFilterArgs);
                        self.views.qtyfilter.render();
                    }

                    self.$html.addClass('noscroll');
                    self.uiEl.$ticketList.addClass('noscroll');
                    self.$eventDetails.addClass('noclick');


                    // dispose quantity filter after a selection is made
                    self.model.on('change', function() {
                        if (self.views.qtyfilter.disposed === false && self.views.qtyfilter.renderCounter >= 1) {
                            self.views.qtyfilter.closeQtyOverlay();
                            $('#eventInfo').removeClass('quantityQuestionHeader');
                        }
                    });
                }

            }).fail(function(error) {
                self.uiEl.$eventParkingHeader.addClass('hide');
                self.uiEl.$eventMapContainer.addClass('hide');
                self.uiEl.$eventContainer.addClass('hide');
                // wait for all promises
                self.promiseInterval = setInterval(self.checkPromises.bind(self, error), 300);
                self.setOnLoadTracking();
            });

            this.isStaticMap = null;
            this.numberOfListings = null;

            this.subscribeEvent('eventmodel:expiredEvent', this.handleExpiredEvent);
            this.subscribeEvent('seatmap:sectionSelected', this.toggleReset);
            this.subscribeEvent('seatmap:sectionDeselected', this.toggleReset);
            this.subscribeEvent('ticketlist:numberOfListings', this.hideSeatmapZoneOrSectionToggle);
            this.subscribeEvent('seatmap:mapDisplayed', this.handleMapReady);
            this.subscribeEvent('showWindowVfs', this.showWindowVfs);
            this.subscribeEvent('filterView:hidden', this.updateBottomContainer);
            this.subscribeEvent('filterView:displayed', this.updateBottomContainer);
            this.subscribeEvent('globalHeader:show', this.handleHeaderToggle);
            this.subscribeEvent('globalHeader:hide', this.handleHeaderToggle);

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));
        },

        el: '#content_container',

        uiEl: {
            '$eventParkingHeader': '#eventParkingHeader',
            '$eventMapContainer': '#eventMapContainer',
            '$eventContainer': '#eventContainer',
            '$seatmap_zone_section': '#seatmap-zone-section',
            '$seatmap_zone_section_checkbox': '#seatmap-zone-section #section-zone-checkbox',
            '$event_error': '#event_error',
            '$findmorelink': '.findmorelink',
            '$eventInfo': '#eventInfo',
            '$windowVfs': '#window-vfs',
            '$arrowButton': '#arrowButton',
            '$ticketList': '#ticketlist',
            '$sortFilterHeader': '#sortfilter_header',
            '$smallVfs': '#small-vfs',
            '$bottomContainer': '.bottom-container',
            '$filter': '#filter',
            '$backButton': '.back-button',
            '$closeIcon': '.close-icon .sh-iconset-close',
            '$serviceFeeInfo': '.serviceFeeInfo',
            '$eventLayout': '#event_layout',
            '$contentContainer': '#content_container'
        },

        template: gc.appFolder + '/event_layout',

        events: {
            'tap #arrowButton' : 'arrowButtonAction',
            'change #section-zone-checkbox': 'enableSectionOrZone',
            'tap .reset-map': 'resetMap',
            'tap .close-button': 'hideWindowVfs',
            'tap #window-vfs img': 'hideWindowVfs',
            'tap #small-vfs': 'switchVfs',
            'tap .back-button': 'backButtonClicked',
            'tap #eventParkingHeader .sh-iconset-close': 'backButtonClicked',
            'tap .qty-close': 'disposeQtyOverlay'
        },

        afterRender: function() {
            Hammer(this.el);
            this.$body = $('body');
            this.$html = $('html');
            this.$headerView = $('.gh-container');
            this.$eventDetails = $('#event-details');

            this.publishEvent('eventlayout:renderdone');

            // Calculate the heights of the various components and set it up for displaying it properly.
            this.layoutSettings();
            if (mapTakeover === true && EventHelper.isMapTakeOverEnabled()) {
                this.uiEl.$eventContainer.addClass(this.getMapTakeoverPosition(mapTakeoverPositionStart));
                this.uiEl.$eventMapContainer.addClass(this.getMapTakeoverPosition(mapTakeoverPositionStart));
                //this.initializeMapTakeOver(mapTakeoverPositionStart);
            }
        },

        handleMapReady: function(isStaticMap) {
            this.showSeatmapZoneToggle(isStaticMap);
            this.mapReadyPromise.resolve({isStaticMap: isStaticMap});
        },

        handleExpiredEvent: function(upcomingEventsLink) {
            this.uiEl.$findmorelink.attr('href', upcomingEventsLink);
            this.uiEl.$eventInfo.addClass('bottom-line');
            this.uiEl.$eventParkingHeader.addClass('hide');
            this.uiEl.$eventMapContainer.addClass('hide');
            this.uiEl.$eventContainer.addClass('hide');
            this.uiEl.$seatmap_zone_section.addClass('hide');
            this.uiEl.$event_error.removeClass('hide');
        },

        disposeQtyOverlay: function() {
            if (this.views.qtyFilter !== undefined) {
                this.views.qtyfilter.el.remove();
                this.views.qtyfilter.dispose();
            }
        },

        checkPromises: function(errorResp) {
            var self = this,
                p1State = this.p1.state(),
                p2State = this.p2.state(),
                p3State = this.p3.state(),
                eventExpiredInd;

            if (p1State === 'pending' || p2State === 'pending' || p3State === 'pending') {
                return;
            }

            clearInterval(this.promiseInterval);

            eventExpiredInd = self.views.eventDetails.model.get('expiredInd');

            if (eventExpiredInd === false) {
                self.publishEvent('app:render-error');
            }

            if (p3State === 'rejected') {
                self.p3.fail(function(p3ErrorResp) {
                    self.publishEvent('dataready:error', p3ErrorResp);
                    // log failures in Splunk
                    EventHelper.logAppState('fetch', p3ErrorResp);
                });
            } else if (p2State === 'rejected') {
                self.p2.fail(function(p2ErrorResp) {
                    // event expired handeled in events/v3, this check is for EVENTS-510
                    if (p2ErrorResp.responseJSON && p2ErrorResp.responseJSON.code === 'INS04' && eventExpiredInd === false) {
                        self.handleExpiredEvent(self.views.eventDetails.model.getUpcomingEventsLink());
                    } else if (eventExpiredInd === false) {
                        self.publishEvent('dataready:error', p2ErrorResp);
                    }

                    // log failures in Splunk
                    EventHelper.logAppState('fetch', p2ErrorResp);
                });
            } else {
                self.publishEvent('dataready:error', errorResp);
                EventHelper.logAppState('fetch', errorResp);
            }
        },

        layoutSettings: function() {

            mapTakeover = EventHelper.isMapTakeOverEnabled();
            this.mapReadyPromise.done(function(response) {
                if(mapTakeover === FALSE || this.isStaticMap){
                    this.layoutSettingsDefault();
                }

                this.updateBottomContainer({});
            }.bind(this));
        },

        layoutSettingsDefault: function() {

            if ($('#arrowButton').hasClass('arrowFlipDown')) {
                this.uiEl.$eventContainer.removeClass('top-zero');
            }

            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                this.uiEl.$smallVfs.addClass('hide');

                if (gc.isAddParking) {
                    this.uiEl.$eventParkingHeader.removeClass('hide');
                    this.publishEvent('eventdetails:showbackbutton');
                }
            } else {
                this.uiEl.$eventParkingHeader.addClass('hide');
            }

            this.updateBottomContainer({});
        },

        layoutSettingsMapTakeover: function() {
            var uiEl = this.uiEl,
                $eventMapContainer = uiEl.$eventMapContainer,
                $seatMapBlueprint = $('#seatmap').blueprint;

            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map: dynamic map', pageload: TRUE});

            $eventMapContainer.removeClass('close split').addClass('open');

            if ($seatMapBlueprint.isMapReady() === TRUE) {
                $seatMapBlueprint.zoomMap(3);
                $seatMapBlueprint.centerMap();
            }

            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map', pageload: true});

            this.views.mapTakeoverControlView = new MapTakeoverControlView();
            this.views.mapTakeoverControlView.render();
            
            //this.$el.off('tap', '#arrowButton');

            if (typeof(this.drawer) === 'undefined') {

                this.drawer = $(uiEl.$eventLayout).drawer({
                    drawer: uiEl.$eventContainer,
                    open_callback: function(arg) {
                        $eventMapContainer.removeClass('close split').addClass('open');
                        $seatMapBlueprint.zoomMap(3);
                        $seatMapBlueprint.centerMap();
                        EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map', pageload: false});
                    },
                    close_callback: function(arg) {
                        $eventMapContainer.removeClass('open split').addClass('close');
                        $seatMapBlueprint.centerMap();
                        EventHelper.track({pageView: 'EventInfo', appInteraction: 'Hide Map', pageload: false});
                    },
                    split_callback: function(arg) {
                        $eventMapContainer.removeClass('open close').addClass('split');
                        $seatMapBlueprint.zoomMap(2);
                        $seatMapBlueprint.centerMap();
                        EventHelper.track({pageView: 'EventInfo', appInteraction: 'Split View Map', pageload: false});
                    }
                });

            }
        },

        initializeMapTakeOver: function(mapPosition) {
            var self = this;
            this.mapReadyPromise.done(function(response){
                if (mapTakeover && response.isStaticMap === FALSE) {
                    mapTakeover = TRUE;
                } else if (response.isStaticMap === TRUE) {
                    mapTakeover = FALSE;
                }

                if (mapTakeover === TRUE) {
                    EventHelper.setUrlParam('mapto', 'true');
                    this.layoutSettingsMapTakeover();
                } else {
                    EventHelper.setUrlParam('mapto', 'false');
                    this.layoutSettingsDefault();
                }
                if (typeof(mapPosition) === 'string') {
                    mapTakeoverPositionStart = mapPosition;
                    var mapTakeoverPositionClass = self.getMapTakeoverPosition(mapPosition);
                    this.uiEl.$eventContainer.addClass(mapTakeoverPositionClass);
                    this.uiEl.$eventMapContainer.addClass(mapTakeoverPositionClass);
                    if (this.drawer) {
                        switch (mapTakeoverPositionClass) {
                            case 'open':
                                this.drawer.open();
                                break;
                            case 'close':
                                this.drawer.close();
                                break;
                            case 'split':
                            default:
                                this.drawer.split();
                                break;
                        }
                    }
                }
            }.bind(this));


            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map ' + mapTakeoverPositionStart, pageload: true});

        },

        handleHeaderToggle: function() {
            var headerBox = this.$headerView[0].getBoundingClientRect()
            if (headerBox.top < 0 || headerBox.bottom <= 0 || headerBox.height <= 0) {
                this.uiEl.$eventContainer.addClass('no-header');
                this.$el.addClass('no-header');
            } else {
                this.uiEl.$eventContainer.removeClass('no-header');
                this.$el.removeClass('no-header');
            }
        },

        repositionEventMapContainer: function(percentFromBottom) {
            document.getElementById('eventContainer').style.top = (window.innerHeight - document.getElementById('content_container').getBoundingClientRect().top ) * percentFromBottom + 'px';
        },

        arrowButtonAction: function(evt) {
            var self = this;

            evt.preventDefault();
            evt.stopPropagation();

            // Scroll the event bar to the top or middle
            var $this = $(evt.currentTarget);
            if (!$this.hasClass('down')) {

                this.uiEl.$eventContainer.addClass('top-zero');

                this.uiEl.$arrowButton.addClass('down arrowFlipDown').removeClass('arrowFlipUp');

                if (EventHelper.isSingleTicketMode()) {
                    setTimeout(function() {
                        self.publishEvent('eventlayout:map-hidden', {'isMapHidden': true});
                    }, 500);
                }
                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Hide Map', pageload: false});
            } else {
                self.layoutSettings();
                self.uiEl.$arrowButton.removeClass('down arrowFlipDown').addClass('arrowFlipUp');

                if (EventHelper.isSingleTicketMode()) {
                    setTimeout(function() {
                        self.publishEvent('eventlayout:map-hidden', {'isMapHidden': false});
                    }, 500);
                }

                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map', pageload: false});
            }
        },

        setQuantitySelectorStyle_11_2016: function(quantitySelectorStyleEnabledState) {
            EventHelper.setUrlParam('qtyddab', quantitySelectorStyleEnabledState);
            if (quantitySelectorStyleEnabledState) {
                this.uiEl.$bottomContainer.addClass('quantity-filter-style-112016');
            }
        },

        enableSectionOrZone: function() {
            var $switch = this.uiEl.$seatmap_zone_section;

            if (this.$el.find('#section-zone-checkbox').is(':checked')) {
                $switch.removeClass('section').addClass('zone');
                this.enableMapZone();
            }else {
                $switch.removeClass('zone').addClass('section');
                EventHelper.setUrlParam('mapState', 'sec');
                EventHelper.removeUrlParam('zid');
                this.publishEvent('seatmap:zoneOrSectionToggle', {'isSelectByZone' : false});
            }
            this.publishEvent('tooltip:hide');
        },

        enableMapZone: function() {
            EventHelper.setUrlParam('mapState', 'zone');
            EventHelper.removeUrlParam('sid');
            this.publishEvent('seatmap:zoneOrSectionToggle', {'isSelectByZone' : true});
        },

        /*
            Hide the zone/section toggle if we have static map or if there are 0 listings available.
            The search inventory or the seatmap can complete independent of one another.
        */
        hideSeatmapZoneOrSectionToggle: function(numberOfListings) {
            this.numberOfListings = numberOfListings;
            if (this.numberOfListings === 0 || this.isStaticMap) {
                this.hideSeatmapZoneToggle();
            } else {
                if (!this.isStaticMap) {
                    this.showSeatmapZoneToggle(this.isStaticMap);
                }

                if (globals.zones_enabled === true) {
                    this.uiEl.$seatmap_zone_section_checkbox.prop('checked', true);
                    this.uiEl.$seatmap_zone_section.addClass('zone');
                    EventHelper.setUrlParam('mapState', 'zone');
                    EventHelper.removeUrlParam('sid');
                    this.model.setSilent({
                        zonesEnabled: globals.zones_enabled
                    });

                    this.publishEvent('eventlayout:enableSelectionByZone', false);
                } else {
                    this.uiEl.$seatmap_zone_section.addClass('section');
                }
            }

            if (this.numberOfListings > 0) {
                this.updateBottomContainer({});
                this.publishEvent('ticketlist:resize');
            }
        },

        showSeatmapZoneToggle: function(isStaticMap) {
            this.isStaticMap = isStaticMap;

            // EVENTS-586, hiding the zone/section toggle if the map is hybrid
            if (this.isStaticMap === false && this.numberOfListings > 0 && (this.mapType + '') !== '2' && !globals.event_meta.isParking) {
                this.uiEl.$seatmap_zone_section.removeClass('hide');
            } else {
                this.hideSeatmapZoneToggle();
            }
        },

        hideSeatmapZoneToggle: function() {
            this.uiEl.$seatmap_zone_section.addClass('hide');
        },

        resetMap: function() {
            this.$el.find('.reset-map').addClass('hide');
            // Reset map and fetch tickets
            this.$el.find('#seatmap').blueprint.resetMap();

            // removing preserved sid & zid from the url
            EventHelper.removeUrlParams(['sid', 'zid']);

            this.publishEvent('tooltip:hide');
            this.views.ticketlist.model.resetSections();

            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Reset Map', pageload: false, userExperienceSnapshot: {seats: ''}});
        },

        toggleReset: function() {
            if (mapTakeover && typeof(this.drawer) !== 'undefined' && this.drawer.hasOwnProperty('split')) {
                this.drawer.split();
            }
            var selectedSections = this.$el.find('#seatmap').blueprint.getSelectedSections();
            if (selectedSections.length > 0) {
                this.$el.find('.reset-map').removeClass('hide');
            }else {
                this.$el.find('.reset-map').addClass('hide');
            }
        },

        setOnLoadTracking: function(eventDetails) {
            var pdoExperience = globals.PDO.showPdoExperience,
                pdoStr = (pdoExperience !== '' && pdoExperience !== globals.PDO.experience.DEFAULT ?
                            ': ' + globals.PDO.omnitureString[pdoExperience] : ':'),
                pageName = pdoStr + ' Splitscreen',
                opts = EventHelper.createTrackingOpts(pageName, {}, eventDetails, this.views.singleTicket);

            EventHelper.track({pageView: opts, appInteraction: null, pageload: true, userExperienceSnapshot: this.preserveFiltersObject.userExperienceSnapshot});

            // Now that onload tracking has fired, we can fire the click tracking for disclosure load if applicable
            this.publishEvent('eventdisclosure:setClickTracking');
        },

        context: function() {
            return {
                hasBsfFeature: !!this.views.bsf,
                sidzidApplied: (this.model.get('sections').length > 0 || this.model.get('zones').length > 0),
                isBYOEnabled: EventHelper.isBYOEnabled(),
                displayTicketlistFooter: EventHelper.displayTicketlistFooter(),
                singleTicketMode: EventHelper.isSingleTicketMode(),
                quantityFilterStyle112016:  EventHelper.isEnabledQuantitySelectorStyle_11_2016(),
                isRecoExperience: EventHelper.isRecoExperience(),
                //drawerState: this.getMapTakeoverPosition(mapTakeoverPositionStart),
                mapTakeover: (mapTakeover)
            };
        },

        // this is for initial page load mbox response only
        getMapTakeoverPosition: function(mapTakeoverPosition) {
            var position;

            switch(mapTakeoverPosition) {
                case 'map':
                    position = 'open';
                    break;
                case 'list':
                    position = 'close';
                    break;
                case 'split':
                default:
                    position = 'split';
            }

            return position;
        },

        showWindowVfs: function(sectionId) {
            if (! globals.vfs_available || !sectionId) {
                return;
            }
            this.vfsSectionId = sectionId;

            EventHelper.showVfs(this.uiEl.$windowVfs.find('img')[0], 'large', sectionId, this.vfsSuccess.bind(this), null);
        },

        vfsSuccess: function() {
            this.$body.addClass('overlay-active');
            this.uiEl.$windowVfs.removeClass('hide');
        },

        switchVfs: function(evt) {
            this.publishEvent('enlargevfs:switchVfs', evt);
        },

        hideWindowVfs: function() {
            this.uiEl.$windowVfs.addClass('hide');
            this.$body.removeClass('overlay-active');
            // When the user closes the window-vfs, show where on the map that window-vfs was referring to.
            this.publishEvent('seatmap:highlightSection', this.vfsSectionId);
        },

        backButtonClicked: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if (gc.isAddParking) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Close Parking Clicked', pageload: false});
                setTimeout(function() {
                    EventHelper.urlParser.redirect(EventHelper.getReferrer());
                }, 250);
            }
        },

        getDefaultSort: function(eventModel) {
            var sortField = globals.defaultSorting.SORT.DEFAULT,
                performers,
                OS = EventHelper.getOS().OS,
                breakpoint = EventHelper.getActiveBreakpoint().toUpperCase();

            try {
                performers = eventModel.get('performers');
                if (performers.length > 0) {
                    sortField = globals.defaultSorting.PERFORMER[performers[0].id];
                }

                // If the sort object is empty then figure out the default sort to use for the OS +
                // breakpoint.
                if (_.isEmpty(sortField)) {
                    sortField = globals.defaultSorting.SORT[breakpoint][OS] || globals.defaultSorting.SORT.DEFAULT;
                }
            } catch (e) {}

            return globals.defaultSorting.SORTOPTIONS[sortField];
        },

        setDefaultSort: function(useSort) {
            var sortObject = this.getDefaultSort(this.views.eventDetails.model);

            // Set the default sorting.
            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                if (!_.isEmpty(useSort) && !_.isEmpty(globals.defaultSorting.SORTOPTIONS[useSort])) {
                    sortObject = globals.defaultSorting.SORTOPTIONS[useSort];
                }

                this.model.setSilent({
                    primarySort: sortObject.sort,
                    sortElement: sortObject.element
                });
            }
        },

        updateBottomContainer: function(params) {
            var displayed = params.displayed || this.uiEl.$filter.is(':visible') || false;

            if (displayed) {
                this.uiEl.$bottomContainer.removeClass('hide');
                this.uiEl.$serviceFeeInfo.addClass('hide');
            } else {
                this.uiEl.$bottomContainer.addClass('hide');
                this.uiEl.$serviceFeeInfo.removeClass('hide');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: EventLayout,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return EventLayout;
});
