define([
    'foobunny',
    'hammer',
    'models/event_disclosure_model',
    'helpers/event_helper',
    'global_context'
    ], function(Foobunny, Hammer, EventDisclosureModel, EventHelper, gc) {
        'use strict';

        var $body = $('body');

        var EventDisclosureView = Foobunny.BaseView.extend({

            initialize: function() {
                console.log('EventDisclosureView-- in initialize()', this);

                this.model = new EventDisclosureModel();

                //show the disclosue when the flag is clicked on
                this.subscribeEvent('eventdisclosure:show', this.showDisclosures);

                //for disclosure onload - tracking has to fire after the page load tracking itself has fired
                this.subscribeEvent('eventdisclosure:setClickTracking', function() {
                    //make sure the disclosure is present
                    if (this.model.get('alertMessage')) {
                        //tracking for disclosure dialog upon first load
                        EventHelper.track({pageView: 'EventDisclosure', appInteraction: 'Viewed event disclosure', pageload: false});
                    }
                });

                this.disclosureShown = null;
                this.disclosureCookieName = 'event_' + gc.event_id + '_disclosureShown';
            },

            el: '#eventDisclosure',

            template: gc.appFolder + '/event_disclosure',

            events: {
                'tap #disclosure_button': 'close'
            },

            //this takes care of displaying the disclosue on load
            modelEvents: {
                'change': 'onModelChange'
            },

            onModelChange: function() {
                this.render();

                try {
                    this.disclosureShown = Foobunny.storage.getFromCookie(this.disclosureCookieName);
                } catch (e) {}

                if (!this.disclosureShown) {
                    this.showDisclosures();
                }
            },

            showDisclosures: function(data) {
                $body.addClass('overlay-active');
                this.$el.addClass('disclosureOverlayAnimate').removeClass('hide');

                // Set omniture for event disclosure view i.e for click from flag icon scenario
                if (data && data.trackDisclosureFlagClick) {
                    EventHelper.track({pageView: data.trackDisclosureFlagClick.prefix, appInteraction: data.trackDisclosureFlagClick.value, pageload: false});
                }
            },

            afterRender: function() {
                Hammer(this.el);
            },

            close: function(evt) {
                var domainMap = EventHelper.urlParser.getDomainMap();

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('disclosureOverlayAnimate').addClass('hide');
                $body.removeClass('overlay-active');

                try {
                    Foobunny.storage.setInCookie(this.disclosureCookieName, true, true, null, '.' + domainMap.domainName + '.' + domainMap.domainSuffix, '/', false);
                } catch (e) {}

                EventHelper.track({pageView: 'EventDisclosure', appInteraction: 'Acknowledged event disclosures', pageload: false});
            }

        });

    return EventDisclosureView;
});
