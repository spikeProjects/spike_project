define('event-parkingpass-model', [
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var ParkingModel = Foobunny.BaseModel.extend({

        defaults: {
            parkingEventId: null,
            qty: 1,
            sectionName: '',
            price: null,
            priceType: 'listingPrice',
            deliveryDate: '',
            deliveryTypeList: '',
            parkingAdded: false,
            listingExpired: false
        },

        initialize: function() {
            console.log('-- Parking Model -- initialize');
            this.key = 'parkingModel';
            this.urlHeaders = gc.url_headers || {};
        },

        url: function() {
            var parkingEventId = this.get('parkingEventId'),
                qty = this.get('qty') || 1,
                priceType = this.get('priceType');

            return '/shape/search/inventory/v2/listings?eventId=' + parkingEventId + '&start=0&rows=3&quantity=' + qty + '&sort=price+asc&priceType=' + priceType;
        },

        parse: function(response) {
            if (response.hasOwnProperty('listing') && response.listing.length > 1) {
                response.alternateListings  = _.clone(response.listing);
                response.alternateListings.shift();
            }
            return response;
        }

    });

    return ParkingModel;

});
