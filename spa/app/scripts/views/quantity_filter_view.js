define([
    'foobunny',
    'hammer',
    'global_context',
    'helpers/event_helper',
    'models/filter_model',
    'globals',
    'i18n'
], function(Foobunny, Hammer, gc, EventHelper, FilterModel, globals, i18n) {
    'use strict';

    var QuantityFilterView = Foobunny.BaseView.extend({

        buttonClass: 'qty-button ',
        filterClass: 'qty-filter',
        theme: 'default',
        maxButtonCount: 30,
        minButtonCount: 4,
        startCount: 1,
        shouldDisposeModel: false,
        selfModelUpdateStatus: false,
        modelEvents: {
            'change:reset change:qty change:qtyMax change:qtyMin change:quantityVector': 'handleModelChange'
        },
        el: '#quantityfilter',

        uiEl: {
            $qtyHeader: '.qty_header',
            $qtyIndex: '.qty_index',
            $viewMoreContent: '#view_more_content',
            $qtySubt: '#qty_subt',
            $qtyAdd: '#qty_add',
            $qty_filter_header: '#qty_filter_header',
            $qtyClose: '.qty-close',
            $qtySelectEl: '.evt-dropdown select'
        },

        events: {
            'tap #qty_add': 'incrementQty',
            'tap #qty_subt': 'decrementQty',
            'click .qty_index': 'selectQty',
            'click .qty-close': 'closeButtonClick',
            'change .evt-dropdown select': 'selectQty',
            'click .btn-view-all': 'viewAllButtonClick'
        },

        initialize: function(args) {
            console.log('--QuantityfiltersView--  in initialize()', this);
            this.options = _.extend(this.options, args);
            this.switchType(this.options.type);
            this.options.qtySelected = this.model.get('qty');
            this.options.startCount = (this.options.qtySelected > Number(this.options.minButtonCount)) ? Number(this.options.qtySelected) - (Number(this.options.minButtonCount) - 1 ) : this.startCount;
            this.options.quantityFilter = this.generateQuantityFilter(this.options);
            this.options.disableUnavailableQuantities = (this.options.disableUnavailableQuantities === false)? false : true;

            this.$eventDetails = $('#event-details');
        },

        /**
         * function: handleModelChange
         * purpose: filter model change updates this view, and re-renders.
         *
          */

        handleModelChange: function() {


            var maxButtonCount = this.options.maxButtonCount,
                minButtonCount = this.options.minButtonCount;

            if(this.options.type === 'select' || this.options.type === 'list') {
                minButtonCount = maxButtonCount;
                $(this.options.filterId).val(this.options.qtySelected);
            }

            if (((this.options.type === 'overlay' || this.options.type === 'select') && (this.options.qtySelected > 0 || EventHelper.getUrlQuery('qtyq') === false))) {
                return;
            }


            this.options.maxButtonCount = maxButtonCount;
            this.options.minButtonCount = minButtonCount;
            this.options.qtySelected = this.model.get('qty');
            this.options.quantityVector = this.model.get('quantityVector');
            this.displaySelectedQty(this.options.qtySelected);
        },

        applyButtonStates: function(buttonArray) {
            var qtySelected = this.options.qtySelected,
                qtyMax = this.options.maxButtonCount;

            for (var i in buttonArray) {


                var buttonValue = buttonArray[i].value;

                buttonArray[i].buttonState = '';

                if(qtySelected == buttonValue){
                    buttonArray[i].buttonState = 'selectQty';
                }

                if (this.options.disableUnavailableQuantities && ((Number(buttonValue) > Number(qtyMax) || this.checkQuantityAvailability(buttonValue) === 0))){
                    buttonArray[i].buttonState += ' disabled';
                }
            }
            return buttonArray;
        },

        generateQuantityButtons: function(buttonCountArg, buttonClassArg) {
            var buttonArray = [],
                buttonCount = buttonCountArg + this.options.startCount - 1,
                buttonClass = buttonClassArg || this.buttonClass;

            for (var i = this.options.startCount; i <= buttonCount; i++) {
                buttonArray.push({
                    'label': i,
                    'value': i,
                    'buttonClass': buttonClass
                });
            }

            return buttonArray;
        },

        generateQuantityFilter: function(args) {
            var args = args || {},
                maxButtonCount = Number(args.maxButtonCount),
                minButtonCount = Number(args.minButtonCount),
                buttonClass = args.buttonClass || this.buttonClass,
                navigation = args.navigation,
                prependButtons = args.prependButtons,
                extraButtons = args.extraButtons,
                disabledAdd = (this.options.startCount + minButtonCount > maxButtonCount || isNaN(maxButtonCount) === true)? 'disabled' : '',
                disabledSubt = (this.options.startCount <= 1)? 'disabled' : '',
                navigationButtons = args.navigationButtons || [
                    {
                        'label': '-',
                        'value': '-',
                        'buttonClass': 'left-nav ' + disabledSubt + ' ' + buttonClass,
                        'id': 'qty_subt'
                    },
                    {
                        'label': '+',
                        'value': '+',
                        'id': 'qty_add',
                        'buttonClass': disabledAdd + ' ' + buttonClass
                    }
                ],
                buttonArray = this.generateQuantityButtons(minButtonCount, buttonClass),
                quantityFilter = {};

            this.buttonClass = buttonClass;

            if (typeof(prependButtons) === 'object' && prependButtons !== null) {
                // can pass additional buttons as needed
                buttonArray = prependButtons.concat(buttonArray);
            }

            if (typeof(extraButtons) === 'object' && extraButtons !== null) {
                // can pass additional buttons as needed
                buttonArray = buttonArray.concat(extraButtons);
            }

            if (navigation === true) {
                buttonArray = buttonArray.concat(navigationButtons);
            }

            buttonArray = this.applyButtonStates(buttonArray);


            quantityFilter.buttons = buttonArray;
            quantityFilter.navigation = navigation;
            quantityFilter.maxButtonCount = maxButtonCount;
            quantityFilter.minButtonCount = minButtonCount;

            return quantityFilter;
        },

        context: function() {
            return this.options;
        },

        afterRender: function() {
            if (typeof(this.el) !== 'string'){
                Hammer(this.el);
            }

            this.$html = $('html');
            this.$ticketList = $('#ticketlist');

            // Display Qty as the label for the Phone.
            if (gc.ticket_id && window.innerWidth < globals.screen_breakpoints.tablet) {
                this.uiEl.$qtyHeader.text(i18n.get('event.quantityfilter.header.singleticket.ga'));
            }

            this.$el.removeClass('hide');

        },

        switchType: function(filterType) {
            switch (filterType) {
                case 'select':
                    this.template = gc.appFolder + '/partials/quantity_select_dropdown';
                    break;
                case 'list':
                    this.template = gc.appFolder + '/partials/quantity_list_dropdown';
                    break;
                case 'carousel':
                    this.template = gc.appFolder + '/partials/quantity_select_carousel';
                    break;
                case 'overlay':
                default:
                    if (gc.view === 'GA') {
                        this.template = gc.appFolder + '/quantity_filters';
                    } else {
                        this.template = gc.appFolder + '/quantity_filters_overlay';
                    }
            }
        },
        checkQuantityAvailability: function (quantityValue) {

            if(isNaN(quantityValue) === true) {
                // if value is not a number, leave it enabled;
                return 1;
            }
            //make sure the value is in range
            if(quantityValue <= this.options.maxButtonCount && quantityValue > 0){
                // check to see if quantityVector is populated as an array
                if(this.options.quantityVector && typeof(this.options.quantityVector.pop) === 'function'){
                    return (this.options.quantityVector[quantityValue]) ? this.options.quantityVector[quantityValue] : 0;
                } else {
                    return 1;
                }
            } else {
                return 0;
            }
        },
        findQtyRangeStart: function(selectedQty) {
            var endCount = this.options.startCount + this.options.minButtonCount,
                selectedQty = Number(selectedQty),
                startCount = selectedQty;

            if (isNaN(selectedQty) === true) {
                return this.options.startCount;
            }

            // if not a carousel and overlay, then this must be a drop down
            if (this.options.type !== 'carousel' && this.options.type !== 'overlay') {
                return 1;
            }

            var range = this.options.startCount + this.options.minButtonCount;

            // if quantity selected is within the displayed range, don't change the range
            if (selectedQty < range && selectedQty > this.options.startCount) {
                startCount = this.options.startCount;
            } else {
                endCount = startCount + this.options.minButtonCount;
            }

            // if the upper range exceeds the max button count, adjust it to only display up to the max
            if (endCount > this.options.maxButtonCount ) {
                startCount = this.options.maxButtonCount - this.options.minButtonCount + 1;
            }

            // if the start count gets adjusted to negative, then move start to 1
            if(startCount <= 1){
                startCount = 1;
            }

            return startCount;
        },

        // Increment the values displayed in the quantity picker by
        incrementQty: function(evt) {

            if (evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }

            var startCount = this.options.startCount + this.options.minButtonCount;

            this.displayStartingQty(startCount);

            if(startCount + this.options.minButtonCount > this.options.maxButtonCount){
                this.uiEl.$qtyAdd.addClass('disabled');
            }

            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Plus Clicked',
                pageload: false
            });
        },

        // Decrements the values displayed in the quantity picker by
        decrementQty: function(evt) {

            if (evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }

            var startCount = this.options.startCount - this.options.minButtonCount;

            this.displayStartingQty(startCount);

            if(this.options.startCount <= 1){
                this.uiEl.$qtySubt.addClass('disabled');
            }

            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Minus Clicked',
                pageload: false
            });
        },

        closeButtonClick: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.closeQtyOverlay();
            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Close Overlay',
                pageload: false
            });
        },

        viewAllButtonClick: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.closeQtyOverlay();
            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Quantity View All',
                pageload: false
            });
        },

        closeQtyOverlay: function() {
            var self = this;
            this.updateQtyOverlay();
            if(this.options.dispose !== false){
                this.dispose();
            }
            $('.quantityQuestionHeader').removeClass('quantityQuestionHeader');

            // allow 300 ms for quantity question to fully close / resize animations
            setTimeout(function(){
                self.publishEvent('quantityFilter:overlayClosed');
            }, 400);

            // on close always remove
            this.remove();
        },

        updateQtyOverlay: function() {
            this.$el.addClass('hide');
            this.$html.removeClass('noscroll');
            this.$ticketList.removeClass('noscroll');
            this.$eventDetails.removeClass('noclick');
            EventHelper.setUrlParam('qqd', '1');
            EventHelper.setUrlParam('qtyq', false);
        },

        validationPatterns: {
            'n+': /^\d+\+$/,
            'n': /^\d+$/
        },

        validateQuantity: function(qtySelected) {
            var status = false,
                qty = String(qtySelected);

            for (var pattern in this.validationPatterns) {
                if(qty.match(this.validationPatterns[pattern]) !== null){
                    status = true;
                }
            }

            return status;
        },

        reset: function() {
            // toggle button if the same button is clicked twice
            this.uiEl.$qtyIndex.removeClass('selectQty');
            this.options.qtySelected = -1;
            EventHelper.setUrlParams(
                [
                    {
                        name: 'qty',
                        value: this.options.qtySelected
                    },
                    {
                        name: 'qqd',
                        value: 1
                    },
                    {
                        name: 'qtyq',
                        value: false
                    },
                ]);

        },

        selectQty: function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (e.currentTarget.classList.contains('disabled')) {
                return;
            }

            if (gc.view === 'NON-GA' && this.options.type === 'overlay') {
                this.updateQtyOverlay();
            }

            var $currentTarget = $(e.currentTarget);
            var selectedQty = ($currentTarget.val() === '') ? $currentTarget.data('value') : $currentTarget.val();
            if ($currentTarget.hasClass('btn-view-all')){
                return;
            }

            if (this.options.qtySelected === selectedQty && selectedQty > 0) {
                this.reset(e);
            }

            if (selectedQty <= 0){
                this.reset(e);
                this.model.updateForQty({qty: selectedQty});
            }

            this.options.qtySelected = selectedQty;


            if (this.validateQuantity(this.options.qtySelected)) {
                // set model update status to true to prevent duplicate render
                // calls
                this.selfModelUpdateStatus = true;
                this.model.updateForQty({qty: this.options.qtySelected});

                EventHelper.setUrlParams(
                    [
                        {
                            name: 'qty',
                            value: this.options.qtySelected
                        },
                        {
                            name: 'qqd',
                            value: 1
                        },
                        {
                            name: 'qtyq',
                            value: false
                        }
                    ]
                );
                this.displaySelectedQty(this.options.qtySelected);

                // hide text
                this.uiEl.$qtyHeader.addClass('hide');

                this.publishEvent('quantityFilter:qtyUpdated', {'qtySelected': this.options.qtySelected});

                if (gc.view === 'NON-GA'){
                    EventHelper.track({
                        pageView: 'QtyQuestOverlay',
                        appInteraction: 'Quantity',
                        pageload: false,
                        filterType: 'Selected QuantityQ: ' + this.options.qtySelected,
                        userExperienceSnapshot: {quantity: 'Quantity: ' + this.options.qtySelected}
                    });
                } else {
                    EventHelper.track({
                        pageView: '',
                        appInteraction: this.options.qtySelected,
                        pageload: false,
                        filterType: 'Selected Quantity: ' + this.options.qtySelected,
                        userExperienceSnapshot: {quantity: 'Quantity: ' + this.options.qtySelected}
                    });
                }
            }
        },

        removeState: function(state) {
            var stateFilter = new RegExp('\.*' + state + '\.*');
            for (var i in this.options.quantityFilter.buttons) {
                if(this.options.quantityFilter.buttons[i].buttonState){
                    var button = this.options.quantityFilter.buttons[i];
                    button.buttonState = button.buttonState.replace(stateFilter, '');
                }
            }
        },

        // The user selected the desired quantity from the panel.
        displayStartingQty: function(qtySelected) {
            this.options.startCount = this.findQtyRangeStart(qtySelected);
            this.options.quantityFilter = this.generateQuantityFilter(this.options);
            // TODO: solve in a better way: Safari on iPhone will activate a select if it is re-rendered
            if (this.options.type === 'select'){
                this.uiEl.$qtySelectEl[0].value = qtySelected;
            } else {
                this.render();
            }
        },

        displaySelectedQty: function(qtySelected) {
            this.options.qtySelected = qtySelected;
            this.displayStartingQty(qtySelected);
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: QuantityFilterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return QuantityFilterView;
});
