/* global SH,_ */
define([
    'foobunny',
    'layouts/event_layout',
    'layouts/event_ga_layout',
    'models/filter_model',
    'helpers/event_helper',
    'globals',
    'global_context'
], function(Foobunny, EventLayout, EventGALayout, FilterModel, EventHelper, globals, gc) {
    'use strict';

    var ViewSelectorController = Foobunny.Controller.extend({
        initialize: function() {
            console.log('--ViewSelectorController-- in initialize()', this);
            _.bindAll(this, 'start');

            // TODO: Remove this once the 76ers is launched.
            // Inject the 76ers CSS file if the url contains brand_performer=76ers.
            if (this.req.urlParams.brand_performer &&
                this.req.urlParams.brand_performer === '76ers') {
                var CSSUrl_76ers = gc.staticUrl + '/resources/shape/styles/' + gc.appFolder + '/app.override.76ers.min.css';
                SH.skinName = '76ers';
                $('body').addClass('skin-76ers');
                $('head').append('<link rel="stylesheet" href="' + CSSUrl_76ers + '">');
            }

            var sortField = 'value',
                secondarySortValue = 'listingPrice+asc',
                preserveData = {};

            // save query params in global context
            gc.event_id = this.req.urlParams.eventId || this.req.urlParams.event_id;

            // Set the global cookie prefix
            globals.cookiePrefix = 'event_' + gc.event_id;

            // Clean up the cookies from event page. This is being introduced in event page 5.3.0.
            // The following line should be removed after 3-4 months from Dec 2016.
            // The following is being introduced because the cookies set by event page are session
            // cookies and are contributing to the HTTP 413 status code issue.
            // For more reference on implementation to clean up the cookies see EVENTS-2138.
            EventHelper.cleanEventPageCookies();

            // sets the ticket id in global context object if it exists
            gc.ticket_id = this.req.urlParams.ticket_id;
            gc.cart_id = this.req.urlParams.cart_id;

            gc.userComingBack = this.req.urlParams.cb;
            gc.mboxCalled = (this.req.urlParams.mbox === '1');
            gc.showBYO = (this.req.urlParams.byo === '1');
            gc.isAddParking = (this.req.urlParams.pA === '1');
            gc.parkingListingId = this.req.urlParams.park_id;
            gc.parkingQty = this.req.urlParams.park_qty;
            gc.quantityDirty = (this.req.urlParams.qqd === '1');

            // preserving filter data
            preserveData.qty = this.req.urlParams.qty ? this.req.urlParams.qty : '-1';
            preserveData.zonesEnabled = (this.req.urlParams.mapState === 'zone') ? true : false;
            preserveData.maxPrice = this.req.urlParams.sliderMax ? parseInt(this.req.urlParams.sliderMax.split(',')[1]) : -1;
            preserveData.minPrice = this.req.urlParams.sliderMin ? parseInt(this.req.urlParams.sliderMin.split(',')[1]) : -1;
            preserveData.withFees = (this.req.urlParams.priceWithFees === 'true');

            // globals.displayWithFeesToggle = (this.req.urlParams.dwft === 'true');

            if (this.req.urlParams.sid) {
                preserveData.sections = this.req.urlParams.sid.split(',');
                globals.OMN.sid = this.req.urlParams.sid;
            }

            if (this.req.urlParams.zid) {
                preserveData.zones = this.req.urlParams.zid.split(',');
                globals.OMN.zid = this.req.urlParams.zid;
            }

            if (this.req.urlParams.dt) {
                preserveData.deliveryTypeList = this.req.urlParams.dt.split(',');
                globals.OMN.dt = this.req.urlParams.dt;
            }

            if (this.req.urlParams.categ) {
                preserveData.listingAttributeCategoryList = this.req.urlParams.categ.split(',');
                globals.OMN.categ = this.req.urlParams.categ;
            }

            if (this.req.urlParams.excl) {
                preserveData.excludeListingAttributeCategoryList = this.req.urlParams.excl.split(',');
                globals.OMN.excl = this.req.urlParams.excl;
            }

            gc.urlSortOption = this.req.urlParams.sort;

            globals.sliderPrice.sliderMinPrice = parseInt(preserveData.minPrice);
            globals.sliderPrice.sliderMaxPrice = parseInt(preserveData.maxPrice);
            globals.sliderPrice.sliderMinPercent = this.req.urlParams.sliderMin ? parseFloat(this.req.urlParams.sliderMin.split(',')[0]) : '';
            globals.sliderPrice.sliderMaxPercent = this.req.urlParams.sliderMax ? parseFloat(this.req.urlParams.sliderMax.split(',')[0]) : '';
            globals.sliderPrice.eventMinPrice = parseInt(this.req.urlParams.minPrice);
            globals.sliderPrice.eventMaxPrice = parseInt(this.req.urlParams.maxPrice);
            globals.priceSlider.displayOutside = this.req.urlParams.sliderpos === 'true';

            globals.byo.ABdisplay = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.abbyo, EventHelper.isBYOEnabled());
            globals.byo.quantity = this.req.urlParams.byo_qty || '';

            globals.upgradeTicket.display = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.dUpg, EventHelper.isUpgradeEnabled());
            globals.upgradeTicket.isTicketUpgraded = this.req.urlParams.oldtktid ? true : false;
            globals.upgradeTicket.oldTicketListingId = this.req.urlParams.oldtktid;
            globals.byo.upsellAccordion = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.dUAccr, EventHelper.isUpsellAccordionEnabled());

            globals.TicketReco.showTicketReco = globals.TicketReco.recoExperience[this.req.urlParams.rS] || globals.TicketReco.showTicketReco;
            globals.quantityOverlay.quantityQuestion = this.req.urlParams.qtyq || globals.quantityOverlay.quantityQuestion;
            globals.inventoryCollection.blendedLogicApplied = this.req.urlParams.bla || EventHelper.determineValueToPreserve('boolean', this.req.urlParams.bla, EventHelper.blendedEnabledSwitch());

            if (this.req.urlParams.mapState !== 'sec') {
                globals.zones_enabled = EventHelper.determineValueToPreserve('boolean', preserveData.zonesEnabled, EventHelper.isMapZoneSelected());
            }

            globals.displayVisaCheckout = EventHelper.isVisaCheckoutOrderDetailEnabled();

            globals.OMN.qty = preserveData.qty;
            globals.OMN.byoqty = globals.byo.quantity;
            globals.OMN.zonesEnabled = preserveData.zonesEnabled;
            globals.OMN.maxPrice = preserveData.maxPrice;
            globals.OMN.minPrice = preserveData.minPrice;
            globals.OMN.withFees = preserveData.withFees;
            globals.OMN.urlSortOption = gc.urlSortOption;
            globals.OMN.listingId = this.req.urlParams.ticket_id;
            globals.OMN.ticketRank = this.req.urlParams.ticketRank;

            // set sortField in model to send secondary sort to search inventory api
            if (gc.urlSortOption) {
                var splitUrlSort = gc.urlSortOption.split('+');
                // sortFiled internal model value, no need of i18n
                switch (splitUrlSort[0]) {
                    case 'sectionname':
                        sortField = 'section';
                        break;
                    case 'row':
                        sortField = 'row';
                        break;
                    case 'currentPrice':
                        sortField = 'price';
                        secondarySortValue = 'currentPrice+asc';
                        break;
                    case 'listingPrice':
                        sortField = 'price';
                        break;
                    case 'quality':
                        sortField = 'seats';
                        break;
                }
            }

            // Set the PDO experience for the APP since the AB has concluded.
            globals.PDO.showPdoExperience = EventHelper.showPdoExperience();
            EventHelper.setPdoState();
            this.model.updateDefaultsForWithFees(globals.PDO.withFees);

            globals.PDO.withFees = preserveData.withFees ? preserveData.withFees : globals.PDO.withFees;

            preserveData.sortField = sortField;
            preserveData.secondarySort = secondarySortValue;
            preserveData.ticketRecommendation = gc.urlSortOption ? false : true;

            if (preserveData.withFees) {
                preserveData.priceType = globals.price_type.CURRENT;
            }

            this.model.setSilent(preserveData);

            gc.tktbkt = this.req.urlParams.tktbkt;

            // url params won't be store in session storage
            var eventFilters = Foobunny.storage.getSessionItem('eventFilters');
            if (eventFilters) {
                for (var key in eventFilters) {
                    this.model.set(key, eventFilters[key]);
                }
            }

            // get the venue config information to check if GA or no-GA layout
            this.viewAvailablePromise = $.Deferred();
            this.fetchVenueConfigData();

            // not everything is right, hide the event container and show error message instead
            this.subscribeEvent('dataready:error', this.showErrorMsg);

            // In safari, When the user gets redirected to checkout after successfully logging in Login component from eventpage
            // and clicks browser back button, reload the page if it's forward/back cache - EVENTS-226
            $(window).bind('pageshow', function(event) {
                // jquery doesn't expose the 'persisted' directly in event, so using orinalEvent
                if (event.originalEvent.persisted) {
                    window.location.reload();
                }
            });

            return this.view;
        },

        fetchVenueConfigData: function() {
            var self = this,
                customErrorStack = {    // Used only for tracking when event id is missing
                    responseJSON: {
                        'code': 'NA',
                        'description': 'Event id is missing in the URL'
                    }
                };

            console.log('--ViewSelectorController-- in fetchVenueConfigData()');

            // If event id doesn't exist publish a failure and return
            if (!gc.event_id) {
                this.showErrorMsg(customErrorStack);
                return;
            }

            return $.ajax({
                dataType: 'json',
                url: '/shape/catalog/venues/v3/venueconfigurations?eventId=' + gc.event_id,
                beforeSend: function(xhr) {
                    if (gc.app_token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + gc.app_token);
                    }
                    xhr.setRequestHeader('Accept-Language', gc.shlocale);
                }
            }).done(function(data) {
                if (_.isEmpty(data)) {
                    self.viewAvailablePromise.reject(new Error());
                    return;
                }
                // check now which layout to initialize, based on if the event is general admission or not
                var venueConfig = data.venueConfiguration[0],
                    gaOnly = venueConfig.generalAdmissionOnly,
                    mapType = venueConfig.map.mapType,
                    version = venueConfig.venueConfigurationVersion,
                    viewFromSection = venueConfig.map.viewFromSection ? true : false,
                    staticImageUrl = venueConfig.staticImageUrl,
                    nodeId = venueConfig.venueId,
                    configId = venueConfig.id;

                globals.TicketReco.hasTicketReco = venueConfig.attributes.reco.showTicketRecoInd || false;

                EventHelper.setBlendedEvent(venueConfig.blendedIndicator);

                // RITESH: Leaving this in the code for now since after the AB for MLB we will have to
                // un-comment this code to adjust the UI.
                // Set the ticket recommendation experience for the APP since the AB has concluded.
                // if (globals.TicketReco.hasTicketReco) {
                //     globals.TicketReco.showTicketReco = EventHelper.showRecoExperience();
                // } else {
                //     globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                // }
                if (gaOnly) {
                    // save view type in global context
                    gc.view = 'GA';
                    // genral admission event
                    self.view = new EventGALayout();
                    // add a global class to body tag
                    $('html, body').addClass('view_ga');
                } else {
                    gc.view = 'NON-GA';
                    // map layout
                    self.view = new EventLayout({
                        nodeId: nodeId,
                        configId: configId,
                        mapType: mapType,
                        version: version,
                        viewFromSection: viewFromSection,
                        staticImageUrl: staticImageUrl
                    });
                    // add a global class to body tag
                    $('body').addClass('view_non_ga');
                    // add a global flag to determine whether we can display vfs images
                    globals.vfs_available = venueConfig.map.viewFromSection;
                }
                self.viewAvailablePromise.resolve();

                try {
                    Foobunny.storage.setItem('event:' + gc.event_id + ':venue', data, 'local', 1000 * 60 * 60);
                } catch (e) {
                    // no op
                }

            }).fail(function(error) {
                self.viewAvailablePromise.reject(error);
            });
        },

        showErrorMsg: function(error) {
            var opts;
            $('#content_container').addClass('hide');
            $('#data_ready_error').removeClass('hide');

            opts = EventHelper.createTrackingOpts(': Error View', {}, null, false);
            EventHelper.track({pageView: opts, pageload: true, pageError: true});
        },

        start: function() {
            console.log('--ViewSelectorController-- in start()', this);
            // start when view is available which in turn is determined after an api call
            var self = this;
            $.when(self.viewAvailablePromise).done(function() {
                self.show();
            }).fail(function(error) {
                // also show app error message
                self.showErrorMsg(error);

                // log failures in Splunk
                EventHelper.logAppState('fetch', error);
            });
            // set the optout url
            SH.app.setOptoutUrl('http://www.' + SH.targetHost + '.com/?event_id=' + gc.event_id + '&ucOptOut=true');

        },

        show: function() {
            console.log('--ViewSelectorController-- in show()', this);
            this.view.render();
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: ViewSelectorController,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return ViewSelectorController;
});
