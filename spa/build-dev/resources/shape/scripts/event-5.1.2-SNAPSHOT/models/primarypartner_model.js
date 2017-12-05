define([
    'foobunny',
    'global_context'
], function(Foobunny, gc) {

    'use strict';

    var PrimaryPartnerModel = Foobunny.BaseModel.extend({
        defaults: {
            isPartner: false,
            designation: ''
        },

        initialize: function() {
            this.urlHeaders = gc.url_headers || {};
        }
    });

    return PrimaryPartnerModel;

});
