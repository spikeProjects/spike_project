define([
    'foobunny',
    'layouts/page_layout'
    ], function(Foobunny, PageLayout) {
        'use strict';

        var PageController = Foobunny.Controller.extend({
            initialize: function() {
                console.log('--PageController-- in initialize()', {'this': this});

                _.bindAll(this, 'start', 'show', 'update');

                this.view = new PageLayout();

                return this.view;
            },

            start: function() {
                console.log('--PageController-- in start()');
                this.show();
            },

            show: function() {
                console.log('--PageController-- in show()');
                this.view.render();
            },

            update: function(args) {
                console.log('--PageController-- in update()  args:', args);
            }

        });


    return PageController;

});
