define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n',
    'models/filter_model'
], function(Foobunny, Hammer, EventHelper, globals, gc, i18n, FilterModel) {
    'use strict';

    var TicketlistFooterView = Foobunny.BaseView.extend({

        el: '#ticketlist_footer',

        template: gc.appFolder + '/ticketlist_footer',

        initialize: function() {
            console.log('--TicketlistFooterView--  in initialize()', this);
            this.subscribeEvent('filterView:hidden', this.show);
            this.subscribeEvent('quantityFilter:qtyUpdated', this.show);
            this.subscribeEvent('eventmodel:expiredEvent', this.hide);
            this.subscribeEvent('filter:show', this.hide);
        },

        uiEl: {
            '$priceFilterOptions': '#footer-wrapper',
            '$priceFilterWrapper': '.filter-wrapper',
            '$advancedFilterTxt': '#price-filter-txt',
            '$sortByQty': '#qtyselector',
            '$sortByQtyTxt': '.qtyText',
            '$sortByQtyhdr': '.qtyhdr'
        },

        events: {
            'tap .filterTitle': 'openPriceFilter',
            'change #qtyselector': 'applyQuantity'
        },

        modelEvents: {
            'change:qty': 'displayUpdatedQuantity'
        },

        afterRender: function() {
            Hammer(this.el);
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var filterType = 'Quantity';

            var qty = this.uiEl.$sortByQty.val();

            this.model.updateForQty({qty: qty});

            if (qty === '-1') {
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
            }

            EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false});
        },

        displayUpdatedQuantity: function(model, params) {
            var qty = model.get('qty');

            if (qty === '>5') {
                qty = '5+';
            }
            if (qty > '0') {
                this.uiEl.$sortByQty.val(qty);
                this.uiEl.$sortByQtyTxt.addClass('applyBlue').text(qty).parent().addClass('applyQuantity');
            } else {
                this.uiEl.$sortByQty.val('-1');
                this.uiEl.$sortByQtyTxt.removeClass('applyBlue').text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            }
        },

        show: function() {
            if (gc.view === 'NON-GA' &&
                globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                return;
            }

            if ($('#filter').is(':visible')) {
                this.hide();
            } else {
                this.$el.removeClass('hide');
            }
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        openPriceFilter: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (gc.view === 'NON-GA' ||
                (gc.view === 'GA' && window.innerWidth >= globals.screen_breakpoints.tablet)
            ) {
                this.hide();
            }

            this.publishEvent('ticketListFooter:hidden');

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Show Filter', pageload: false});
        },

        context: function() {
            return {
                globals: globals
            };
        }
    });
    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistFooterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistFooterView;
});
