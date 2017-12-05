define([
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'views/upgrade_ticket_view',
    'views/byomap_tooltip_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/map_helper'
], function(Foobunny, Hammer, globals, gc, UpgradeTicketView, ByomapTooltipView, i18n, currencyFormatUtil, EventHelper, MapHelper) {
    'use strict';

    var svgimg,
        scale = 1,
        byoSvgMap,
        MAX_ZOOM = 5,
        MIN_ZOOM = 1, //setting min & max zoom values for byoseatmap,
        computedScale = 1,
        svgns = 'http://www.w3.org/2000/svg',
        xlink = 'http://www.w3.org/1999/xlink',
        selectedColor = '#D9367F',
        upgradeColor = '#00A6A0',
        whiteColor = '#FFFFFF',
        mapLeft,
        mapTop,
        deltaX,
        deltaY,
        deltaXUpperLimit,
        deltaXLowerLimit,
        deltaYUpperLimit,
        deltaYLowerLimit,
        selectionSectionEl,
        upgradeSectionEl,
        selectedSectionPos,
        upgradeSectionPos,
        $upgradeMarker,
        removeMapColors = {
            'fill': whiteColor,
            'fill-opacity': 0.2,
            'stroke': whiteColor,
            'stroke-width': 0,
            'stroke-opacity': 0
        },
        highlightSelectedTicket = {
            'fill': selectedColor,
            'fill-opacity': 0.4,
            'stroke': selectedColor,
            'stroke-width': 2,
            'stroke-opacity': 1
        },
        highlightUpgradeTicket = {
            'fill': upgradeColor,
            'fill-opacity': 0.4,
            'stroke': upgradeColor,
            'stroke-width': 2,
            'stroke-opacity': 1
        },
        parentOffset,
        parentWidth,
        parentHt,
        contentCtrMarginL,
        toolTipHalfWidth,
        toolTipHt,
        top,
        left,
        pageX,
        pageY,
        rePosition,
        upgradeTooltipEl = '#byo-seatmap .upgrade',
        selectedTooltipEl = '#byo-seatmap .selected';

    var ByoListingMapView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/byo_listing_map',

        events: {
            'tap .byo-small-vfs': 'swapVfsAndMap',
            'tap .byo-small-map': 'swapVfsAndMap',
            'tap .markers': 'displayByoMapTooltip',
            'mouseenter .markers': 'displayMarkerHoverState',
            'mouseleave .markers': 'removeHoverState'
        },

        uiEl: {
            $singleTicketVfs: '.single-ticket-vfs',
            $byoseatmap: '#byo-seatmap',
            $noVfsText: '.noVfsText',
            $vfsSpinner: '.single-ticket-vfs .spinner',
            $vfs: '.vfsImage',
            $switchIconMap: '.switchIconMap',
            $disclaimerMap: '.disclaimer.map',
            $disclaimerVfs: '.disclaimer.vfs',
            $byomaptooltip: '.byomap-tooltip'
        },

        initialize: function() {
            this.subViews = {};

            this.subscribeEvent('buildyourorder:displayed', this.displayListingMap);
            this.subscribeEvent('upgradeTicket:add', this.addUpgradedTicketVfs);
            this.subscribeEvent('similarTicket:add', this.addUpgradedTicketVfs);
            this.subscribeEvent('upgradeTicket:remove', this.removeUpgradedTicketVfs);
            this.subscribeEvent('upgradeTicket:hidden', this.removeUpgradeMarker);
            this.subscribeEvent('upgradeTicket:remove', this.displayUpgradeMarker);
            this.subscribeEvent('byoListingInfo:oldTicketInfo', this.setOldTicketInfo);
            this.subscribeEvent('upgradeTicket:displayed', this.displayUpgradeMarker);
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.handleTicketExpired);
        },

        afterRender: function() {
            Hammer(this.el);

            this.showListingMap();
        },

        displayMarkerHoverState: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var currentTarget = $(ev.currentTarget);
            currentTarget.find('.oval-97').attr({
                'stroke-opacity': 0.25,
                'stroke-width': 112
            });

            if (currentTarget.prop('id') === 'upgrade-marker-specs') {
                this.highlightMapSection(this.upgradeSectionId, highlightUpgradeTicket);
            } else {
                this.highlightMapSection(this.sectionId, highlightSelectedTicket);
            }
        },

        removeHoverState: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var currentTarget = $(ev.currentTarget);
            currentTarget.find('.oval-97').attr({
                'stroke-opacity': 1,
                'stroke-width': 0
            });

            if (currentTarget.prop('id') === 'upgrade-marker-specs') {
                this.highlightMapSection(this.upgradeSectionId, removeMapColors);
            } else {
                this.highlightMapSection(this.sectionId, removeMapColors);
            }
        },

        removeUpgradeMarker: function() {
            $upgradeMarker = byoSvgMap.find('#upgrade-marker-specs');

            if ($upgradeMarker.length) {
                $upgradeMarker.remove();
            }
        },

        displayUpgradeMarker: function(upgradeModel) {
            if (MapHelper.isStaticMap() || !upgradeModel.get('sectionId') || globals.upgradeTicket.isTicketUpgraded) {
                return;
            }

            this.upgradeModel = upgradeModel;

            this.upgradeSectionId = this.upgradeModel.get('sectionId');

            upgradeSectionEl = this.getSectionElementOnMap(this.upgradeSectionId);

            if (upgradeSectionEl) {
                upgradeSectionPos = upgradeSectionEl.getBBox();
            } else {
                return;
            }

            this.subViews.UpgradeByomapTooltipView = new ByomapTooltipView({
                el: upgradeTooltipEl,
                model: this.upgradeModel
            });

            // remove upgrade marker if already existing
            this.removeUpgradeMarker();

            // create upgrade marker
            byoSvgMap.append(MapHelper.createMarkerTags('upgrade-marker-specs', 'upgrade'));

            // centering the upgrade map marker inside the section
            if (this.upgradeSectionId === this.sectionId) {
                upgradeSectionPos.x = upgradeSectionPos.x + 100;
                upgradeSectionPos.y = upgradeSectionPos.y + 100;
            }
            byoSvgMap.find('#upgrade-marker-specs').attr('transform', 'matrix(1, 0, 0, 1, ' + (upgradeSectionPos.x + upgradeSectionPos.width / 2) + ', ' + (upgradeSectionPos.y + upgradeSectionPos.height / 2) + ')');
        },

        getSectionElementOnMap: function(sectionId) {
            return this.uiEl.$byoseatmap.find('#' + sectionId)[0];
        },

        showListingMap: function() {
            this.$el.removeClass('hide');
        },

        hideListingMap: function() {
            this.$el.addClass('hide');
        },

        calculateTooltipPos: function($el, touchCoord) {
            parentOffset = $('.seat-info').offset().top;
            parentWidth = $('.seat-info').width();
            parentHt = $('.seat-info').height();
            contentCtrMarginL = ($('#app_container').width() - $('#content_container').width()) / 2;
            toolTipHalfWidth = $el.width() / 2;
            toolTipHt = $el.height();

            top = touchCoord.pageY - parentOffset + 10; //10 is the tooltip offset so it does not completely hide the markers when clicked on the outer circle
            left = touchCoord.pageX - contentCtrMarginL - toolTipHalfWidth;

            if (!EventHelper.isDesktop()) {
                if (left < 0) { //if tooltip goes outside viewport on the left
                    left = 0;
                } else if ((touchCoord.pageX + toolTipHalfWidth) > parentWidth) { //if tooltip goes outside viewport on the right
                    left = left - toolTipHalfWidth;
                }

                if (top + toolTipHt > parentHt) { //if tooltip goes below seat-info div ctr
                    top = top - (toolTipHt * 1.5); //(1 is the tooltipht) and 0.5 is half the tooltip's height - used for displacing the tooltip above the marker
                    $el.addClass('below');
                } else {
                    $el.removeClass('below');
                }
            }
            return {'top': top, 'left': left};
        },

        constructMap: function() {
            this.mapClone();

            if (!MapHelper.isStaticMap()) {
                // for interactive map remove colors using blank map function
                this.blankMap();
                this.uiEl.$switchIconMap.find('path').css({'fill-opacity': 1}); // for retaining the opacity of the expand-arrows on map
            }
        },

        addSelectedTktMarkers: function() {
            byoSvgMap.append(MapHelper.createMarkerTags('selected-marker-specs', 'selected'));

            // centering the map marker inside the section
            byoSvgMap.find('#selected-marker-specs').attr('transform', 'matrix(1, 0, 0, 1, ' + (selectedSectionPos.x + selectedSectionPos.width / 2) + ', ' + (selectedSectionPos.y + selectedSectionPos.height / 2) + ')');
        },

        displayListingMap: function(hideGlobalHeader, ticketModel) {
            this.render();
            this.model = ticketModel;
            this.sectionId = this.model.get('sectionId');

            this.constructMap();

            if (MapHelper.isStaticMap() || !this.sectionId) {
                this.vfsFailure();
                return;
            }

            selectionSectionEl = this.getSectionElementOnMap(this.sectionId);

            if (selectionSectionEl) {
                //if map contains the section, then call getBBox to get the position of the section on the map
                selectedSectionPos = selectionSectionEl.getBBox();
            } else {
                return;
            }

            this.subViews.SelectedByomapTooltipView = new ByomapTooltipView({
                el: selectedTooltipEl,
                model: this.model
            });

            this.addSelectedTktMarkers();

            // Get the VFS
            EventHelper.showVfs(this.uiEl.$singleTicketVfs.find('img')[0], (EventHelper.isDesktop() ? 'large' : 'medium'), this.sectionId, this.vfsSuccess.bind(this), this.vfsFailure.bind(this));
        },

        swapVfsAndMap: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if($(evt.currentTarget).hasClass('byo-small-map')){
                this.uiEl.$byoseatmap.removeClass('byo-small-map');
                this.uiEl.$singleTicketVfs.addClass('byo-small-vfs');
                this.uiEl.$disclaimerMap.removeClass('hide');
                this.uiEl.$disclaimerVfs.addClass('hide');
                EventHelper.track({
                    pageView: 'Ticket Listings',
                    appInteraction: 'BYOView: VFS2Map',
                    pageload: false
                });
            } else if($(evt.currentTarget).hasClass('byo-small-vfs')){
                this.uiEl.$singleTicketVfs.removeClass('byo-small-vfs');
                this.uiEl.$byoseatmap.addClass('byo-small-map');
                byoSvgMap.css({'transform': 'none', 'left': 0, 'top': 0}); //reset the map to its original for PIP
                this.uiEl.$disclaimerMap.addClass('hide');
                this.uiEl.$disclaimerVfs.removeClass('hide');
                EventHelper.track({
                    pageView: 'Ticket Listings',
                    appInteraction: 'BYOView: Map2VFS',
                    pageload: false
                });
            }
        },

        displayByoMapTooltip: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var currentTarget = $(ev.currentTarget);
            pageX = ev.originalEvent.gesture.center.pageX;
            pageY = ev.originalEvent.gesture.center.pageY;
            if (currentTarget.prop('id') === 'upgrade-marker-specs') {
                $(upgradeTooltipEl).removeClass('hide');
                this.subViews.UpgradeByomapTooltipView.render();
                rePosition = this.calculateTooltipPos($(upgradeTooltipEl), {
                    'pageX': pageX,
                    'pageY': pageY
                });
                $(upgradeTooltipEl).css({
                    'top': rePosition.top,
                    'left': rePosition.left
                });
                EventHelper.track({
                    pageView: 'Ticket Listings',
                    appInteraction: 'BYOView: Upgrade Seats Icon Clicked',
                    pageload: false
                });
            } else {
                $(selectedTooltipEl).removeClass('hide');
                this.subViews.SelectedByomapTooltipView.render();
                rePosition = this.calculateTooltipPos($(selectedTooltipEl), {
                    'pageX': pageX,
                    'pageY': pageY
                });
                $(selectedTooltipEl).css({
                    'top': rePosition.top,
                    'left': rePosition.left
                });
                EventHelper.track({
                    pageView: 'Ticket Listings',
                    appInteraction: 'BYOView: Selected Seats Icon Clicked',
                    pageload: false
                });
            }
        },

        mapClone: function() {
            this.uiEl.$byoseatmap.append($('#seatmap').find('.svgcontainer').html());

            byoSvgMap = this.uiEl.$byoseatmap.find('svg').not('.switchIconMap'); //getting the mapSVG

            if (EventHelper.getBrowserName().isSafari()) {
                // Safari does not repaint the image el inside SVG..
                // BYOSeatMap Repainting Fix
                byoSvgMap.find('image').remove(); //removing image el from SVG

                // creating an image element and adding it to the SVG
                svgimg = document.createElementNS(svgns, 'image');
                svgimg.setAttribute('height', '100%');
                svgimg.setAttribute('width', '100%');
                svgimg.setAttributeNS(xlink, 'href', $('#seatmap').blueprint.getmapurl());
                byoSvgMap.prepend(svgimg);
            }

            // adding gestures for touch devices with hammer js
            if (EventHelper.isTouchDevice()) {
                this.addGestures(byoSvgMap);
            }
        },

        addGestures: function(mapEl) {
            var hammer = Hammer(mapEl[0], {
                    prevent_default: true //prevents the entire page from scrolling when the map events are triggered
                }), 
                self = this;

            mapLeft = parseInt(mapEl.css('left') === 'auto' ? 0 : mapEl.css('left'), 10);
            mapTop = parseInt(mapEl.css('top') === 'auto' ? 0 : mapEl.css('top'), 10);

            hammer.on('drag', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                self.uiEl.$byomaptooltip.addClass('hide');
                deltaX = mapLeft + ev.gesture.deltaX;
                deltaY = mapTop + ev.gesture.deltaY;

                // computedScale value will always be between 1 - 5
                // as we are setting the MIN & MAX LIMIT for the scale above
                // setting drag boundaries for the map
                if (computedScale >= 1 && computedScale <= 2) {
                    deltaXUpperLimit = 100;
                    deltaXLowerLimit = -100;
                    deltaYUpperLimit = 100;
                    deltaYLowerLimit = -100;
                } else if (computedScale > 2 && computedScale <= 3) {
                    deltaXUpperLimit = 200;
                    deltaXLowerLimit = -200;
                    deltaYUpperLimit = 200;
                    deltaYLowerLimit = -200;
                } else if (computedScale > 3 && computedScale <= 4) {
                    deltaXUpperLimit = 300;
                    deltaXLowerLimit = -300;
                    deltaYUpperLimit = 300;
                    deltaYLowerLimit = -300;
                } else {
                    deltaXUpperLimit = 400;
                    deltaXLowerLimit = -400;
                    deltaYUpperLimit = 400;
                    deltaYLowerLimit = -400;
                }

                if (deltaX >= deltaXLowerLimit && deltaX <= deltaXUpperLimit) {
                    $(this).css({
                        'left': deltaX
                    });
                }

                if (deltaY >= deltaYLowerLimit && deltaY <= deltaYUpperLimit) {
                    $(this).css({
                        'top': deltaY
                    });
                }
            });

            hammer.on('dragend', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                //updating the last mapLeft & mapTop
                mapLeft = parseInt(mapEl.css('left') === 'auto' ? 0 : mapEl.css('left'), 10);
                mapTop = parseInt(mapEl.css('top') === 'auto' ? 0 : mapEl.css('top'), 10);
            });

            hammer.on('transform', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                // Hammer js resets the transform scale to 1 on the consecutive
                // pinch this is to tranform the map from the last scale value
                // we check if the last scale value is greater than 1, if yes,
                // we use that as our scaling factor for our next computation
                if (computedScale > 1) {
                    scale = computedScale;
                }

                computedScale = ev.gesture.scale * scale; //inital scale is 1

                if (computedScale > 5) {
                    computedScale = MAX_ZOOM;
                } else if (computedScale < 1) {
                    computedScale = MIN_ZOOM;
                }

                $(this).css({'transform': 'scale(' + computedScale + ')'});
            });

            hammer.on('transformend', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();

                // if current scaling value is less than previous scale value - which means zooming out
                // then move the map towards the center based on the current scaling factor
                if (computedScale < scale) {
                    mapEl.css({
                        'left': mapLeft + (mapLeft * -1) / computedScale,
                        'top': mapTop + (mapTop * -1) / computedScale
                    });
                    EventHelper.track({
                        pageView: 'BYOView',
                        appInteraction: 'Seatmap: Zoom decreased',
                        pageload: false
                    });
                } else {
                    // zoom in
                    EventHelper.track({
                        pageView: 'BYOView',
                        appInteraction: 'Seatmap: Zoom increased',
                        pageload: false
                    });
                }
            });
        },

        blankMap: function() {
            this.uiEl.$byoseatmap.find('path').css(removeMapColors);
        },

        highlightMapSection: function(sectionId, color) {
            this.uiEl.$byoseatmap.find('#' + sectionId).css(color);
        },

        vfsSuccess: function() {
            this.uiEl.$singleTicketVfs.removeClass('hide');
            this.uiEl.$vfsSpinner.addClass('hide');
            this.uiEl.$disclaimerVfs.removeClass('hide');
            this.uiEl.$disclaimerMap.addClass('hide');
        },

        vfsFailure: function() {
            this.uiEl.$singleTicketVfs.addClass('byo-small-vfs');
            this.uiEl.$singleTicketVfs.find('#noVfsImage').attr('src', globals.noVfsImgUrl).removeClass('hide');
            this.uiEl.$vfs.addClass('hide');
            this.uiEl.$noVfsText.removeClass('hide');
            this.uiEl.$byoseatmap.removeClass('byo-small-map');
            this.uiEl.$vfsSpinner.addClass('hide');
            this.uiEl.$disclaimerVfs.addClass('hide');
            this.uiEl.$disclaimerMap.removeClass('hide');
        },

        addUpgradedTicketVfs: function(upgradeModel) {
            this.originalListing = this.model;
            this.displayListingMap('', upgradeModel);
        },

        removeUpgradedTicketVfs: function() {
            this.displayListingMap('', this.originalListing);
        },

        setOldTicketInfo: function(oldTicketModel) {
            this.originalListing = oldTicketModel;
        },

        handleTicketExpired: function() {
            this.hideListingMap();
        }

    });
    return ByoListingMapView;
});
