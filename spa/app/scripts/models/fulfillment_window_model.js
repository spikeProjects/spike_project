/* global _ */
define([
    'foobunny',
    'global_context',
    'i18n',
    'helpers/delivery_helper'
], function(Foobunny, gc, i18n, DeliveryHelper) {
    'use strict';

    var InventoryMetadataModel = Foobunny.BaseModel.extend({
        initialize: function(attr, options) {

            this.urlHeaders = gc.url_headers || {};
        },

        //setting cache to true since subsequent requests would have the same meta data
        //no need to fetch again once cached
        cache: true,

        url: function() {
            // return '/shape/catalog/events/v1/' + gc.event_id + '/metadata/inventoryMetaData';
            return '/shape/fulfillment/window/v1/event/' + gc.event_id;
        },

        parse: function(result) {
            var deliveryTypes,
                fulfillmentWindows = result.fulfillmentWindows,
                tmpTypes = {};

            // filter same delivery type
            _.each(fulfillmentWindows, function(fulfillmentWindow) {
                if (fulfillmentWindow && fulfillmentWindow.deliveryMethod) {
                    var deliveryTypeId = fulfillmentWindow.deliveryMethod.deliveryTypeId,
                        deliveryName = fulfillmentWindow.deliveryMethod.deliveryTypeName;

                    tmpTypes[deliveryTypeId] = DeliveryHelper.getDeliveryTypeName(deliveryTypeId, deliveryName);
                }
            });

            // conbime post and convert to array
            deliveryTypes = _.map(DeliveryHelper.combinePaperDelivery(_.keys(tmpTypes), 'deliveryType'), function(typeId) {
                return {
                    id: parseInt(typeId),
                    description: tmpTypes[typeId]
                };
            });

            return {
                InventoryEventMetaData: {
                    deliveryTypeList: deliveryTypes
                }
            };
        }

    });
    return InventoryMetadataModel;
});
