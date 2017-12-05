/* global SH,_ */
define([
    'foobunny',
    'models/filter_model',
    'views/quantity_filter_view',
    'views/event_details_view',
    'views/event_disclosure_view',
    'views/ticketlist_ga_view',
    'views/singleticket_ga_view',
    'views/filter_view',
    'views/ticketlist_footer_view',
    'views/seller_view',
    'collections/inventory_collection',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, FilterModel, QuantityFilterView, EventDetailsView, EventDisclosureView, TicketlistGAView, SingleTicketGAView, FilterView, TicketlistFooterView, SellerView, InventoryCollection, EventHelper, gc, globals) {
    'use strict';

    var EventGALayout = Foobunny.Layout.extend({

        initialize: function() {
            console.log('--EventLayoutGA-- in initialize()', this);

            var self = this,
                p0,
                experience = {abValue: {}},
                mboxKeys = ['showWithFees', 'quantityQuestion'];

            SH.mbox = SH.mbox || {};

            this.views = {
                eventDetails: new EventDetailsView(),
                eventDisclosure: new EventDisclosureView(),
                //filter: new FilterView(),
                ticketlist: new TicketlistGAView(),
                ticketlistFooter: new TicketlistFooterView()
            };

            this.preserveFiltersObject = {
                userExperienceSnapshot: {
                    quantity: globals.OMN.qty > 0 ? 'Quantity: ' + globals.OMN.qty : '',
                    ticketId: globals.OMN.listingId ? 'ListingId: ' + globals.OMN.listingId : '',
                    PDO: globals.OMN.withFees === true ? 'Price With Fees' : '',
                    priceSliderMax: globals.OMN.maxPrice > -1 ? 'Max Price: ' + globals.OMN.maxPrice : ''
                }
            };

            this.subscribeEvent('module:globalcontextvars:apiresponseready', this.updateMaxQuantity);
            this.subscribeEvent('eventmodel:expiredEvent', this.handleExpiredEvent);
            this.subscribeEvent('quantityFilter:qtyUpdated', this.updateLayout);
            this.subscribeEvent('ticketdetails:qtyUpdated', this.updateLayout);

            if (EventHelper.hasBsfFeature()) {
                this.views.bsf = new SellerView();
            }

            //initialize the collection
            this.collection = new InventoryCollection(gc.event_id);

            //three api calls are made from this app, promise p1 is only the metadata fetch promise
            p0 = $.Deferred();
            this.p2 = this.views.ticketlist.fetchDataPromise;
            this.p3 = this.views.eventDetails.fetchDataPromise;

            $.when(this.p3).done(function eventDetailsDone() {
                if (self.views.eventDetails.model.get('expiredInd') === true) {
                    self.$el.find('.ga.spinner').addClass('hide');
                    return;
                }

                if (EventHelper.isABTestActive()) {
                    if (gc.mboxCalled) {
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

                        //ABTest for priceWithFeesToggle show/hide
                        // if (_.isBoolean(params.abValue.displayWithFeesToggle)) {
                        //     globals.displayWithFeesToggle = params.abValue.displayWithFeesToggle;
                        // } else {
                        //     globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();
                        // }
                        // EventHelper.setUrlParam('dwft', globals.displayWithFeesToggle); //dwft - displayWithFeesToggle

                        // TODO: Remove this once the AB test for WithFees has been put to rest.
                        globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();

                        p0.resolve();
                    });
                } else {

                    // TODO: Remove this once the AB test for WithFees has been put to rest.
                    globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();

                    p0.resolve();
                }
            });

            $.when(p0, this.p2, this.p3).then(function() {
                self.views.filter = new FilterView();
                self.views.filter.render();

                if (EventHelper.isSingleTicketMode()) {
                    self.views.singleTicket = new SingleTicketGAView();
                    self.views.singleTicket.render();
                }
                var urlParamQtyBtnCount = EventHelper.getUrlQuery('qtyBtnCount'),
                    qtyFilterArgs;

                if (!gc.quantityDirty && !globals.event_meta.isParking && globals.quantityOverlay.quantityQuestion && !gc.userComingBack && self.model.get('qty') === '-1' && !EventHelper.isSingleTicketMode()){
                    qtyFilterArgs = {
                        filterId: "qty_container",
                        filterClass: 'qty_content flex-container',
                        type: 'carousel',
                        dispose: false,
                        maxButtonCount: urlParamQtyBtnCount || globals.quantityOverlay.quantityBtnMaxCountGA,
                        minButtonCount: globals.quantityOverlay.quantityBtnInitialCountGA,
                        quantityVector: self.model.get('quantityVector'),
                        qtySelected:  self.model.get('qty'),
                        navigation: true
                    };
                } else {
                    qtyFilterArgs = {
                        filterId: "qty_container",
                        filterClass: 'qty_content',
                        type: 'overlay',
                        dispose: false,
                        maxButtonCount: urlParamQtyBtnCount || globals.quantityOverlay.quantityBtnMaxCountGA,
                        minButtonCount: globals.quantityOverlay.quantityBtnInitialCountGA,
                        quantityVector: self.model.get('quantityVector'),
                        qtySelected:  self.model.get('qty'),
                        navigation: true
                    };
                }

                // create the quantity filter view only after event data model is available
                self.views.qtyfilter = new QuantityFilterView(qtyFilterArgs);
                self.views.qtyfilter.render();

                self.subscribeEvent('ticketdetails:qtyUpdated',function(evt){
                    self.views.qtyfilter.displaySelectedQty(evt.qtySelected);
                });

                self.$el.find('.ga.spinner').addClass('hide');

                // finally fire the app:render-ready event
                self.publishEvent('app:render-ready');

                self.collection.prepareAPIUrl(self.model.toJSON());
                self.collection.fetch()
                    .done(function(response) {
                        var quantityVector = self.collection.getQtyAvailableVector(response);
                        // end Quantity filter theme switch
                        // check if there are tickets available before displaying quantity question
                        if(response.qtyVectorMinimumQuantity > 0) {
                            self.views.qtyfilter.options.maxButtonCount = response.qtyVectorMaximumQuantity;
                            self.views.qtyfilter.initialize({startCount: response.qtyVectorMinimumQuantity, maxButtonCount: response.qtyVectorMaximumQuantity, qtySelected:  EventHelper.getUrlQuery('qty')});
                            self.views.qtyfilter.render();
                            if (response.minQuantity < 1) {
                                self.views.ticketlist.handleAPIErrors();
                            }
                        } else {
                            self.views.qtyfilter.closeQtyOverlay();
                            self.views.ticketlist.handleZeroInventory();
                        }
                    });

                self.setOnLoadTracking(self.views.eventDetails.model);
            }).fail(function(error) {
                self.setOnLoadTracking();
                self.publishEvent('app:render-error');
            });
        },

        uiEl: {
            '$quantityfilter': '#quantityfilter',
            '$tickets_view': '#tickets_view',
            '$ga_image': '#ga_image',
            '$findmorelink': '.findmorelink',
            '$event_error': '#event_error',
            '$ticketlistfooter': '#ticketlist_footer',
            '$ga_spinner': '.ga.spinner'
        },

        el: '#content_container',

        template: gc.appFolder + '/event_ga_layout',

        modelEvents: {
            'change:qty change:qtyMax change:qtyMin': 'closeOverlay'
        },

        closeOverlay: function() {
            if(this.overlayClosed !== 1) {
                this.uiEl.$quantityfilter.addClass('selectQty');
                this.overlayClosed = 1;
            }
        },

        afterRender: function() {
            // Set the class to single_ticket for all modes.
            if (EventHelper.isSingleTicketMode()) {
                this.$el.find('#event_ga_layout').addClass('single_ticket');
            }

            if (this.model.get('qty') !== '-1') {
                this.updateLayout();
                this.uiEl.$quantityfilter.addClass('selectQty');
                this.uiEl.$ticketlistfooter.removeClass('hide'); //as qty is updated remove .hide for the footer
                this.uiEl.$ga_spinner.hide();
            }

            //Ads specific code
            /*var eventpageAds = 'eventpage';
             //if gc has current geo id, use this info to make ad call
            var geoId = gc.geolocationCollection.getSelectedGeoId();
            // Initialize the cache
            var geolocationCache = new Foobunny.Cache({
                type: 'local',
                namespace: 'app'
            });

            //Get last selected location ID from cache
            var lastSelectedLocationId = geolocationCache.get('lastSelectedLocationId');

            var config = {
                            pageType: eventpageAds,
                            categoryId: '',
                            genreId: '',
                            genreParentId: '',
                            genreGrandParentId: '',
                            pageUrl: window.location.href,
                            userGeoDetected: lastSelectedLocationId || geoId || '',
                            venueId: '',
                            userStatus: 'guestuser',
                            artistPrimaryStyle: ''
            };

            Ads.initialize(function() {
                Ads.setTargetingConfig(config);
                Ads.loadAdConfig(eventpageAds);
            });*/
        },

        handleExpiredEvent: function(upcomingEventsLink) {
            this.uiEl.$findmorelink.attr('href', upcomingEventsLink);
            this.uiEl.$quantityfilter.addClass('hide');
            this.uiEl.$tickets_view.addClass('hide');
            this.uiEl.$event_error.removeClass('hide');
        },

        setOnLoadTracking: function(eventDetails) {
            var pdoExperience = globals.PDO.showPdoExperience,
                pdoStr = (pdoExperience !== '' && pdoExperience !== globals.PDO.experience.DEFAULT ?
                            ': ' + globals.PDO.omnitureString[pdoExperience] : ':'),
                pageName = pdoStr + ' Quantity Picker',
                opts = EventHelper.createTrackingOpts(pageName, {}, eventDetails, this.views.singleTicket);

            EventHelper.track({pageView: opts, appInteraction: null, pageload: true, userExperienceSnapshot: this.preserveFiltersObject.userExperienceSnapshot});

            //Now that onload tracking has fired, we can fire the click tracking for disclosure load if applicable
            this.publishEvent('eventdisclosure:setClickTracking');
        },

       updateLayout: function() {
            this.uiEl.$ga_image.addClass('hide');
        },

        updateMaxQuantity: function(response) {
            if(response.APIName === 'inventory') {
                if(this.views.qtyfilter === undefined) {
                    globals.quantityBtnMaxCountGA = response.data.maxQuantity;
                } else {
                    this.views.qtyfilter.maxButtonCount = response.data.maxQuantity;
                }
            }
        },

        context: function() {
            return {
                hasBsfFeature: !!this.views.bsf,
                pdoExperience: globals.PDO.experience,
                showPdoExperience: globals.PDO.showPdoExperience,
                showServiceFeeInfo: EventHelper.showServiceFeeInfo()
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: EventGALayout,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return EventGALayout;
});
