/* global _ */
define([
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var CartItemModel = Foobunny.BaseModel.extend({
        cache: false,

        urlRoot: '/shape/purchase/carts/v3',

        initialize: function(params) {
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': gc.shlocale
            });

            this.apiUrl = this.urlRoot;
        },

        url: function() {
            return this.apiUrl;
        },

        getUrl: function(action, cartItemId) {
            var _url = this.urlRoot;

            if (this.cartId) {
                _url += '/' + this.cartId;

                if (action === 'ADDITEM') {
                    _url += '/items';
                } else if (action === 'DELETEITEM') {
                    _url += '/items/' + cartItemId;
                }
            }

            return _url;
        },

        getApiHeaders: function() {
            return {
                headers: this.urlHeaders,
                emulateJSON: true
            };
        },

        // Add or replace item as necessary.
        saveItem: function(data) {
            this.cartId = data.cartId;
            if (!data.cartId) {
                return this.createCart(data);
            } else {
                return this.addItem(data);
            }
        },

        createCart: function(data) {
            var self = this,
                apiParams = {
                    orderSourceId: 7,
                    deleteIfExist: 'Y',
                    items: data.listing
                },
                listingId = data.listing.listingId;

            this.apiUrl = this.getUrl('CREATECART');

            return this.save({}, {
                headers: self.urlHeaders,
                emulateJSON: true,
                data: JSON.stringify(apiParams),
                method: 'POST',
                success: function(model, response, options) {
                    self.cartId = response.cartId;
                    self.id = listingId;
                    self.setSilent('listingId', listingId);
                }
            });
        },

        addItem: function(data) {
            var self = this,
                apiParams = {
                    orderSourceId: 7,
                    items: data.listing
                },
                listingId = data.listing.listingId;

            this.apiUrl = this.getUrl('ADDITEM');

            return this.save({}, {
                headers: self.urlHeaders,
                emulateJSON: true,
                data: JSON.stringify(apiParams),
                method: 'POST',
                success: function(model, response, options) {
                    self.cartId = response.cartId;
                    self.id = listingId;
                    self.setSilent('listingId', listingId);
                }
            });
        },

        destroy: function(cartId) {
            this.cartId = cartId;
            this.apiUrl = this.getUrl('DELETEITEM', this.get('cartItemId'));

            return Foobunny.BaseModel.prototype.destroy.call(this, {
                headers: this.urlHeaders
            });
        }
    });

    return CartItemModel;
});
