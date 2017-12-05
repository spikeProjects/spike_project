define([
    'foobunny',
    'global_context'
], function(Foobunny, gc) {

    'use strict';

    var PerformerModel = Foobunny.BaseModel.extend({
        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {});
        },

        setPerformerId: function(performerId) {
            this.url = '/shape/catalog/performers/v3/' + performerId + '/?mode=internal';
        },

        parse: function(result) {
            var protocolPrefix = window.location.protocol + '//',
                partnerObject;

            // publish performers api response to globalContextVars
            if (result) {
                this.publishEvent('module:globalcontextvars:apiresponseready', {APIName: 'performers', data: result});
            }

            if (result.teamColors && result.teamColors[0] && result.teamColors[0].hexCode && result.teamColors[0].hexCode !== '') {
                result.primaryPerformerColor = result.teamColors[0].hexCode;
            }

            if (result.attributes) {
                result.isPartner = result.isHost = false;
                if (result.attributes.sell.host) {
                    partnerObject = result.attributes.sell.host;
                    result.isPartner = partnerObject.isInventorySupported || false;
                    result.isHost = true;
                    result.partnerLogo = null;
                    result.performerLogo = protocolPrefix + partnerObject.imageURL;
                } else if (result.attributes.sell.partner) {
                    partnerObject = result.attributes.sell.partner;
                    result.isPartner = partnerObject.isOfficialPartner || false;
                    result.isHost = false;
                    result.partnerLogo = protocolPrefix + partnerObject.groupingLogoUrl;
                    result.performerLogo = protocolPrefix + partnerObject.performerLogoUrl;
                }
            }

            return result;
        }
    });

    return PerformerModel;

});
