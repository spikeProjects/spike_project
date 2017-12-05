define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/similar_ticket_model',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper'
], function(Foobunny, Hammer, globals, gc, SimilarTicketModel, i18n, currencyFormatUtil, EventHelper) {
    'use strict';

    var SimilarTicketView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/similar_ticket',

        model: new SimilarTicketModel(),

        events: {
            'tap .similar-button': 'selectSimilarTicket',
            'tap .similar-find-ticket': 'goBackToEventPage',
            'tap .find-ticket-button' : 'goBackToEventPage',
            'tap .upgrade-see-more-container .upgrade-see-more': 'displayMoreFeatures'
        },

        uiEl: {
            $similarTicketWrapper: '.similar-ticket-wrapper',
            $similarTicketVfs: '.similar-vfs',
            $noVfsText: '.novfs-text',
            $similarSeatNumberText: '.seatInfoText .seatInfo',
            $similarSeatNumbers: '.seatInfoText .seatNumbers',
            $similarNoSeatNumberText: '.seatInfoText .noseatInfo',
            $similarFeatureIcons: '.upgrade-feature-icons-wrapper',
            $similarMoreFeatures: '.similar-listing-info .view-more-container',
            $similarMoreText: '.upgrade-see-more-container .upgrade-see-more-text',
            $similarMoreIcon: '.upgrade-see-more-container .upgrade-see-more-icon',
            $similarAmount: '.similar-listing-info .upgrade-amount',
            $similar: '.similar-button',
            $similarButton: '.similar-button button',
            $similarFindTicket: '.similar-find-ticket',
            $findTicketContainer: '.find-ticket-container'
        },

        initialize: function() {
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.fetchSimilarTicket);
            this.subscribeEvent('buildyourorder:notickets', this.showFindTicketInfo);
        },

        context: function() {
        },

        afterRender: function() {
            Hammer(this.el);
        },

        showSimilarTicket: function() {
            this.uiEl.$similarTicketWrapper.removeClass('hide');
            this.$el.removeClass('hide');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Similar Ticket Offered',
                pageload: false,
                filterType: 'Similar-offered ListingId: ' + this.model.get('listingId') + '; Similar-offered Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: 'Similar-offered ListingId: ' + this.model.get('listingId'),
                    upgradedListingPrice: 'Similar-offered Listing Price: ' + this.model.get('usePrice').amount
                }
            });
        },

        fetchSimilarTicket: function(SelectedTicketModel) {
            var similarTicketPromise,
                qty = parseInt(SelectedTicketModel.get('qty')),
                resp,
                listingData = {},
                self = this;

            listingData.listingId = SelectedTicketModel.get('listingId');
            listingData.price = SelectedTicketModel.get('usePrice').amount;
            if (qty === -1) {
                listingData.qty = SelectedTicketModel.get('splitVector')[0];
            } else {
                listingData.qty = qty;
            }

            this.model.prepareUpgradeUrl(listingData);
            similarTicketPromise = this.model.fetch();

            similarTicketPromise.done(function(response) {
                    self.render();
                    setTimeout(function() {
                        if (_.isEmpty(response) || response.listingError) {
                            self.showFindTicketInfo();
                            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: No Similar Ticket Found', pageload: false});
                        } else {
                            resp = response.listing[0].listing;
                            self.showSimilarTicket();
                            // Get the VFS
                            EventHelper.showVfs(self.uiEl.$similarTicketVfs.find('img')[0], 'medium', resp.venueConfigSectionId, self.vfsSuccess.bind(self), self.vfsFailure.bind(self));
                        }
                    }, 0);
            }).fail(function() {
                self.render();
                setTimeout(function() {
                    self.showFindTicketInfo();
                    EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: No Similar Ticket Found', pageload: false});
                });
            });
        },

        vfsSuccess: function() {
        },

        vfsFailure: function() {
            this.uiEl.$similarTicketVfs.addClass('similar-no-vfs');
            this.uiEl.$noVfsText.removeClass('hide');
        },

        selectSimilarTicket: function(evt) {
            var listingId = this.model.get('listingId');

            evt.preventDefault();
            evt.stopPropagation();

            this.$el.addClass('hide');
            EventHelper.setUrlParam('sim_tkt', 1);
            this.publishEvent('similarTicket:add', this.model);

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Similar ticket Clicked',
                pageload: false,
                filterType: 'Similar-selected ListingId: ' + listingId,
                userExperienceSnapshot: {
                    ticketId: 'ListingId Selected: ' + listingId,
                    upgradeListingId: 'Similar-selected ListingId: ' + listingId,
                    upgradedListingPrice: 'Similar-selected Listing Price: ' + this.model.get('usePrice').amount
                }
            });
        },

        goBackToEventPage: function(evt) {
            this.publishEvent('similarTicket:remove');
            if ($(evt.currentTarget).hasClass('similar-find-ticket')) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Similartix: See All Listings', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: See All Listings', pageload: false});
            }
        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$similarMoreFeatures.hasClass('expand')) {
                this.uiEl.$similarFeatureIcons.removeClass('hide');
                this.uiEl.$similarMoreFeatures.slideUp(400);
                this.uiEl.$similarMoreFeatures.removeClass('expand');
                this.uiEl.$similarMoreText.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$similarMoreIcon.text('+');

                EventHelper.track({pageView: 'Similar Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$similarFeatureIcons.addClass('hide');
                this.uiEl.$similarMoreFeatures.slideDown(400);
                this.uiEl.$similarMoreFeatures.addClass('expand');
                this.uiEl.$similarMoreText.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$similarMoreIcon.text('-');

                EventHelper.track({pageView: 'Similar Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        showFindTicketInfo: function() {
            this.uiEl.$similarTicketWrapper.addClass('hide');
            this.uiEl.$similarFindTicket.addClass('hide');
            this.uiEl.$findTicketContainer.removeClass('hide');
            this.$el.removeClass('hide');
        }
    });

    return SimilarTicketView;
});

