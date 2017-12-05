/*global SH,_ */
define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n'
], function(Foobunny, Hammer, EventHelper, globals, gc, i18n) {
    'use strict';

    var StaticImageView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/static_image',

        initialize: function(options) {
            this.imageHost = options.imageHost || '';
            this.imageUrl = options.imageUrl || '';
            this.imageLink = options.imageLink || '';
            this.imageTracking = options.imageTracking || '';
            this.imageAltKey = options.imageAltKey || '';
            this.imageAltText = options.imageAltText || '';
        },

        events: {
            'click .static-image-item': 'imageClicked'
        },

        uiEl: {
            $staticImageItem: '.static-image-item',
            $staticImage: '.static-image'
        },

        addImage: function(imageUrl) {
            var staticImage = new Image(),
                self = this;

            staticImage.onload = function() {
                self.uiEl.$staticImage[0].src = this.src;
                if (self.imageAltKey !== '') {
                    self.uiEl.$staticImage[0].alt = i18n.get(self.imageAltKey);
                } else if (self.imageAltText !== '') {
                    self.uiEl.$staticImage[0].alt = this.imageAltText;
                }
            };
            staticImage.onerror = function() {
                self.uiEl.$staticImageItem.addClass('hide');
            };
            staticImage.src = imageUrl;
        },

        imageClicked: function(evt) {
            EventHelper.track('Static image clicked', this.imageTracking, false);
        },

        afterRender: function() {
            this.addImage(this.imageHost + this.imageUrl);

            if (!this.imageLink || this.imageLink === '') {
                $(this.$el).off('click', '.static-image-item');
            }
        },

        context: function() {
            return {
                imageLink: this.imageLink
            };
        }
    });
    return StaticImageView;
});
