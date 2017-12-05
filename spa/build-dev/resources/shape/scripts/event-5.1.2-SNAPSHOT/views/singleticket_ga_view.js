define([
    'foobunny',
    'hammer',
    'models/filter_model',
    'models/singlelisting_model',
    'views/ticketdetails_ga_view',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, Hammer, FilterModel, SingleListingModel, TicketdetailsGAView, EventHelper, gc, globals) {
    'use strict';

    var SingleticketGAView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--SingleTicketGAView-- in initialize', this);

            this.model = new SingleListingModel(gc.ticket_id);
            // GA View only: We are not doing anything if the single ticket is not available/valid.
            // Hence we are not listening to the invalid event of the model like in the NON-GA view.

            this.subscribeEvent('singleticket:hideSeeMore', this.hideSeeMore);
            this.subscribeEvent('ticketdetails:qtyUpdated', this.updateSingleTicket);

            this.model.on('invalid', this.errorOnFetchedData, this);
        },

        el: '#single-ticket',

        template: gc.appFolder + '/single_ticket_ga',

        events: {
            'tap .view_more': 'showMoreTickets',
            'tap .find-another-ticket' : 'showAllTickets'
        },

        modelEvents: {
            'change:singleTicketError': 'displayErrorMesage',

            FilterModel: {
                'change:withFees': 'updatePrice',
                'change:qty': 'updateSingleTicketQty'
            }
        },

        unSubscribeFilterModelEvents: function() {
            this.subModels.FilterModel.off('change:withFees', this.updatePrice);
            this.subModels.FilterModel.off('change:qty', this.updateSingleTicketQty);
        },

        afterRender: function() {
            Hammer(this.el);
        },

        fetchData: function() {
            var self = this,
                singleTicketFetchPromise;

            singleTicketFetchPromise = this.model.fetch({validate: true});

            singleTicketFetchPromise.done(function() {
                if (!self.model.validationError) {
                    // FOR NOW, GA is treating the tickets without splits as if it has
                    // splits. Hence, massaging the data here. Once we move the same to
                    // NON-GA view then this should be done in the MODEL and removed
                    // from here.
                    self.model.convertIntoVector();
                    self.addSingleTicket();
                }
                // TBD: If there is a validation error then should we stop listening to events?
                // The model is still available it's just that it is not valid and most probably
                // the single ticket view is not visible either.
            })
            .fail(function(error) {
                self.errorOnFetchedData(self.model, error);
            });
            return singleTicketFetchPromise;
        },

        errorOnFetchedData: function(model, error, options) {
            var logdata;

            // hide advanced settings
            $('#ticketlist_footer').addClass('hide');

            // Remove the single_ticket class from the event_ga_layout
            $('#event_ga_layout').removeClass('single_ticket');

            // Stop listening to the event since the model is not there.
            this.unsubscribeEvent('quantityFilter:qtyUpdated');
            this.unsubscribeEvent('ticketdetails:qtyUpdated');
            this.unSubscribeFilterModelEvents();

            if (model.validationError) {
                this.publishEvent('dataready:error', error);
                EventHelper.track({pageView: '', appInteraction: model.validationError, pageload: false});
            } else if (error.status === 400 || error.status === 404) {
                this.model.set('singleTicketError', true);
                error = EventHelper.singleTicketErrorObject(error);
                EventHelper.track({pageView: error.responseJSON.code, appInteraction: error.responseJSON.description, pageload: false});
            } else {
                // Handle failure; cannot proceed with the app
                this.publishEvent('dataready:error', error);
            }

            //log failures in Splunk
            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        displayErrorMesage: function() {
            if (!this.model.get('singleTicketError')) {
                return;
            }

            var self = this;

            $('#quantityfilter').addClass('hide');
            this.render();

            this.showTicketTimer = setTimeout(function() {
                // Hide ticket view if listing is not available but event is active
                self.showAllTickets();
            }, 5000);
        },

        showAllTickets: function(evt) {
            clearTimeout(this.showTicketTimer);
            this.$el.addClass('hide');

            // omniture tracking only when user clicked on find another ticket button
            if (evt && $(evt.currentTarget).hasClass('find-another-ticket')) {
                EventHelper.track({pageView: 'GA ticket id expired', appInteraction: 'Find another ticket', pageload: false});
            }
            $('#quantityfilter').removeClass('hide');

            // display tickets for quantity one
            $('#qty_container .qty_index').first().trigger('click');
            EventHelper.removeUrlParam('ticket_id');
        },

        addSingleTicket: function() {
            var self = this,
                filterModelQty = this.subModels.FilterModel.get('qty'),
                isFilterModelQtyAvailable = this.model.isQtyAvailableOnThisTicket(Number(filterModelQty));
            this.singleTicketView = new TicketdetailsGAView({
                model: this.model,
                qty: filterModelQty > 0 && isFilterModelQtyAvailable ? Number(filterModelQty) : this.getQuantity()
            });

            var renderPromise = this.singleTicketView.render();
            renderPromise.done(function() {
                self.$el.find('.single-ticket-wrapper').empty().append(self.singleTicketView.el);
                // Sometimes if the single ticket API takes longer and then the user
                // clicks on a filter the ticket list is displayed and then when the
                // ticket api returns with a response see more is displayed in between
                // the single ticket and the ticket list. Show the see more if the ticket list is hidden.
                if ($('#tickets_view').hasClass('hide')) {
                    self.displaySeeMore();
                    globals.ticketIdActive = true;
                }
            });
        },

        updateSingleTicketQty: function(model, qty) {
            this.updateSingleTicket({qtySelected: qty});
        },

        updateSingleTicket: function(qty) {
            var qtySelected = qty.qtySelected,
                qtyAvailable = true;

            // If the model is not available then bail.
            if (!this.model.fetched) {
                return;
            }

            // If the quantity picked from the qty picker is not available then
            // set the qty to the minimum qty in the view.
            // IMPORTANT: The select drop down may be disabled.
            if (!this.model.isQtyAvailableOnThisTicket(qtySelected)) {
                qtyAvailable = false;
            }
            this.model.set('qty', qtySelected);

            if (qtyAvailable) {
                // Show the View more link
                this.displaySeeMore();
            } else {
                this.showMoreTickets();
            }

            this.publishEvent('singleticket:updated');
        },

        updatePrice: function(filterModel, withFees) {
            if (withFees) {
                this.model.set('usePrice', this.model.get('buyerSeesPerProduct'));
            } else {
                this.model.set('usePrice', this.model.get('pricePerProduct'));
            }

            this.singleTicketView.render();
        },

        getQuantity: function() {
            return this.model.get('qty');
        },

        showMoreTickets: function() {
            this.publishEvent('fetchTickets');
            this.hideSeeMore();
        },

        hideSeeMore: function() {
            this.$el.find('.single-ticket-see-more').addClass('hide');
        },

        displaySeeMore: function() {
            this.$el.find('.single-ticket-see-more').removeClass('hide');
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SingleticketGAView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });
    return SingleticketGAView;
});
