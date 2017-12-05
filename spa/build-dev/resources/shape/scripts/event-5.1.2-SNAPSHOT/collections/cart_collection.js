/* global _ */
define([
    'foobunny',
    'global_context',
    'models/cart_item_model'
], function(Foobunny, gc, CartItemModel) {
    'use strict';

    var cartInstance;

    var CartCollection = Foobunny.BaseCollection.extend({
        cache: false,

        urlRoot: '/shape/purchase/carts/v3',

        model: CartItemModel,

        fetchTimeout: 2000,
        maxNrOfReFetch: 3,

        initialize: function() {
            this.apiUrl = this.urlRoot;

            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': gc.shlocale
            });
        },

        url: function() {
            return this.apiUrl;
        },

        getUrl: function() {
            var _url = this.urlRoot;

            if (this.id) {
                _url += '/' + this.id;
            }

            return _url;
        },

        fetch: function() {
            this.apiUrl = this.getUrl();
            return Foobunny.BaseCollection.prototype.fetch.apply(this, [{cache: false}]);
        }
    });

    CartCollection.getInstance = function() {
        if (!cartInstance) {
            cartInstance = new CartCollection();
        }

        return cartInstance;
    };

    return CartCollection;
});
