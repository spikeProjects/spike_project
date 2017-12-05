define(['collections/inventory_collection', 'global_context', 'globals', 'filterModelData'],
    function(InventoryCollection, gc, globals, filterModelData, invResponse) {
    describe('Inventory Collection', function() {
        'use strict';

        var inventoryCollection = null,
            eventId = 9390045;

        beforeEach(function() {
            inventoryCollection = new InventoryCollection(eventId);
            globals.inventoryCollection.searchType = globals.inventoryCollection.search.DEFAULT;
            globals.inventoryCollection.blendedIndicator = false;
        });

        it('should define InventoryCollection', function() {
            expect(inventoryCollection).not.toBe(null);
        });

        describe('prepareAPIUrl function', function() {

            it('should call prepareAPIUrl with data', function() {
                spyOn(inventoryCollection, 'prepareAPIUrl').and.callThrough();

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.prepareAPIUrl).toHaveBeenCalled();
            });

            it('should call prepareAPIUrl with data and view set to GA', function() {
                spyOn(inventoryCollection, 'prepareAPIUrl').and.callThrough();

                gc.view = 'GA';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.prepareAPIUrl).toHaveBeenCalled();
            });

            it('should return blended url', function() {
                spyOn(inventoryCollection, 'getUrl');

                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.getUrl).toHaveBeenCalled();
            });

            it('should handled blended parameter list formatting', function() {
                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;
                gc.view = 'NON-GA';

                inventoryCollection.prepareAPIUrl(filterModelData);
            });

            it('should set zonesEnabled with a list of zone ids', function() {
                filterModelData.zonesEnabled = true;
                filterModelData.zones = ['9054', '9055'];

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/zoneIdList=9054,9055/);
            });

            it('should set section with a list of section ids', function() {
                filterModelData.sections = ['39287', '39289'];
                filterModelData.zonesEnabled = false;

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/sectionIdList=39287,39289/);
            });

            it('should set quantity parameter', function() {
                filterModelData.qty = '5+';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/quantity=>5/);
            });

            it('should set minPrice and maxPrice parameter', function() {
                filterModelData.minPrice = '51';
                filterModelData.maxPrice = '355';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/pricemin=51&pricemax=355/);
            });

            it('should set blendedAlgoId parameter', function() {
                filterModelData.blendedAlgoId = '35';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/blendedAlgoId=35/);
            });

            it('should set listingAttributeCategoryList parameter', function() {
                filterModelData.listingAttributeCategoryList = ['6', '4'];

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/listingAttributeCategoryList=6,4/);
            });

            it('should set excludeListingAttributeCategoryList parameter', function() {
                filterModelData.excludeListingAttributeCategoryList = ['1'];

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/excludeListingAttributeCategoryList=1/);
            });

            it('should set deliveryTypeList parameter', function() {
                filterModelData.deliveryTypeList = ['1', '2'];

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/deliveryTypeList=1,2/);
            });

            it('should set valuePercentage parameter', function() {
                globals.TicketReco.showTicketReco = globals.TicketReco.experience.VALUEBARLOWEST

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/valuePercentage=true/);
            });

            it('should change primarySort quantity value to price', function() {
                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;
                filterModelData.priceType = 'quantity';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/price\+asc/);
            });

            it('should update currentPrice priceType to bundledPrice', function() {
                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;
                filterModelData.primarySort = 'currentPrice+asc';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/priceType=bundledPrice/);
            });

            it('should update secondarySort listingPrice to nonBundledPrice', function() {
                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;
                filterModelData.primarySort = "quality+desc";
                filterModelData.secondarySort = 'listingPrice+asc';

                inventoryCollection.prepareAPIUrl(filterModelData);

                expect(inventoryCollection.url).toMatch(/priceType=nonBundledPrice/);
            });

            it('should return blended link url', function() {
                var link = '/shape/search/inventory/v2/listings/?eventId=9390045&sectionStats=false&zoneStats=false&start=0&allSectionZoneStats=false&eventLevelStats=false&sectionIdList=39287,39289&quantity=>5&pricemin=51&pricemax=355&blendedAlgoId=35&rows=20&sort=quality+desc,price+asc&listingAttributeCategoryList=6,4&excludeListingAttributeCategoryList=1&deliveryTypeList=1,2&priceType=bundledPrice&valuePercentage=true';

                globals.inventoryCollection.searchType = globals.inventoryCollection.search.BLENDED;
                globals.inventoryCollection.blendedIndicator = true;

                inventoryCollection.prepareAPIUrl(filterModelData);
                console.log('url: ', inventoryCollection.url);
                console.log('link: ', link);
                expect(inventoryCollection.url).toEqual(link);
            });

            it('should return search inventory link url', function() {
                var link = '/shape/search/inventory/v2/?eventId=9390045&sectionStats=false&zoneStats=false&start=0&allSectionZoneStats=false&eventLevelStats=false&sectionIdList=39287,39289&quantity=>5&pricemin=51&pricemax=355&blendedAlgoId=35&rows=20&sort=quality+desc,price+asc&listingAttributeCategoryList=6,4&excludeListingAttributeCategoryList=1&deliveryTypeList=1,2&priceType=bundledPrice&valuePercentage=true';

                globals.inventoryCollection.searchType = globals.inventoryCollection.search.DEFAULT;
                globals.inventoryCollection.blendedIndicator = false;

                inventoryCollection.prepareAPIUrl(filterModelData);
                expect(inventoryCollection.url).toEqual(link);
            });
        });

        describe('Response', function() {
            var resp;
            beforeEach(function() {
                resp = null;

                spyOn(inventoryCollection, 'fetch').and.returnValue(invResponse);
            });

            it('should fetch results', function() {
                spyOn(inventoryCollection, 'prepareAPIUrl').and.callThrough();

                inventoryCollection.prepareAPIUrl(filterModelData);
                resp = inventoryCollection.fetch();

                expect(inventoryCollection.prepareAPIUrl).toHaveBeenCalled();
                expect(resp).not.toBeNull();
                expect(resp).toEqual(invResponse);
            });

        });
    });
});