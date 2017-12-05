define([
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper'
], function(Foobunny, gc, globals, EventHelper) {
    'use strict';

    var ListingModel = Foobunny.BaseModel.extend({
        initialize: function() {
            console.log('--ListingMode-- on initialize()');
        }
    });

    return ListingModel;
});
