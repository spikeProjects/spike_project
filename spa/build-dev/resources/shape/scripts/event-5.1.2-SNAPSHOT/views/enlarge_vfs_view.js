define([
    'foobunny',
    'app',
    'hammer',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, app, Hammer, EventHelper, gc, globals) {
    'use strict';

    var EnlargeVfsView = Foobunny.BaseView.extend({
        initialize: function() {
            console.log('--EnlargeVfsView--  in initialize()');
            //this.vfsUrl = '//cache11.stubhubstatic.com/sectionviews/venues/{{nodeId}}/config/{{configId}}/500x271/{{sectionId}}.jpg';

            this.subscribeEvent('eventmodel:dataready', this.prepareVfsUrl);
            this.subscribeEvent('enlargevfs:show', this.showEnlargeVfs);
            this.subscribeEvent('enlargevfs:hide', this.hideEnlargeVfs);
            this.subscribeEvent('enlargevfs:switchVfs', this.swapWithEnlargeVfs);
        },

        afterRender: function() {
            Hammer(this.el);
            this.$smallVfs = $('#small-vfs');
            this.$tooltip = $('#seatmap-tooltip');
        },

        el: '#large-vfs',

        template: gc.appFolder + '/enlarge_vfs',

        events: {
            'hold .image' : 'hold',
            'release .image' : 'release',
            'tap .seatmap-overlay' : 'swapWithEnlargeVfs'
        },

        prepareVfsUrl: function(dataModel) {
           globals.vfs_url = globals.vfs_url.replace('{{nodeId}}', dataModel.get('venue').id).replace('{{configId}}', dataModel.get('venue').configurationId);
        },

        hold: function() {
            this.publishEvent('seatmap:hold');
        },

        release: function() {
            this.publishEvent('seatmap:release');
        },

        showEnlargeVfs: function(sid) {
            var vfsImg = new Image(),
                self = this;

            this.$smallVfs.addClass('hide');
            vfsImg.src = EventHelper.getVfsUrl(sid, 'medium');
            vfsImg.onload = function() {
                self.$el.find('.image ')[0].style.backgroundImage = 'url(' + this.src + ')';
                self.$el.removeClass('hide').removeClass('vfs-small');
                self.publishEvent('seatmap:hide');
                self.$tooltip.addClass('hide');
            };
            vfsImg.onerror = function() {
                self.hideEnlargeVfs();
                // Log the vfs failure.
                EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
            };
            vfsImg = null;
        },

        hideEnlargeVfs: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            // Hide this only if it is not visible. If we publish the seatmap:show when
            // the seat map is already visible the size of the map is changed based on
            // the handler of the seatmap:show event.
            if (!this.$el.hasClass('hide')) {
                this.$el.addClass('hide');
                this.publishEvent('seatmap:show');
            }
            this.$smallVfs.addClass('hide');
        },

        swapWithEnlargeVfs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (this.$el.hasClass('hide')) {
                this.$smallVfs.addClass('hide');
                this.$el.removeClass('hide');
                this.publishEvent('seatmap:hide');
                this.$tooltip.addClass('hide');
                EventHelper.track({pageView: 'Blueprint', appInteraction: 'Map2VFS', pageload: false});
            } else {
                this.$smallVfs.empty();
                this.$el.children('.image').clone().appendTo('#small-vfs');
                this.$el.addClass('hide');
                this.$smallVfs.removeClass('hide');
                this.publishEvent('seatmap:show');
                this.$tooltip.removeClass('hide');
                EventHelper.track({pageView:'Blueprint', appInteraction: 'VFS2Map', pageload: false});
            }
        },

        showVfsImage: function(evt) {
           this.removeClass('hidden');
        }

    });
    return EnlargeVfsView;
});
