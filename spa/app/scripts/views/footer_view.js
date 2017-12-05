define([
    'foobunny',
    'global_context'
    ], function(Foobunny, gc) {
        'use strict';

        var FooterView = Foobunny.BaseView.extend({
            initialize: function() {
                console.log('--FooterView--  in initialize()', this);
            },
            el: '#footer',

            template: gc.appFolder + '/footer'

        });
    return FooterView;
});
