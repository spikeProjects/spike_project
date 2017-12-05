/**
 * @module DeliveryHelper
 * @TODO tech debt https://jira.stubcorp.com/browse/EVENTS-1617 name should be localized from API
 * localized name should be returned from API instead of hard code in front-end
 */
define([
    'i18n',
    'helpers/event_helper'
], function(i18n, EventHelper) {

    var combinePaperDeliveryFeature = EventHelper.getFeatureFn('eventpage.combinePaperDelivery')() || false,
        paperDeliveryTypeIds = [5, 6, 7],
        paperDeliveryMethodIds = [22, 23, 24, 25, 27, 36, 37, 38, 39];

    /**
     * @private
     * get i18n property value, return fallback if not found
     */
    function getI18n(propertyName, fallback) {
        var value = i18n.get(propertyName);
        if (value.trim() !== '' && value.indexOf('ERROR') === -1) {
            return value;
        }
        return fallback;
    }

    return {

        getDeliveryTypeName: function(deliveryTypeId, fallback) {
            var propertyName = 'event.common.deliveryType.' + deliveryTypeId;
            return getI18n(propertyName, fallback);
        },

        /**
         * @public
         * get delivery method name by delivery method id
         */
        getDeliveryMethodName: function(deliveryMethodId, fallback) {
            var propertyName = 'event.common.deliveryMethod.' + deliveryMethodId;

            if (combinePaperDeliveryFeature && deliveryMethodId > 20) {
                propertyName = 'event.common.delivery.post';
            }

            return getI18n(propertyName, fallback);
        },

        /**
         * combine paper deliveries
         * @param {Array} deliveryList - array of delivery type ids or delivery method ids
         * @param {string} typeName=deliveryType -- value should be 'deliveryType' or 'deliveryMethod'
         * @return Array
         */
        combinePaperDelivery: function(deliveryList, typeName) {
            typeName = _.contains(['deliveryType', 'deliveryMethod'], typeName) ? typeName : 'deliveryType';

            var idList = typeName === 'deliveryType' ? paperDeliveryTypeIds : paperDeliveryMethodIds,
                combinedList = deliveryList,
                primaryPaperId = idList[0];

            if (combinePaperDeliveryFeature) {
                combinedList = _.filter(deliveryList, function(id) {
                    id = parseInt(id);
                    return id === primaryPaperId || !_.contains(idList, id);
                });
            }

            return combinedList;
        },

        /**
         * Seprate paper types for pass delivery types to api.
         * If deliveryTypes contains paper delivery, all paper delivery ids should be added to the list
         * @param {Array|string} deliveryTypes - delivery type list
         * @return {Array}
         */
        separatePaper: function(deliveryTypes) {
            if (typeof deliveryTypes === 'string') {
                deliveryTypes = deliveryTypes.split(',');
            }
            var types = deliveryTypes;

            if (combinePaperDeliveryFeature) {
                types = _.map(deliveryTypes, function(id) {
                    return parseInt(id);
                });

                if (_.contains(types, paperDeliveryTypeIds[0])) {
                    _.each(paperDeliveryTypeIds, function(id) {
                        if (!_.contains(types, id)) {
                            types.push(id);
                        }
                    });
                }
            }

            return types;
        }
    };
});
