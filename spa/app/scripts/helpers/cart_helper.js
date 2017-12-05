/* global _ */
define([
    'foobunny',
    'global_context',
    'collections/cart_collection',
    'models/cart_item_model',
    'helpers/event_helper',
    'globals'
], function(Foobunny, gc, CartCollection, CartItemModel, EventHelper, globals) {
    var CartHelper = (function() {
        'use strict';

        var cartCollection = CartCollection.getInstance();

        var getCart = function() {
            var collectionPromise = cartCollection.fetch();
            collectionPromise.done(function(response) {
                // Set the id of all the models.
                for (var i in response.items) {
                    if (!response.items[i].id) {
                        response.items[i].id = response.items[i].cartItemId;
                    }
                }

                cartCollection.id = response.cartId;
                cartCollection.reset(response.items);

            }).fail(function(error) {
                if (error && error.responseJSON) {
                    switch (error.responseJSON.code) {
                        case 'purchase.cart.badRequest':
                        case 'purchase.cart.cartDoesnotBelongsToUser':
                        case 'purchase.cart.usercartCannotBeAccessed':
                        case 'purchase.cart.listingOrQuantityUnavailable':
                             // this case added to handle some effects of Jira EVENTS-2114
                        case 'purchase.cart.quantityUnacceptable':
                            // this case added to handle some effects of Jira EVENTS-2114
                            gc.cart_id = null;
                            EventHelper.removeUrlParam('cart_id');
                            CartHelper.resetCart();
                            break;
                    }
                }

                EventHelper.logAppState('fetch', error);
            });

            return collectionPromise;
        };

        var getListingsItems = function(model) {
            var listings = [],
                seats = model.get('seats'),
                qty = model.get('qty'),
                i = 0;

            if (seats) {
                // v3
                if (EventHelper.isBlendedLogicApplied()) {
                    // Since the blending logic is applied sent the ticketId to the cart api.
                    for (i = 0; i < seats.length; i++) {
                        listings.push({
                            listingId: seats[i].listingId,
                            itemId: seats[i].ticketSeatId,
                            itemType: 1
                        });
                    }
                } else {
                    listings.push({
                        listingId: seats[0].listingId,
                        quantity: (qty !== -1 ? qty : model.get('splitVector')[0])
                    });
                }
            } else {
                // v2
                listings.push({
                    listingId: model.get('id'),
                    quantity: (qty >= 1 ? qty : 1)
                });
            }

            return listings;
        };

        var addToCart = function(model) {
            var cartModel,
                cartId = cartCollection.id,
                addCartPromise = $.Deferred(),
                cartPromise,
                fetchPromise,
                listing = getListingsItems(model);

            // Check whether we need to create a new cart or not.
            if (abandonCart(model)) {
               // Carry over non-ticket items to the new cart
               listing = listing.concat(addCarryOverItems());
               cartId = null;
            }

            cartModel = new CartItemModel();
            cartPromise = cartModel.saveItem({
                listing: listing,
                cartId: cartId
            });
            cartPromise.done(function(response, status, xhr) {
                cartCollection.add(cartModel);
                cartCollection.id = response.cartId;
                console.log('Listing Added to Cart:' + response.cartId + ' / ' + listing[0].listingId + ' / ' + cartCollection.length);

                fetchPromise = getCart();
                fetchPromise.done(function(response, status, xhr) {
                    cartCollection.reset(response.items);

                    gc.cart_id = response.cartId;
                    EventHelper.setUrlParam('cart_id', response.cartId);
                    addCartPromise.resolve(response, status, xhr);
                }).fail(function(xhr, status, statusText) {
                    console.log('Get cart after adding to cart failed', xhr);
                    addCartPromise.reject(xhr, status, statusText);
                    EventHelper.logAppState('fetch', xhr);
                });
            }).fail(function(xhr, status, statusText) {
                console.log('Cart Error: Adding/Update failed:' + listing[0].listingId + ' / ' + cartCollection.length, xhr);
                addCartPromise.reject(xhr, status, statusText);
                EventHelper.logAppState('fetch', xhr);
            });

            return addCartPromise.promise();
        };

        var deleteFromCart = function(model) {
            var cartModels,
                thisModel,
                destroyDeferred = $.Deferred(),
                destroyPromise,
                modelDestroyPromises = [],
                listing = {
                    listingId: model.get('listingId')
                };

            if (!cartCollection || cartCollection.length === 0) {
                return $.Deferred().resolve();
            }

            cartModels = cartCollection.where({listingId: Number(listing.listingId)});
            for (var i = 0; i < cartModels.length; i++) {
                thisModel = cartModels[i];
                console.log('Deleting listing:' + thisModel.get('listingId') + ' / ' + thisModel.get('cartItemId'));

                destroyPromise = thisModel.destroy(cartCollection.id);
                destroyPromise.done(function(response, status, xhr) {
                    console.log('Listing deleted from Cart:' + thisModel.get('listingId') + ' / ' + thisModel.get('cartItemId'));
                    cartCollection.remove(thisModel, {silent: true});
                }.bind(thisModel)).fail(function(error) {
                    console.log('Listing failed with error', error);
                });

                modelDestroyPromises.push(destroyPromise);
            }

            // Resolve the deferred when all the items are deleted.
            $.when.apply($, modelDestroyPromises).then(function() {
                console.log('All listings deleted from cart for listing:' + listing.listingId);
                destroyDeferred.resolve();
            }).fail(function(xhr, status, statusText) {
                destroyDeferred.reject(xhr, status, statusText);
                EventHelper.logAppState('fetch', xhr);
            });

            return destroyDeferred;
        };

        // Every listing will have an event associated with it.
        // For example, tickets, parking, hospitality etc.
        var getEventListingsFromCart = function(eventId) {
            var event;
            return cartCollection.filter(function(model, index, collection) {
                event = model.get('event');

                return (event.eventId === eventId);
            });
        };

        var getNonTicketItemsFromCart = function() {
            return cartCollection.filter(function(model, index, collection) {
                return (model.get('itemType') !== 'TICKET' && model.get('status') === 'AVAILABLE');
            });
        };

        var addCarryOverItems = function() {
            var nonTicketItems = getNonTicketItemsFromCart(),
                carryOverItems = [];

            for (var i = 0; i < nonTicketItems.length; i++) {
                carryOverItems.push({
                    listingId: nonTicketItems[i].get('listingId'),
                    quantity: nonTicketItems[i].get('quantity')
                });
            }

            return carryOverItems;
        };

        // Create listings object from the cart models.
        // TODO: Determine whether to return listingId/itemId or listingId/quantity?
        var getItemsFromCart = function(eventId) {
            var itemType,
                thisListing,
                listings;

            listings = _.map(getItemsByEvent(eventId), function(model) {
                itemType = model.get('itemType');
                thisListing = {};
                thisListing.listingId = model.get('listingId');
                if (model.get('id') === model.get('cartItemId')) {
                    thisListing.quantity = model.get('quantity');
                } else {
                    thisListing.ticketSeatId = model.get('id');
                }

                return thisListing;
            });

            return listings;
        };

        var getItemsByType = function(type) {
            var cartModels = _.filter(cartCollection.models, function(model) {
                return (model.get('itemType') === type);
            });

            return cartModels;
        };

        var getItemsByEvent = function(eventId) {
            var eventInfo,
                cartModels = _.filter(cartCollection.models, function(model) {
                    eventInfo = model.get('event');

                    if (_.isEmpty(eventInfo) || _.isNaN(eventInfo.eventId) || eventInfo.eventId !== eventId) {
                        return false;
                    }

                    return true;
                });

            return cartModels;
        };

        var multipleListingsInCart = function(eventId) {
            var listingModels = getItemsByEvent(eventId),
                multipleListings = false;

            if (listingModels.length > 0) {
                // Now find out if there is another listingid in the cart.
                for (var i = 1; i < listingModels.length; i++) {
                    if (listingModels[i].get('listingId') !== listingModels[0].get('listingId')) {
                        multipleListings = true;
                        break;
                    }
                }
            }

            return multipleListings;
        };

        var invalidListingsInCart = function(eventId) {
            var cartModels = _.filter(getItemsByEvent(eventId), function(model) {
                return (model.get('status') !== 'AVAILABLE');
            });

            // Return true if there are invalid listings in cart. If not, return false.
            return (cartModels.length > 0);
        };

        var getCartId = function() {
            if (!cartCollection) {
                return null;
            }

            return cartCollection.id;
        };

        var setCartId = function(cart_id) {
            cartCollection.id = cart_id;
        };

        var resetCart = function() {
            if (!cartCollection) {
                return;
            }

            cartCollection.reset();
            cartCollection.id = null;
        };

        var abandonCart = function(model) {
            // Abandon the cart if we have blended listings in the cart. ie., number of TICKET items
            // is more than 1.
            // var itemCount = cartCollection.filter(function(model, index, collection) {
            //     return (model.get('itemType') === 'TICKET');
            // });

            // If we are adding the parking model then do not abandon the cart.
            if (model.get('parkingEventId')) {
                return false;
            }

            var cartModels = cartCollection.where({itemType: 'TICKET'});
            return (cartModels.length > 0);
        };

        return {
            cartCollection: cartCollection,
            getCart: getCart,
            resetCart: resetCart,
            abandonCart: abandonCart,
            getCartId: getCartId,
            setCartId: setCartId,
            addToCart: addToCart,
            deleteFromCart: deleteFromCart,
            multipleListingsInCart: multipleListingsInCart,
            invalidListingsInCart: invalidListingsInCart,
            getItemsFromCart: getItemsFromCart,
            getItemsByEvent: getItemsByEvent,
            getItemsByType: getItemsByType,
            getEventListingsFromCart: getEventListingsFromCart
        };
    }());

    return CartHelper;
});
