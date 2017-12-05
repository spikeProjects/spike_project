define([
    'foobunny',
    'globals',
    'global_context',
    'helpers/event_helper'
    ], function(Foobunny, globals, gc, EventHelper) {
        'use strict';

        var ParkingAddedView = Foobunny.BaseView.extend({
            initialize: function() {
                this.subscribeEvent('parkingpass:add', this.addParking);
                this.subscribeEvent('parkingpass:remove', this.removeParking);
                this.subscribeEvent('buildyourorder:hidden', this.removeParking);
                this.subscribeEvent('buildyourorder:showParking', this.show);
            },

            template: gc.appFolder + '/parking_added',

            uiEl: {
                $totalParking: '.total-parking',
                $totalParkingQuantity: '.total-parking-quantity',
                $totalParkingSection: '.total-parking-section',
                $totalParkingAmount: '.total-parking-price',
                $totalParkingCurrency: '.total-parking-info .currency',
                $totalParkingEachText: '.total-parking-info .each',
            },

            addParking: function(parkingModel) {
                this.model = parkingModel;
                this.render();
                this.animate();
                globals.parking.isAddedToCart = true;
                this.model.set('parkingAdded', true);
            },

            removeParking: function(parkingModel) {
                var self = this;

                // animate
                if (parkingModel) {
                    this.uiEl.$totalParking.removeClass('animate-enter').addClass('animate-exit').parent().removeClass('animate-open');
                } else {
                    this.uiEl.$totalParking.removeClass('animate-enter').parent().removeClass('animate-open');
                }
                if (EventHelper.isMobile()) {
                    self.uiEl.$totalParking.addClass('hide');
                } else {
                    // timeout is required for animation
                    setTimeout(function() {
                        self.uiEl.$totalParking.addClass('hide');
                    }, 1000);
                }
                if (globals.parking.isAddedToCart === true) {
                    globals.parking.isAddedToCart = false;
                    this.model.set('parkingAdded', false);
                }
            },

            show: function() {
                this.uiEl.$totalParking.removeClass('hide').parent().addClass('animate-open');
            },


            animate: function() {
                var ref = EventHelper.getReferrer(),
                    refParams = ref.params.reduce(function(a, b) {
                        return a.concat(b);
                    }, []),
                    addParkingTop;

                // animate
                if (refParams.indexOf('pA') > -1 ) {
                    if (!EventHelper.isMobile()) {
                        addParkingTop = $('.parking-container').position().top;
                        this.uiEl.$totalParking.parents('#event-byo-container').animate({
                            scrollTop: addParkingTop
                        }, 'fast');
                    }
                } else {
                    if (!EventHelper.isMobile()) {
                        this.uiEl.$totalParking.parents('#event-byo-container').animate({scrollTop: 0},400);
                    }
                }
                this.uiEl.$totalParking.removeClass('animate-exit').addClass('animate-enter').removeClass('hide').parent().addClass('animate-open');
            }
        });

    return ParkingAddedView;
});
