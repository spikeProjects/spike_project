define([
    'foobunny',
    'global_context'
    ], function(Foobunny, gc) {

    'use strict';

    // The Sell API hosts this API and returns the url to the partner's web page.
    var PrimaryPartnerIntegrationModel = Foobunny.BaseModel.extend({
        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {});
        },

        url: function() {
            return '/shape/partnerintegration/partnerevents/v1/' + gc.event_id;
        }
    });

    return PrimaryPartnerIntegrationModel;

});
