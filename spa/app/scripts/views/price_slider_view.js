/* global _ */
define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'models/filter_model',
    'globals',
    'global_context',
    'i18n',
    'priceValidator',
    'sh_currency_format'
], function(Foobunny, Hammer, EventHelper, FilterModel, globals, gc, i18n, priceValidator, currencyFormatUtil) {
    'use strict';

    var PriceSliderView = Foobunny.BaseView.extend({

        el: '#price-slider',

        template: gc.appFolder + '/price_slider',

        initialize: function() {
            console.log('--SliderView--  in initialize()', this);

            this.oldx = 0;
            this.sliderMinPrice = 0; // used only in priceSlider reset

            this.subscribeEvent('slider:dataFetched', this.displaySliderPrice);
            this.subscribeEvent('filter:reset', this.resetSlider);
            this.subscribeEvent('filter:reset', this.renderSlider);

            // Listen for orientation changes
            //$(window).resize(_.bind(this.layoutSettings, this));
        },

        priceSliderNumberFormat: {
            decimalSymbol: '.',
            groupingSymbol: ',',
            decimalDigits: 0
        },

        events: {
            'mousedown #min-handle': 'mousedown',
            'mousedown #max-handle': 'mousedown',
            'touchstart #min-handle': 'mousedown',  // touch events are for non-desktop modes
            'touchstart #max-handle': 'mousedown'
        },

        uiEl: {
            $histogram: '.histogram',
            $trackSelection: '.track-selection',
            $track: '.track',
            $minHandle: '#min-handle',
            $maxHandle: '#max-handle',
            $minPrice: '#min-price .price_value',
            $maxPrice: '#max-price .price_value',
            $maxPlus: '.plus-max'
        },

        afterRender: function() {
            // Added a defensive check to verify if the el is in dom,
            // before passing it to hammer.
            if($(this.el).length) {
                Hammer(this.el);
            }
            this.updateSliderInfo();
            this.minHandle = document.getElementById('min-handle');
            this.maxHandle = document.getElementById('max-handle');

            if (globals.sliderPrice.sliderMinPrice && globals.sliderPrice.sliderMaxPrice) {
                this.preserveSliderValues();
            }
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        show: function() {
            this.$el.removeClass('hide');
        },

        renderSliderView: function() {
            return this.render();
        },

        layoutSettings: function() {
            this.reset();
            this.updateSliderInfo();
        },

        resetSlider: function() {
            this.percentage = [0, 100];
            this.minPrice = this.sliderMinPrice;
            this.maxPrice = this.model.get('sliderMaxValue');
            this.value = [this.minPrice, this.maxPrice];

            //update slider handle and prices
            this.uiEl.$minHandle.css('left', this.percentage[0] - 5 + '%');
            this.uiEl.$maxHandle.css('right', (95 - this.percentage[1]) + '%');
            this.uiEl.$trackSelection.css('left', Math.min(this.percentage[0], this.percentage[1]) + '%');
            this.uiEl.$trackSelection.css('width', Math.abs(this.percentage[0] - this.percentage[1]) + '%');

            this.setDragPrice();
        },

        renderSlider: function() {
            globals.sliderPrice.sliderMinPrice = '';
            globals.sliderPrice.sliderMaxPrice = '';

            // do not re-render the slider for single ticket case
            // on clicking filter reset its not making search inventory api call
            if (!gc.ticket_id) {
                this.model.setSilent({
                    sliderMaxValue: ''
                });
            }
        },

        calculateValue: function() {
            var val = [this.minPrice, this.maxPrice];

            if (this.percentage[0] !== 0) {
                val[0] = this.dragged === 0 ? this.toValue(this.percentage[0]) : this.value[0];
            }
            if (this.percentage[1] !== 100) {
                val[1] = this.dragged === 1 ? this.toValue(this.percentage[1]) : this.value[1];
            }
            return val;
        },

        // Called by 'mousedown' and 'mousemove'
        getPercentageDragged: function(evt) {
            // If it is not in desktop mode
            if (!EventHelper.isDesktop() && (evt.type === 'touchstart' || evt.type === 'touchmove')) {
                evt = evt.touches[0];
            }

            var eventPosition = evt.pageX,
                sliderOffset = this.offset.left,
                distanceToSlide = eventPosition - sliderOffset,
                percentage;

            // Calculate what percentage of the length the slider handle has slid
            percentage = (distanceToSlide / this.size) * 100;
            percentage = Math.round(percentage / this.step) * this.step;

            if (this.dragged === 0 && percentage > this.toPercentage(this.intervals[this.numIntervals - 1].min)) {
                percentage = this.toPercentage(this.intervals[this.numIntervals - 1].min);
            } else if (this.dragged === 1 && percentage < this.toPercentage(this.intervals[0].max)) {
                percentage = this.toPercentage(this.intervals[0].max);
            }

            // Make sure the percent is within the bounds of the slider.
            // 0% corresponds to the 'min' value of the slide
            // 100% corresponds to the 'max' value of the slide
            return Math.max(0, Math.min(100, percentage));
        },

        mousedown: function(evt) {
            // display price while slider drag
            this.setDragPrice();
            this.updateSliderInfo();
            this.currValues = this.value;

            var $currentTargetId = $(evt.currentTarget).prop('id');

            this.dragged = ($currentTargetId === 'min-handle' ? 0 : 1);

            // If in mobile/tablet mode
            if (!EventHelper.isDesktop()) {
                document.removeEventListener('touchmove', this.mousemove, false);
                document.removeEventListener('touchend', this.mouseup, false);
                this.minHandle.removeEventListener('touchstart', function(e) {e.preventDefault();}, false);
                this.maxHandle.removeEventListener('touchstart', function(e) {e.preventDefault();}, false);
            }

            if (this.mousemove) { // if the mousemove function is already bound, remove it
                document.removeEventListener('mousemove', this.mousemove, false);
            }
            if (this.mouseup) {
                document.removeEventListener('mouseup', this.mouseup, false);
            }

            this.mousemove = this.mousemove.bind(this);
            this.mouseup = this.mouseup.bind(this);

            // If in mobile/tablet mode, bind touch event handlers
            if (!EventHelper.isDesktop()) {
                // only For chrome browser on touch device add preventDefault
                this.minHandle.addEventListener('touchstart', function(e) {e.preventDefault();}, false);
                this.maxHandle.addEventListener('touchstart', function(e) {e.preventDefault();}, false);

                document.addEventListener('touchmove', this.mousemove, false);
                document.addEventListener('touchend', this.mouseup, false);
            }

            // Bind mouse events:
            document.addEventListener('mousemove', this.mousemove, false);
            document.addEventListener('mouseup', this.mouseup, false);
        },

        mousemove: function(evt) {
            // Where is the handle now?
            var rawPercentage = this.getPercentageDragged(evt),
                bubbleDistance = 10;


            // Set the position of the currently dragged handle
            if (this.dragged === 0) {
                if (this.percentage[1] - rawPercentage > bubbleDistance) {
                    this.percentage[0] = rawPercentage;
                } else if (rawPercentage > this.percentage[1]) {
                    this.percentage[0] = this.percentage[1] - bubbleDistance;
                }
            } else if (this.dragged === 1) {
                if (rawPercentage - this.percentage[0] > bubbleDistance) {
                    this.percentage[1] = rawPercentage;
                } else if (rawPercentage < this.percentage[0]) {
                    this.percentage[1] = this.percentage[0] + bubbleDistance;
                }
            }

            // Calculates the new price values from this.percentage
            this.setValue(this.calculateValue());
            this.updateLayout();
        },

        mouseup: function(evt) {
            var val = this.calculateValue(),
                minVal = 0,
                dragged = this.dragged,
                minMax = '',
                minMaxValue = '',
                minStr = 'Min Price: ' + val[0],
                maxStr = 'Max Price: ' + val[1];
            // If in mobile/tablet mode, unbind touch event handlers
            if (!EventHelper.isDesktop()) {
                document.removeEventListener('touchmove', this.mousemove, false);
                document.removeEventListener('touchend', this.mouseup, false);
            }
            // Unbind mouse event handlers:
            document.removeEventListener('mousemove', this.mousemove, false);
            document.removeEventListener('mouseup', this.mouseup, false);

            this.setValue(val);
            this.updateLayout();

            // If event occurred of min and max price but the value didn't change, return
            if ((dragged === 0 && this.currValues[0] === val[0]) || (dragged === 1 && this.currValues[1] === val[1])) {
                return;
            }

            if (this.percentage[0] === 0 && this.percentage[1] === 100) {
                this.resetSlider();
            } else {
                minVal = this.value[0];
            }

            // User made a slider selection, so fetch tickets to update ticketlist view
            this.model.set({
                minPrice: ~~currencyFormatUtil.unFormatPrice(minVal),
                maxPrice: this.value[1] !== this.model.get('sliderMaxValue') ? ~~currencyFormatUtil.unFormatPrice(this.value[1]) : 0,
                lastchanged: 'filters'
            }, {});

            if (dragged === 0) {
                minMax = 'Min price';
                minMaxValue = minMax + ': ' + val[0];
                if (this.percentage[0] !== 0) {
                    EventHelper.setUrlParam('sliderMin', this.percentage[0].toFixed(2) + ',' + val[0]);
                } else {
                    EventHelper.removeUrlParam('sliderMin');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: minMax, pageload: false, filterType: 'Selected ' + minMaxValue, userExperienceSnapshot: {priceSliderMin: minStr}});
            } else {
                minMax = 'Max Price';
                minMaxValue = minMax + ': ' + val[1];

                if (this.value[1] !== this.model.get('sliderMaxValue')) {
                    EventHelper.setUrlParam('sliderMax', this.percentage[1].toFixed(2) + ',' + val[1]);
                } else {
                    EventHelper.removeUrlParam('sliderMax');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: minMax, pageload: false, filterType: 'Selected ' + minMaxValue, userExperienceSnapshot: {priceSliderMax: maxStr}});
            }
        },

        reset: function() {
            this.percentage = [0, 100];
            this.value = [this.minPrice, this.maxPrice];
        },

        displaySliderPrice: function(data) {

            if (!data.eventPricingSummary || data.eventPricingSummary.minTicketPrice === data.eventPricingSummary.maxTicketPrice) {
                this.minMaxPriceEqual = true;
                this.hide();
                return;
            }

            // If we have preserved values set them now then configure sliders
            if (!this.model.get('sliderMaxValue')) {
                if (globals.sliderPrice.sliderMinPrice || globals.sliderPrice.sliderMaxPrice) {
                    this.preserveSliderValues();
                }
            }

            var pricePercentiles, i, minVal, maxVal,feeMinPrice,feeMaxPrice;

            this.minMaxPriceEqual = false;
            minVal = this.minPrice;
            maxVal = this.maxPrice;
            // data.eventPricingSummary.XXXXX has correct values with or w/o fees
            feeMinPrice = Math.floor(data.eventPricingSummary.minTicketPrice);
            // get 95th percentile price
            pricePercentiles = _.findWhere(data.eventPricingSummary.percentiles, {name: 95});
            feeMaxPrice = Math.ceil(pricePercentiles.value);

            // Abort if there's no change to the slider
            if (minVal === feeMinPrice && maxVal === feeMaxPrice) { return; }

            // Slider results are handled separately to react to only one of them in home position
            // Only change prices when in home position
            // Handle Min Slider
            if (this.percentage[0] === 0 || minVal === 0) {
                this.value[0] = feeMinPrice;
            }
            // Handle Max
            if (this.percentage[1] > 99.99) { // ~ 1 in 6 repositions of max slider exhibit a floating point error when slid to 100%
                this.value[1] = feeMaxPrice;
            }
            // Always change the slider min and max when API returns new values
            this.minPrice = feeMinPrice;
            this.maxPrice = feeMaxPrice;
            this.eventMinPrice = feeMinPrice;
            this.eventMaxPrice = feeMaxPrice;
            this.sliderMinPrice = feeMinPrice;
            this.sliderMaxPrice = feeMaxPrice;
            this.model.setSilent({
                sliderMinValue: feeMinPrice,
                sliderMaxValue: feeMaxPrice
            });

            this.totalTickets = data.totalTickets;
            this.totalListings = data.totalListings;
            this.step = 1.0;

            // We don't need to render anymore just update
            this.updateLayout();

            // (1) Determine how many bars/intervals to use for the histgram
            this.numIntervals = 30; // this.getNumIntervals(data.section_stats.length);

            // (2) Prepare the lower and upper bounds associated with each histogram bar/interval
            this.intervals = [];

            for (i = 0; i < this.numIntervals; i++) {
                this.intervals.push({
                    min: this.toValue((i / this.numIntervals) * 100),
                    max: this.toValue(((i + 1) / this.numIntervals) * 100) - 1, // minus one to remove range overlaps
                    quantity: 0
                });
            }

            // Cap the upper bound at 95%
            this.intervals[this.numIntervals - 2].max = this.maxPrice;
            this.intervals[this.numIntervals - 2].quantity += this.intervals[this.numIntervals - 1].quantity;
            this.numIntervals = this.numIntervals - 1;
        },

        preserveSliderValues: function() {
            var minPercentage = 0,
                maxPercentage = 100;

            if (globals.sliderPrice.sliderMinPrice >= 0) {
                this.minPrice = globals.sliderPrice.sliderMinPrice;
            }

            if (globals.sliderPrice.sliderMaxPrice >= 0) {
                this.maxPrice = globals.sliderPrice.sliderMaxPrice;
            }

            minPercentage = globals.sliderPrice.sliderMinPercent ? globals.sliderPrice.sliderMinPercent : minPercentage;
            maxPercentage = globals.sliderPrice.sliderMaxPercent ? globals.sliderPrice.sliderMaxPercent : maxPercentage;

            this.value = [this.minPrice, this.maxPrice];
            this.percentage = [minPercentage, maxPercentage];

            this.updateLayout();

            if (!this.minMaxPriceEqual) {
                this.show();
            } else {
                this.hide();
            }

            this.minPrice = this.eventMinPrice;
            this.maxPrice = this.eventMaxPrice;
        },

        searchForIndex: function(handle) {
            var handlePosition = this.percentage[handle],
                index = this.searchForInterval(this.toValue(handlePosition));

            return index;
        },

        searchForInterval: function(value, left) {
            var right = this.numIntervals - 1,
                mid;

            left = left || 0;

            while (left < right) {
                mid = Math.floor(left + ((right - left) / 2));
                if (this.intervals[mid].max < value) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        },

        searchForRange: function(min, max) {
            var firstInterval = this.searchForInterval(min),
                lastInterval = this.searchForInterval(max, firstInterval);

            return { firstInterval: firstInterval, lastInterval: lastInterval };
        },

        setValue: function(val) {
            this.value = val;
            this.value[0] = Math.max(this.minPrice, Math.min(this.maxPrice, this.value[0]));
            this.value[1] = Math.max(this.minPrice, Math.min(this.maxPrice, this.value[1]));

            if (this.maxPrice > this.minPrice) {
                this.percentage = [
                    this.toPercentage(this.value[0]),
                    this.toPercentage(this.value[1])
                ];
            } else {
                this.percentage = [0, 0];
            }
        },

        toPercentage: function(value) {
            if (this.maxPrice === this.minPrice) {
                return 0;
            } else {
                var max = Math.log(this.maxPrice),
                    min = this.minPrice === 0 ? 0 : Math.log(this.minPrice),
                    v = value === 0 ? 0 : Math.log(value);

                return 100 * (v - min) / (max - min);
            }
        },

        toValue: function(percentage) {
            var min = (this.minPrice === 0) ? 0 : Math.log(this.minPrice),
                max = Math.log(this.maxPrice),
                value = Math.exp(min + (max - min) * percentage / 100);

            value = this.minPrice + Math.round((value - this.minPrice) / this.step) * this.step;

            // Rounding to the nearest step could exceed the min or
            // max, so clip to those values.
            if (value < this.minPrice) {
                return this.minPrice;
            } else if (value > this.maxPrice) {
                return this.maxPrice;
            } else {
                return value;
            }
        },

        updateLayout: function() {
            var positionPercentages = [this.percentage[0], this.percentage[1]];

            // Update handle positions
            this.uiEl.$minHandle.css('left', positionPercentages[0] - 5 + '%');
            this.uiEl.$maxHandle.css('right', (95 - positionPercentages[1]) + '%');
            // Update selection track
            this.uiEl.$trackSelection.css('left', Math.min(positionPercentages[0], positionPercentages[1]) + '%');
            this.uiEl.$trackSelection.css('width', Math.abs(positionPercentages[0] - positionPercentages[1]) + '%');

            this.setDragPrice();
        },

        updateSliderInfo: function() {
            this.offset = this.uiEl.$track.offset();
            this.size = this.uiEl.$track.width();
        },

        getNumIntervals: function(totalSections) {
            // use for histogram
            // if (totalSections <= 10) {
            //     return 10;
            // }
            // if (totalSections <= 50) {
            //     return 20;
            // }
            return 30;
        },

        setDragPrice: function() {
            this.uiEl.$minPrice.text(currencyFormatUtil.format(this.value[0], this.priceSliderNumberFormat));
            this.uiEl.$maxPrice.text(currencyFormatUtil.format(this.value[1], this.priceSliderNumberFormat));

            if (this.value[1] === this.eventMaxPrice) {
                this.uiEl.$maxPlus.removeClass('hide');
            } else {
                this.uiEl.$maxPlus.addClass('hide');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: PriceSliderView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });
    return PriceSliderView;
});
