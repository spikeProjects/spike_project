define([
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper',
    'sh_image'
], function(Foobunny, gc, globals, EventHelper, SHImage) {
    'use strict';

    var EventModel = Foobunny.BaseModel.extend({
        initialize: function(attr, options) {
            this.urlHeaders = gc.url_headers || {};
        },

        url: function() {
            return '/shape/catalog/events/v3/' + gc.event_id + '/?mode=internal&isSeatTraitsRequired=true';
        },

        parse: function(response) {
            var imageQuality = SHImage.CONST.QUALITY_70,
                imageSizes = [{'mobile': SHImage.CONST.SIZES[21]},
                              {'default': SHImage.CONST.SIZES[4]},
                              {'tablet': SHImage.CONST.SIZES[55]},
                              {'desktop': SHImage.CONST.SIZES[55]}],
                imageSize,
                imageUrl;

            // publish events api response to globalContextVars
            if (response) {
                this.publishEvent('module:globalcontextvars:apiresponseready', {APIName: 'events', data: response});
            }

            if (response.images) {
                response.sh_images = {};
                response.images.forEach(function(image, index, images) {
                    response.sh_images[image.type] = {urls: {}};
                    imageUrl = (EventHelper.isSSL() ? image.urlSsl : image.url);

                    //if the image cannot be resized, no point building the resizeable url
                    if (image.resizableInd === true) {
                        imageSizes.forEach(function(size, index, sizes) {
                            imageSize = Object.keys(size)[0];
                            imageUrl = SHImage.zoomImageUrlBuilder(imageUrl, {
                                size: size[imageSize],
                                progressive: true,
                                quality: imageQuality
                            });
                            response.sh_images[image.type].urls[imageSize] = imageUrl;
                        });
                    } else {
                        response.sh_images[image.type].urls.default = imageUrl;
                        response.sh_images[image.type].urls.mobile = imageUrl;
                        response.sh_images[image.type].urls.desktop = imageUrl;
                        response.sh_images[image.type].urls.tablet = imageUrl;
                    }
                });
            }

            // Call the function to create the links for the name.
            response.eventNameLinked = response.name;

            // Wrap the creation of the links inside of the try/catch to avoid un-necessary
            // errors and still proceed with the flow.
            try {
                response.eventNameLinked = this.getTitleLink(response);
                response = this.createPerformerDetails(response);
            } catch (e) {}

            return response;
        },

        getTitleLink: function(response) {
            // Gen3 Logic - updateEventInfo function on Gen3 web page.
            //  If we have visiting Team information then use actPrimary and actSecondary to create the links.
            //  If we do not have visiting team information then use actPrimary to create the link for the entire title minus ' Tickets' word.

            // Strip out certain phrases from the performers name.
            // Cycle through the performers object replacing the performers in the event name.
            // Return the new formed link.
            var eventNameLinked = response.name,
                performers = response.performers,
                groupings = response.groupings;

            if (performers) {
                eventNameLinked = this.replaceNamesWithLinks(performers, eventNameLinked);
            } else if (groupings) {
                eventNameLinked = this.replaceNamesWithLinks(groupings, eventNameLinked);
            }

            return eventNameLinked;
        },

        replaceNamesWithLinks: function(performers, eventNameLinked) {
            var performerName = '',
                performerId = '',
                webURI = null;

            for (var i = 0, len = performers.length; i < len; i++) {
                if (!performers[i].webURI) {
                    continue;
                }

                performerName = this.stripPerformerName(performers[i].name);
                performerId = performers[i].id;
                webURI = performers[i].webURI;
                eventNameLinked = eventNameLinked.replace(new RegExp(performerName, 'i'), this.convertToLink(performerName, webURI, performerId));
            }

            return eventNameLinked;
        },

        stripPerformerName: function(name) {
            var idx = name.toLowerCase().lastIndexOf(' tickets');
            return (idx < 0 ? name : name.substring(0, idx));
        },

        convertToLink: function(performerName, performerURI, performerId) {
            var existing_link_pattern = /^\<a.*\<\/a\>/g;

            if (existing_link_pattern.test(performerName)) {
                // TODO: splunk log here when this condition is hit, as it points to a design flaw
                return performerName;
            }
            return '<a class="performer pid-' + performerId + '" target="_blank" ' + 'href="/' + performerURI + '">' + performerName + '</a>';
        },

        createPerformerDetails: function(response) {
            response.primaryPerformer = '';
            response.secondaryPerformer = '';
            if (!response.performers || response.performers.length === 0) {
                return response;
            }

            response.primaryPerformer = this.stripPerformerName(response.performers[0].name);
            if (response.performers[1]) {
                response.secondaryPerformer = this.stripPerformerName(response.performers[1].name);
            }

            return response;
        },

        getUpcomingEventsLink: function() {
            var webURI = this.getPrimaryPerformerAttribute('webURI');
            if (webURI === '') {
                webURI = this.getGroupingAttribute('webURI');
            }

            return '/' + webURI;
        },

        getPrimaryPerformerId: function() {
            return this.getPrimaryPerformerAttribute('id');
        },

        getPrimaryPerformerAttribute: function(attr) {
            var value = '',
                performers = this.get('performers');

            if (performers &&
                performers.length > 0 &&
                performers[0][attr] &&
                performers[0][attr] !== '') {
                value = performers[0][attr];
            }

            return value;
        },

        getGroupingAttribute: function(attr) {
            var value = '',
                groupings = this.get('groupings');

            if (groupings &&
                groupings.length > 0 &&
                groupings[0][attr] &&
                groupings[0][attr] !== '') {
                value = groupings[0][attr];
            }

            return value;
        },

        // https://jira.stubcorp.com/browse/CATALOG-596
        getBuyerMessages: function() {
            var messages = this.get('buyerMessages'),
                thisMessage,
                returnBuyerMessage = '',
                i = 0;

            if (messages && messages.length > 0) {
                for (i = 0; i < messages.length; i++) {
                    thisMessage = messages[i].message;
                    if (thisMessage && thisMessage !== '') {
                        returnBuyerMessage += thisMessage;
                    }
                }
            }

            return returnBuyerMessage;
        }
    });
    return EventModel;
});
