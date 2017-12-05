/* global _ */
define([
    'foobunny',
    'helpers/event_helper',
    'globals',
    'global_context',
    'models/filter_model',
    'blueprint'
], function(Foobunny, EventHelper, globals, gc, FilterModel) {
    'use strict';

    var SeatmapView = Foobunny.BaseView.extend({

        initialize: function(options) {

            console.log('--SeatmapView--  in initialize()', this);

            //map type from the api, default to section - 0, blueprint behaves differently for each type
            this.mapTypeId = options.mapType || 0;
            // venue config info from venueConfig api
            this.version = options.version;
            this.nodeId = options.nodeId;
            this.configId = options.configId;
            this.viewFromSection = options.viewFromSection;
            this.staticImageUrl = options.staticImageUrl;
            this.oldZoom = 0;

            this.subModels = {};

            this.subscribeEvent('eventmodel:dataready', this.setEventModel);
            this.subscribeEvent('eventlayout:renderdone', this.prepareSeatmapAndVfs);
            this.subscribeEvent('seatmap:sectionSelected', this.sectionSelected);
            this.subscribeEvent('seatmap:sectionDeselected', this.sectionDeselected);
            this.subscribeEvent('seatmap:centerSection', this.centerSection);
            this.subscribeEvent('seatmap:highlightSection', this.highlightSectionAndPrepareTooltip);
            this.subscribeEvent('seatmap:dehighlightSection', this.dehighlightSection);
            this.subscribeEvent('seatmap:center', this.centerSeatmap);
            this.subscribeEvent('seatmap:reset', this.resetSeatmap);
            this.subscribeEvent('seatmap:resize', this.resizeSeatmap);
            this.subscribeEvent('seatmap:filter', this.filterSeatmap);
            this.subscribeEvent('seatmap:hide', this.hide);
            this.subscribeEvent('seatmap:show', this.show);
            this.subscribeEvent('seatmap:hold', this.hold);
            this.subscribeEvent('seatmap:release', this.release);
            this.subscribeEvent('app:render-ready', this.layoutDataComplete);
            this.subscribeEvent('seatmap:enableSelectionByZone', this.selectByZone);
            this.subscribeEvent('seatmap:enableSelectionBySection', this.selectBySection);
            this.subscribeEvent('ticketdetails:dehighlighted', this.dehighlightSection);
        },

        el: '#seatmap',

        template: gc.appFolder + '/seatmap',

        fetchData: function() {
            this.fetchDataDeferred = $.Deferred();
            return this.fetchDataDeferred.promise();
        },

        afterRender: function() {
            this.$eventMapContainer = $('#eventMapContainer');
            if (this.model.get('zonesEnabled')) {
                this.$el.blueprint.enableSelectSectionsByZone(true);
            }
        },

        renderSeatmap: function(node_id, config_id, mapDisplayType, version, viewFromSection, staticImageUrl) {
            var that = this,
                isZoomControl = (window.innerWidth >= globals.screen_breakpoints.tablet) ? true : false;

            try {
                $('#seatmap').blueprint({
                    nodeId: node_id,
                    configId: config_id,
                    version: version,
                    viewFromSection: viewFromSection,
                    staticImageUrl: staticImageUrl,
                    comingSoonImgUrl: globals.comingSoonImgUrl,
                    useInventoryApi: true,
                    multiSelectSection: true,
                    selectSectionsByZone: false,
                    mapDisplayType: mapDisplayType,
                    autoCreateTicketList: false,
                    useStubHubStyle: true,
                    autoResizeMap: true,
                    token: gc.app_token,
                    appendToken: (gc.addToken) ? true : false,
                    defaultZoomControl: isZoomControl,
                    metadataUrl: '/shape/catalog/venues/v2/{{nodeId}}/venueconfig/{{configId}}/metadata',
                    extensions: {},
                    hoverStyle: {
                        'stroke': '#cc6600',
                        'stroke-width': 2,
                        'stroke-opacity': 1
                    },
                    onMapReady: function(status) {
                        that.fetchDataDeferred.resolve();
                        that.$seatmapTooltip = $('#seatmap-tooltip');

                        // If the map is static map then add another style for displaying the map
                        // then resize the map according to the new height/width.
                        if (that.$el.blueprint.isMapStatic()) {
                            that.$eventMapContainer.addClass('staticMap');
                            that.resizeSeatmap();
                        }

                        that.publishEvent('seatmap:mapDisplayed', that.$el.blueprint.isMapStatic());
                    },
                    onSectionOver: function(evt, sid) {
                        that.publishEvent('seatmap:highlightSection', sid);
                    },
                    onSectionOut: function(evt, sid) {
                        // If the mouse has left the section but has moved onto the visible tooltip,
                        // keep the section highlighted.
                        if (! that.$seatmapTooltip.hasClass('hide')) {
                            that.highlightSection(sid);
                        }
                        // Seatmap's version of hideTooltip is hoverHideTooltip(), which sets a timeout on the original
                        // hideTooltip(). If we use the original hideTooltip() without a timeout, it will be very difficult to
                        // reach the seatmap tooltip because onSectionOut() is triggered by Blueprint on every pixel movement!
                        that.publishEvent('seatmap:hideTooltip');
                    },
                    onSectionFocus: function(sid) {
                        //ticketFilterType -- Evar21 -- last selected zone/section id
                        //filterType -- Prop36 -- array of all highlighted sections/zones
                        if(globals.zones_enabled === true){
                            EventHelper.track({pageView: 'Seatmap', appInteraction: "Selected Zone", pageload: false, filterType: "Selected Zone: " + that.$el.blueprint.getZoneBySection(sid), userExperienceSnapshot: {seats: 'Zones: ' + that.getSelectedZones()}});
                        } else {
                            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Selected Section', pageload: false, filterType: "Selected Section: " + sid, userExperienceSnapshot: {seats: 'Sections: ' + that.$el.blueprint.getSelectedSections()}});
                        }

                        that.publishEvent('seatmap:sectionSelected', sid);
                    },
                    onSectionBlur: function(sid) {
                        if(globals.zones_enabled === true) {
                            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Deselected Zone', pageload: false, filterType: "Deselected Zone: " + that.$el.blueprint.getZoneBySection(sid), userExperienceSnapshot: {seats: (that.getSelectedZones().length > 0) ? 'Zones: ' + that.getSelectedZones() : ''}});
                        } else {
                            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Deselected Section', pageload: false, filterType: "Deselected Section: " + sid, userExperienceSnapshot: {seats: (that.$el.blueprint.getSelectedSections().length > 0) ? 'Sections: ' + that.$el.blueprint.getSelectedSections() : ''}});
                        }

                        that.publishEvent('seatmap:sectionDeselected', sid);
                    },
                    onZoomChange: function(zoomLevel) {
                        // Static maps cannot be zoomed in/out. So, not tracking required.
                        if (that.$el.blueprint.isMapStatic()) {
                            return;
                        }
                        // We should not track the default zoom level. The variable that.oldZoom will be 0 when we
                        // load the map. The blueprint library zooms the map according to the size of the container.
                        // If the oldZoom is 0 then do not fire tracking.
                        if (that.oldZoom === 0) {
                            that.oldZoom = zoomLevel;
                            return;
                        }

                        that.publishEvent('seatmap:zoomChanged', zoomLevel);

                        EventHelper.track({pageView: 'Seatmap', appInteraction: 'Zoom ' + ((zoomLevel > that.oldZoom) ? 'increased' : 'decreased'), pageload: false});

                        that.oldZoom = zoomLevel;
                    }
                });
            } catch (e) {
                EventHelper.logAppState('MapError', e);
                console.error('MapError:', e);
            }
        },

         //set up config details for the seatmap and get it rendered
        prepareSeatmapAndVfs: function() {
            var mapDisplayType = _.object(globals.map_types)[this.mapTypeId];

            //attempt map only if node id is present
            if (this.nodeId && this.configId) {
                this.renderSeatmap(this.nodeId, this.configId, mapDisplayType, this.version, this.viewFromSection, this.staticImageUrl);
            }
        },

        setEventModel: function(model) {
            this.subModels.eventModel = model;
        },

        hide: function(style) {
            this.$el.removeClass('hold');
            this.$el.addClass('seatmap-small');
            $('#seatmap-zone-section').addClass('hide');
            this.$el.blueprint.zoomMap(1);
            this.centerSeatmap();
        },

        show: function(style) {
            this.$el.removeClass('hold');
            this.$el.removeClass('seatmap-small');
            $('#seatmap-zone-section').removeClass('hide');
            this.$el.blueprint.zoomMap(2.3); //change this and ensure it reads from parent
            this.centerSeatmap();
        },

        hold: function() {
            this.$el.addClass('hold');
        },

        release: function() {
            this.$el.removeClass('hold');
        },

        centerSeatmap: function() {
            this.$el.blueprint.centerMap(true);
        },

        centerSection: function(sid) {
            if ((this.initialZoom + 2) !== this.$el.blueprint.getCurrentZoom) {
                this.$el.blueprint.zoomMap(this.initialZoom + 2);
            }
            this.$el.blueprint.centerSection(sid, true);
        },

        resetSeatmap: function() {
            this.$el.blueprint.resetMap();
        },

        resizeSeatmap: function() {
            this.$el.blueprint.resizeMap();
        },

        filterSeatmap: function(sectionIds) {
            this.$el.blueprint.filterSections(sectionIds);
        },

        highlightSectionAndPrepareTooltip: function(sid) {
            var self = this,
                zid,
                sections,
                sectionState = this.$el.blueprint.getSectionData(sid).state;
            // If the section is in default/filtered state then no need to do anything.
            // ie., the section is white in color. maybe there is no ticket
            // available in this section.
            if (sectionState === 'unavailable' || sectionState === 'filtered') {
                return;
            }

            this.highlightSection(sid);

            if (globals.zones_enabled) {
                zid = this.$el.blueprint.getZoneBySection(sid);

                // Filter out the sections that are unavailable or are filtered.
                // Do not send those sections to the showTooltip otherwise you run the
                // risk of displaying the tooltip in a section where the user might not be
                // able to buy the ticket.
                sections = _.filter(this.$el.blueprint.getSectionsByZone(zid), function(sid) {
                    sectionState = self.$el.blueprint.getSectionData(sid).state;

                    // Return all the sections that are not unavailable and not filtered.
                    return !(sectionState === 'unavailable' || sectionState === 'filtered');
                });

                this.publishEvent('seatmap:showTooltip', zid, sections);
            }
            else {
                this.publishEvent('seatmap:showTooltip', sid);
            }
        },

        highlightSection: function(sid) {
            this.$el.blueprint.highlightSections([sid]);
        },

        dehighlightSection: function() {
            this.$el.blueprint.dehighlightSections();
            this.publishEvent('tooltip:hide');
        },

        focusSectionOnMap: function(sids) {
            this.$el.blueprint.focusSections(sids, false);
        },

        selectByZone: function() {
            var selectedSections = this.$el.blueprint.getSelectedSections(),
                selectedZones = this.getSelectedZones();

            for (var i = 0, j = selectedSections.length; i < j; i++) {
                this.$el.blueprint.focusZoneBySection(selectedSections[i]);
            }

            this.$el.blueprint.enableSelectSectionsByZone(true);
            this.publishEvent('seatmap:sectionSelected');
            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Selection By Zone', pageload: false, userExperienceSnapshot: {seats: (selectedZones.length > 0) ? 'Zones: ' + selectedZones : '', zoneOrSection: 'Zone Selection'}});
        },
        selectBySection: function() {
            var selectedSections = this.$el.blueprint.getSelectedSections();

            /* Blueprint blurSections method has an issue with Array of Strings
               Converting selectedSections from Array of strings to Array of numbers */
            selectedSections = _.map(selectedSections, function(section) {
                return Number(section);
            });
            this.$el.blueprint.enableSelectSectionsByZone(false);
            this.$el.blueprint.blurSections(selectedSections, true);

            this.publishEvent('seatmap:sectionDeselected');
            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Selection By Section', pageload: false, userExperienceSnapshot: {seats: '', zoneOrSection: ''}});
        },
        sectionSelected: function() {
            var zonesEnabled = this.model.get('zonesEnabled') ? true : false,
                dataObj = {};

            // The attributeName changes based on zone or section is selected.
            if (zonesEnabled) {
                dataObj.zones = _.clone(this.getSelectedZones());
                if (dataObj.zones.length > 0) {
                    EventHelper.setUrlParam('zid', dataObj.zones.join());
                }
            } else {
                dataObj.sections = _.clone(this.$el.blueprint.getSelectedSections());
                if (dataObj.sections.length > 0) {
                    EventHelper.setUrlParam('sid', dataObj.sections.join());
                }
            }

            dataObj.lastchanged = 'section-selected';
            this.model.set(dataObj, {});
            this.publishEvent('enlargevfs:hide');
        },

        sectionDeselected: function() {
            var slen = 0,
                zonesEnabled = this.model.get('zonesEnabled') ? true : false,
                dataObj = {};

            // The attributeName changes based on zone or section is selected.
            if (zonesEnabled) {
                dataObj.zones = _.clone(this.getSelectedZones());
                slen = dataObj.zones.length;
                if (slen === 0) {
                    EventHelper.removeUrlParam('zid'); //when all zones are deselected remove zid urlParam
                } else {
                    EventHelper.setUrlParam('zid', dataObj.zones.join());
                }
            } else {
                dataObj.sections = _.clone(this.$el.blueprint.getSelectedSections());
                slen = dataObj.sections.length;
                if (slen === 0) {
                    EventHelper.removeUrlParam('sid'); //when all zones are deselected remove sid urlParam
                } else {
                    EventHelper.setUrlParam('sid', dataObj.sections.join());
                }
            }

            // The attributeName changes based on zone or section is selected.
            // dataObj[attributeName] = _.clone(selectedSections);
            dataObj.lastchanged = (slen > 0 ? 'section-selected' : 'show-all');
            this.model.set(dataObj, {});
        },

        layoutDataComplete: function() {
            this.initialZoom = this.$el.blueprint.getCurrentZoom();
            if (this.$el.blueprint.isMapStatic()) {
                this.resizeSeatmap();
            }
            this.publishEvent('seatmap:ready', {'isMapStatic': this.$el.blueprint.isMapStatic()});

            setTimeout(_.bind(function() {
                this.preSelectTicketBySection();
            }, this), 1000);
        },

        getSelectedZones: function() {
            //Request maps team to add this method
            var $blueprint = this.$el.blueprint,
                sections = $blueprint.getSelectedSections() || [],
                selectedZonesMap = {},  //Zones Hash map, {'zoneid1':true, 'zoneid2':true}
                selectedZones = [],
                zoneid,
                invalidZoneForSection = [];

            for (var i = 0, j = sections.length; i < j; i++) {
                zoneid = $blueprint.getZoneBySection(sections[i]);
                if (zoneid && zoneid !== '') {
                    selectedZonesMap[zoneid] = true;
                } else {
                    invalidZoneForSection.push(sections[i]);
                }
            }
            if (invalidZoneForSection.length > 0) {
                window.Bugsnag.notify('Invalid Zone Id',
                                'Sections do not have valid Zone Id:' + invalidZoneForSection,
                                {
                                    'event_id': gc.event_id,
                                    'venue_name': this.subModels.eventModel.get('venue').name,
                                    'venue_location': this.subModels.eventModel.get('venue').locality
                                },
                                'info');
            }
            selectedZones = _.keys(selectedZonesMap);
            return selectedZones;
        },

        // If filter model already has the sections attribute,
        // pre-select the tickets according to those section ids.
        preSelectTicketBySection: function() {
            var sectionIds = this.model.get('sections'),
                zoneIds = this.model.get('zones');
            //section toggle mode - highlighting the preselected sections
            if (sectionIds.length > 0) {
                this.$el.blueprint.focusSections(sectionIds, false);
            }
            //zone toggle mode - highlighting the preselected zones
            for (var i = 0; i < zoneIds.length; i++) {
                this.$el.blueprint.focusSectionsInZone(zoneIds[i]);
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SeatmapView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return SeatmapView;
});
