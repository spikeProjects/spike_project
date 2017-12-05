define([
    'foobunny',
    'hammer',
    'global_context',
    'helpers/event_helper',
    'models/filter_model',
    'globals'
    ], function(Foobunny, Hammer, gc, EventHelper, FilterModel, globals) {
    'use strict';

    var TicketDetailsGAView = Foobunny.BaseView.extend({

        initialize: function(options) {
            console.log('--TicketDetailsGAView--  in initialize()', this);
            var self = this;
            options.model.set('totalCost', (options.model.get('usePrice').amount * options.qty).toFixed(2));
            options.model.set('qty', options.qty);

            this.initialRender = true;

            this.singleTicket = options.model.get('singleTicket');
            if (this.singleTicket) {
                this.subscribeEvent('quantityFilter:qtyUpdated', function(qty) {
                    self.updateQuantity(qty);
                    self.reRender(qty);
                    // Add the active class to the ticket details if the quantity is available
                    if (self.qtyAvailable) {
                        // Enable the Buy button.
                        self.$el.find('.buy_tickets button').addClass('active');
                    }
                });
            }
        },

        template: gc.appFolder + '/ticketdetails_ga',

        events: {
            'tap .buy_tickets': 'buyTickets',
            'change .quantity' : 'displayQuantitySelector',
            'tap .sellerInfo': 'viewUserInfo'
        },

        afterRender: function() {
            Hammer(this.el);

            var qtySelected;
            if (this.singleTicket && this.initialRender) {
                this.initialRender = false;
                qtySelected = this.model.get('qty');
                this.updateQuantity({
                    qtySelected: qtySelected
                });
                this.publishEvent('ticketdetails:qtyUpdated', {
                    qtySelected: qtySelected,
                    qtyAvailable: this.model.isQtyAvailableOnThisTicket(qtySelected)
                });
            }
        },

        buySingleTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            // Check the qty and then add the shaker if qty is not selected.
            var $currTgt = $(evt.currentTarget),
                $parent = $currTgt.parents('.ticket_details'),
                self = this;

            if (!$parent.find('.buy_tickets button').hasClass('active')) {
                $parent.find('.quantity').addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('shake');
                });
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout: Inactive', pageload: false});
                return;
            }

            EventHelper.setUrlParam('ticket_id', $parent.attr('data-tid'));

            setTimeout(function() {
                self.publishEvent('url:checkout', {
                    tid: $parent.attr('data-tid'),
                    qty: $parent.attr('data-qty')
                });
            }, 300);

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout', pageload: false});

        },

        buyTickets: function(evt) {
            var $currTgt = $(evt.currentTarget),
                currentTargetId = evt.currentTarget.id.split('_'),
                ticketId = currentTargetId[1];

            if ($currTgt.parents('.single_ticket').length > 0) {
                this.buySingleTicket(evt);
                return;
            }

            EventHelper.setUrlParam('ticket_id', ticketId);
            if (!gc.ticket_id) {
                EventHelper.setUrlParam('cb', '1');
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Checkout',
                pageload: false,
                filterType: 'ListingId Selected: ' + ticketId + '; Ticket Rank: ' + this.model.get('ticketRank'),
                userExperienceSnapshot: {
                    ticketId: 'ListingId: ' + ticketId,
                    ticketRank: 'Ticket Rank: ' + this.model.get('ticketRank')
                }
            });

            // Navigate to checkout page
            this.publishEvent('url:checkout', {
                tid: currentTargetId.pop(),
                qty: this.model.get('qty')
            });
        },

        displayQuantitySelector: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $currTgt = $(evt.currentTarget),
                $parent = $currTgt.parents('.ticket_details'),
                qty = parseInt(evt.target.value),
                price = $parent.attr('data-price'),
                amount = (qty * price).toFixed(2).split('.');

            EventHelper.setUrlParam('qty', qty);
            this.globalFilterModel.set('qty', qty);
            this.updateQuantity(qty);
            
            // Update the DOM with the information.
            $parent.attr('data-qty', qty);
            $parent.find('.price_dollars').html(amount[0]);
            $parent.find('.price_cents').html('.' + amount[1]);
            $parent.find('.selectedQty').html(qty);

            // Enable the Buy button.
            $parent.find('.buy_tickets button').addClass('active');

            // Update the qty in the qty selector.
            this.publishEvent('ticketdetails:qtyUpdated', {
                qtySelected: qty,
                qtyAvailable: this.model.isQtyAvailableOnThisTicket(qty)
            });

            this.qtyAvailable = true;
            this.reRender({qtySelected: qty});
        },

        updateQuantity: function(qty) {
            var qtySelected = qty.qtySelected;
            this.qtyAvailable = true;

            if (!this.initialRender && !this.model.isQtyAvailableOnThisTicket(qtySelected)) {
                qtySelected = this.model.get('splitVector')[0];
                this.qtyAvailable = false;
            }
            this.model.set('qty', qtySelected);
            this.$el.find('.quantity select').val((this.qtyAvailable ? qtySelected : 0));

            // Add the active class to the ticket details if the quantity is available
            if (this.qtyAvailable) {
                // Enable the Buy button.
                this.$el.find('.buy_tickets button').addClass('active');
            }
        },

        reRender: function(qty) {
            this.render();
            this.$el.find('.quantity select').val((this.qtyAvailable ? qty.qtySelected : 0));
            if (this.qtyAvailable) {
                this.$el.find('.buy_tickets button').addClass('active');
            }
        },

        viewUserInfo: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.publishEvent('sellerInfo:show', {
                businessGuid: this.model.get('businessGuid')
            });
        },

        context: function() {
            return {
                qty: this.model.get('qty'), // may have a different value than filter model
                hasBsfFeature: EventHelper.hasBsfFeature(),
                hasFaceValueFeature: EventHelper.hasFaceValueFeature()
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketDetailsGAView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel',
        targetPropName: 'globalFilterModel'
    });

    return TicketDetailsGAView;
});
