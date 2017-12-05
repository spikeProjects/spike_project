define([
    'foobunny',
    'hammer',
    'models/seller_model',
    'helpers/event_helper',
    'global_context'
    ], function(Foobunny, Hammer, BsfModel, EventHelper, gc) {
        'use strict';

        var SellerView = Foobunny.BaseView.extend({

            el: '#bsf',

            template: gc.appFolder + '/seller',

            initialize: function() {
                console.log('--FilterView--  in initialize()', this);
                this.model = new BsfModel();
                this.$body = $('body');

                this.subscribeEvent('sellerInfo:show', this.showSellerInfo);
            },

            afterRender: function() {
                Hammer(this.el);
            },

            events: {
                'tap .bsf-overlay-close' : 'close'
            },

            close: function(evt) {
                this.$body.removeClass('overlay-active');

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('overlayAnimate');
            },

            fetchOnRender: true,
            fetchOnInitialize: false,

            showSellerInfo: function(opts) {
                if (!opts.businessGuid) {
                    return false;
                }

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Business Seller Info', pageload: false});
                var that = this;
                this.$body.addClass('overlay-active');

                // new another model, else the last one would leave dirty data
                this.model = new BsfModel();
                this.model.set('businessGuid', opts.businessGuid);
                var promise = this.model.fetch();

                promise.done(function() {
                    that.render();
                    that.$el.addClass('overlayAnimate');
                });
                promise.fail(function() {
                    that.$body.removeClass('overlay-active');
                    EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Business Seller Info Load Failed', pageload: false});
                });
            }

        });

        return SellerView;
});
