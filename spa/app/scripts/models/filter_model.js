define([
    'foobunny',
    'globals',
    'global_context',
    'helpers/event_helper'
    ], function(Foobunny, globals, gc, EventHelper) {

    'use strict';

    var globalModelName = 'FilterModel',
        mediator = Foobunny.mediator;

    var FilterModel = Foobunny.BaseModel.extend({
        defaults: {
            lastchanged: 'initial',
            qty: '-1',
            qtyMax: globals.quantityOverlay.quantityBtnMaxCount,
            minPrice: -1,
            maxPrice: -1,
            sections: [],
            zones: [],
            sectionStats: true,
            zoneStats: true,
            rowStart: 0,
            ticketRecommendation: true,
            seeMoreLink: true,
            startInterval: 20,
            filterApplied: false,
            zonesEnabled: false,  /* Set to true if zone selections are enabled in maps */
            sortField: 'price',
            secondarySort: null,
            listingAttributeCategoryList: [],
            excludeListingAttributeCategoryList: [],
            deliveryTypeList: [],
            allSectionZoneStats: true,
            eventLevelStats: true,
            quantitySummary: true
        },

        filterAppliedAttributes: ['qty', 'minPrice', 'maxPrice', 'withFees', 'listingAttributeCategoryList', 'excludeListingAttributeCategoryList', 'deliveryTypeList'],
        filterUrlParams: ['qty', 'minPrice', 'maxPrice', 'priceWithFees', 'categ', 'excl', 'dt'],

        initialize: function() {
            this.fetchPromise = Foobunny.utils.resolvedPromise();
            mediator.publishEvent('app:addStartPromise', this.fetchPromise);

            this.on('change', function() {
                console.log('Filter Model Changed:' + JSON.stringify(this.changedAttributes()));
            });
            // Future Change: Figure out how to get rid of the lastchanged attribute.
            // Once the lastchanged attribute has been sorted, re-visit the model functions toc
            // combine them.
            this.on('change:withFees change:lastchanged', this.resetForNewTicketList);

        },

        // Reset should only reset the items that are inside the advanced filters section.
        reset: function() {
            var newAttributes = {},
                attr,
                i = 0,
                len = this.filterAppliedAttributes.length,
                removeParams = [];

            for (i = 0; i < len; i++) {
                attr = this.filterAppliedAttributes[i];
                if (attr === 'qty' && gc.view === 'GA') {
                    continue;
                }
                if (this.defaults[attr] !== this.attributes[attr]) {
                    newAttributes[attr] = this.defaults[attr];
                    removeParams.push(this.filterUrlParams[i]);
                }
            }
            EventHelper.removeUrlParams(removeParams);
            if (gc.isAddParking) {
                EventHelper.setUrlParam('qty', '1');
                newAttributes.qty = '1';
            }
            newAttributes.reset = true;
            this.set(newAttributes);
        },

        resetSections: function() {
            if (this.get('zonesEnabled')) {
                this.set('zones', []);
            } else {
                this.set('sections', []);
            }
        },

        isFiltersApplied: function() {
            // Check the current attributes against the default attributes.
            // If any one of them is different then filters have been applied.
            var filtersApplied = false,
                attr,
                i = 0,
                len = this.filterAppliedAttributes.length;

            for (i = 0; i < len; i++) {
                attr = this.filterAppliedAttributes[i];
                if (attr === 'qty' && this.resetQty()) {
                    continue;
                }

                if (this.defaults[attr] !== this.attributes[attr]) {
                    if (typeof this.attributes[attr] === 'object') {
                        if (this.attributes[attr].length === 0) {
                            continue;
                        }
                    }
                    // Price slider values will never return to default of -1 ... need special handler.
                    // Occassionally 0 is returned for minPrice.
                    if ((attr === 'minPrice' || attr === 'maxPrice') && this.get('minPrice') <= this.get('sliderMinValue') && this.get('maxPrice') === 0) {
                        continue;
                    }
                    console.log('Filters Applied:' + attr + ': ' + this.defaults[attr] + ' ==> ' + this.attributes[attr]);
                    filtersApplied = true;
                    break;
                }
            }

            return filtersApplied;
        },

        resetQty: function() {
            return gc.view === 'GA';
        },

        // Move the updating of the attributes based on what changes over here.
        resetForNewTicketList: function(model, lastchanged) {
            // Update the filter model based on where the model was changed from. Doing this in
            // one place since there are many other places this is being done from and most
            // importantly we do not want to raise another change event with this action.
            if (lastchanged === 'qty' ||
                lastchanged === 'section-selected' ||
                lastchanged === 'section-deselected' ||
                lastchanged === 'filters') {
                model.setSilent({
                    rowStart: 0,
                    sectionStats: true,
                    zoneStats: true,
                    sortByPrice: 'desc',
                    sortBySection: null,
                    sortByRows: null
                });
            }
        },

        // Update the withFees related fields since the data is only available
        // after the MBOX call is done or when AB Test status has been determined.
        updateDefaultsForWithFees: function(withFees) {
            var priceType = (withFees ? globals.price_type.CURRENT : globals.price_type.LISTING);
            this.defaults.withFees = withFees;
            this.defaults.primarySort = gc.urlSortOption ? gc.urlSortOption : (priceType + '+asc');

            this.set({
                lastchanged: 'initial',
                withFees: this.defaults.withFees,
                priceType: priceType,
                priceSort: priceType,
                primarySort: this.defaults.primarySort
            });
        },

        updateForQty: function(attr, options) {
            var newAttributes = _.extend({}, attr, {lastchanged: 'filters'});
            this.set(newAttributes, options);
        },

        updateForWithFees: function(attr, options) {
            var withFees = attr.withFees,
                priceType = (withFees ? globals.price_type.CURRENT : globals.price_type.LISTING);

            globals.PDO.withFees = withFees;

            this.set({
                lastchanged: 'filters',
                withFees: withFees,
                priceType: priceType,
                priceSort: priceType
            }, options);
        },

        updateForSorting: function(attr, options) {
            var newAttributes = _.extend({}, attr, {
                rowStart: 0,
                sectionStats: false,
                zoneStats: false
            });
            this.set(newAttributes, options);
        },

        updateForLoadMore: function(attr, options) {
            var newAttributes = _.extend({}, attr, {
                    lastchanged: 'start',
                    rowStart: this.get('rowStart') + this.get('startInterval'),
                    sectionStats: false,
                    zoneStats: false
                });
            this.set(newAttributes, options);
        }
    });

    mediator.subscribeEvent('app:init:start', getInstance);

    function getInstance() {
        var singleton = FilterModel.prototype._singleton;
        if (!singleton) {
            singleton = new FilterModel();
            FilterModel.prototype._singleton = singleton;
            delete FilterModel.prototype.disposed;
            mediator.registerObject(globalModelName, singleton);
            mediator.publishEvent(globalModelName + ':instanceCreated', singleton);
        }
        return singleton;
    }

    return FilterModel.prototype._singleton;

});
