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
