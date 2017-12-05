define([
    'foobunny',
    'global_context',
    'helpers/event_helper'
    ], function(Foobunny, gc, EventHelper) {
        'use strict';

        var MapTakeoverControlView = Foobunny.BaseView.extend({
            events: {
                'tap #arrowButton': 'arrowButtonAction'
            },

            initialize: function() {
                console.log('--MapTakeoverControlView--  in initialize()', this);
            },
            el: '#map-drawer-control-container',

            context: function() {
                return {
                    mapTakeover: EventHelper.isMapTakeOverEnabled()
                };
            },

            template: gc.appFolder + '/partials/map_take_over_control'

        });
    return MapTakeoverControlView;
});
