define([
    'foobunny'
], function(Foobunny) {
    'use strict';

    var EventDisclosureModel = Foobunny.BaseModel.extend({

        initialize: function() {
            this.subscribeEvent('eventdisclosure:available', this.disclosuresReady);
        },

        disclosuresReady: function(alertMessage) {
            this.set('alertMessage', alertMessage);
        }
    });
    return EventDisclosureModel;
});
