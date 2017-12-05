/* global _ */
define([
    'foobunny',
    'hammer',
    'models/filter_model',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'views/price_slider_view',
    'collections/inventory_collection',
    'globals',
    'global_context',
    'i18n',
    'priceValidator',
    'sh_currency_format',
    'views/quantity_filter_view'
], function(Foobunny, Hammer, FilterModel, EventHelper, DeliveryHelper, PriceSliderView, InventoryCollection, globals, gc, i18n, priceValidator, currencyFormatUtil, QuantityFilterView) {
    'use strict';

    var FilterView = Foobunny.BaseView.extend({

        el: '#filter',

        template: gc.appFolder + '/filter',

        subViews: {},

        initialize: function() {
            console.log('--FilterView--  in initialize()', this);
            this.timer = '';
            this.seatTraits = [];
            this.deliveryTypes = [];
            this.$clonedModal = null;
            this.$modalOverlays = null;

            this.subscribeEvent('ticketListFooter:hidden', this.show);
            this.subscribeEvent('filter:show', this.show);
            this.subscribeEvent('filter:hide', this.closeFilters);
            this.subscribeEvent('ticketlist:seeAllTickets', this.reset);
            this.subscribeEvent('eventmodel:dataready', this.setSeatTraits);
            this.subscribeEvent('deliveryTypes:ready', this.setdeliveryTypes);

            if (gc.view === 'NON-GA' && !globals.priceSlider.displayOutside) {
                this.subViews = {sliderView: new PriceSliderView()};
            }

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));

            // Future Change: Figure out the 250 ms delay.
            this.debouncedToggleReset = _.debounce(this.toggleReset, 250);

            var layoutType = EventHelper.getLayoutType();
            switch(layoutType) {
                case 'blended':
                    var urlParamQtyBtnCount = Number(EventHelper.getUrlQuery('qtyBtnCount')),
                        maxButtonCount = urlParamQtyBtnCount || EventHelper.getFeatureFn('event.qqBlendedMaxQty', 'string')() || globals.quantityOverlay.quantityBtnMaxCount,
                        qtyFilterArgs;

                    if(EventHelper.isMobile() === true) {
                        qtyFilterArgs = {
                            el: '#qty_container',
                            filterId: 'qty_filter_mobile',
                            filterClass: 'qty_content qty-filter-drop-down',
                            buttonClass: 'select-item',
                            type: 'select',
                            qtySelected:  this.model.get('qty'),
                            maxButtonCount: maxButtonCount,
                            minButtonCount: maxButtonCount,
                            navigation: false
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);

                    } else {

                        var qtyFilterArgs = {
                            el: '#sortfilter-qty-selector .select-dropdown',
                            filterId: 'sortfilter-qty-dropdown',
                            filterClass: '',
                            type: 'list',
                            qtySelected:  this.model.get('qty'),
                            maxButtonCount: maxButtonCount,
                            minButtonCount: maxButtonCount,
                            navigation: false
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);
                    }
                    break;
                case 'nonBlended':
                    if(EventHelper.isDesktop() === false){
                        // this is going to go away, only to support the default / current circle selector buttons 12345+
                        var qtyFilterArgs = {
                            el: '#qty_container',
                            filterId: 'qty_filter_mobile',
                            filterClass: 'qty_content filter-mobile-carousel flexbox flex-container',
                            buttonClass: 'btn-default qty-button qty_index btn-small flex-item',
                            type: 'carousel',
                            maxButtonCount: 5,
                            minButtonCount: 4,
                            navigation: false,
                            qtySelected: this.model.get('qty'),
                            modelEvents: {},
                            extraButtons: [
                                {
                                    "label": '5+',
                                    "value": '5+',
                                    buttonClass: 'btn-default qty-button btn-small flex-item'
                                }
                            ]
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);
                        this.subViews.qtyFilter.selectQty = this.selectQty;
                    }
                    break;
                case 'ga':

                    break;

                default:

            }
        },

        modelEvents: {
            'change': 'debouncedToggleReset',
            'change:qty': 'displayUpdatedQuantity'
        },

        context: function() {
            return {
                globals: globals,
                seatTraits: this.seatTraits,
                deliveryTypes: this.deliveryTypes,
                isAdvancedFiltersEnabled: EventHelper.isAdvancedFiltersEnabled(),
                isFiltersApplied: this.model.isFiltersApplied()
            };
        },

        afterRender: function() {
            Hammer(this.el);

            this.$body = $('body');
            this.$modalOverlays = $('.modal-overlay-cover');
            this.$clonedModal = $(this.$modalOverlays[0]).clone();
            this.$clonedModal.attr('id', 'ticketlist-modal-overlay');

            this.layoutSettings();
        },

        layoutSettings: function() {
            // Display How Many Tickets as the label for the Tablet and Desktop for NON-GA events only.
            if (gc.view === 'NON-GA') {
                if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                    this.$el.find('.lbl-quantity').text(i18n.get('event.filter.qty.text'));
                } else {
                    this.$el.find('.lbl-quantity').text(i18n.get('event.filter.howmany.text'));
                }
            }
        },

        uiEl: {
            '$feeOption': '.fee-option',
            '$feesIncluded': '#feesIncluded',
            '$feesIncludedLabel': '.withfeeslabel',
            '$filterSubmit': '.filter-submit',
            '$qtyIndex': '#qty_container .qty_index',
            '$eiFromPriceTxt': '#eifromPriceTxt',
            '$eiToPriceTxt': '#eitoPriceTxt',
            '$filterReset': '.filter-reset',
            '$feeCheck': '#feesIncluded',
            '$sortByQty': '#qtyselector',
            '$sortByQtyTxt': '.qtyText',
            '$advFilterDropdown': '#filter-container .select-dropdown',
            '$sortfilterQtySelector': '#sortfilter-qty-selector',
            '$sortfilterQtySelectorMobile': '#qty_filter_mobile',
            '$sortfilterSelector': '#sortfilter-selector',
            '$priceSlider': '#price-slider',
            '$filterDropdownInputs': '#filter-dropdown li',
            '$deliveryFeature': '#delivery-cont .checkbox-icon',
            '$seatFeature': '#seatfeature-cont .checkbox-icon',
            '$qtySubt': '.qty-subt',
            '$qtyAdd': '.qty-add'
        },

        events: {
            'tap .filter-submit': 'closeFilters',
            'tap .filter-reset': 'reset',
            'keyup #eitoPriceTxt': 'updateMaxPrice',
            'change #eitoPriceTxt': 'updateMaxPrice',
            'keypress #eitoPriceTxt': 'validatePrice',
            'change #feesIncluded': 'feesIncluded',
            'change #qtyselector': 'applyQuantity',
            'change #qty_filter_mobile': 'applyQuantity',
            'mousedown #delivery-cont': 'handleFilter',
            'mousedown #seatfeature-cont': 'handleFilter',
            'click #delivery-dropdown > li': 'handleFilterCheckbox',
            'click #seatfeature-dropdown > li': 'handleFilterCheckbox',
            'click #delivery-done': 'handleFilterCloseButton',
            'click #seatfeature-done': 'handleFilterCloseButton',
            'click #delivery-x-done': 'handleFilterCloseButton',
            'click #seatfeature-x-done': 'handleFilterCloseButton',
            'focusout #filter-dropdown .dropdown-cont': 'handleFilterClose'
        },

        handleFilterCheckbox: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            // Fix focus out on checkbox click.
            var $target = $(evt.currentTarget),
                $targetChild = $target.find('.checkbox-icon'),
                $targetName = $targetChild.data('name'),
                $targetId = $targetChild.data('id'),
                $targetChecked = ($target.hasClass('selected')) ? 'de-selected' : 'selected',
                $checkList = [],
                categoryId = null,
                $selectedCb = null,
                $selectedCbId = null,
                $selectedCbLi = null,
                filterList = [],
                filterExcludeList = [],
                deliveryFilterList = [],
                seatFeatures = [],
                deliveryTypes = [],
                categorySelection = '',
                filterListCombined = [],
                filterExcludeListCombined = [],
                deliveryFilterListCombined = [],
                paramCount = 0,
                wasChecked = false;

            if (typeof $targetName === 'undefined') {
                return;
            }

            if ($targetName === 'seatfeature') {
                $checkList = this.uiEl.$seatFeature;
            } else {
                $checkList = this.uiEl.$deliveryFeature;
            }

            $checkList.each(function() {
                $selectedCb = $(this);
                $selectedCbId = $selectedCb.data('id');
                $selectedCbLi = $selectedCb.closest('li');

                if ($targetId === 0) {
                    $target.addClass('selected');

                    if ($selectedCbId !== $targetId) {
                        $selectedCbLi.removeClass('selected');
                    }
                } else {
                    if ($selectedCbId === 0) {
                        if ($selectedCbLi.hasClass('selected')) {
                            $selectedCbLi.removeClass('selected');
                        }
                    } else {
                        if ($targetId === $selectedCbId) {
                            if ($selectedCbLi.hasClass('selected')) {
                                wasChecked = true;
                                $selectedCbLi.removeClass('selected');
                            } else {
                                $selectedCbLi.addClass('selected');

                                if ($selectedCb.data('name') === 'seatfeature') {
                                    categoryId = $selectedCb.data('category-id');

                                    if (categoryId === 1) {
                                        filterExcludeList.push(categoryId);
                                    } else {
                                        filterList.push(categoryId);
                                    }
                                    seatFeatures.push($selectedCb.data('category'));
                                } else {
                                    deliveryFilterList.push($selectedCbId);
                                    deliveryTypes.push($selectedCb.data('category'));
                                }
                            }
                        } else {
                            if ($selectedCbLi.hasClass('selected')) {
                                if ($selectedCb.data('name') === 'seatfeature') {
                                    categoryId = $selectedCb.data('category-id');

                                    if (categoryId === 1) {
                                        filterExcludeList.push(categoryId);
                                    } else {
                                        filterList.push(categoryId);
                                    }
                                    seatFeatures.push($selectedCb.data('category'));
                                } else {
                                    deliveryFilterList.push($selectedCbId);
                                    deliveryTypes.push($selectedCb.data('category'));
                                }
                            }
                        }
                    }
                }
            });

            paramCount = seatFeatures.length + deliveryFilterList.length + deliveryTypes.length;

            if (paramCount === 0) {
                // No filters are selected, select All
                $($checkList[0]).closest('li').addClass('selected');
            }

            if (wasChecked && paramCount === 0 && $targetId === 0) {
                return;
            }

            categorySelection = $targetChild.data('category') + ' ' + $targetChecked;

            if ($targetName === 'seatfeature') { // For SeatTrait Feature
                if (filterList.length > 0) {
                    filterListCombined = filterList.join();
                    EventHelper.setUrlParam('categ', filterListCombined);
                } else {
                    EventHelper.removeUrlParam('categ');
                }

                if (filterExcludeList.length > 0) {
                    filterExcludeListCombined = filterExcludeList.join();
                    EventHelper.setUrlParam('excl', filterExcludeListCombined);
                } else {
                    EventHelper.removeUrlParam('excl');
                }

                this.model.set({
                    listingAttributeCategoryList: filterListCombined,
                    excludeListingAttributeCategoryList: filterExcludeListCombined,
                    lastchanged: 'filters'
                }, {});

                seatFeatures = seatFeatures.join(', ');

                EventHelper.track({
                    pageView: 'FilterView',
                    appInteraction: 'Seat Feature: ' + categorySelection,
                    pageload: false, filterType: 'Seat Features: ' + categorySelection,
                    userExperienceSnapshot: {seatFeatures: (seatFeatures !== '') ? 'Seat Features: ' + seatFeatures : 'Seat Features: All'}
                });
            } else { // For DeliveryType Feature
                if (deliveryFilterList.length > 0) {
                    deliveryFilterListCombined = deliveryFilterList.join();
                    EventHelper.setUrlParam('dt', deliveryFilterListCombined);
                } else {
                    EventHelper.removeUrlParam('dt');
                }

                this.model.set({
                    deliveryTypeList: deliveryFilterListCombined,
                    lastchanged: 'filters'
                }, {});

                deliveryTypes = deliveryTypes.join(', ');

                EventHelper.track({
                    pageView: 'FilterView',
                    appInteraction: 'Delivery Methods: ' + categorySelection,
                    pageload: false, filterType: 'Delivery Methods: ' + categorySelection,
                    userExperienceSnapshot: {deliveryTypes: (deliveryTypes !== '') ? 'Delivery Methods: ' + deliveryTypes : 'Delivery Methods: All'}
                });
            }
        },

        handleFilterCloseButton: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $origTarget = $(evt.currentTarget),
                seatOrDelivery = $origTarget.hasClass('seatfeature-done') ? 'Close Seat Features' : 'Close Delivery Methods';

            $origTarget.closest('.select-dropdown').hide();

            if (EventHelper.isMobile()) {
                $('#ticketlist-modal-overlay').remove();
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: seatOrDelivery, pageload: false});
        },

        handleFilter: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget),
                $origDropdown = $origTarget.closest('.dropdown-cont').find('.select-dropdown'),
                $origDropdownVisible = $origDropdown.is(':visible'),
                $target = $(evt.target),
                seatOrDelivery;

            if (!$origTarget.is(':focus')) {
                $origTarget.focus();
            }

            $origDropdown.toggle(0, function() {
                $(this).hide();
            }, function() {
                $(this).show();
                if (EventHelper.isMobile()) {
                    $(that.el).append(that.$clonedModal);
                }
            });

            seatOrDelivery = $origTarget.attr('id') === 'seatfeature-cont' ? 'Show Seat Features' : 'Show Delivery Methods';

            if($target.hasClass('seatfeature-header') || $target.hasClass('delivery-header')) {
                EventHelper.track({pageView: 'Advanced filter', appInteraction: seatOrDelivery, pageload: false});
            }
        },

        handleFilterClose: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $origTarget = $(evt.currentTarget);

            $origTarget.find('.select-dropdown').hide();

            if (EventHelper.isMobile()) {
                $('#ticketlist-modal-overlay').remove();
            }
        },

        setdeliveryTypes: function(deliveryObj) {
            var allObj = {
                    'category': i18n.get('event.common.all.text'),
                    'categoryId': 0,
                    'id': 0,
                    'description': i18n.get('event.common.all.text'),
                    'iconset': '',
                    'checked': 'true'
                },
                dtList = this.model.get('deliveryTypeList'),
                tempList = [],
                deliveryArray = deliveryObj.deliveryTypes;

            if (dtList.length > 0) {
                // initially on pageLoad, allObj checked is true & dtList has length 0.
                // so, if dtList has values, set allObj checked to false
                allObj.checked = 'false';
            }

            this.deliveryTypes = _.filter(deliveryArray, function(obj) {
                return obj.id && (tempList.indexOf(obj.id) === -1) && (tempList.push(obj.id));
            });

            _.each(this.deliveryTypes, function(obj) {
                obj.value = obj.id;
                obj.description = DeliveryHelper.getDeliveryTypeName(obj.id, obj.description);

                if (dtList.length > 0 && _.contains(dtList, obj.value.toString())) {
                    obj.checked = 'true';
                } else {
                    obj.checked = 'false';
                }

                if (obj.id === 2) {
                    obj.iconset = 'sh-iconset-instantdnld';
                }
            });

            this.deliveryTypes.sort(function(a, b) {
                if (a.description < b.description) {return -1;}
                if (a.description > b.description) {return 1;}
                return 0;
            });

            this.deliveryTypes.unshift(allObj);
            this.renderFilterView();
        },

        renderFilterView: function() {
            return this.render();
        },

        setSeatTraits: function(mySeats) {
            var allObj = {
                    'category': i18n.get('event.common.all.text'),
                    'categoryId': 0,
                    'id': 0,
                    'name': i18n.get('event.common.all.text'),
                    'iconset': '',
                    'checked': 'true'
                },
                tempList = [],
                seatTraitsList = this.model.get('listingAttributeCategoryList').concat(this.model.get('excludeListingAttributeCategoryList')),
                tempDesc = '';

            if (seatTraitsList.length > 0) {
                // initially on pageLoad, allObj checked is true & seatTraitsList has length 0.
                // so, if seatTraitsList has values, set allObj checked to false
                allObj.checked = 'false';
            }

            // 6 - aisle; 4 - parking; 2 - wheelchair; 1 - obstructed view.
            this.seatTraits = _.filter(mySeats.attributes.seatTraits, function(obj) {
                return obj.categoryId && (
                        obj.categoryId === 1 ||
                        obj.categoryId === 2 ||
                        obj.categoryId === 4 ||
                        obj.categoryId === 6) && (tempList.indexOf(obj.categoryId) === -1) && (tempList.push(obj.categoryId));
            });

            _.each(this.seatTraits, function(obj) {
                tempDesc = EventHelper.geti18n('event.filter.seatTraits.label.' + obj.categoryId);
                obj.category = (tempDesc ? tempDesc : obj.category);

                if (seatTraitsList.length > 0 && _.contains(seatTraitsList, obj.categoryId.toString())) {
                    obj.checked = 'true';
                } else {
                    obj.checked = 'false';
                }

                switch (obj.categoryId) {
                    case 1:
                        obj.iconset = 'sh-iconset-obstructed';
                        obj.value = 'obstructed';
                        break;
                    case 2:
                        obj.iconset = 'sh-iconset-handicap';
                        obj.value = 'handicap';
                        break;
                    case 4:
                        obj.iconset = 'sh-iconset-parking-2';
                        obj.value = 'parking';
                        break;
                    case 6:
                        obj.iconset = 'sh-iconset-aisleseat';
                        obj.value = 'aisleseat';
                        break;
                    default:
                        break;
                }
            });

            this.seatTraits.sort(function(a, b) {
                if (a.category < b.category) {return -1;}
                if (a.category > b.category) {return 1;}
                return 0;
            });

            this.seatTraits.unshift(allObj);

            if (!EventHelper.isDesktop()) {
                this.renderFilterView();
            }
        },

        show: function() {
            var self = this;

            clearTimeout(this.timer);

            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                this.$el.addClass('overlayAnimate').removeClass('hide');
                this.$body.addClass('overlay-active');
                this.publishEvent('filterView:displayed', {displayed: true});
            } else {
                this.publishEvent('filterView:displayed', {displayed: true});
                this.$el.slideDown(100, function() {
                    self.$el.removeClass('hide');
                    self.publishEvent('ticketlist:resize');
                });
            }
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var qty = evt.target.value;
            var filterType = 'Quantity';

            this.model.updateForQty({qty: qty});

            if (qty === '-1') {
                evt.target.text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
            }

            EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false});
        },

        hide: function() {
            var self = this;

            self.$el.slideUp(50, function() {
                self.$el.addClass('hide');
                self.publishEvent('filterView:hidden', {displayed: false});
                self.publishEvent('ticketlist:resize');
            });
        },

        displayUpdatedQuantity: function() {
            var qty = this.model.get('qty') || '-1';

            if (qty === '>5') {
                qty = '5+';
            }
            if(this.subViews.qtyFilter !== undefined) {
                this.subViews.qtyFilter.displaySelectedQty(qty);
            }
        },

        selectQty: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if(evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }
            var $currentTarget = $(evt.currentTarget),
                qtySelected = $currentTarget.data('value') || -1;

            if(this.model.get('qty') === qtySelected) {
                this.model.set('qty', -1);
                return;
            }
            this.model.updateForQty({qty: qtySelected});
            EventHelper.setUrlParam('qty', qtySelected);

            EventHelper.track({pageView: 'FilterView', appInteraction: 'Quantity', pageload: false});
        },

        reset: function(evt, params) {
            var qty,
                pageView = (!$.isEmptyObject(params) && params.pView) ? params.pView : 'FilterView',
                appInteraction = (!$.isEmptyObject(params) && params.appInter) ? params.appInter : 'Reset',
                $filterDDInputs;

            evt.stopPropagation();
            evt.preventDefault();

            // reset the filter text fields
            this.uiEl.$qtyIndex.removeClass('selectQty');
            this.uiEl.$eiFromPriceTxt.val('');
            this.uiEl.$eiToPriceTxt.val('');
            
            // setting false, as this is only for toggle experience
            // globals.PDO.withFees only being overwritten in toggle experience
            if (globals.PDO.showPdoExperience === globals.PDO.experience.TOGGLE) {
                // Uncheck price with Fees checkbox
                this.uiEl.$feeCheck.prop('checked', false);
                globals.PDO.withFees = false;
            }

            // reset the filter values for the api call
            if (gc.view === 'GA') {
                // GA - The user selects the quantity before seeing the tickets.
                // Hence whenever we reset the filters we do not want to reset the
                // QTY.
                // TBD: Check with UX/PO on what they want to do.
                qty = this.model.get('qty');
            }

            if (!$.isEmptyObject(params) && params.resetAll) {
                this.publishEvent('filter:resetQty');
            }

            this.uiEl.$filterDropdownInputs.each(function() {
                $filterDDInputs = $(this);

                if ($filterDDInputs.find('.checkbox-icon').data('id') === 0) {
                    $filterDDInputs.addClass('selected');
                } else {
                    if ($filterDDInputs.hasClass('selected')) {
                        $filterDDInputs.removeClass('selected');
                    }
                }
            });

            this.model.reset();
            // remove slidermin and slidermax for Non-GA & GA
            EventHelper.removeUrlParams(['sliderMin', 'sliderMax']);

            // Publish the event so that all the views can reset attributes/data as needed.
            this.publishEvent('filter:reset');

            EventHelper.track({pageView: pageView, appInteraction: appInteraction, pageload: false, userExperienceSnapshot: {
                quantity: (this.model.get('qty') !== '-1') ? ('Quantity: ' + this.model.get('qty')) : '',
                ticketId: '',
                priceSliderMin: '',
                priceSliderMax: '',
                PDO: '',
                deliveryTypes: '',
                deliveryMethods: '',
                seatFeatures: '',
                ticketRank: '',
                blendedListing: ''
            }});
        },

        closeFilters: function(evt) {
            var self = this;

            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            // For Table Desktop Close Price filter
            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                self.$el.slideUp(50, function() {
                    self.$el.addClass('hide');
                    self.publishEvent('filterView:hidden', {displayed: false});
                    self.publishEvent('ticketlist:resize');
                });
            } else {
                this.$body.removeClass('overlay-active');
                this.$el.addClass('hide').removeClass('overlayAnimate');
                this.publishEvent('filterView:hidden', {displayed: false});
                this.publishEvent('ticketlist:resize');
            }

            this.uiEl.$eiToPriceTxt.blur();

            if (globals.priceSlider.displayOutside && EventHelper.isMobile()) {
                // price slider inside sort filter
                $('#price-slider').addClass('hide-slider').removeClass('display-slider');
                this.uiEl.$feeOption.removeClass('slider-space');
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Close Filter', pageload: false});
        },

        // allow only 0-9 digits to Enter in max Price input field
        validatePrice: function(evt) {
            var key = evt.which,
                priceLen = $(evt.currentTarget).val().length;

            if (key !== 8 && ((key < 48 || key > 57) || priceLen > 5) && (priceLen > 5 || key !== 8)) {
                return false;
            }
        },

        // Only for Table/Desktop experience
        updateMaxPrice: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var self = this,
                maxPrice = $(evt.currentTarget).val(),
                priceLen = maxPrice.length,
                priceFieldFocus = this.uiEl.$eiToPriceTxt.is(':focus'),
                key = evt.which;

            if (!priceFieldFocus || typeof(key) === 'undefined') {
                return;
            }

            if (key !== 8 && ((key < 48 || key > 57) && (key < 95 || key > 106)) || priceLen > 5) {
                return;
            }

            if (self.priceFilterTimer) {
                clearTimeout(self.priceFilterTimer);
            }

            self.priceFilterTimer = setTimeout(function() {
                self.model.set({
                    maxPrice: ~~currencyFormatUtil.unFormatPrice(maxPrice),
                    lastchanged: 'filters'
                }, {});
                if (maxPrice !== '') {
                    EventHelper.setUrlParam('sliderMax', 0 + ',' + maxPrice);
                } else {
                    EventHelper.removeUrlParam('sliderMax');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: 'Max price', pageload: false, filterType: 'Selected Max Price: ' + maxPrice, userExperienceSnapshot: {priceSliderMax: 'Max Price: ' + maxPrice}});
            }, 1200);
        },

        feesIncluded: function(evt) {
            var $currentTarget = $(evt.currentTarget),
                checked = $currentTarget.is(':checked');
            if (checked) {
                EventHelper.setUrlParam('priceWithFees', checked);
                EventHelper.track({pageView: 'Toggle', appInteraction: (checked ? 'With fees' : 'Without fees'), pageload: false, userExperienceSnapshot: {PDO: 'Price With Fees'}});
            } else {
                EventHelper.removeUrlParam('priceWithFees');
                EventHelper.track({pageView: 'Toggle', appInteraction: (checked ? 'With fees' : 'Without fees'), pageload: false, userExperienceSnapshot: {PDO: 'Price Without Fees'}});
            }

            evt.stopPropagation();
            evt.preventDefault();

            this.model.updateForWithFees({withFees: checked});
        },

        toggleReset: function() {
            if (this.model.isFiltersApplied()) {
                this.uiEl.$filterReset.removeClass('hide');
            } else {
                this.uiEl.$filterReset.addClass('hide');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: FilterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return FilterView;
});
