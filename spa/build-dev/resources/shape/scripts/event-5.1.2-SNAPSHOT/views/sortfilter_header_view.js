/*global _ */
define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'models/filter_model',
    'views/price_slider_view',
    'globals',
    'global_context',
    'i18n'], function(Foobunny, Hammer, EventHelper, FilterModel, PriceSliderView, globals, gc, i18n) {
    'use strict';

    var SortFilterHeaderView = Foobunny.BaseView.extend({

        el: '#sortfilter_header',

        template: gc.appFolder + '/sortfilter_header',

        initialize: function() {
            console.log('--SortFilterHeaderView--  in initialize()', this);

            this.currentSort = null;

            if (globals.priceSlider.displayOutside === true && globals.priceSlider.enablePriceSlider[globals.TicketReco.showTicketReco]) {
                this.subViews = {
                    sliderView: new PriceSliderView()
                };
            }

            if (this.model.get('primarySort').split('+')) {
                this.pSort = this.model.get('primarySort').split('+');
                if (this.pSort.length > 1) {
                    switch (this.pSort[0]) {
                        case 'row':
                            this.currentSort = '.rowhdr';
                            break;
                        case 'sectionname':
                            this.currentSort = '.sectionhdr';
                            break;
                    }
                }
            }

            this.subscribeEvent('ticketlist:numberOfListings', this.numberOfListings);
            this.subscribeEvent('filterView:hidden', this.switchFilterIcon);
            this.subscribeEvent('recotooltip:show', this.displayValueBarTooltip);
            this.subscribeEvent('recotooltip:hide', this.hideValueBarTooltip);
            this.subscribeEvent('recotooltip:showmodal', this.displayModalValueBarTooltip);
            this.subscribeEvent('filter:resetQty', this.resetFilterQty);
        },

        modelEvents: {
            'change:qty': 'displayUpdatedQuantity',
            'change:withFees': 'updatePriceSortOptions'
        },

        events: {
            'change #qtyselector': 'applyQuantity',
            'click .sectionhdr': 'sortData',
            'click .rowhdr': 'sortData',
            'click .pricehdr': 'sortData',
            'mousedown #sortfilter-qty-dropdown li': 'applyQuantityDD',
            'click #sortfilter-qty-selector .sortfilter-title': 'handleFilterDD',
            'focusout #sortfilter-qty-selector .sortfilter-title': 'handleFilterCloseDD',
            'click #sortfilter-selector .sortfilter-filter-icon': 'openFilterTray',
            'click #sortfilter-selector .sortfilter-close-icon': 'closeFilterTray',
            'tap .lowestprice' : 'sortTabs',
            'tap .bestvalue' : 'sortTabs',
            'tap .bestseats' : 'sortTabs',
            'tap .closeTooltip': 'closeModalValueBarTooltip'
        },

        uiEl: {
            $sortBySection: '.sectionhdr',
            $sortByRows: '.rowhdr',
            $sortByPrice: '.pricehdr',
            $sortByQty: '#qtyselector',
            $sortByQtyTxt: '.qtyText',
            $feesIncluded: '#feesIncluded',
            $sortSelectionTitle: '#sortfilter-selection-title-cont',
            $sortQtyTitleTxt: '#sortfilter-qty-title',
            $applyQtyLiList: '#sortfilter-qty-dropdown li',
            $tabbar: '.tabbar',
            $tabButtons: '.tabbar button',
            $tabLowestPrice: '.tabbar .lowestprice',
            $tabBestValue: '.tabbar .bestvalue',
            $iconFilter: '#sortfilter-selector .sortfilter-filter-icon',
            $iconClose: '#sortfilter-selector .sortfilter-close-icon',
            $recoTooltip: '#recotooltip',
            $recoTooltipMessage: '#recotooltip .ttMessage',
            $recoTooltipClose: '.closeTooltip',
            $sortfilterQtyTitle: '#sortfilter-qty-title',
            $sortfilterQtyDropdown: '#sortfilter-qty-dropdown'
        },

        disableEvents: function() {
            if (globals.disableSorting[globals.TicketReco.showTicketReco]) {
                $(this.$el).off('click', '.sectionhdr');
                $(this.$el).off('click', '.rowhdr');
                $(this.$el).off('click', '.pricehdr');
            }
        },

        determineSortOptionTab: function() {
            var splitUrlSort,
                currentElement = '.bestvalue';

            if (!gc.urlSortOption) {
                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    return this.model.get('sortElement') || '.lowestprice';
                }
            }

            splitUrlSort = gc.urlSortOption.split('+');

            this.uiEl.$tabButtons.removeClass('selected');

            // sortfilter_header_dropdown has only currentPrice for 'data-sort-value'
            if (splitUrlSort[0] === 'listingPrice' || splitUrlSort[0] === 'price') {
                splitUrlSort[0] = 'currentPrice';
            }

            currentElement = this.uiEl.$tabButtons.filter('[data-sort-value^="' + splitUrlSort[0] + '"]').addClass('selected');

            return currentElement;
        },

        afterRender: function() {
            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                this.currentSort = this.determineSortOptionTab();
                this.$el.addClass('valuebar');
            }

            // PDO may have changed the priceType during initialization. Update the DOM
            // based on the current withFees value.
            this.updatePriceSortOptions(this.model, this.model.get('withFees'));

            this.disableEvents();
        },

        resetFilterQty: function() {
            EventHelper.removeUrlParam('qty');

            if (this.uiEl.$sortByQty.length > 0) {
                if (gc.isAddParking) {
                    EventHelper.setUrlParam('qty', '1');
                    this.uiEl.$sortByQty.val('1');
                    this.uiEl.$sortByQtyTxt.text('1').parent().addClass('applyQuantity');
                } else {
                    this.uiEl.$sortByQty.val('-1');
                    this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');
                }
            } else {
                var qtyText = this.uiEl.$applyQtyLiList.eq(0).data('qty-title');
                this.uiEl.$applyQtyLiList.removeClass('selected');
                this.uiEl.$applyQtyLiList.eq(0).addClass('selected');
                this.uiEl.$sortfilterQtyTitle.text(qtyText);
            }

        },

        openFilterTray: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.switchFilterIcon(false);
            this.publishEvent('filter:show');

            if (!globals.priceSlider.displayOutside && (EventHelper.isDesktop() || EventHelper.isTablet())) {
                $('.recoExpSlider').addClass('slider-top');
            }

            if (globals.priceSlider.displayOutside && EventHelper.isMobile()) {
                $('#price-slider').removeClass('hide-slider').addClass('display-slider');
                $('#filter-container .fee-option').addClass('slider-space');
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Show Filter', pageload: false});
        },

        closeFilterTray: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.switchFilterIcon(true);
            this.publishEvent('filter:hide');
        },

        switchFilterIcon: function(show) {
            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                return;
            }

            show = (show === undefined ? true : show);

            if (show) {
                this.uiEl.$iconClose.addClass('hide');
                this.uiEl.$iconFilter.removeClass('hide');
            } else {
                this.uiEl.$iconFilter.addClass('hide');
                this.uiEl.$iconClose.removeClass('hide');
            }
        },

        handleFilterDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget);

            $origTarget.parent().find('.select-dropdown').toggle(0, function() {
                if ($(this).is(':visible')) {
                    that.uiEl.$sortSelectionTitle.removeClass('canHover');
                } else {
                    that.uiEl.$sortSelectionTitle.addClass('canHover');
                }
            });
        },

        handleFilterCloseDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget);

            $origTarget.parent().find('.select-dropdown').hide();
            that.uiEl.$sortSelectionTitle.addClass('canHover');
        },

        applyQuantityDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget),
                qty = $origTarget.attr('data-value'),
                qtyTitle = $origTarget.attr('data-qty-title'),
                $qtyHeader = this.uiEl.$sortQtyTitleTxt,
                filterType = 'Quantity';

            this.uiEl.$applyQtyLiList.removeClass('selected');
            $origTarget.addClass('selected');
            $origTarget.closest('.select-dropdown').hide(0, function() {
                if (!that.uiEl.$sortSelectionTitle.hasClass('canHover')) {
                    that.uiEl.$sortSelectionTitle.addClass('canHover');
                }
            });

            this.model.updateForQty({
                qty: qty
            });

            if (qty === '-1') {
                filterType = 'Removed Quantity';
                qtyTitle = i18n.get('event.common.sortfilter.selector.quantity.alltickets.text');
                this.uiEl.$sortQtyTitleTxt.removeClass('no-blue');
                EventHelper.removeUrlParam('qty');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: ''}});
            } else {
                EventHelper.setUrlParam('qty', qty);
                this.uiEl.$sortQtyTitleTxt.addClass('no-blue');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: 'Quantity: ' + qty}});
            }

            $qtyHeader.text(qtyTitle);
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var qty = this.uiEl.$sortByQty.val(),
                filterType = 'Quantity';

            //preserveFilters Qty
            if (qty !== '-1') {
                EventHelper.setUrlParam('qty', qty);
            } else {
                EventHelper.removeUrlParam('qty');
            }

            this.model.updateForQty({
                qty: qty
            });

            //show quantity selected on the label
            if (qty === '-1') {
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');
                filterType = 'Removed Quantity';
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: ''}});
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: 'Quantity: ' + qty}});
            }
        },

        displayUpdatedQuantity: function(model, params) {
            var qty = model.get('qty'),
                qtyText = this.uiEl.$sortfilterQtyDropdown.find("[data-value='"+ qty +"']").attr('data-qty-title');

            if (qty === '>5') {
                qty = ('5+');
            }

            if (qty > '0') {
                this.uiEl.$sortByQty.val(qty);
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
                this.uiEl.$applyQtyLiList.first().removeClass('selected');
                this.uiEl.$sortfilterQtyDropdown.find("[data-value='"+ qty +"']").addClass('selected');
                this.uiEl.$sortfilterQtyTitle.html(qtyText);
            } else {
                this.uiEl.$sortByQty.val('-1');
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');

                // For experice Ticket Reco Version C,D,E
                this.uiEl.$applyQtyLiList.removeClass('selected');
                this.uiEl.$applyQtyLiList.first().addClass('selected');
                this.uiEl.$sortQtyTitleTxt.text(i18n.get('event.common.sortfilter.selector.quantity.alltickets.text'));
            }
            this.uiEl.$sortByQty.val(qty);
        },

        sortData: function(evt) {
            evt.stopPropagation();

            var $sortElem = $(evt.currentTarget),
                sortField = $sortElem.attr('data-sort'),
                sortValue = $sortElem.attr('data-sort-value'), //preserveFilters for sortState
                sortObject = _.extend({}, this.getSortOptions($sortElem, false), {
                    lastchanged: 'sortOptions'
                }),

                sortDirection = sortObject.sortDirection,
                sortTracking = $sortElem.attr('data-tracking-prefix');

            this.currentSort = evt.currentTarget;

            EventHelper.setUrlParam('sort', sortValue + '+' + sortDirection); //preserve sortState

            this.resetElems(sortField);
            this.updateDirection($sortElem, sortField, sortDirection);

            this.model.updateForSorting(sortObject);

            if (sortField !== 'value') {
                EventHelper.track({
                    pageView: 'Filter Header',
                    appInteraction: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                    pageload: false,
                    filterType: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                    userExperienceSnapshot: {sortTab: sortValue + ' ' + (sortDirection === 'asc' ? 'asc' : 'desc')}
                });
            }
        },

        getSortOptions: function($sortElem, preserveSort) {
            var sortField = $sortElem.attr('data-sort'),

                // Secondary sort is always going to be price in ascending order.
                priceValue = this.uiEl.$sortByPrice.attr('data-sort-value'),
                priceDirection = 'asc',
                secSortValue = priceValue,
                secSortDirection = priceDirection,
                priSortValue = $sortElem.attr('data-sort-value') || priceValue,
                priSortDirection = 'asc';

            if (preserveSort) {
                priSortDirection = $sortElem.attr('data-sort-direction');
            } else {
                priSortDirection = ($sortElem.attr('data-sort-direction') === 'asc' ? 'desc' : 'asc');
            }

            //RITESH: Re-factor condition check.
            if (globals.TicketReco.showTicketReco !== globals.TicketReco.experience.DEFAULT) {
                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    if (sortField === 'price') {
                        secSortValue = this.uiEl.$tabBestValue.attr('data-sort-value');
                        secSortDirection = this.uiEl.$tabBestValue.attr('data-sort-direction');
                    } else {
                        secSortValue = priceValue;
                        secSortDirection = priceDirection;
                    }
                }
            }

            return {
                priceType: priceValue,
                sortField: sortField,
                primarySort: priSortValue + '+' + priSortDirection,
                secondarySort: secSortValue + '+' + secSortDirection,
                sortDirection: priSortDirection
            };
        },

        updateDirection: function($sortElem, sortField, sortDirection) {
            var $arrowElem = $sortElem.find('.dropdownArrow');

            if (sortDirection === 'asc') {
                $arrowElem.addClass('upArrow');
            } else {
                $arrowElem.removeClass('upArrow');
            }
            $sortElem.attr('data-sort-direction', sortDirection);
        },

        resetElems: function(sortField) {
            this.uiEl.$sortBySection.find('.dropdownArrow').removeClass('upArrow');
            this.uiEl.$sortByRows.find('.dropdownArrow').removeClass('upArrow');

            this.uiEl.$sortBySection.attr('data-sort-direction', 'desc');
            this.uiEl.$sortByRows.attr('data-sort-direction', 'desc');

            if (sortField !== 'price') {
                this.uiEl.$sortByPrice.find('.dropdownArrow').addClass('upArrow');
                this.uiEl.$sortByPrice.attr('data-sort-direction', 'asc');
            }
        },

        numberOfListings: function(nbr) {
            if (nbr === 0) {
                if (this.model.isFiltersApplied()) {
                    this.$el.removeClass('hide');
                    this.uiEl.$tabbar.removeClass('invisible');
                } else {
                    this.$el.addClass('hide');
                }
            } else {
                this.$el.removeClass('hide');

                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    this.uiEl.$tabbar.removeClass('invisible');
                }
            }
        },

        updatePriceSortOptions: function(model, withFees) {
            console.log('Model Changed: updatePriceSortOptions');

            var value = (withFees ? 'CURRENT' : 'LISTING'),
                sortObject, sortDirection, sortField;

            //RITESH: Re-factor code.
            if (globals.TicketReco.showTicketReco !== globals.TicketReco.experience.DROPDOWN) {
                this.uiEl.$sortByPrice.attr('data-sort-value', globals.price_type[value]);

                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    this.uiEl.$tabLowestPrice.attr('data-sort-value', globals.price_type[value]);
                }
            }

            sortObject = this.getSortOptions($(this.currentSort || '.pricehdr'), true);
            sortDirection = sortObject.sortDirection;
            sortField = sortObject.sortField;

            this.resetElems(sortField);
            this.updateDirection($(this.currentSort), sortField, sortDirection);

            this.model.setSilent(sortObject);
        },

        updatePriceAttribute: function(withFees) {
            var value = (withFees ? 'CURRENT' : 'LISTING');
            this.uiEl.$sortByPrice.attr('data-sort-value', globals.price_type[value]);
        },

        sortTabs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $sortElem = $(evt.currentTarget),
                sortField = $sortElem.attr('data-sort'),
                sortValue = $sortElem.attr('data-sort-value'),
                sortObject = _.extend({}, this.getSortOptions($sortElem, true), {
                    lastchanged: 'sortOptions'
                }),
                sortDirection = sortObject.sortDirection,
                sortTracking = $sortElem.attr('data-tracking-prefix');

            // Update the look of the elements
            this.uiEl.$tabButtons.removeClass('selected');
            $sortElem.addClass('selected');

            this.currentSort = evt.currentTarget;

            if (sortField === 'price') {
                sortValue = this.uiEl.$sortByPrice.attr('data-sort-value');
            }

            EventHelper.setUrlParam('sort', sortValue + '+' + sortDirection);

            this.model.updateForSorting(sortObject);

            EventHelper.track({
                pageView: 'Filter Header',
                appInteraction: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                pageload: false,
                filterType: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                userExperienceSnapshot: {sortTab: sortValue + ' ' + (sortDirection === 'asc' ? 'asc' : 'desc')}
            });
        },

        displayValueBarTooltip: function(currentTarget) {
            var currTgt = $(currentTarget),
                elemOffset = currTgt.offset(),
                elemHeight = currTgt.height(),
                elemWidth = currTgt.width(),
                tooltipOffset = {},
                winHeight = $(window).height(),
                tooltipHeight = 180,
                tooltipWidth = 280,
                arrowHeight = 15,
                ttArrowUp = 'tt-arrow-up',
                ttArrowDown = 'tt-arrow-down',
                ttAddArrowClass = ttArrowUp,
                ttRemoveArrowClass = ttArrowDown;

            if (!this.uiEl.$recoTooltip || this.uiEl.$recoTooltip.hasClass('modal')) {
                return;
            }

            // Check if the hover point is near the bottom. If yes, then display the tooltip on the top.
            if (elemOffset.top + elemHeight + tooltipHeight + arrowHeight > (winHeight - 50)) {
                ttAddArrowClass = ttArrowDown;
                ttRemoveArrowClass = ttArrowUp;
                tooltipOffset.top = elemOffset.top - tooltipHeight - arrowHeight;
            } else {
                ttAddArrowClass = ttArrowUp;
                ttRemoveArrowClass = ttArrowDown;
                tooltipOffset.top = elemOffset.top + elemHeight + arrowHeight;
            }
            tooltipOffset.left = (elemOffset.left + (elemWidth / 2)) - tooltipWidth;

            // Position and Show
            this.uiEl.$recoTooltipClose.addClass('hide');
            this.uiEl.$recoTooltipMessage.removeClass(ttRemoveArrowClass).addClass(ttAddArrowClass).show();
            this.uiEl.$recoTooltip.css(tooltipOffset).show();
        },

        hideValueBarTooltip: function() {
            if (!this.uiEl.$recoTooltip || this.uiEl.$recoTooltip.hasClass('modal')) {
                return;
            }

            this.uiEl.$recoTooltip.hide();
        },

        displayModalValueBarTooltip: function(currentTarget) {
            $('body').addClass('overlay-active');
            this.uiEl.$recoTooltipClose.removeClass('hide');
            this.uiEl.$recoTooltipMessage.removeClass('tt-arrow-up tt-arrow-down').show();
            this.uiEl.$recoTooltip.css({top: '', left: ''}).addClass('overlayAnimate modal').show();

            EventHelper.track('Tooltip', 'Show best value tooltip', false);
        },

        closeModalValueBarTooltip: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            $('body').removeClass('overlay-active');
            this.uiEl.$recoTooltip.removeClass('overlayAnimate modal').hide();
            this.uiEl.$recoTooltipMessage.hide();
            this.uiEl.$recoTooltipClose.addClass('hide');
            EventHelper.track('Tooltip', 'Close best value tooltip', false);
        },

        context: function() {
            return {
                globals: globals,
                sortArrows: (!globals.disableSorting[globals.TicketReco.showTicketReco]),
                sortBy: this.pSort[0],
                sortDir: this.pSort[1]
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SortFilterHeaderView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return SortFilterHeaderView;
});
