/*global SH,_ */
define([
    'foobunny',
    'models/filter_model',
    'models/fulfillment_window_model',
    'collections/inventory_collection',
    'views/ticketdetails_view',
    'views/static_image_view',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'global_context',
    'globals',
    'i18n',
    'url-parser'
    ], function(Foobunny, FilterModel, FulfillmentWindowModel, InventoryCollection, TicketdetailsView, StaticImageView, EventHelper, DeliveryHelper,  gc, globals, i18n, urlParser) {
    'use strict';

    var timer;

    var reg = /^\d+(,\d+)*$/;

    var TicketlistView = Foobunny.BaseView.extend({

        initialize: function(params) {
            console.log('--TicketlistView--  in initialize()', this);

            this.fetchOnInitialize = false;
            this.eventDeferred = Foobunny.utils.deferred();
            this.eventPromise = this.eventDeferred.promise();

            this.fulfillmentFetchPromise = null;

            this.subModels = {
                metadata: new FulfillmentWindowModel()
            };

            this.lastchanged = 'initial';

            //initialize the collection
            this.collection = InventoryCollection.getInstance(gc.event_id);

            this.subCollections = {
                ticketlist: new Foobunny.BaseCollection(),
                sectionlist: new Foobunny.BaseCollection()
            };

            // Array of ticket views to keep track of the ticket collection
            this.ticketDetailsViews = [];

            //delivery type and listing attribute mappings
            this.deliveryMappings = [];
            this.attributeMappings = [];
            this.attributeMappingsForIcons = [];

            this.deliveryTypeList = [];
            this.listingAttributeList = [];

            this.isMapStatic = false;
            this.isMapAvailable = false;

            this.seatmap = null;
            this.mapHighlightedSectionId = null;
            this.mapHighlightedSectionPrice = '';

            this.enablePrimaryPartner = false;
            this.isHost = false;

            this.viewingAllTickets = (EventHelper.isSingleTicketMode() ? false : true);
            this.totalListings = 0;

            //once the seatmap is ready, style the sections
            this.subscribeEvent('seatmap:ready', this.syncMapInformation);
            this.subscribeEvent('ticketdetails:highlighted', this.highlightSectionOnMap);
            this.subscribeEvent('ticketlist:highlightFirstTicketDiv', this.highlightFirstTicketDiv);
            this.subscribeEvent('ticketlist:resize', this.layoutSettings);
            this.subscribeEvent('ticketlist:scrollToView', this.scrollToView);
            this.subscribeEvent('eventmodel:dataready', this.setEventModel);
            this.subscribeEvent('primarypartner:ready', this.setEnablePrimaryPartner);
            this.subscribeEvent('seatmap:zoneOrSectionToggle', this.zoneOrSectionToggle);
            this.subscribeEvent('ticketlist:seeall', this.seeAllTickets);
            this.subscribeEvent('eventdetailsview:goToUpcomingEvents', this.goToUpcomingEvents);
            this.subscribeEvent('quantityFilter:overlayClosed', this.highlightFirstTicketDiv);

            //is it still loading...
            this.isLoading = false;

            $('.see-more').html(i18n.get('event.common.seemore.text')).removeAttr('disabled');

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));
        },

        modelEvents: {
            'change': 'processFilterModelChanged'
        },

        uiEl: {
            '$primaryPerformer': '.primaryPerformer',
            '$ticketsWrapper': '#tickets-wrapper'
        },

        el: '#ticketlist',

        template: gc.appFolder + '/ticketlist',

        events: {
            'scroll' : 'highlightOrLoadMore',
            'click .see-more' : 'fetchMoreTickets',
            'click .see-partner-tickets-button': 'goToPrimaryPartner',
            'click .see-upcoming-events-button': 'goToUpcomingEvents',
            'click .see-all-tickets-button' : 'reset',
            'click .parking-go-back-button' : 'goBack'
        },

        processFilterModelChanged: function(model) {
            if (!model) {
                return;
            }

            // If this was part of the reset from filter then nullify the value of the reset attribute.
            model.unset('reset', {silent: true});

            this.model.setSilent('filterApplied', true);

            // If the user has not clicked on See more tickets then do not get additional tickets.
            // This is true in the single ticket mode.
            if (!this.viewingAllTickets) {
                return;
            }

            // Hide the tooltip
            this.publishEvent('tooltip:hide');

            this.getTickets();

            // if not single ticket case, remove ticket_id url param
            if (!gc.ticket_id) {
                EventHelper.removeUrlParams(['ticket_id', 'tktbkt']);
            }
        },

        setEventModel: function(eModel) {
            this.subModels.eventModel = eModel;

            // Update up-coming section
            var self = this;
            this.renderPromise.done(function() {
                self.uiEl.$primaryPerformer.text(eModel.get('primaryPerformer'));
            });
            this.eventDeferred.resolve();
        },

        setEnablePrimaryPartner: function(ppModel) {
            var primaryPerformer;

            if (!ppModel || (!ppModel.get('isPartner') && !ppModel.get('isHost'))) {
                return;
            }

            this.subModels.primaryPartnerModel = ppModel;
            this.enablePrimaryPartner = ppModel.get('isPartner');
            this.isHost = ppModel.get('isHost');

            primaryPerformer = ppModel.get('primaryPerformer');
            if (primaryPerformer !== '') {
                this.$el.find('.primaryPerformer').text(primaryPerformer);
            }

            // If the performer and the partner integration api's take a long time and then
            // return with appropriate data, check to see if the inventory collection has also
            // returned and that there are no tickets available before displaying the no tickets
            // message.
            // If the performer and partner integration api's returned before the inventory
            // collection has returned then do not do anything. The showing of the no tickets message
            // will be executed by the fetchData chain of functions.
            if (this.fulfillmentFetchPromise && this.fulfillmentFetchPromise.state() === 'resolved' &&
                this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }
        },

        goToUpcomingEvents: function(evt, track) {
            evt.preventDefault();
            evt.stopPropagation();

            var upComingLink = this.subModels.eventModel.getUpcomingEventsLink();

            if (!track) { //checks if the call is from a different View
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See upcoming events', pageload: false});
            }

            window.setTimeout(function() {
                urlParser.redirect(upComingLink);
            }, 300);
        },

        goToPrimaryPartner: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            this.publishEvent('primarypartner:goToPrimaryPartner', evt);
        },

        fetchData: function() {
            var self = this,
                metadataFetchPromise,
                deferred = $.Deferred(),
                fetchDataPromise = deferred.promise();

            // Show the Spinner when loading the page.
            this.prepareView();
            //pass the filter model data to prepare the url
            this.collection.prepareAPIUrl(this.model.toJSON());

            //now finally fetch
            this.fulfillmentFetchPromise = this.collection.fetch();

            //get the inventory meta data
            metadataFetchPromise = this.subModels.metadata.fetch();

            this.fulfillmentFetchPromise
                .done(function(response) {
                    self.successfulInventoryDataFetch(response);
                });

            $.when(this.fulfillmentFetchPromise, metadataFetchPromise, self.eventPromise).done(function() {
                //prepare attribute dictionary, this needs to be done only once
                if (self.deliveryMappings.length <= 0) {
                    self.setupAttributeDictionary();
                }

                //map this data onto each ticket
                self.prepareMetaDataMappings();

                // If the fetchOnInitialize is true then the rendering happens after the fetchDone is completed.
                // fetchDone is performing the task of adding the tickets. Hence, forcing the render so that the
                // parent element is rendered for the addTickets to add the tickets to.
                // We are force rendering only for the initial load.
                if (self.lastchanged === 'initial') {
                    self.render();
                    self.renderPromise.done(function() {
                        self.fetchDone();
                    });
                } else {
                    self.fetchDone();
                }

                //finally resolve the promise of promises
                deferred.resolve();
            }).fail(function(error) {
                deferred.reject(error);
            });

            return fetchDataPromise;

        },

        getTickets: function() {
            var self = this,
                fetchPromise;

            this.lastchanged = this.model.get('lastchanged');
            this.prepareView();

            //now fetch only search inventory, true prevents the metadata fetch
            fetchPromise = this.fetchData();
            fetchPromise.fail(function(error) {
                self.publishEvent('dataready:error', error);
            });
        },

        fetchDone: function() {
            console.log('fetchDone in TicketListView');

            //prepare view for appending of tickets - almost what beforeRender would be but since,
            //here we are explicity appending to DOM, can't use those hooks
            this.prepareView();

            //add tickets for each listing
            this.addTickets();

            if (this.seatmap) {
                this.syncMapInformation({'isMapStatic': this.seatmap.blueprint.isMapStatic()});
            }

            //filter map if needed
            this.refillMap();

            // EVENTS-1446 - fix.
            this.uiEl.$ticketsWrapper.removeClass('hide');

            this.initialTicketFetch();

            // We need to do this because the ticket list is now going to be size/re-sized
            // through multiple scenarios.
            this.layoutSettings();

            //work on if load more is needed or not
            this.prepareLoadMore();
        },

        initialTicketFetch: function() {
            // Do not show the ticket list in single ticket mode only when we are
            // fetching the tickets on page load.
            if ($('#single-ticket').is(':visible')) {
                this.$el.addClass('hide');
            } else {
                this.$el.removeClass('hide');
            }

            // Display the 0 tickets available. This is only to be displayed on page load.
            // 0 tickets available because a filter is applied is taken care of in repeatedTicketFetch.
            if (this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }

            this.publishEvent('ticketlist:numberOfListings', this.subCollections.ticketlist.length);
        },

        repeatedTicketFetch: function() {
            console.log('repeatedTicketFetch in TicketListView');

            this.$el.removeClass('hide');

            if (this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }
        },

        successfulInventoryDataFetch: function(response) {
            // give the sub collection, its data
            this.subCollections.ticketlist.reset(this.collection.models[0].get('listing'));
            if (this.model.get('sectionStats')) {
                this.subCollections.sectionlist.reset(this.collection.models[0].get('sectionStats'));
                // pass on section/zone stats to seatmap_tooltip_view
                this.publishEvent('ticketlist:statsFetched', { section_stats: this.collection.models[0].get('sectionStats') ,
                                                               zone_stats: this.collection.models[0].get('zoneStats') });
            }
            this.model.setSilent('quantityVector', response.qtyAvailableVector);
            // save total listings info
            this.totalListings = this.collection.models[0].get('totalListings');

            // Pass on data to the price slider
            this.publishEvent('slider:dataFetched', this.collection.models[0].attributes);

            // we can now empty the main collection - no need to keep it!
            this.collection.reset();

            // If the totalListings is 0 then send the tracking call.
            if (this.totalListings === 0) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Zero tickets returned', pageload: false});
            }
        },

        showNoTicketsMessage: function() {
            var $ppGetTickets = this.$el.find('#partner-gettickets');
            
            if (this.model.isFiltersApplied() ||
                (globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT && this.model.get('qty') >= '0')) {
                 if (!gc.ticket_id) {
                    this.$el.removeClass('hide');
                    $('.no-tickets-message').removeClass('hide');
                 }
            } else {
                if (this.enablePrimaryPartner &&
                    !this.isHost &&
                    this.subModels.primaryPartnerModel.get('primaryEventPageURL') &&
                    this.subModels.primaryPartnerModel.get('primaryEventPageURL') !== '') {
                    $('#upcoming-events').addClass('hide');
                    $ppGetTickets.removeClass('hide');
                } else {
                    this.uiEl.$ticketsWrapper.addClass('hide');
                    $ppGetTickets.addClass('hide');
                    $('#upcoming-events').removeClass('hide');
                }
            }
        },

        showPrimaryPartnerGetTickets: function() {
            var $ppGetTickets = this.$el.find('#partner-gettickets');

            // Hide the partner get tickets for the phone.
            // if (window.innerWidth < globals.screen_breakpoints.desktop) {
            //     $ppGetTickets.addClass('hide');
            //     return;
            // }

            // Display or hide the partner get tickets depending on whether we have the
            // inventory or not. This is only for the 1st time page load.
            if (this.enablePrimaryPartner &&
                !this.isHost &&
                this.subModels.primaryPartnerModel.get('primaryEventPageURL') &&
                this.subModels.primaryPartnerModel.get('primaryEventPageURL') !== '') {
                $ppGetTickets.removeClass('hide');
            } else {
                $ppGetTickets.addClass('hide');
            }
        },

        layoutSettings: function() {
            var win = $(window),
            winHeight = win.height(),
            $ticketlist = $('#ticketlist'),
            $headerView = $('#header'),
            $parkingHeaderView = $('#eventParkingHeader'),
            $contentContainer = $('#content_container'),
            $eventMapContainer = $('#eventMapContainer'),
            $eventContainer = $('#eventContainer'),
            $ticketListFooter = $('#ticketlist_footer'),
            $advancedFilter = $('#filter'),
            $singleTicket = $('#single-ticket'),
            $serviceFeeInfo = $('#eventContainer .serviceFeeInfo'),
            $vfsLarge,
            headerHeight = $headerView.is(':visible') ? $headerView.outerHeight() : 0,
            parkingHeaderHeight = $parkingHeaderView.is(':visible') ? $parkingHeaderView.outerHeight() : 0,
            eventDetailsHeight = $('#event-details').outerHeight(),
            sortFilterHeaderHeight = $('#sortfilter_header').is(':visible') ? $('#sortfilter_header').outerHeight() : 0,
            ticketlistFooterHeight = $ticketListFooter.is(':visible') ? $ticketListFooter.outerHeight() : 0,
            advancedFilterHeight = $advancedFilter.is(':visible') ? $advancedFilter.outerHeight() : 0,
            serviceFeeInfoHeight = $serviceFeeInfo.outerHeight() ? $serviceFeeInfo.outerHeight() : 0,
            singleTicketHeight = 0,
            arrowHeight = 33,
            areatotal,
            twoRowHeight,
            cellheight,
            actualHeight,
            eventContainerSpacing,
            contentContainerMarginTop = 74; //74 is the Height of event header in tablet view

            if (gc.ticket_id) {
                singleTicketHeight = $singleTicket.is(':visible') ? $singleTicket.outerHeight() : 0;
            }

            if ($headerView.hasClass('scroll-up')) {
                headerHeight = 0;
                $headerView.removeClass('scroll-up');
                this.publishEvent('globalHeader:hide');
                $contentContainer.removeClass('scroll-up');
                //Mobile: Handling the edgecase when the user expands ticketlist for full view and clicks event header
                if (window.innerWidth < globals.screen_breakpoints.tablet) {
                    if ($('#arrowButton').hasClass('arrowFlipDown')) {
                        $eventContainer.height(winHeight - eventDetailsHeight);
                        $ticketlist.height(winHeight - eventDetailsHeight - sortFilterHeaderHeight - serviceFeeInfoHeight);
                    } else {
                        areatotal = winHeight - headerHeight - eventDetailsHeight;
                        twoRowHeight = areatotal / 2;

                        $eventMapContainer.height(twoRowHeight);
                        $eventContainer.height(twoRowHeight + arrowHeight);

                        if (gc.ticket_id) {
                            // Adjust height of ticket list if in single ticket view
                            $ticketlist.height('80%');
                        } else {
                            $ticketlist.height(twoRowHeight - sortFilterHeaderHeight - serviceFeeInfoHeight + arrowHeight);
                        }
                    }
                }
            }

            // for tablets and up
            // Tablet: 10px top padding, 10px bottom padding.
            // Desktop: 20px top padding, 20px bottom padding.
            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                eventContainerSpacing = 45;
                cellheight = winHeight - headerHeight - parkingHeaderHeight - contentContainerMarginTop;
                actualHeight = cellheight - eventContainerSpacing;
                $vfsLarge = $('#large-vfs');

                $eventMapContainer.css('height', cellheight);
                $eventContainer.height(actualHeight);
                $ticketlist.height(actualHeight - sortFilterHeaderHeight - singleTicketHeight - ticketlistFooterHeight - advancedFilterHeight - serviceFeeInfoHeight);

                if ($vfsLarge.is(':visible')) {
                    this.publishEvent('enlargevfs:hide');
                }
                this.publishEvent('ticketdetails:hideSideVfs');
                return;
            }

            //For smartphone layout - Once the layout setting is done, dont execute this
            if (!($('#arrowButton').hasClass('arrowFlipUp') || $('#arrowButton').hasClass('arrowFlipDown'))) {
                areatotal = winHeight - headerHeight - eventDetailsHeight;
                twoRowHeight = areatotal / 2;

                $contentContainer.height(winHeight - headerHeight - eventDetailsHeight);
                $eventMapContainer.height(twoRowHeight);
                $eventContainer.height(twoRowHeight + arrowHeight);

                if (gc.ticket_id) {
                    // Adjust height of ticket list if in single ticket view
                    $ticketlist.height('80%');
                    //ticketlist.height(twoRowHeight + singleTicketHeight);
                } else {
                    $ticketlist.height(twoRowHeight - sortFilterHeaderHeight - serviceFeeInfoHeight + arrowHeight);
                }
            }
        },

        refresh: function() {
            //clear the existing array of views
            this.ticketDetailsViews = [];

            $('#tickets > .spinner').removeClass('hide');

            //clear the existing list
            $('#tickets-wrapper').empty('');
            $('#upcoming-events, #partner-gettickets, .see-more, .no-tickets-message').addClass('hide');
        },

        goBack: function() {
            EventHelper.parkingPassRedirectToBYO('park_id=0&park_qty=0');
        },

        reset: function(evt) {
            var params = {
                pView: 'Ticket Listings',
                appInter: 'See all tickets',
                resetAll: true
            };

            this.publishEvent('ticketlist:seeAllTickets', evt, params);
        },

        prepareView: function() {
            if (this.lastchanged && (this.lastchanged === 'section-selected' ||
                this.lastchanged === 'section-deselected' ||
                this.lastchanged === 'show-all' ||
                this.lastchanged === 'filters' ||
                this.lastchanged === 'sortOptions' ||
                this.lastchanged === 'initial'
            )) {

                //if a section on the map is selected or deselected, clear the existing ticket list
                //the new ticket list should not be appended but replacing the existing DOM
                this.refresh();
            }
        },

        addTickets: function() {
            var renderPromise = [],
                self = this,
                domFrag = [],
                qty = this.model.get('qty'),
                selectedQty = (qty > 0 && qty <= 4 ? qty : -1),
                staticImagesinterval = globals.staticImagesInTicketList.interval,
                staticImagesEventObject = globals.staticImagesInTicketList.events[gc.event_id],
                currentImage = globals.staticImagesInTicketList.currentImage,
                lastTicketIndex = (this.lastchanged === 'start' ? globals.staticImagesInTicketList.lastTicketIndex : 0),
                nbrOfImages,
                imageObject,
                sectionId = EventHelper.getUrlQuery('sid'),
                isEbayTickets = EventHelper.getUrlQuery('gcid');

            self.ticketRank = self.model.get('rowStart');

            if (staticImagesEventObject) {
                nbrOfImages = staticImagesEventObject.images.length;
            }

            // fix for ebay inline listing. If the section id from ebay is invalid or there is no tickets
            // under this section, all the tickets should be display.
            if (isEbayTickets && sectionId && (this.subCollections.ticketlist.models.length === 0 || !reg.test(sectionId))) {
                EventHelper.removeUrlParam('sid');
                this.model.set('sections', []);
            } else {
                 //for each ticket in the collection , add a view to the list of all tickets
                this.subCollections.ticketlist.each(_.bind(function(ticket) {
                    lastTicketIndex++;

                    ticket.set('ticketRank', ++self.ticketRank);

                    if (staticImagesinterval > 0 && staticImagesEventObject &&
                        (lastTicketIndex % staticImagesinterval) === 1) {

                        imageObject = staticImagesEventObject.images[currentImage - 1];
                        renderPromise.push(this.addStaticImage(imageObject));

                        currentImage++;
                        if (currentImage > nbrOfImages) {
                            currentImage = 1;
                        }
                    }
                    renderPromise.push(this.addView(ticket, selectedQty));

                    if (lastTicketIndex >= staticImagesinterval) {
                        lastTicketIndex = 0;
                    }
                }, this));

                globals.staticImagesInTicketList.currentImage = currentImage;
                globals.staticImagesInTicketList.lastTicketIndex = lastTicketIndex;

                //append to the tickets to the DOM
                $.when.apply($, renderPromise).always(function() {

                    //get the DOM fragments to append to the wrapper
                    self.ticketDetailsViews.forEach(function(view) {
                        domFrag.push(view.el);
                    });
                    //now append all dom fragments once
                    if ($('#tickets-wrapper').length === 0) {
                        console.error('tickets-wrapper not ready');
                    }
                    $('#tickets-wrapper').append(domFrag);

                    //reset see more
                    $('.see-more').html(i18n.get('event.common.seemore.text'));

                    $('#tickets > .spinner').addClass('hide');
                    self.isLoading = false;

                    self.highlightFirstTicketDiv();
                });
            }

        },

        addView: function(ticket, selectedQty) {
            var ticketView = new TicketdetailsView({
                model: ticket,
                qty: selectedQty
            });

            this.ticketDetailsViews.push(ticketView);
            return ticketView.render();
        },

        addStaticImage: function(imageObject) {
            var staticImageView = new StaticImageView(_.extend(imageObject, {imageHost: gc.staticUrl}));
            this.ticketDetailsViews.push(staticImageView);
            return staticImageView.render();
        },

        prepareLoadMore: function() {
            if (this.totalListings <= (this.model.get('rowStart') + this.model.get('startInterval'))) {
                $('.see-more').addClass('hide');
            }else {
                $('.see-more').removeClass('hide');
            }
        },

        highlightOrLoadMore: function(evt) {
            var that = this;
            clearTimeout(timer);
            var triggerPoint = 100, // 100px from the bottom
            $eventHeader = $('#event-details'); //apply only to the phone layout

            if (!this.isLoading && (this.el.scrollTop + this.el.clientHeight + triggerPoint) > this.el.scrollHeight && !$('.see-more').hasClass('hide')) {
                this.fetchMoreTickets();

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Load more tickets', pageload: false});
            }

            if (!EventHelper.isDesktop()) {
                timer = setTimeout(function() {
                    that.highlightFirstTicketDiv();
                }, 250);
            }

            if (!$eventHeader.hasClass('scrolled-up') && window.innerWidth < globals.screen_breakpoints.tablet && !$('#header #hamburger').hasClass('clicked')) {
                EventHelper.scrollEventHeader($eventHeader, true);
                //after transition ends - reposition tooltip
                $('#header').one('webkitAnimationEnd mozAnimationEnd animationend', function(e) {
                    that.publishEvent('tooltip:reposition');
                    that.layoutSettings();
                });
            }

            // Hide the side-vfs image when scrolling
            this.publishEvent('ticketdetails:hideSideVfs');
        },

        fetchMoreTickets: function(evt) {
            this.isLoading = true;
            $('.see-more').html(i18n.get('event.common.loading.text')).attr('disabled', 'disabled');
            this.model.updateForLoadMore();
        },

        refillMap: function() {
            var self = this,
                sections = [];

            if (!this.seatmap) {
                return;
            }

            if (this.model.get('zonesEnabled')) {
                _.each(this.model.get('zones'), function(zid) {
                    sections = sections.concat(self.$el.blueprint.getSectionsByZone(zid));
                });
            } else {
                sections = this.model.get('sections');
            }

            this.seatmap.blueprint.resetMap();
            this.filterMap();

            if (sections.length > 0) {
                //FIX FOR- EVENTS-38 -setting callback trigger to false; only want the focus applied at this point; do not tigger associated callback
                this.seatmap.blueprint.focusSections(sections, false);
            }
        },

        syncMapInformation: function(data) {

            this.seatmap = $('#seatmap');

            //isMapStatic - ?, then dont attempt to highlight section on map and dont show tooltips
            this.isMapStatic = data.isMapStatic;
            this.isMapAvailable = true;

            //color the sections on map
            this.styleMapSections();
            //also now that the map is rendered highlist the first div and corresponding section on the map
            this.highlightFirstTicketDiv();

            //TODO: the api does return zone ids,
            // this is a redundant function. Wouldn't exist if Inventory API returned zoneIds!
            this.colorizeSectionlist();
        },

        styleMapSections: function() {
            this.seatmap.blueprint.styleSections(this.getSectionIds());
        },

        //filter map when filters ae applied
        filterMap: function() {
            this.seatmap.blueprint.filterSections(this.getSectionIds());
        },

        getSectionIds: function() {
            return _.map(this.subCollections.sectionlist.models, function(s) {
                return s.get('sectionId');
            });
        },

        highlightFirstTicketDiv: function(evt) {
            console.log('--TicketlistView--  in highlightFirstTicketDiv()');

            var self = this,
                price = '';

            // If the ticket view is open don't highlight the first ticket
            if ((this.lastchanged !== 'initial' && EventHelper.isDesktop()) || this.$el.find('.ticket-item.container-open').length > 0) {
                return;
            }

            $('#tickets-wrapper .ticket-item-wrapper').removeClass('highlight').each(function() {

                var $this = $(this),
                    $ticketItem = $this.find('.ticket-item'),
                    elTop = $this.position().top + $this.outerHeight() / 4;

                price = $ticketItem.find('.amount-value').text();

                if (elTop >= 0) {

                    //add highlight to the ticket now in view
                    $this.addClass('highlight');
                    self.publishEvent('ticketdetails:showSideVfs', $ticketItem.attr('data-tid'), $ticketItem.attr('data-sid'));

                    //also highlight the section on the map, but only if the map shows up
                    if (self.isMapAvailable && !self.isMapStatic) {
                        self.highlightSectionOnMap($ticketItem.attr('data-sid'), price);
                    }

                    return false;
                } else {
                    $this.removeClass('highlight');
                }
            });
        },

        highlightSectionOnMap: function(sectionId, price, isZoneTicket) {
            if (!this.seatmap) {
                return;
            }

            // If a ticket is dispalyed form a ticket_id url parameter,
            // add the section id and price
            if (globals.ticketIdActive) {
                sectionId = this.parentView.views.singleTicket.model.get('sectionId');
                price = $('.single-ticket-wrapper').find('.amount-value').text();
            }

            // highlight the section or zone on map
            this.seatmap.blueprint.highlightSections([sectionId]);

            // now show the tooltip but only for non zone tickets or tickets with sections.
            if (!!sectionId && !isZoneTicket) {
                this.publishEvent('ticketlist:showTooltip', sectionId, price);
            }
        },

        prepareMetaDataMappings: function() {
            var self = this,
                featureType,
                listingAttributeDesc = '',
                listingId = '',
                country = SH.country.toUpperCase();

            this.subCollections.ticketlist.each(_.bind(function(ticket) {

                if (ticket.get('deliveryTypeList') === null || ticket.get('deliveryTypeList') === undefined || (ticket.get('deliveryTypeList') && ticket.get('deliveryTypeList').length === 0)) {
                    return;
                }

                listingId = ticket.get('listingId');

                //update the mappings if not already done
                if (!ticket.attributes.deliveryTypeList[0].deliveryAttribute) {
                    //for all the delivery attributes
                    ticket.attributes.deliveryTypeList = (ticket.attributes.deliveryTypeList || []).map(function(deliveryAttribute) {
                        return {
                            id: deliveryAttribute,
                            deliveryAttribute: self.deliveryMappings[deliveryAttribute]
                        };
                    });
                }

                //add additional property if listing attribute has more ticket features
                if (_.intersection(ticket.attributes.listingAttributeList, self.attributeMappingsForIcons).length > 0) {
                    ticket.set('showDisclosure', 'yes');
                } else {
                    ticket.set('showDisclosure', 'no');
                }

                //listing attributes and associated icons
                if (!ticket.attributes.deliveryTypeList[0].listingAttribute) {
                    //for all the listing attributes
                    ticket.attributes.listingAttributeList = (ticket.attributes.listingAttributeList || []).map(function(listingAttribute) {
                        listingAttributeDesc = self.attributeMappings[listingAttribute];

                        //append final attribute, only if the description has been correctly mapped
                        if (listingAttributeDesc) {

                            //add feature icons if applicable
                            featureType = EventHelper.checkFeatureType(listingAttribute);

                            return {
                                id: listingAttribute,
                                listingAttribute: listingAttributeDesc,
                                featureIcon: featureType.featureIcon,
                                valueType: featureType.valueType
                            };
                        } else {
                            // Splunk log this error for visibility.
                            // Delaying actual sending because we do not to hold up the UI at all.
                            // We don't need this here because the call is going to be Async. But
                            // There is additional logic that logAppState does that we do not want
                            // to at this point in time. Hence, setting a timeout.
                            setTimeout(function(listingId, listingAttribute) {
                                try {
                                    EventHelper.logAppState('MissingListingAttributeList', null, {
                                        ticket_id: listingId,
                                        listingAttributeList: listingAttribute
                                    });
                                } catch (e) {}
                            }, 150, listingId, listingAttribute);

                            // Return an empty object conformant with what is expected downstream.
                            return {
                                id: null
                            };
                        }
                    });
                }

                //add the count of categorized and un-categorized ticket feature types to make it easier on dust
                ticket.set('iconCounts', _.countBy(ticket.get('listingAttributeList'), function(attribute) {
                    if (!attribute) {
                        return;
                    }
                    return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
                }));
            }));
        },

        setupAttributeDictionary: function() {
            var self = this,
                deliveryTypeList = this.subModels.metadata.get('InventoryEventMetaData').deliveryTypeList,
                listingAttributeList = this.subModels.eventModel.get('seatTraits'),
                country = SH.country.toUpperCase();

            if (deliveryTypeList) {
                this.deliveryTypeList = deliveryTypeList;
                this.deliveryTypeList.forEach(function(deliveryAttribute) {
                    var desc = deliveryAttribute.description;
                    self.deliveryMappings[deliveryAttribute.id] = desc;
                });
            }

            if (listingAttributeList) {
                this.listingAttributeList = listingAttributeList;
                this.listingAttributeList.forEach(function(listingAttribute) {
                    self.attributeMappings[listingAttribute.id] = listingAttribute.name;
                    //pick features other than seller comments
                    if (listingAttribute.type !== 'Seller Comments') {
                        self.attributeMappingsForIcons.push(listingAttribute.id);
                    }
                });
                //for these id's special icons are shown
                //101 - aisle; 102 - parking; 202, 3006 - wheelchair; 201, 5370, 4750, 4369, 2001, 348 - obstructed view, 13372 - Partner ticket.
                self.attributeMappingsForIcons = _.difference(self.attributeMappingsForIcons, [101, 102, 202, 3006, 201, 13372]);
            }

            self.publishEvent('deliveryTypes:ready', {deliveryTypes: this.deliveryTypeList});
        },

        colorizeSectionlist: function() {

            function lightenDarkenColor(col, amt) {
                var usePound = false;
                if (col && col[0] == '#') {
                    col = col.slice(1);
                    usePound = true;
                }
                var num = parseInt(col, 16);
                var r = (num >> 16) + amt;
                if (r > 255) r = 255;
                else if (r < 0) r = 0;
                var b = ((num >> 8) & 0x00FF) + amt;
                if (b > 255) b = 255;
                else if (b < 0) b = 0;
                var g = (num & 0x0000FF) + amt;
                if (g > 255) g = 255;
                else if (g < 0) g = 0;
                return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
            }

            function hexToRgb(hex, opacity) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ', ' + opacity + ')' : null;
            }

            console.log('--TicketlistView-- in colorizeSectionlist()');
            var zones = this.parentView.views.seatmap.$el.blueprint.getZones();
            var zoneIds = _.keys(zones);
            //set the default color, for when the map is static
            //border should actually be 0, but it will be overwritten by the high specificity of the styles in app.les
            var zoneCssStyle = '.zonecolor { border-color: transparent; }\n';
            var color = '';
            _.each(zoneIds, function(z) {
                var col1 = hexToRgb(zones[z].color, '0.5');
                var col2 = lightenDarkenColor(zones[z].color, -20);
                col2 = '#000';
                zoneCssStyle += '.zid-' + z + ' { border-left-color:' + col1 + '; color: ' + col2 + '; }\n';
            });
            console.log('zone css style=', zoneCssStyle);
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = zoneCssStyle;
            document.getElementsByTagName('head')[0].appendChild(style);

        },

        seeAllTickets: function() {
            this.viewingAllTickets = true;

            // Triggering the show-all since the filters might have changed.
            // This will trigger an API request. There are some cases where the user
            // might have changed the filters but is not shown the ticket list at that time.
            // Hence, making sure the ticket list is "refreshed" based on update/not-update filter
            // data.
            this.model.set('lastchanged', 'show-all');

            //also hide vfs
            this.publishEvent('enlargevfs:hide');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See All Listings', pageload: false});
        },

        /*
            The following use cases need to be considered when scrolling the ticket into the view -
            1. The ticket can be partially above the fold when the user clicks on the ticket.
            2. The ticket can be partially below the fold when the user clicks on the ticket.
            3. The height of the ticket can be greater than the height of the ticket list in which case
               the ticket should be top aligned.
        */
        scrollToView: function($ticket) {
            var $ticketList = this.$el,
                tlScrollTop = $ticketList.scrollTop(),
                tlHeight = $ticketList.height(),
                tktHeight = $ticket.height() + 10, // 10 = padding of the ticket.
                tktTop = $ticket.position().top,
                alignTicket = '',
                newScroll = 0;

            if (tktTop < 0 ||
                tktHeight > tlHeight) {
                alignTicket = 'top';
            } else if ((tktTop + tktHeight) > tlHeight) {
                alignTicket = 'bottom';
            }
            if (alignTicket === 'top') {
                newScroll = tlScrollTop + tktTop;
            } else if (alignTicket === 'bottom') {
                newScroll = tlScrollTop + tktHeight - (tlHeight - tktTop);
            }

            if (alignTicket !== '') {
                $ticketList.scrollTop(newScroll);
            }

        },

        zoneOrSectionToggle: function(data) {
            globals.zones_enabled = (data.isSelectByZone ? true : false);
            this.model.setSilent({
                zonesEnabled: globals.zones_enabled,
                lastchanged: 'filters'
            });
            if (globals.zones_enabled) {
                this.publishEvent('seatmap:enableSelectionByZone');
            } else {
                this.publishEvent('seatmap:enableSelectionBySection');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistView;
});
