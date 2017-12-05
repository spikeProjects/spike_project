define(['models/inventory_metadata_model', 'global_context'], function(InventoryMetadataModel, gc) {
    describe('Inventory Metadata Model', function() {
        'use strict';
        var subModels = {
            InventoryMetadataModel: new InventoryMetadataModel()
        };

        it('should define InventoryMetadataModel', function() {
            expect(InventoryMetadataModel).not.toBe(null);
        });

        it('should call fetch successfully', function() {
            spyOn(subModels.InventoryMetadataModel, 'fetch');
            subModels.InventoryMetadataModel.fetch();
            expect(subModels.InventoryMetadataModel.fetch).toHaveBeenCalled();
        });

        it('should call url and return value successfully', function() {
            spyOn(subModels.InventoryMetadataModel, 'url').and.callThrough();
            var result = subModels.InventoryMetadataModel.url();
            expect(subModels.InventoryMetadataModel.url).toHaveBeenCalled();
            expect(result).toEqual('/shape/catalog/events/v1/' + gc.event_id + '/metadata/inventoryMetaData');
        });

        it('should check cache property and should be defined', function() {
            var cacheProp = subModels.InventoryMetadataModel;
            expect(cacheProp.cache).toBeDefined();
        });
    });
});
