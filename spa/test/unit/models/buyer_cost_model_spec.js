define(['models/buyer_cost_model'], function(BuyerCostModel) {
    describe('Buyer Cost Model', function() {
        var subModels = {
            BuyerCostModel : new BuyerCostModel()
        };

        it('should define BuyerCostModel', function() {
            expect(BuyerCostModel).not.toBe(null);
        });

        it('should call fetch successfully', function() {
            spyOn(subModels.BuyerCostModel, 'fetch');

            subModels.BuyerCostModel.fetch();

            expect(subModels.BuyerCostModel.fetch).toHaveBeenCalled();
        });

        it('should call url and return value successfully', function() {
            spyOn(subModels.BuyerCostModel, 'url').and.callThrough();

            var result = subModels.BuyerCostModel.url();

            expect(subModels.BuyerCostModel.url).toHaveBeenCalled();
            expect(result).toEqual('/shape/pricing/aip/v1/buyercost');
        });
    });
});
