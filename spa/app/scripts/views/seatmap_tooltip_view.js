/*global _ */
define([
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n'
], function(Foobunny, Hammer, EventHelper, globals, gc, i18n) {
    'use strict';

    var SeatmapTooltipView = Foobunny.BaseView.extend({

        el: '#seatmap-tooltip',

        template: gc.appFolder + '/seatmap_tooltip',

        initialize: function() {
            console.log('--SeatmapTooltipView--  in initialize()', this);

            this.tooltipTypes = ['vfs', 'non-vfs', 'mini'];     // 'mini' is for zone mode, or for when ticketlist requests a tooltip
            this.tooltipSender = ['seatmap', 'ticketlist'];     // who sent a request to showTooltip()
            this.sectionStats = {};
            this.zoneStats = {};
            this.isLargeVfsVisible = false;

            this.subscribeEvent('tooltip:hide', this.hideTooltip);
            this.subscribeEvent('tooltip:reposition', this.repositionTooltip);
            this.subscribeEvent('seatmap:show', this.largeVfsHidden);
            this.subscribeEvent('seatmap:zoomChanged', this.repositionTooltip);
            this.subscribeEvent('seatmap:showTooltip', this.seatmapShowTooltip);
            this.subscribeEvent('seatmap:hideTooltip', this.hoverHideTooltip);
            this.subscribeEvent('ticketlist:showTooltip', this.ticketlistShowTooltip);
            this.subscribeEvent('ticketlist:statsFetched', this.saveFetchedStats);
            this.subscribeEvent('enlargevfs:show', this.largeVfsShown);
            this.subscribeEvent('enlargevfs:hide', this.largeVfsHidden);

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));
        },

        uiEl: {
            $tooltipVfs: '.tooltip-vfs',
            $price: '.price',
            $qty: '.qty',
            $qtyText: '.qty-text',
            $triangleTip: '.triangle-tip',
            $expandVfsButton: '.expand-vfs-button',
            $vfsTooltipImg: '.tooltip-vfs img',
            $vfsNotAvailable: '.tooltip-vfs noimage'
        },

        events: {
            'tap img' : 'showWindowVfs',
            'mouseenter' : 'hoverShowTooltip',
            'mouseleave' : 'hoverHideTooltip'
        },

        afterRender: function() {
            // Cache any auxiliary variables
            this.seatmap = $('#seatmap');

            // Tooltip type is set here, so that tipWidth and tipHeight
            // take up correct CSS height during tooltip positioning
            this.setTooltipType();
        },

        saveFetchedStats: function(data) {
            var numSections, numZones, i;
            if (data.section_stats) {
                numSections = data.section_stats.length;
                for (i = 0; i < numSections; i++) {
                    // Map each section to its sectionId
                    this.sectionStats[data.section_stats[i].sectionId] = {
                        minTicketPrice: data.section_stats[i].minTicketPrice,
                        totalTickets: data.section_stats[i].totalTickets
                    };
                }
            }
            if (data.zone_stats) {
                numZones = data.zone_stats.length;
                for (i = 0; i < numZones; i++) {
                    // Map each zoneId to an empty object. Later will be mapped to the sectionId with the minTicketPrice
                    this.zoneStats[data.zone_stats[i].zoneId] = {};
                }
            }
        },

        /* Wrapper function that calls original showTooltip() function. This function is called
         * if seatmap requested a tooltip
         */
        seatmapShowTooltip: function(id, sids) {
            var price, qty, section, zone;

            // Break out early and reset timer if tooltip for that section/zone is already displaying (don't re-render).
            if (!this.$el.hasClass('hide') &&
                (id === (this.mapHighlightedSectionId || this.mapHighlightedZoneId))) {
                this.hoverShowTooltip();
                return;
            }

            if (globals.zones_enabled) {
                zone = this.zoneStats[id];
                if (! zone) {
                    this.hideTooltip();
                    return;
                }
                this.mapHighlightedZoneId = id;
                // Set id to be the sectionId of the cheapest section
                id = this.findMinSectionId(zone, sids);
                section = this.sectionStats[id];
                if (! section) {
                    this.hideTooltip();
                    return;
                }
            }
            else {
                section = this.sectionStats[id];
                if (! section) {
                    this.hideTooltip();
                    return;
                }
            }
            price = EventHelper.formatPrice(section.minTicketPrice, true);
            qty = section.totalTickets;

            this.showTooltip(id, price, qty, this.tooltipSender[0]);
            // Clear the hoverState timer, delaying hideTooltip
            this.hoverShowTooltip();
        },

        ticketlistShowTooltip: function(sectionId, price) {
            this.showTooltip(sectionId, price, 0, this.tooltipSender[1]);
        },

        showTooltip: function(sectionId, price, qty, sender) {
            // We need to update the incoming information for mobile use case.
            // Ticket is opened, user clicks on VFS image, user opens another ticket.
            this.mapHighlightedSectionId = sectionId;
            this.mapHighlightedSectionPrice = price;    // use price.split('.')[0] to discard the cent values
            this.mapHighlightedSectionQty = qty;
            this.mapHighlightedSectionSender = sender;

            // If we do not have the seatmap then
            // hide the tooltip and then no further processing required.
            if (!this.seatmap || this.seatmap.blueprint.isMapStatic() || !sender) {
                this.hideTooltip();
                return;
            }

            // In case the user has dragged or changed the map in some way
            this.updateMapInfo();

            // Set tooltip type to be in 'mini' style if sender/publisher was 'ticketlist'
            if (sender === this.tooltipSender[1]) {
                this.setTooltipType(this.tooltipTypes[2]);
            }

            // To generate the tooltip, we need to first determine where to place it
            var coord = this.getTooltipCoord();
            if (!coord) {
                this.hideTooltip();
                return;
            }

            // Display the tooltip only if the large vfs is not visible.
            if (!this.isLargeVfsVisible) {
                this.$el.removeClass('hide');
            }
            // Set the x and y position for the tooltip
            this.$el.css({ 'left': coord.l, 'top': coord.t });

            if (!EventHelper.isMobile()) {
                // Show detailed tooltip
                var qtyTextString = (qty === 1) ? 'event.common.ticket.text' : 'event.common.tickets.text';
                this.uiEl.$qty.text(this.mapHighlightedSectionQty);
                this.uiEl.$qtyText.text(i18n.get(qtyTextString));

                if (this.tooltipType === this.tooltipTypes[0]) {
                    this.getTooltipVfs(this.mapHighlightedSectionId);
                }
            }
            this.uiEl.$price.html(this.mapHighlightedSectionPrice);
        },

        hideTooltip: function() {
            this.$el.addClass('hide');
        },

        hoverShowTooltip: function() {
            // At this point, the seatmap tooltip is showing. Clear the hoverState timer
            // so as to delay hiding the tooltip. This function is called on mouseenter
            // and in seatmapShowTooltip()
            clearTimeout(this.hoverState);
        },

        hoverHideTooltip: function() {
            var self = this,
                hoverState = setTimeout(function() {
                    self.hideTooltip();
                    self.publishEvent('seatmap:dehighlightSection');
                }, 120);
            // Set the hoverState timeout, so that on mouse leave it sets a delay for it to disappear.
            // If the mouse enters the tooltip before the delay is triggered, then we clear
            // the trigger before it goes off in hoverState, thereby delaying hideTooltip
            this.hoverState = hoverState;
        },

        // Repositioning of the tooltip is required when the user selects a ticket, then selects another ticket,
        // and then clicks on the enlarges the seat map. The tooltip in this case is not positioned properly.
        // This use case was seen while testing on phone.
        // IMPORTANT: For this issue to occur there should be no scrolling of the ticket list whatsoever.
        repositionTooltip: function() {
            this.showTooltip(this.mapHighlightedSectionId,
                                this.mapHighlightedSectionPrice,
                                this.mapHighlightedSectionQty,
                                this.mapHighlightedSectionSender);
        },

        getTooltipCoord: function() {
            var l, t, ratio, section, totalLength, point1, point3, sectionData, arr ;

            //4096 is the max width ever for the map
            ratio = 4096 / this.mapSize;

            //return if section is null for some reason
            section = this.seatmap.blueprint.getSectionNode(this.mapHighlightedSectionId);
            
            if (section === null) {		
                return null;		
            }
            //section coordinates, from the bounding box of each section
            totalLength = section.getTotalLength();
            sectionData = this.seatmap.blueprint.getSectionData( this.mapHighlightedSectionId );

            arr = sectionData.p.split('M');
            if (arr.length>2 ) {
            	point1 = section.getPointAtLength( totalLength*5/8 );
	        	point3 = section.getPointAtLength( totalLength*7/8 );
            }else{
	            point1 = section.getPointAtLength( totalLength/4 );
	        	point3 = section.getPointAtLength( totalLength*3/4 );
            }

            l = parseInt( ( point1.x + (point3.x - point1.x )/2 )/ratio, 10);
            t = parseInt( ( point1.y + (point3.y - point1.y )/2 )/ratio, 10);

            if (EventHelper.isMobile()) {
                // in tablet or mobile, also check if the tooltip will fall
                // all in the view, adjust the positioning if it does
                if ((l + this.tipWidth) > this.mapSize) {
                    l = this.mapSize - this.tipWidth;
                }
                if ((t + this.tipHeight) > this.mapSize) {
                    t = this.mapSize - this.tipHeight;
                }
            }
            else {
                // In desktop, offset the tooltip such that the tip is pointed at the section's center
                t = t - this.tipHeight;
            }

            l = l + this.mapOffset.x + this.seatmapoffset.left;
            t = t + this.mapOffset.y + this.seatmapoffset.top;

            return { t: t, l: l };
        },

        getTooltipVfs: function(sectionId) {
            var vfsImg = new Image(),
                self = this;

            vfsImg.onload = function() {
                // This if statement takes care of the edge case where the map has vfs imgs available, but
                // a vfs img for an earlier section failed to be retrieved. In that case, it was reverted to 'non-vfs'.
                // Here we change the tooltip type back to 'vfs' since vfs imgs for the current section is available.
                if (self.tooltipType === self.tooltipTypes[1]) {
                    self.$el.removeClass(self.tooltipTypes[1]).addClass(self.tooltipTypes[0]);
                    self.tooltipType = self.tooltipTypes[0];
                    self.updateTooltipInfo();
                }
                self.uiEl.$vfsTooltipImg.attr('src', this.src);
                self.uiEl.$vfsTooltipImg.slideDown();
                self.uiEl.$expandVfsButton.removeClass('hide');
            };
            vfsImg.onerror = function() {
                // On error, we display the vfs not available message.
                self.uiEl.$vfsTooltipImg.slideUp();
                self.uiEl.$expandVfsButton.addClass('hide');

                // Log the vfs failure.
                EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
            };
            vfsImg.src = EventHelper.getVfsUrl(sectionId, 'small');
        },

        layoutSettings: function() {
            // When the window is being resized, hide the tooltip
            this.hideTooltip();
            this.updateMapInfo();
            this.updateTooltipInfo();
        },

        updateTooltipInfo: function() {
            this.tipWidth = this.$el.outerWidth();
            this.tipHeight = this.$el.outerHeight() + this.uiEl.$triangleTip.outerHeight();
        },

        updateMapInfo: function() {
            if (!this.seatmap) {
                return;
            }

            this.mapSize = this.seatmap.blueprint.getMapSize();
            this.mapOffset = this.seatmap.blueprint.getMapOffset();
            this.seatmapoffset = this.seatmap.offset();

            // If there is a mismatch between tooltip type and vfs availability, that means (CASE 1) a vfs
            // img failed failed to load, or (CASE 2) the seatmap was previously in zone mode and the tooltip
            // was reverted to non-vfs in getTooltipVfs(). Here, we revert back to its original tooltip type
            // in an attempt to retrieve a vfs image. For (CASE 1), just because one vfs img fails to load
            // doesn't mean all subsequent vfs images will fail to load.
            this.setTooltipType();
        },

        findMinSectionId: function(zone, sections) {
            // If the user hovered over this zone previously, we have already cached the minSectionId
            if (zone.minSectionId) {
                return zone.minSectionId;
            }
            var sectionsLength = sections.length,
                minPrice = Number.MAX_SAFE_INTEGER,
                minIndex = 0,
                section;
            for (var i = 0; i < sectionsLength; i++) {
                section = this.sectionStats[sections[i]];
                if (section && (section.minTicketPrice < minPrice)) {
                    minPrice = section.minTicketPrice;
                    minIndex = i;
                }
            }
            zone.minSectionId = sections[minIndex];
            return zone.minSectionId;
        },

        /* Optional parameter to set the tooltip type.
         * The default is to allow zone_mode or vfs_availability to determine tooltip type.
         *      this.tooltipTypes = [ 'vfs', 'non-vfs', 'mini' ]
         */
        setTooltipType: function(tooltipType) {
            var type = tooltipType || (globals.zones_enabled ? this.tooltipTypes[2] :
                                      (globals.vfs_available ? this.tooltipTypes[0] : this.tooltipTypes[1]));
            if (this.tooltipType === type) {
                return; // Break out early since tooltip type is same
            }
            // Remove original tooltip style type
            this.$el.removeClass(this.tooltipType);

            // Set new tooltip style type
            this.tooltipType = type;
            this.$el.addClass(this.tooltipType);

            this.updateTooltipInfo();
        },

        showWindowVfs: function() {
            this.publishEvent('showWindowVfs', this.mapHighlightedSectionId);

            EventHelper.track({pageView: 'Map', appInteraction: 'VFS expanded', pageload: false});
        },

        largeVfsShown: function() {
            this.isLargeVfsVisible = true;
        },

        largeVfsHidden: function() {
            this.isLargeVfsVisible = false;
            this.repositionTooltip();
        }
    });

    return SeatmapTooltipView;
});
