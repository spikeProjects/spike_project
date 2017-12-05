/* global SH,_ */
define([
    'foobunny',
    'hammer',
    'models/event_model',
    'views/event_info_view',
    'helpers/event_helper',
    'global_context',
    'globals',
    'application_helper'
], function(Foobunny, Hammer, EventModel, EventInfoView, EventHelper, gc, globals, ApplicationHelper) {
    'use strict';

    var EventDetailsView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--EventDetailsView--  in initialize()', this);

            this.subscribeEvent('eventdisclosure:available', this.showDisclosureIcon);
            this.subscribeEvent('app:render-ready', this.processAppRenderReady);
            this.subscribeEvent('buildyourorder:displayed', this.showBackButton);
            this.subscribeEvent('globalHeader:show', this.resetEventDetails);

            this.model = new EventModel();
            this.subViews = {};

            this.byoDisplayed = false;
        },

        el: '#event-details',

        template: gc.appFolder + '/event_details',

        events: {
            'click': 'scrollHeaderBack',
            'click .filterButton' : 'showFilterView',
            'click .infoButton' : 'showInfoView',
            'click #event-details-flag' : 'showEventDisclosure',
            'click .back-button' : 'processBackButton'
        },

        uiEl: {
            '$backButton': '.back-button'
        },

        fetchData: function() {
            var self = this,
                fetchDataPromise = this.model.fetch();

                fetchDataPromise
                    .done(function(data) {
                        self.successfulFetchData(data);
                    })
                    .fail(function(error) {
                        self.publishEvent('dataready:error', error);
                    });

            return fetchDataPromise;
        },

        afterRender: function() {
            Hammer(this.el);
        },

        context: function() {
            return {
                globals: globals
            };
        },

        processBackButton: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Back Button Clicked', pageload: false});

            if (this.byoDisplayed) {
                this.publishEvent('buildyourorder:hide');
            } else if (gc.isAddParking) {
                EventHelper.urlParser.redirect(EventHelper.getReferrer());
            } else {
                this.publishEvent('eventdetailsview:goToUpcomingEvents', evt, true);
            }
        },

        successfulFetchData: function(data) {
            if (this.model.get('expiredInd') === true) {
                this.publishEvent('eventmodel:expiredEvent', this.model.getUpcomingEventsLink());
            }

            globals.event_meta.country = this.model.get('venue').country;

            //initialize the info view only when the event details model has been fetched and then pass it on.
            this.subViews.eventinfo = new EventInfoView({
                model: this.model
            });

            //update meta tags now that the meta information is available
            this.updateMetaTags();

            //add this model data to globals object, this is used for displaying the alt/title on vfs images
            globals.event_meta.venue = this.model.toJSON().venue;
            // this.model.get('eventAttributes').isBYO = EventHelper.determineBYO({ });;

            try {
                globals.event_meta.isParking = (this.model.get('eventAttributes').eventType === globals.constants.PARKING);
                globals.event_meta.parkingEventId = this.model.get('eventAttributes').parkingEventId[0] ? this.model.get('eventAttributes').parkingEventId[0] : null;
            } catch (e) {}

            this.publishEvent('eventmodel:dataready', this.model);

            try {
                Foobunny.storage.setItem('event:' + gc.event_id + ':event', data, 'local', 1000 * 60 * 60);
            } catch (e) {}

        },

        scrollHeaderBack: function() {
            var isScrolledUp = this.$el.hasClass('scrolled-up');
            EventHelper.scrollEventHeader(this.$el, !isScrolledUp);
            if (!isScrolledUp) {
                this.hideGlobalHeader();
            } else {
                this.showGlobalHeader();
            }
        },

        hideGlobalHeader: function() {
            if (EventHelper.isMobile()) {
                this.publishEvent('globalHeader:hide');
                this.publishEvent('ticketlist:resize');
            }
        },

        showGlobalHeader: function() {
            this.publishEvent('globalHeader:show');
            this.publishEvent('ticketlist:resize');
        },

        resetEventDetails: function() {
            EventHelper.scrollEventHeader(this.$el, false);
        },

        showFilterView: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.publishEvent('filter:show');
            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Filter', pageload: false});
        },

        showInfoView: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.publishEvent('eventinfo:show');
            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show EventCard', pageload: false});
        },

        showDisclosureIcon: function() {
            this.$el.find('#event-details-flag').removeClass('hide');
        },

        showEventDisclosure: function() {
            this.publishEvent('eventdisclosure:show', {trackDisclosureFlagClick: {
                prefix: 'EventInfo',
                value: 'Event Disclosure Flag'
            }});
        },

        showLeftIcon: function() {
            if (gc.view === 'NON-GA') {
                this.uiEl.$backButton.removeClass('hide');
            }
        },

        updateMetaTags: function() {

            // TODO: - keeping the static tags here as well, easy to maintain - until we have a complete server side solution
            var self = this,
                seoMeta = this.model.get('seoMeta'),
                metaTags, domainName, eventUrl, deepLinkUrl, imgWidth, imgHeight, imgUrl = '',
                title;

            if (seoMeta.title && !_.isEmpty(seoMeta.title)) {
                title = seoMeta.title;
            } else {
                title = this.model.get('name');
            }

            domainName = (gc.gsConfig) ? gc.gsConfig.domain.domainName : 'stubhub.com';
            eventUrl = domainName.toLowerCase() + '/' + self.model.get('webURI');
            deepLinkUrl = 'stubhub://stubhub.com/?event_id=' + self.model.get('id');

            if (!_.isEmpty(this.model.get('images'))) {
                imgUrl = this.model.get('images')[0].url;
                imgWidth = this.model.get('images')[0].width;
                imgHeight = this.model.get('images')[0].height;
            }

            window.setTimeout(function() {
                metaTags = [
                            {type: 'title', content: title},
                            {type: 'link', attribute: ['rel', 'canonical'], contents: [['href', 'https://www.' + eventUrl]] },
                            {type: 'meta', attribute: ['name', 'description'], contents: [['content', seoMeta.metaDescription]]},

                            //twitter meta tags
                            {type: 'meta', attribute: ['name', 'twitter:title'], contents: [['content', seoMeta.seoDescription]]},
                            {type: 'meta', attribute: ['name', 'twitter:description'], contents: [['content', seoMeta.metaDescription]]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:iphone'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:ipad'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:googleplay'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},

                            //open graph
                            {type: 'meta', attribute: ['property', 'og:title'], contents: [['content', seoMeta.seoDescription]]},
                            {type: 'meta', attribute: ['property', 'og:description'], contents: [['content', seoMeta.metaDescription]]},
                            {type: 'meta', attribute: ['property', 'og:url'], contents: [['content', 'https://www.' + eventUrl]]},

                            //AppLinks
                            {type: 'meta', attribute: ['name', 'al:ios:url'], contents: [['content', deepLinkUrl + '&GCID=AppLinks:Event']]},
                            {type: 'meta', attribute: ['name', 'al:android:url'], contents: [['content', deepLinkUrl + '&GCID=AppLinks:Event']]}
                        ];

                if (imgUrl !== '') {
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image'], contents: [['content', imgUrl]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image:width'], contents: [['content', imgWidth]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image:height'], contents: [['content', imgHeight]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image'], contents: [['content', imgUrl]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image:width'], contents: [['content', imgWidth]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image:height'], contents: [['content', imgHeight]]});
                }
                ApplicationHelper.updateHeadTags(metaTags);
            },0);
        },

        showBackButton: function(hideGlobalHeader) {
            // Show the back button if the BYO is visible.
            if (hideGlobalHeader) {
                this.hideGlobalHeader();
            }
            this.showLeftIcon()
            this.byoDisplayed = true;
        },

        processAppRenderReady: function() {
            var buyerMessages = this.model.getBuyerMessages();

            this.showLeftIcon();

            // Check for disclosure
            if (buyerMessages !== '') {
                this.publishEvent('eventdisclosure:available', buyerMessages);
            }
        }
    });
    return EventDetailsView;
});
