define([
    'foobunny',
    'hammer',
    'models/primarypartner_model',
    'models/primarypartnerintegration_model',
    'models/performer_model',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n'
], function(Foobunny, Hammer, PrimaryPartnerModel, PrimaryPartnerIntegrationModel, PerformerModel, EventHelper, globals, gc, i18n) {
    'use strict';

    var PrimaryPartnerView = Foobunny.BaseView.extend({
        el: '#primary-partner-links',
        template: gc.appFolder + '/primarypartner_banner',

        initialize: function() {
            this.model = new PrimaryPartnerModel();

            this.subModels = {
                ppiModel: new PrimaryPartnerIntegrationModel(),
                performerModel: new PerformerModel()
            };

            this.ticketsAvailable = true;

            this.subscribeEvent('eventmodel:dataready', this.setEventModel);
            this.subscribeEvent('primarypartner:goToPrimaryPartner', this.goToPrimaryPartner);
            this.subscribeEvent('ticketlist:numberOfListings', this.numberOfListings);
        },

        events: {
            'click .see-partner-tickets-link': 'goToPrimaryPartner',
            'click .see-partner-tickets-button': 'goToPrimaryPartner'
        },

        fetchOnInitialize: false,

        setEventModel: function(eModel) {
            var self = this,
                groupings,
                groupingId,
                designationPrefix = 'event.primarypartner.designation.',
                designationString = '';

            this.subModels.eventModel = eModel;

            // Set the Name of the performer in the "Get more tickets for"
            this.model.set('primaryPerformer', this.subModels.eventModel.get('primaryPerformer'));

            // Set the designation since the designation is not returned by the API.
            // ancestor -> groupings
            //  81 = sports tickets
            try {
                // Some events may not have groupings. Hence, checking to see if it does have
                // grouping and if not then get the default.
                groupings = this.subModels.eventModel.get('ancestors').groupings;
                if (groupings && groupings.length > 0) {
                    groupingId = this.subModels.eventModel.get('ancestors').groupings[0].id;

                    // Lookup the string in the localization. If not found then use the default.
                    designationString = i18n.propsJson[designationPrefix + groupingId];

                    this.model.set('primaryGroupingId', groupingId);
                }

                if (!designationString) {
                    designationString = i18n.propsJson[designationPrefix + 'default'];
                }
            } catch (e) {
                designationString = i18n.propsJson[designationPrefix + 'default'];
            }
            this.model.set('designation', designationString);

            // Use setTimeout to make sure eventView rendered before this component fetchData/render
            setTimeout(function() {
                self.fetchData().then(function() {
                    self.render();
                });
            }, 0);
        },

        fetchData: function() {
            var self = this,
                fetchDeferred = $.Deferred(),
                fetchPerformerDeferred,
                fetchDataPromise = fetchDeferred.promise(),
                performerFetchDataPromise,
                primaryPerformerId = this.subModels.eventModel.getPrimaryPerformerId();

            // Make the API call only if we have valid data.
            if (primaryPerformerId !== '') {
                this.subModels.performerModel.setPerformerId(primaryPerformerId);
                performerFetchDataPromise = this.subModels.performerModel.fetch();
            } else {
                fetchPerformerDeferred = $.Deferred();
                performerFetchDataPromise = fetchPerformerDeferred.promise();
                fetchPerformerDeferred.resolve();
            }

            performerFetchDataPromise.done(function() {
                // Call the Partner API if this performer has isPartner set to true
                if (self.subModels.performerModel.get('isPartner') &&
                    !self.subModels.performerModel.get('isHost')) {
                    self.fetchPartnerIntegrationData();
                }

                // Update the model based on business logic. :(
                // 81 = MLB has a partner Logo.
                if (self.model.get('primaryGroupingId') === 81) {
                    self.model.set('partnerLogo', self.subModels.performerModel.get('partnerLogo'));
                    self.model.set('primaryPerformerHexColor', self.subModels.performerModel.get('primaryPerformerColor'));
                }
                self.model.set('primaryPerformerLogo', self.subModels.performerModel.get('performerLogo'));
                self.model.set('isPartner', self.subModels.performerModel.get('isPartner'));
                self.model.set('isHost', self.subModels.performerModel.get('isHost'));

                self.publishEvent('primarypartner:ready', self.model);
                fetchDeferred.resolve();
            });

            performerFetchDataPromise.fail(function(error) {
                self.errorOnFetchedData(error);
            });

            return fetchDataPromise;
        },

        fetchPartnerIntegrationData: function() {
            var self = this,
                ppiFetchDataPromise = this.subModels.ppiModel.fetch();
            ppiFetchDataPromise.done(function() {
                self.model.set('primaryEventPageURL', self.subModels.ppiModel.get('primaryEventPageURL'));
                self.updatePartnerBanner();
                self.publishEvent('primarypartner:ready', self.model);
            });
            ppiFetchDataPromise.fail(function(error) {
                // We are not using the regular errorOnFetchedData since we do not want
                // to hide the partner images even if the PPI API fails.
                //log failures in Splunk
                EventHelper.logAppState('fetch', error);
            });
        },

        errorOnFetchedData: function(error) {
            // Hide the Partner Links since we do not have the partner information.
            this.$el.addClass('hide');

            //log failures in Splunk
            EventHelper.logAppState('fetch', error);
        },

        afterRender: function() {
            var partnerGroupingId = this.model.get('primaryGroupingId'),
                primaryPerformer = this.model.get('primaryPerformer');

            if (this.model.get('isPartner')) {
                if (partnerGroupingId === 81) {
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-logo'), this.model.get('partnerLogo'));
                }

                this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), this.model.get('primaryPerformerLogo'));

                if (primaryPerformer !== '') {
                    this.$el.find('.primaryPerformer').text(primaryPerformer);
                }

                this.updatePartnerBanner();

                this.$el.removeClass('hide');
            } else if (this.subModels.eventModel && (SH.country === 'gb' || SH.country === 'de')) {
                // Ugly temp solution for UK to show performer, venue & grouping as partner performer. Should be removed once
                // front end teams finish building middle orchestration layer to support this.
                var logoURL,
                    partnerDesignation,
                    eventModel = this.subModels.eventModel,
                    eventPerformers = !!eventModel && eventModel.get('performers'),
                    primaryPerformerId = !!eventPerformers && eventPerformers[0].id,
                    venueId = !!eventModel && !!eventModel.get('venue') && this.subModels.eventModel.get('venue').id,
                    groupingId = !!eventModel && !!eventModel.get('groupings') && eventModel.get('groupings')[0].id,
                    partners = {
                        performers: [{
                            id: 165237,
                            name: 'Everton',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/165237.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 711353,
                            name: 'Northampton Saints',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/711353.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 711648,
                            name: 'Gloucester Rugby',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/711648.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 164987,
                            name: 'Tottenham Hotspur Tickets',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/164987.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 1495979,
                            name: 'Anthony Joshua',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/1495979.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, ],
                        venues: [{
                            id: 99499,
                            name: 'The O2',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-99499.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }, {
                            id: 197980,
                            name: 'Indigo O2',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-197980.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }, {
                            id: 7103,
                            name: 'SSE Wembley Arena',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-7103.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }],
                        groupings: [{
                            id: 1500210,
                            name: 'Matchroom Boxing',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/1500210.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 732823,
                            name: 'We Are FSTVAL',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/fstvl.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 700215,
                            name: 'Aviva Premiership Rugby Final',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/700215.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 1505661,
                            name: 'Splash! Festival',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/splash.svg',
                            partnerDesignation: 'Offizieller Ticketing Partner'
                        }, {
                            id: 1505660,
                            name: 'Melt! Festival',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/Melt!2016_Logo_SW.SVG',
                            partnerDesignation: 'Offizieller Ticketing Partner'
                        }]
                    };

                var primaryPerformerPartner = _.find(partners.performers, function(performer) {
                        return performer.id === primaryPerformerId;
                    }),
                    venuePartner = _.find(partners.venues, function(venue) {
                        return venue.id === venueId;
                    }),
                    groupingPartner = _.find(partners.groupings, function(grouping) {
                        return grouping.id === groupingId;
                    });

                // if is performer partner and grouping partner, show both logos
                if (!!primaryPerformerPartner && primaryPerformerPartner.logoURL && !!groupingPartner && groupingPartner.logoURL) {
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-logo'), groupingPartner.logoURL);
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), primaryPerformerPartner.logoURL);
                    this.$el.find('.partner-designation').text(groupingPartner.partnerDesignation);
                    this.$el.removeClass('hide');
                }
                else {
                    logoURL = !!primaryPerformerPartner && primaryPerformerPartner.logoURL || !!venuePartner && venuePartner.logoURL ||
                        !!groupingPartner && groupingPartner.logoURL;
                    partnerDesignation = primaryPerformerPartner && primaryPerformerPartner.partnerDesignation || !!venuePartner && venuePartner.partnerDesignation ||
                        !!groupingPartner && groupingPartner.partnerDesignation;

                    if (logoURL && partnerDesignation) {
                        this.$el.addClass('partner-peformer-only');
                        this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), logoURL);
                        this.$el.find('.partner-designation').text(partnerDesignation);
                        this.$el.removeClass('hide');
                    }
                }
            } else {
                this.$el.addClass('hide');
            }
        },

        addPrimaryPartnerLogos: function(elem, url) {
            var img = document.createElement('img');
            img.src = url;
            img.onload = function() {
                elem.append(this);
            };
            img.onerror = function() {
                elem.addClass('hide');
            };
        },

        addPrimaryPartnerIconSet: function(spanElem, iconset) {
            spanElem.addClass('sh-iconset ' + iconset);
            spanElem.removeClass('hide');
        },

        goToPrimaryPartner: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (!primaryPartnerUrl) {
                return;
            }

            EventHelper.track({pageView: 'Primary Partner', appInteraction: 'Go To Partner Site', pageload: false});
            window.open(primaryPartnerUrl);

            return false;
        },

        numberOfListings: function(nbr) {
            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (nbr === 0) {
                this.ticketsAvailable = false;
                $('.partner-gettickets-banner').addClass('hide');
            } else if (primaryPartnerUrl && primaryPartnerUrl !== '') {
                this.ticketsAvailable = true;
                $('.partner-gettickets-banner').removeClass('hide');
            }
        },

        updatePartnerBanner: function() {
            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (!this.ticketsAvailable) {
                $('.partner-gettickets-banner').addClass('hide');
            } else if (primaryPartnerUrl && primaryPartnerUrl !== '') {
                $('.partner-gettickets-banner').removeClass('hide');
            }
        }
    });

    return PrimaryPartnerView;

});
