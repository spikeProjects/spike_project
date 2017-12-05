define([
    'foobunny',
    'global_context',
    'underscore'
    ], function(Foobunny, gc, _) {

    'use strict';

    var BsfModel = Foobunny.BaseModel.extend({

        parse: function(response) {
            var seller = response.businessSellerInfo,
                locale = SH.locale,
                notes = seller.notes,
                addInfo = '',
                returnPolicy = '',
                termsCondition = '';

            _.each(notes, function(note) {
                if (note.locale.toLowerCase().replace('_', '-') === locale) {
                    addInfo = note.noteText;
                    returnPolicy = note.returnPolicyText;
                    termsCondition = note.termsConditionText;
                    return false;
                }
            });

            seller.addInfo = addInfo;
            seller.returnPolicy = returnPolicy;
            seller.termsCondition = termsCondition;

            return seller;
        },

        initialize: function() {
            this.urlHeaders = gc.url_headers || {};
        },

        url: function() {
            return '/shape/user/business/v1/' + this.get('businessGuid');
        }
    });

    return BsfModel;

});
