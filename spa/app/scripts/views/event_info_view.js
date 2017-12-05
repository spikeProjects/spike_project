define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'global_context',
    'globals',
    'dotdotdot'
    ], function(Foobunny, Hammer, EventHelper, gc, globals, dotdotdot) {
        'use strict';

        var EventInfoView = Foobunny.BaseView.extend({
            initialize: function() {
                console.log('--Event_infoView--  in initialize()', this);

                this.setPerformerBanner(); // TODO control code TBD
                
                // show info when asked for
                this.subscribeEvent('eventinfo:show', this.show);
                this.subscribeEvent('eventdisclosure:available', this.showDisclosureIcon);
            },

            el: '#eventInfo',

            template: gc.appFolder + '/event_info',

            events: {
                'tap .closeEventInfo' : 'close',
                'tap #event-info-flag' : 'showEventDisclosure',
                'tap .performer' : 'trackEventNameClick',
                'tap .venue' : 'trackVenueClick'
            },

            afterRender: function() {
                Hammer(this.el);

                // Add ellipsis to the title and update it when the window is re-sized.
                this.$el.find('.header').dotdotdot({
                    watch: 'window'
                });

                // Add the 'year' class if the event date is not the current year.
                var evtDate = new Date(this.model.get('eventDateLocal'));
                var today = new Date();
                if (today.getFullYear() !== evtDate.getFullYear()) {
                    this.$el.find('.event-meta').addClass('event-year').find('.year').removeClass('hide');
                }
            },

            show: function() {
                $('body').addClass('overlay-active');
                this.$el.addClass('overlayAnimate');
            },

            setPerformerBanner: function() {
                var imgs = this.model.get("sh_images");
                this.model.set('showPerformerBanner', false);
                if(!_.isEmpty(imgs.BANNER) && SH.skinName === '76ers') {
                    if (EventHelper.isMobile()) {

                    } else if (EventHelper.isTablet()) {
                        this.model.set('performerBannerUrl', imgs.BANNER.urls.tablet);
                        this.model.set('showPerformerBanner', true);
                    } else {
                        this.model.set('performerBannerUrl', imgs.BANNER.urls.desktop);
                        this.model.set('showPerformerBanner', true);
                    }

                }
            },

            close: function(evt) {
                $('body').removeClass('overlay-active');

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('overlayAnimate');
                EventHelper.track({pageView: 'EventCard', appInteraction: 'Close', pageload: false});
            },

            showDisclosureIcon: function() {
                var self = this;
                //make sure the rendered fragment has been appended to the DOM
                window.setTimeout(function() {
                    self.$el.find('#event-info-flag').removeClass('hide');
                }, 0);
            },

            showEventDisclosure: function() {
                this.publishEvent('eventdisclosure:show', {trackDisclosureFlagClick: {
                    prefix: 'EventInfo',
                    value: 'Event Disclosure Flag'
                }});
            },

            trackEventNameClick: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                EventHelper.track({pageView: 'EventInfo', appInteraction:  'Go to performer page',  pageload: false});
            },

            trackVenueClick: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Go to venue page', pageload: false});
            },

            context: function() {
                return {
                    showVenuePostCode: EventHelper.showVenuePostCode()
                };
            }
        });
    return EventInfoView;
});
