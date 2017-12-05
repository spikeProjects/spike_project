/* global _ */
define([
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var BuyerCostModel = Foobunny.BaseModel.extend({
        initialize: function() {
            console.log('--BuyerCostModel-- initilize');
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
        },

        url: function() {
            return '/shape/pricing/aip/v1/buyercost';
        }
    });
    return BuyerCostModel;
});
