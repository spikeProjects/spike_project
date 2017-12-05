/* global SH,_ */
define([
    'foobunny',
    'hammer',
    'global_context',
    'models/filter_model',
    'models/fulfillment_window_model',
    'models/buyer_cost_model',
    'collections/inventory_collection',
    'views/ticketdetails_ga_view',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'globals'
    ], function(Foobunny, Hammer, gc, FilterModel, FulfillmentWindowModel, BuyerCostModel, InventoryCollection, TicketDetailsGAView, EventHelper, DeliveryHelper, globals) {
    'use strict';

    var TicketlistGAView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--TicketlistGAView--  in initialize()', this);

            this.collection = new InventoryCollection(gc.event_id);
            this.subCollections = {
                ticketlist: new Foobunny.BaseCollection()
            };

            this.subModels = {
                metadata: new FulfillmentWindowModel(),
                BuyerCostModel: new BuyerCostModel()
            };

            //delivery type and listing attribute mappings
            this.deliveryMappings = [];
            this.attributeMappings = [];
            this.deliveryTypeList = [];
            this.listingAttributeList = [];

            this.eventDeferred = Foobunny.utils.deferred();
            this.eventPromise = this.eventDeferred.promise();

            // This is required in the single ticket GA mode when the user
            // clicks on "View more tickets"
            this.subscribeEvent('fetchTickets', this.getTickets);

            this.subscribeEvent('singleticket:updated', this.updateTicketList);
            this.subscribeEvent('ticketlist:resize', this.setTicketlistHeight);
            this.subscribeEvent('eventmodel:dataready', this.setEventModel);

            // Listen for orientation changes
            $(window).resize(_.bind(this.setTicketlistHeight, this));
            this.upcomingEventsLink = '/'; // by default set upcoming events link to homepage

            this.eventPromise.always(
                function(){
                    this.upcomingEventsLink = this.subModels.eventModel.getUpcomingEventsLink();
                }.bind(this)
            );

            this.viewingAllTickets = false;
        },

        template: gc.appFolder + '/ticketslist_ga',

        el: '#tickets_view',

        modelEvents: {
            'change': 'processFilterModelChanged'
        },

        events: {
            'tap #view_more': 'showAllTickets'
        },

        uiEl: {
            $ticketsWrapper: '.tickets_wrapper',
            $listingsNotFound: '#listings_not_found',
            $viewMoreContent: '#view_more_content',
            $viewMoreLink: '#view_more',
            $viewTicket: '#view_ticket',
            $noTickets: '.no-tickets',
            $throbber: '.throbber',
            $zero_listings_found: '#zero_listings_found'
        },

        context: function() {
            return _.extend(
                {upcomingEventsLink: this.upcomingEventsLink}, this.model
            );
        },

        setEventModel: function(eModel) {
            this.subModels.eventModel = eModel;
            this.eventDeferred.resolve();
        },

        processFilterModelChanged: function(model) {
            // If this was part of the reset from filter then nullify the value of the reset attribute.
            model.unset('reset', {silent: true});

            // We are going to show only the 1st ticket if the user has changed
            // the quantity from the quantity picker.
            if (model.hasChanged('qty')) {
                // Whenever the qty is changed then we will only show the 1st ticket.
                this.viewingAllTickets = false;
            }

            // In single ticket mode we are not fetching the tickets when
            // the model is changed.
            if (gc.ticket_id && this.viewingAllTickets === false) {
                this.uiEl.$viewTicket.addClass('hide');
                return;
            }

            this.getTickets();
        },

        getTickets: function() {
            this.publishEvent('singleticket:hideSeeMore');

            // make sure the throbber is on
            this.uiEl.$throbber.removeClass('hide').show();

            this.$el.removeClass('hide');
            this.uiEl.$ticketsWrapper.removeClass('hide');

            // any error messages are hidden
            this.$el.find('#listings_not_found, #view_more_content, #view_more').addClass('hide');

            // and make sure the div is empty
            this.uiEl.$viewTicket.empty();

            // call fetch data
            this.fetchTicketInventory();
        },

        fetchTicketInventory: function() {
            var self = this,
                fulfillmentFetchPromise,
                buyerCostPromise;

            // fetch inventory data, but before that construct the url based on the filter model
            // pass the filter model data to prepare the url
            this.collection.prepareAPIUrl(this.model.toJSON());

            // now finally fetch
            fulfillmentFetchPromise = this.collection.fetch();

            fulfillmentFetchPromise
                .done(function(data) {
                    if (EventHelper.showBuyerCost() && data.listing && data.listing[0] !== undefined) {
                        var listingId = data.listing[0].listingId,
                            qty = qty,
                            buyercost = {
                                'buyerCostRequest': {
                                    'listingId': listingId,
                                    'quantity': self.model.get('qty'),
                                    'deliveryMethodId' : data.listing[0].deliveryMethodList[0]
                                }
                            };
                        buyerCostPromise = self.subModels.BuyerCostModel.fetch({
                            data: JSON.stringify(buyercost),
                            type: 'POST'
                        });

                        buyerCostPromise.done(function(data) {
                            var totalBuyFee = data.buyerCostResponse.totalBuyFee.amount;
                            var listing = _.clone(self.collection.models[0].get('listing'));
                            _.each(listing, function(key) {
                                key.totalBuyFee = totalBuyFee;
                            });
                            self.collection.models[0].set('listing', listing);
                            self.fetchSucessCallBack();
                        }).fail(function(error) {
                            // log in splunk
                            self.errorOnFetchedData(error);
                        });
                    } else {
                        self.fetchSucessCallBack();
                    }

                })
                .fail(function(error) {
                    // log in splunk
                    self.errorOnFetchedData(error);
                });
        },

        fetchSucessCallBack: function() {
            this.successfulInventoryDataFetch();

            // map this data onto each ticket
            this.prepareMetaDataMappings();

            // add tickets for each listing
            this.addTickets();

            // handle the cases when there could be no tickets found etc
            this.handleErrors();
        },

        fetchData: function() {
            console.log('--TicketlistGAView--  in fetchData()', this);

            var self = this,
                fetchDataPromise = this.subModels.metadata.fetch();

            fetchDataPromise
                .fail(function(error) {
                    // log in splunk
                    self.errorOnFetchedData(error);
                });

            $.when(fetchDataPromise, self.eventPromise).done(function() {
                // prepare attribute dictionary, this needs to be done only once and then cached
                self.setupAttributeDictionary();
            });

            return fetchDataPromise;
        },

        afterRender: function() {
            Hammer(this.el);

            if (this.model.get('qty') !== '-1') {
                this.processFilterModelChanged(this.model);
            }
        },

        addTickets: function() {
            var self = this;

            self.ticketRank = self.model.get('rowStart');
            // For each ticket in the collection:
            // 1- Map the disclosures from the dictionary we constructed above
            // 2- Add a view to the list of all ticket views
            this.subCollections.ticketlist.each(function(ticket, viewIndex) {
                ticket.set('ticketRank', ++self.ticketRank);

                var ticketView = new TicketDetailsGAView({
                    model: ticket,
                    qty: self.model.get('qty')
                });
                ticketView.render();
                if (viewIndex >= 1 || gc.ticket_id) {
                    ticketView.$el.addClass('more_ga_tickets');
                }
                ticketView.$el.appendTo(self.uiEl.$viewTicket);
            });
            // show the tickets finally
            this.displayTickets();
        },

        displayTickets: function() {
            if (gc.ticket_id) {
                this.showAllTickets();
            } else {

                if (this.subCollections.ticketlist.length > 1) {
                    this.uiEl.$viewMoreLink.removeClass('hide');
                }

                if (this.viewingAllTickets) {
                    this.showAllTickets();
                }
            }

            this.uiEl.$viewTicket.removeClass('hide');
            this.uiEl.$viewMoreContent.removeClass('hide');
            this.uiEl.$throbber.hide();
            this.setTicketlistHeight();
        },

        setTicketlistHeight: function() {
            var windowHeight = $(window).height(),
                headerHeight = $('#header').outerHeight(),
                eventInfoHeight = $('#eventInfo').outerHeight(),
                qtyFilterHeight = $('#quantityfilter').outerHeight(),
                $ticketListFooter = $('#ticketlist_footer'),
                ticketListFooterHeight = ($ticketListFooter.is(':visible') ? $ticketListFooter.outerHeight() : 0),
                $filter = $('#filter'),
                filterHeight = ($filter.is(':visible') ? $filter.outerHeight() : 0),
                singleTicketHeight = 0;

            if (gc.ticket_id) {
                singleTicketHeight = $('#single-ticket').outerHeight();
            }

            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                filterHeight = 0;
            }

            this.$el.height(windowHeight - headerHeight - eventInfoHeight -
                qtyFilterHeight - singleTicketHeight - ticketListFooterHeight - filterHeight);
        },

        handleErrors: function() {
            if (this.subCollections.ticketlist.length === 0 && this.model.get('qty') !== 0) {
                this.uiEl.$viewTicket.addClass('hide');
                this.uiEl.$viewMoreContent.addClass('hide');
                this.uiEl.$throbber.addClass('hide').hide();
                this.uiEl.$zero_listings_found.hide();
                this.uiEl.$listingsNotFound.removeClass('hide');
            }

            if (this.collection.hasOwnProperty('quantityVector') && this.collection.quantityVector.length < 1) {
                this.uiEl.$listingsNotFound.removeClass('hide');
            }
        },

        handleAPIErrors: function() {
            this.uiEl.$throbber.addClass('hide').hide();
            this.uiEl.$viewTicket.addClass('hide');
            this.uiEl.$noTickets.removeClass('hide');
        },

        handleZeroInventory: function() {
            this.uiEl.$throbber.addClass('hide').hide();
            this.uiEl.$viewTicket.addClass('hide');
            this.uiEl.$zero_listings_found.find('a').first().attr('href',this.upcomingEventsLink); // TODO: this should really be a subtemplate or subview to re-render errors as needed but since we are getting rid of GA, i'm doing it this way
            this.uiEl.$zero_listings_found.show();
        },

        showAllTickets: function() {
            this.viewingAllTickets = true;

            this.uiEl.$viewTicket.removeClass('hide');
            this.$el.find('#view_ticket .more_ga_tickets').show();

            // reset the height to allow scroll
            this.setTicketlistHeight();

            // keep this hidden - all tickets are showing up now
            this.uiEl.$viewMoreLink.addClass('hide');

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See All Listings', pageload: false});
        },

        successfulInventoryDataFetch: function() {
            this.subCollections.ticketlist.reset(this.collection.models[0].get('listing'));

            // If the totalListings is 0 then send the tracking call.
            if (this.collection.models[0].get('totalListings') === 0) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Zero tickets returned', pageload: false});
                this.handleZeroInventory();
            }

            // we can now empty the main collection - no need to keep it!
            this.collection.reset();
        },

        prepareMetaDataMappings: function() {
            var self = this;
            this.subCollections.ticketlist.each(_.bind(function(ticket) {

                if (ticket.attributes.deliveryTypeList === null || ticket.attributes.deliveryTypeList === undefined || (ticket.attributes.deliveryTypeList && ticket.attributes.deliveryTypeList.length === 0)) {
                    return;
                }
                // TODO: dust template should handle this
                // update the mappings if not already done
                if (ticket.attributes.deliveryTypeList !== null && !ticket.attributes.deliveryTypeList[0].deliveryAttribute) {
                    // for all the delivery attributes
                    ticket.attributes.deliveryTypeList = (ticket.attributes.deliveryTypeList || []).map(function(deliveryAttribute) {
                        return {
                            id: deliveryAttribute,
                            deliveryAttribute: self.deliveryMappings[deliveryAttribute]
                        };
                    });
                }
                // TODO: dust template should handle this
                if (ticket.attributes.deliveryTypeList !== null && !ticket.attributes.deliveryTypeList[0].listingAttribute) {
                    // for all the listing attributes
                    ticket.attributes.listingAttributeList = (ticket.attributes.listingAttributeList || []).map(function(listingAttribute) {
                        return {
                            listingAttribute: self.attributeMappings[listingAttribute]
                        };
                    });
                }
            }));
        },

        setupAttributeDictionary: function() {
            var self = this,
                deliveryTypeList = this.subModels.metadata.get('InventoryEventMetaData').deliveryTypeList,
                listingAttributeList = this.subModels.eventModel.get('seatTraits');

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
                });
            }
        },

        errorOnFetchedData: function(error) {
            // also handle failure; cannot proceed with the app
            // Since the user is already being shown the single ticket,
            // show an alternate message to the user instead of something went wrong page.
            if (gc.ticket_id) {
                this.handleAPIErrors();
            } else {
                this.publishEvent('dataready:error', error);
            }

            // log failures in Splunk
            EventHelper.logAppState('fetch', error);
        },

        updateTicketList: function() {
            if (!gc.ticket_id) {
                return;
            }

            // any error messages are hidden
            this.uiEl.$listingsNotFound.addClass('hide');
            this.uiEl.$viewMoreContent.addClass('hide');
            this.uiEl.$viewMoreLink.addClass('hide');
            this.uiEl.$noTickets.addClass('hide');

            // and make sure the div is empty
            this.uiEl.$viewTicket.empty();

            this.uiEl.$throbber.addClass('hide').hide();
        },

        showViewMoreLink: function() {
            this.uiEl.$viewMoreContent.removeClass('hide');
            this.uiEl.$viewMoreLink.removeClass('hide');
            this.$el.removeClass('hide');
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistGAView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistGAView;
});
