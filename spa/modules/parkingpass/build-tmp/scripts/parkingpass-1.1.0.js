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

/* global _*/
define('event-singlelisting-model', [
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var SingleListingModel = Foobunny.BaseModel.extend({

        defaults: {
            parkingListingId: ''
        },

        initialize: function() {
            console.log('-- Parking Model -- initialize');
            this.urlHeaders = gc.url_headers || {};
            this.key = 'parkingSingleListingModel';
        },

        loadMockData: function() {
            this.url = 'parkingpass.json';
            this.urlHeaders = {};
            return this.fetch();
        },

        parse: function(response) {
            var listing = response,
                currentDate,
                nextDate,
                deliveryIds = [17, 22],
                deliveryMethods = listing.deliveryMethods;

            if (typeof deliveryMethods !== 'undefined' && deliveryMethods.length) {
                // For UPS delivery, choose the delivery type closer to the event date but do NOT use
                // id = 17 for Pickup or id = 22 for UPS worldwide
                for (var index = 0; index < deliveryMethods.length; index++) {
                    if (deliveryMethods[index].id && _.indexOf(deliveryIds, deliveryMethods[index].id) === -1) {
                        if (!listing.deliveryDate) {
                            listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                            listing.deliveryDescription = deliveryMethods[index].name;
                        } else {
                            currentDate = new Date(listing.deliveryDate).getTime();
                            nextDate = new Date(deliveryMethods[index].estimatedDeliveryTime).getTime();

                            if (nextDate > currentDate) {
                                listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                                listing.deliveryDescription = deliveryMethods[index].name;
                            }
                        }
                    }
                }

                listing.deliveryTypeList = deliveryMethods.map(function(deliveryMethod) {
                    return {
                        id: deliveryMethod.id
                    };
                });
            }

            // TODO: We should not be referencing the GC object as this GC object might not be available in other apps.
            if (gc.OMN.withFees) {
                listing.price = listing.buyerSeesPerProduct.amount;
            } else {
                listing.price = listing.pricePerProduct.amount;
            }

            listing.listingId = Number(listing.id);

            return listing;
        },

        url: function() {
            return '/shape/inventory/listings/v2/' + this.get('parkingListingId');
        }

    });

    return SingleListingModel;

});

define(
    'event-parkingpass-component',
    ['foobunny',
    'component',
    'event-parkingpass-model',
    'event-singlelisting-model',
    'event-parkingpass-view'],
    function(Foobunny, Component, ParkingModel, SingleListingModel, ParkingView) {
        'use strict';
        var parkingPass = Component.extend({
            // Set component name for referencing
            name: 'parking',

            init: function() {
                var component = this;

                // attributes to be passed for parking component
                // parkingEventId: required
                // qty: required if quantity > 1 default 1
                // priceType: listingPrice/currentPrice default 'listingPrice',
                // parkingSelected: false/true default false
                component.view = new ParkingView(
                {
                    'el': component.options.element,
                    'attributes': component.options.attributes,
                    'component': component
                });
            },

            add: function(model) {
                var addPromise,
                    self = this;

                // Wait for a promise or just return the default state
                if (this.options['add'] && _.isFunction(this.options['add'])) {
                    addPromise = this.options['add'].call(this, model);
                    addPromise.done(function(response, status, xhr) {
                        console.log('Parking Pass added to cart: ', response, status, xhr);
                        self.view.displayParkingState('added');
                        self.view.enableButtons();
                    }).fail(function(xhr, status, statusText) {
                        console.log('Parking Pass add to cart failed: ', xhr, status, statusText);
                        // self.publishEvent('event:parkingpass:error', {xhr: xhr, status: status, statusText: statusText});
                        self.view.delegateError({xhr: xhr, status: status, statusText: statusText});
                        self.view.enableButtons();
                    });
                }

                return addPromise;
            },

            remove: function(args) {
                //var removePromise = this.implements('remove', args);
                var removePromise,
                    self = this;

                // Wait for a promise or just return the default state
                if (this.options['remove'] && _.isFunction(this.options['remove'])) {
                    removePromise = this.options['remove'].call(this, args);
                    removePromise.done(function(response, status, xhr) {
                        console.log('Parking Pass removed from cart: ', response, status, xhr);
                        self.view.displayParkingState('removed');
                        self.view.enableButtons();
                    }).fail(function(xhr, status, statusText) {
                        console.log('Parking Pass removed from cart failed: ', xhr, status, statusText);
                        // self.publishEvent('event:parkingpass:error', {xhr: xhr, status: status, statusText: statusText});
                        self.view.delegateError({xhr: xhr, status: status, statusText: statusText});
                        self.view.enableButtons();
                    });
                } else {
                    self.view.displayParkingState('removed');
                    self.view.enableButtons();
                }

                return removePromise;
            },

            more: function(args) {
                // So far no need for Promise. Extend if necessary.
                if (this.options['more'] && _.isFunction(this.options['more'])) {
                    this.options['more'].call(this, args);
                }
            },

            displayParkingPass: function(attributes) {
                this.view.displayParkingPass(attributes);
            }

        });

        return parkingPass;
    }
);

define('event-parkingpass-view', [
    'foobunny',
    'event-parkingpass-model',
    'event-singlelisting-model'
], function(Foobunny, ParkingModel, SingleListingModel) {

    'use strict';

    var ParkingView = Foobunny.BaseView.extend({
        template: 'parkingpass',

        events: {
            'click .parking-button.add' : 'add',
            'click .parking-button.remove' : 'remove',
            'click .more-parking' : 'more'
        },

        errorCodes: {
            'purchase.cart.quantityUnacceptable':'sro',
            'purchase.cart.quantityUnavailable':'sold',
            'purchase.cart.itemNotFound':'sold',
            'purchase.cart.listingOrQuantityUnavailable':'sold',
            'inventory.listings.listingAlreadySold':'sro',
            'inventory.listings.listingExpired':'sold',
            'inventory.listings.invalidListingid':'sold'
        },

        initialize: function(options) {
            this.options = options || {};
            this.TEST = options.attributes.TEST;
            this.model = new ParkingModel();
            this.subModels = {
                singleListingModel: new SingleListingModel({
                    'parkingListingId':options.attributes.parkingListingId
                })
            };

            this.displayParkingPass(options.attributes);
            this.subscribeEvent('parkingpass:error', this.delegateError);
        },

        fetchOnInitialize: false,

        uiEl: {
            '$parkingWrapper': '.parking-component',
            '$parkingSpinner': '.parking-spinner',
            '$parkingButtonSpinner': '.parking-button-spinner',
            '$parkingInfoWrapper': '.parking-info-wrapper',
            '$parkingErrorWrapper': '.parking-error-wrapper',
            '$parkingAddButton': '.parking-button.add',
            '$parkingRemoveButton': '.parking-button.remove'
        },

        displayParkingPass: function(attributes) {
            this.updateModel(attributes);
            this.fetchParkingPass();
        },

        updateModel: function(attributes) {
            this.model.setSilent({
                parkingSelected: attributes.parkingSelected || false,
                parkingInCart: attributes.parkingInCart || false,
                priceType: attributes.priceType || 'listingPrice',
                qty: attributes.qty || 1,
                parkingEventId: attributes.parkingEventId,
                parkingListingId: attributes.parkingListingId,
                isLowest: (attributes.parkingListingId ? false : true)
            });
        },

        fetchParkingPass: function() {
            if (this.model.get('parkingListingId')) {
                this.fetchParkingListingInfo(this.model.get('parkingListingId'));
            } else if (this.model.get('parkingEventId')) {
                this.fetchParkingEventInfo();
            } else {
                console.log('please provide parking event or listing id.');
            }
        },

        fetchParkingEventInfo: function() {
            var parkingPromise,
                alternateListings,
                self = this;

            // TODO: Log API failures in splunk.
            parkingPromise = this.model.fetch();
            parkingPromise.done(function(response) {
                if (response.totalListings !== 0) {
                    self.fetchParkingListingInfo(self.getParkingListingId(response.listing));
                    if (response.totalListings > 1) {
                        alternateListings = response.listing;
                        alternateListings.shift();
                        self.model.set('alternateListings', alternateListings);
                    }
                } else {
                    if (!_.isEmpty(self.model.get('exception'))) {
                        self.model.set('exception', {code: 'sro'});
                        self.displayError();
                    }
                }
            });
        },

        getParkingListingId: function(listings) {
            if (_.isEmpty(listings) || _.isEmpty(listings[0].seats)) {
                return;
            }
            return listings[0].seats[0].listingId;
        },

        fetchParkingListingInfo: function(listingId) {
            var listingPromise,
                self = this;
            this.subModels.singleListingModel.set('parkingListingId', listingId);
            if (this.TEST) {
                listingPromise = this.subModels.singleListingModel.loadMockData();
            } else {
                listingPromise = this.subModels.singleListingModel.fetch();
            }
            listingPromise.done(function(singleListingResponse) {
                // Add single listing response to parking model
                // for cart to access data.
                self.model.setSilent(singleListingResponse);
                self.displayParking();
            }).fail(function(error) {
                self.publishEvent('parkingpass:error', error);
            });
        },

        displayParking: function() {
            var exception = this.model.get('exception') || {},
                self = this;

            this.render().done(function() {
                self.$el.removeClass('hide');
                if (self.model.get('parkingSelected')) {
                    self.add();
                } else if (self.model.get('parkingInCart')) {
                    self.displayParkingState('added');
                    self.enableButtons();
                }

                self.uiEl.$parkingSpinner.addClass('hide');
                self.uiEl.$parkingInfoWrapper.removeClass('hide');
                self.publishEvent('parkingpass:displayed', self.model);
                if (exception.code) {
                    self.uiEl.$parkingWrapper.addClass('parking-error');
                    self.model.unset('exception');
                }
            });
        },

        displayError: function() {
            var self = this;

            this.render().done(function(){
                self.uiEl.$parkingWrapper.addClass('parking-error');
                self.uiEl.$parkingSpinner.addClass('hide');
                self.uiEl.$parkingInfoWrapper.addClass('hide');
                self.model.unset('exception');
            });
        },

        displayParkingState: function(state) {
            switch (state) {
                case 'added':
                    this.uiEl.$parkingWrapper.addClass('active');
                    this.publishEvent('parkingpass:add', this.model);
                    break;
                case 'removed':
                    this.uiEl.$parkingWrapper.removeClass('active');
                    this.publishEvent('parkingpass:remove', this.model);
                    break;
                default:
                    console.log('displayParkingState is undefined.');
                    break;
            }
        },

        disableButtons: function() {
            this.uiEl.$parkingAddButton.addClass('parking-disabled');
            this.uiEl.$parkingRemoveButton.addClass('parking-disabled');
            this.uiEl.$parkingButtonSpinner.addClass('button-disabled').removeClass('hide');
        },

        enableButtons: function() {
            var self = this;

            // 300 ms is need for animation
            setTimeout(function() {
                self.uiEl.$parkingAddButton.removeClass('parking-disabled');
                self.uiEl.$parkingRemoveButton.removeClass('parking-disabled');
                self.uiEl.$parkingButtonSpinner.removeClass('button-disabled').addClass('hide');
            }, 300);
        },

        more: function() {
            if (!this.uiEl.$parkingWrapper.hasClass('active')) {
                this.options.component.more(this.model);
                this.publishEvent('parkingpass:more');
            }
        },

        add: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            this.disableButtons();
            this.$el.find('.parking-error-wrapper').remove();
            if (this.uiEl.$parkingWrapper.hasClass('parking-error')) {
                this.uiEl.$parkingWrapper.removeClass('parking-error');
            }
            return this.options.component.add(this.model);
        },

        remove: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            this.disableButtons();
            return this.options.component.remove(this.model);
        },

        delegateError: function(error) {
            var exception;

            if (typeof error === 'undefined') {
                return;
            }
            exception = this.model.get('exception');
            if (_.isObject(exception)) {
                this.handleApiSystemError(exception);
                return;
            }
            if (_.has(error, 'responseJSON')) {
                this.handleInventoryApiError(error.responseJSON);
                return;
            }
            if (_.has(error, 'xhr')) {
                this.handleCartApiError(error.xhr);
                return;
            }
        },

        handleApiSystemError: function(exception) {
            exception.code = 'error';
            exception.description = 'SYSTEM ERROR';
            exception.requestId = '';
            exception.data = {};
            this.setException({type: 'system'}, exception);
            this.displayError();
        },

        handleInventoryApiError: function(error) {
            this.setException({type: 'inventory'}, error);
            if (this.getExceptionCode() === 'sold') {
                this.fetchAnotherTicket(this.options.attributes.qty);
            } else {
                this.displayError();
            }
        },

        handleCartApiError: function(xhr) {
            var error = xhr;

            if (_.has(xhr, 'responseJSON')) {
                error = xhr.responseJSON;
            }
            this.setException({type: 'cart'}, error);
            if (this.getExceptionCode() === 'sold') {
                this.fetchAnotherTicket(this.options.attributes.qty);
            } else {
                this.displayError();
            }
        },

        setException: function (type, error) {
            var errorCode = this.errorCodes[error.code] || 'error';
            this.model.set('exception',{
                'type': type,
                'description': error.description,
                'requestId': error.requestId,
                'data': error.data,
                'code': errorCode
            });
        },

        getExceptionCode: function() {
            var exception = this.model.get('exception');
            if (exception) {
                return exception.code;
            }
        },

        fetchAnotherTicket: function(quantity) {
            var parkingAttributes = {},
                alternateListings = this.model.get('alternateListings');

            parkingAttributes.parkingSelected = false;
            parkingAttributes.qty = quantity;
            parkingAttributes.isLowest = false;
            parkingAttributes.priceType = this.model.get('priceType');
            parkingAttributes.parkingEventId = this.model.get('parkingEventId');

            if (_.isEmpty(alternateListings) || _.isEmpty(alternateListings[0].listingId)) {
                this.updateModel(parkingAttributes);
                this.fetchParkingEventInfo();
            } else {
                parkingAttributes.parkingListingId = alternateListings[0].listingId;
                alternateListings.shift();
                this.model.set('alternateListings', alternateListings);
                this.updateModel(parkingAttributes);
                this.fetchParkingListingInfo(parkingAttributes.parkingListingId);
            }
        }

    });

    return ParkingView;
});
