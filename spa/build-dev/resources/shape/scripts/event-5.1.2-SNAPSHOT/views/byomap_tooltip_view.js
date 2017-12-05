define([
    'foobunny',
    'global_context',
    'helpers/event_helper'
], function(Foobunny, gc, EventHelper) {
    'use strict';

    var ByomapTooltipView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/byomap_tooltip',

        events: {
            'tap': 'scrolltoUpgrade'
        },

        initialize: function() {
            //close tooltip on window resize
            $(window).resize(_.bind(this.winresize, this));
        },

        winresize: function() {
            if (this.$el.hasClass('byomap-tooltip')) {
                this.$el.addClass('hide');
            }
        },

        scrolltoUpgrade: function(ev) {
            //scroll to Upgrade Div

            if ($(ev.currentTarget).hasClass('upgrade') && $(ev.currentTarget).hasClass('byomap-tooltip')) {
                $('#event-byo-container').animate({scrollTop: $('.upgrade-listing').offset().top}, 400);
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade Seats Bubble Clicked', pageload: false});
            }
        },

        context: function() {
            return {
                markerType: this.$el.hasClass('upgrade') ? 'upgrade' : 'selected'
            };
        }
    });

    return ByomapTooltipView;
});