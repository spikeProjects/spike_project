/****************************************************************
 *  BLUEPRINT JS - StubHub Interactive Seatmap API
 *  Designed for desktop and mobile devices
 *  Copyright (c) 2009 - 2014 StubHub, Inc. All rights reserved.
 *  version 1.0.36
 *****************************************************************/

define('blueprint',[
    'jquery',
    'raphael',
    'hammer'
], function($, Raphael, Hammer) {
    'use strict';

    var mapVisibleWidth, mapVisibleHeight, containerSize, newContainerSize, originalContainerSize, // map dimensions
        prevZoomLevel, zoomLevel,
        sf = 1.00, // current scale factor
        nsf = 1.00, // new scale factor
        px = 0.00, // current mapContainer position x
        py = 0.00, // current mapContainer position y
        touchx = 0.00, // current touch pageX during drag
        touchy = 0.00, // current touch pageY during drag
        deltaX = 0.00, // change in transformation
        deltaY = 0.00, // change in transformation
        transforming = false, // true while user is pinching, false once 2nd finger lifts
        dragstartpos = {},
        ondragpos = {},
        transformOrigin = [0, 0],
        $map, $mapContainer, $svgContainer, $ticketlistContainer, $ticketItems, // cached jQuery elements
        canvasImage,
        selectedSections = [],
        availableSections = {},
        zones = {},
        ticketsInZone = {},
        highlightedSections = [],
        totalTickets = 0,
        ticketStartPrice = 999999,
        ie8 = (navigator.userAgent.match(/msie 8/i)) ? true : false,
        zoomRatio = 128,
        mapMaxSize = 4096,
        domainBuffer = 6,
        domainPtr = 0,
        domainCount = 0, // used for parallelizing loading of image tiles
        mousePressed = false,
        mouseCoord = [0, 0], // stores the original pointer coordinates on mousepress when dragging map
        hammer, canvas, // Raphael canvas
        filteredSections = [],
        isMapFiltered = false,
        mapReady = false,
        dragged = false,
        mapStatic = false,
        csstransform = '',
        protocol = 'http:',
        callbacks = {
            onSectionOver: [],
            onSectionOut: [],
            onSectionBlur: [
                function() {
                    if (isMapFiltered) {
                        handleFilterSections(filteredSections);
                    } // always refilter sections upon sectionBlur if user is in filter mode
                }
            ],
            onSectionFocus: [],
            onZoomChange: [],
            onMapReady: [
                // if 'hybrid', start map in section mode
                function() {
                    if (opts.mapDisplayType === 'hybrid') {
                        $map.blueprint.toSectionMode(Object.keys($map.blueprint.getZones()));
                    }
                }
            ]
        },
        mouseuped = false;   //when click on section, after mouseup, needed fire tap.

    // default options
    var defaultOptions = function() {
        return {
            nodeId: '0000',
            configId: '0000',
            version: '0',
            eventId: '0000', // passing in the event ID isn't compatible with jqmobi
            token: '0000',
            mapType: '2d',
            mapDisplayType: 'section', // 'section' | 'zone' | 'hybrid' (special path toFront()/toBack() behavior for 'hybrid' maps)
            appendToken: true,
            checkForInteractiveMap: true,
            minZoom: 1,
            maxZoom: 24,
            initialZoom: 0,
            initialPosition: 'center',
            stickToEdge: true,
            autoFetchMetadata: true,
            environment: 'prod',
            server: 'stubhub',
            imgBaseDomains: ['cache11.stubhubstatic.com', 'cache12.stubhubstatic.com', 'cache13.stubhubstatic.com',
                'cache21.stubhubstatic.com', 'cache22.stubhubstatic.com', 'cache23.stubhubstatic.com',
                'cache31.stubhubstatic.com', 'cache32.stubhubstatic.com', 'cache33.stubhubstatic.com'
            ],
            tileBaseUrl: '{{protocol}}//{{imgBaseDomains}}/seatmaps/venues/{{nodeId}}/config/{{configId}}/{{version}}/{{mapType}}/maptiles/',
            metadataUrl: 'https://api.{{server}}.com/catalog/venues/v2/{{nodeId}}/venueconfig/{{configId}}/metadata?maptype=2d',
            ticketApiUrl: '{{protocol}}//www.{{server}}.com/ticketAPI/restSvc/event/',
            inventoryApiUrl: 'https://api.{{server}}.com/search/inventory/v1/sectionsummary?eventID={{eventId}}',
            venueConfigApiUrl: '/shape/catalog/venues/v3/venueconfigurations',
            eventApiUrl: '/shape/catalog/events/v3/{{eventId}}',
            staticMapBaseUrl: '{{protocol}}//www.{{server}}.com/data/venue_maps/{{nodeId}}/',
            viewFromSection: true,
            useInventoryApi: false,
            useStubHubStyle: true,
            enablePinchToZoom: true,
            enableTouchEvents: true,
            staticMapFallback: true,
            selectSectionsByZone: false,
            multiSelectSection: true,
            defaultZoomControl: true,
            autoResizeMap: false,
            allowMapDrag: true,
            onSectionOver: function() {},
            onSectionOut: function() {},
            onSectionFocus: function() {}, // accepts an array of section ids
            onSectionBlur: function() {}, // accepts an array of section ids
            onZoomChange: function() {},
            onMapReady: function() {},
            beforeMapError: function() {}, // callback before a map error is triggered
            onMapError: function(errCode, errMsg, thisMap) {
                if (typeof console !== 'undefined' || typeof console.log !== 'undefined') {
                    console.log('*onMapError* ' + errCode + ', ' + errMsg);
                }
                if ((errCode === 9) || (errCode === 11)) {
                    if (opts.staticMapFallback) {
                        mapStatic = true;
                        initialize(thisMap);
                    } else {
                        throw new Error(errMsg);
                    }
                } else if (errCode === 10) {
                    getStaticMap();
                } else {
                    triggerCallback('onMapReady', [0]);
                    // opts.onMapReady(0);
                    throw new Error(errMsg);
                }
            }
        };
    };
    var opts = defaultOptions();

    var loadStaticMap = function(staticImageUrl) {

        var staticMapUrl = staticImageUrl?
        		(opts.staticMapBaseUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server).replace('{{nodeId}}', opts.nodeId) + staticImageUrl)
        			: opts.comingSoonImgUrl;

        if (canvas !== undefined) {
            var myImg = new Image();
            myImg.onload = function() {
                var curImg = $('svg').find('image');
                if (curImg.length > 0) {
                    curImg[0].href.baseVal = staticMapUrl;
                } else {
                    canvasImage = canvas.image(staticMapUrl, 0, 0, (mapMaxSize), (mapMaxSize));
                }
                handleLoadMetadata({});
            };
            myImg.onerror = staticMapFailHandler;
            myImg.src = staticMapUrl;
        } else {
            $map.html('<img src=\'' + staticMapUrl + '\'/>');
            $map.find('img').css('width', $map.css('width')); // fixes map width within viewport on Android 2.3
        }
    };

    var staticMapFailHandler = function() {
        // error code 15: error loading static map
        opts.beforeMapError.call(15);
        opts.onMapError.call(null, 15, 'ERR15: could not retrieve static map url', $map[0]);
        mapReady = false;
    };

    var getStaticMap = function() {
    	loadStaticMap(opts.staticImageUrl);
    };

    var getJSONP = function(url, data, jsonp, success) {
        $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonp: jsonp,
            data: data,
            cache: true,
            contentType: '',
            success: success
        });
    };

    var getMetadata = function() { // sectionpaths.json is generated from the svg parser script
        $.ajax({
            url: opts.metadataUrl,
            dataType: 'json',
            contentType: '',
            success: function(data) {
                handleLoadMetadata(data);
            },
            error: function(err) {
                // error code 11: error fetching map metadata from api gateway
                opts.beforeMapError.call(11);
                opts.onMapError.call(null, 11, 'ERR11: error fetching map metadata from api gateway ' + opts.metadataUrl, $map[0]);
                mapReady = false;
            },
            beforeSend: function(xhr) {
                if (opts.appendToken) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + opts.token);
                }
            }
        });

    };

    // later change isTypeZone() to check section.t instead of parsing section.na
    // can't depend on section.t yet until map design team names zones paths 'zone XXXXXX' in svg
    var isTypeZone = function(sectionId) { // helper for handleLoadMetadata()
        var section = $.fn.blueprint.venueSections[sectionId];
        if (section && section.na) {
            var sectionType = section.na.split(' ')[0]; // section can be type 'Section' or 'Zone'
            return sectionType === 'Zone';
        }
        return false;
    };

    var handleLoadMetadata = function(data) { // callback function from successful metadata fetch
        if (data instanceof Object) {
            $.fn.blueprint.venueSections = data;

            // reconstruct data by zones
            for (var s in $.fn.blueprint.venueSections) {
                if (s !== 'bbox' && s !== '') {
                    var zoneId = $.fn.blueprint.venueSections[s].zi;
                    var isZonePath = isTypeZone(s);
                    if (zoneId in zones) { // add section to zone in zone array
                        if (zones[zoneId].sections.indexOf(s) < 0 && !isZonePath) { // don't add zone paths to zone.sections
                            zones[zoneId].sections.push(s);
                        }
                    } else { // add zone to zones array
                        zones[zoneId] = {
                            sections: (!isZonePath ? [s] : []), // don't add zone paths to zone.sections
                            color: $.fn.blueprint.venueSections[s].c,
                            name: $.fn.blueprint.venueSections[s].z
                        };
                    }
                    if (isZonePath) { // add path ID to zone
                        zones[zoneId].path = s;
                    }
                }
            }

            renderSections();

        } else {
            // error code 12: error parsing map metadata
            opts.beforeMapError.call(12);
            opts.onMapError.call(null, 12, 'ERR12: error parsing map metadata', $map[0]);
            mapReady = false;
        }
    };

    var isTouchDevice = function() {
        return !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
    };

    var isStyleValid = function(style) { // checks whether style is properly defined with
        if (style === null) {
            return false;
        } // following mandatory attributes
        else { // 'fill', 'fill-opacity', 'stroke', stroke-width', 'stroke-opacity'
            return (style.hasOwnProperty('fill') &&
                style.hasOwnProperty('fill-opacity') &&
                style.hasOwnProperty('stroke') &&
                style.hasOwnProperty('stroke-width') &&
                style.hasOwnProperty('stroke-opacity'));
        }
    };

    var contains = function(array, value) {
        var index = -1,
            length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return true;
            }
        }
        return false;
    };

    var objectSize = function(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    var convertToString = function(ints) { // converts int or array of ints to string format
        // strings or non-ints are returned as is
        if (typeof ints === 'number') {
            ints = ints.toString();
        } else if (ints instanceof Array && typeof ints[0] === 'number') {
            for (var i = 0; i < ints.length; i++) {
                ints[i] = ints[i].toString();
            }
        }
        return ints;
    };

    /* Events on section elements */

    var handleSectionMouseOver = function(evt, el) {
        $map.css('cursor', 'pointer');
        if ($.fn.blueprint.venueSections[el.id].state === 'default') {
            if (opts.selectSectionsByZone === true) {
                var allSectionsInZone = zones[$.fn.blueprint.venueSections[el.id].zi].sections;
                handleHighlightSections(allSectionsInZone);
            }
            else {
                el.attr(opts.hoverStyle);
            }
        }
        // trigger callbacks for onSectionOver
        triggerCallback('onSectionOver', [evt, el.id]);
    };

    var handleSectionMouseOut = function(evt) {
        $map.css('cursor', '');
        if ($.fn.blueprint.venueSections[this.id].state === 'default') {
            if (opts.selectSectionsByZone === true) {
                handleDehighlightSections();
            }
            else {
                this.attr(this.data('defaultStyle'));
            }
        }
        // trigger callbacks for onSectionOut
        triggerCallback('onSectionOut', [evt, this.id]);
    };

    var handleSectionDown = function(el) { // fired when section is clicked / tapped
        var state = $.fn.blueprint.venueSections[el.id].state;
        var s = el.data('section');
        var ind = selectedSections.indexOf(s);
        if (state === 'selected') {
            // if section is selected and section is filtered, deselect it
            // if section is selected and section is unfiltered, deselect it and set style to filteredOutStyle
            if (filteredSections.length > 0) {
                if (filteredSections.indexOf(s) >= 0) {
                    el.attr(el.data('defaultStyle'));
                    $.fn.blueprint.venueSections[el.id].state = 'default';
                    selectedSections.splice(ind, 1);
                } else {
                    el.attr(opts.filteredOutStyle);
                    $.fn.blueprint.venueSections[el.id].state = 'filtered';
                    selectedSections.splice(ind, 1);
                }
            } else {
                el.attr(el.data('defaultStyle'));
                $.fn.blueprint.venueSections[el.id].state = 'default';
                selectedSections.splice(ind, 1);
            }
        } else {
            if (filteredSections.length > 0) {
                if (filteredSections.indexOf(el.id) >= 0) {
                    if (opts.multiSelectSection === false) {
                        if (selectedSections.length > 0) {
                            handleSectionDown(canvas.getById(selectedSections[0]));
                        }
                    }
                }
                if (($.fn.blueprint.venueSections[el.id].state !== 'filtered') && ($.fn.blueprint.venueSections[el.id].state !== 'unavailable')) {
                    el.attr(opts.selectedStyle);
                    $.fn.blueprint.venueSections[el.id].state = 'selected';
                    selectedSections.push(s);
                }
            } else {
                if (opts.multiSelectSection === false) {
                    if (selectedSections.length > 0) {
                        handleSectionDown(canvas.getById(selectedSections[0]));
                    }
                }
                if ($.fn.blueprint.venueSections[el.id].tix) {
                    el.attr(opts.selectedStyle);
                    $.fn.blueprint.venueSections[el.id].state = 'selected';
                    selectedSections.push(s);
                }
                // following conditional is for hybrid maps
                if (($.fn.blueprint.venueSections[el.id].zoneTix !== undefined) && ($.fn.blueprint.venueSections[el.id].zoneTix)) {
                    el.attr(opts.selectedStyle);
                    $.fn.blueprint.venueSections[el.id].state = 'selected';
                    selectedSections.push(s);
                }
            }
        }
    };

    var renderSections = function() { // render sections on canvas
        if (!mapStatic) {
            var el;
            for (var section in $.fn.blueprint.venueSections) {
                el = canvas.path($.fn.blueprint.venueSections[section].p);

                if (section === 'bbox') { // exclude bounding box
                    el.attr({
                        opacity: 0
                    });
                } else {
                    el.node.setAttribute('zid', $.fn.blueprint.venueSections[section].zi );
                    /* Draw sections and bind events to them */
                    el.id = el.node.id = section;

                    // by default draw all sections as unavailable
                    $.extend($.fn.blueprint.venueSections[section], {
                        state: 'unavailable',
                        tix: false
                    });
                    el.data('section', section);

                    // default coloring should be the 'noTicketsStyle'
                    el.data('defaultStyle', opts.noTicketsStyle);
                    el.attr(el.data('defaultStyle'));

                    // bind section mouseout event
                    el.mouseout(handleSectionMouseOut);
                }
            }
        }

        // get map size
        mapVisibleWidth = $map.width();
        mapVisibleHeight = $map.height();

        // set map to zoomlevel 4 first to set originalContainerSize to that level
        var currentZoom = 4;
        containerSize = zoomRatio * currentZoom;
        originalContainerSize = containerSize;
        prevZoomLevel = currentZoom;

        // set initial zoom if initialZoom is passed (else it will auto-resize the map)
        if (opts.initialZoom !== 0) {
            currentZoom = opts.initialZoom;
        } else {
            // get optimum zoom level for current map size
            currentZoom = parseFloat(Math.min(mapVisibleHeight, mapVisibleWidth) / zoomRatio);
            if (currentZoom === 0) {
                currentZoom = 1;
            }
        }
        if (mapStatic) {
            // if map is static, set default zoom to 4 and hide zoom control
            currentZoom = 4;

        }
        handleZoomMap(currentZoom);
        canvas.setSize(containerSize, containerSize);
        handlePositionMap(opts.initialPosition, false, true);

        // reset size to containerSize if browser is ie8
        if (ie8) {
            canvas.setViewBox(0, 0, containerSize, containerSize);
        }

        // only fetch tickets if an event id is passed in as parameter
        if (opts.eventId !== '0000') {
            handleFetchTickets();
        } else {
            // map is ready
            mapReady = true;
            triggerCallback('onMapReady', [1]);
            // opts.onMapReady(1);
        }

    };

    var getImageDomain = function(seed) {
        if (seed) {
            var l = opts.imgBaseDomains.length;
            var _seed = parseInt(seed, 10) % l;
            return opts.imgBaseDomains[_seed];
        }
        var currentBaseDomain = opts.imgBaseDomains[domainPtr];
        domainCount = domainCount + 1;
        if (domainCount === domainBuffer) {
            domainCount = 0;
            domainPtr = domainPtr + 1;
            if (domainPtr === opts.imgBaseDomains.length) {
                domainPtr = 0;
            }
        }
        return currentBaseDomain;
    };

    var constructBkgImageUrl = function(row, col, zoom) { // alternates through a list of server base domains
        var currentBaseDomain = getImageDomain();
        return [opts.tileBaseUrl.replace('{{protocol}}', protocol).replace('{{imgBaseDomains}}', currentBaseDomain), zoom, '-', row, '-', col, '.jpg'].join('');
    };

    var handleMouseDown = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        $mapContainer.removeClass('smooth').addClass('hwacc');
        $svgContainer.addClass('hwacc');
        if (ie8) {
            mouseCoord[0] = e.clientX;
            mouseCoord[1] = e.clientY;
        } else {
            mouseCoord[0] = e.pageX;
            mouseCoord[1] = e.pageY; // update current mouse coordinates
        }
        mousePressed = true;
        return false;
    };

    var handleMouseUp = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        $mapContainer.removeClass('hwacc');
        $svgContainer.removeClass('hwacc');
        if (dragged === false) {
            if ((e.srcElement) && (e.srcElement.nodeName === 'shape') && (e.srcElement.id) && ($.fn.blueprint.venueSections[e.srcElement.id].state === 'unavailable')) {
                mousePressed = false;
                dragged = false;
                return;
            }
            if ((e.target) &&
                (e.target.nodeName === 'path') &&
                (e.target.id) &&
                (($.fn.blueprint.venueSections[e.target.id].state === 'unavailable') || ($.fn.blueprint.venueSections[e.target.id].state === 'filtered'))) {
                mousePressed = false;
                dragged = false;
                return;
            }

            var targetId = '';
            if ((e.srcElement) && (e.srcElement.nodeName === 'shape')) {
                targetId = e.srcElement.id;
            } else if ((e.target) && (e.target.nodeName === 'path')) {
                targetId = e.target.id;
            }

            if (targetId !== '') {
                var el;
                var sectionWasSelected = true;
                if (selectedSections.indexOf(targetId) >= 0) {
                    sectionWasSelected = false;
                }
                if (opts.selectSectionsByZone) {
                    var zoneId = $.fn.blueprint.venueSections[targetId].zi;
                    for (var s = 0; s < zones[zoneId].sections.length; s++) {
                        el = canvas.getById(zones[zoneId].sections[s]);
                        handleSectionDown(el);
                    }
                } else {
                    el = canvas.getById(targetId);
                    handleSectionDown(el);
                }
                if (sectionWasSelected) {
                    // trigger callbacks for onSectionFocus
                    triggerCallback('onSectionFocus', [targetId]);
                } else {
                    // trigger callbacks for onSectionBlur
                    triggerCallback('onSectionBlur', [targetId]);
                }
            }
        }
        mousePressed = false;
        dragged = false;
        
        mouseuped = true;
        setTimeout(function(){
        	mouseuped = false;
        }, 300);
    };

    var handleMouseMove = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        var delta, el;
        if (ie8) {
            if ((e.srcElement) && (e.srcElement.nodeName === 'shape') && (e.srcElement.id)) {
                el = canvas.getById(e.srcElement.id);
                handleSectionMouseOver(e, el);
            } else {
                if (mousePressed && opts.allowMapDrag) {
                    dragged = true;
                    delta = [e.clientX - mouseCoord[0], e.clientY - mouseCoord[1]];
                    mouseCoord[0] = e.clientX;
                    mouseCoord[1] = e.clientY;
                    handleMapPan(e, delta);
                }
            }
        } else {
            if (mousePressed && opts.allowMapDrag) {
            	if( isTouchDevice()&& ((e.pageX - mouseCoord[0])<1 || (e.pageY - mouseCoord[1])<1) ) return;
                dragged = true;
                delta = [e.pageX - mouseCoord[0], e.pageY - mouseCoord[1]];
                mouseCoord[0] = e.pageX;
                mouseCoord[1] = e.pageY;
                handleMapPan(e, delta);
            } else {
                if ((e.srcElement) && (e.srcElement.nodeName === 'shape') && (e.srcElement.id)) {
                    el = canvas.getById(e.srcElement.id);
                    handleSectionMouseOver(e, el);
                } else if ((e.target) && (e.target.nodeName === 'path') && (e.target.id)) {
                    el = canvas.getById(e.target.id);
                    handleSectionMouseOver(e, el);
                }
            }
        }
        return false;
    };

    var handleMouseLeave = function(e) { // stop panning if mouse leaves map
        if (e.preventDefault) {
            e.preventDefault();
        }
        mousePressed = false;
    };

    var handleMouseWheel = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        $map.trigger('scroll', [e]);
        return false;
    };

    var getMapPanBounds = function() { // calculate min and max x and y that user can pan map with stickToEdge:true
        var mapWidth = $map.width();
        var mapHeight = $map.height();
        var containerWidth = containerSize; // svg width
        var containerHeight = containerSize; // svg height

        var adjustSize = containerSize * 0.04; // allow user to pan extra 4% on each side of map

        var minX, maxX, minY, maxY;
        if (containerWidth <= mapWidth) {
            minX = -adjustSize;
            maxX = mapWidth + adjustSize - containerWidth;
        } else {
            minX = mapWidth - containerWidth;
            maxX = 0;
        }
        if (containerHeight <= mapHeight) {
            minY = -adjustSize;
            maxY = mapHeight + adjustSize - containerHeight;
        } else {
            minY = mapHeight - containerHeight;
            maxY = 0;
        }
        return [minX, maxX, minY, maxY];
    };

    var boundXY = function(x, y) { // check proposed x, y to pan to and return x, y within stickToEdge limits
        if (opts.stickToEdge === true) {
            var bounds = getMapPanBounds();
            if (x < bounds[0]) { // x < min x
                x = bounds[0];
            }
            if (x > bounds[1]) { // x > max x
                x = bounds[1];
            }
            if (y < bounds[2]) { // y < min y
                y = bounds[2];
            }
            if (y > bounds[3]) { // y > max y
                y = bounds[3];
            }
        }
        return [x, y];
    };

    var handleMapPan = function(e, delta) {
        if (ie8) {
            var l = $mapContainer.css('left');
            var t = $mapContainer.css('top');
            if (l === 'auto') {
                l = 0;
            } else {
                l = parseInt(l);
            }
            if (t === 'auto') {
                t = 0;
            } else {
                t = parseInt(t);
            }
            var lt = boundXY(l + delta[0], t + delta[1]); // limit panning to stickToEdge bounds
            $mapContainer.css({
                left: lt[0] + 'px',
                top: lt[1] + 'px'
            });
        } else {
            var xy = boundXY(px + delta[0], py + delta[1]); // limit panning to stickToEdge bounds
            px = xy[0];
            py = xy[1];

            $mapContainer.css(csstransform, 'matrix(' + sf + ', 0, 0, ' + sf + ', ' + px + ', ' + py + ')');
        }
    };

    var handleMapScroll = function(e, evt) {
        var delta = [];
        var deltaX = 0;
        var deltaY = 0;
        var eventData;
        var ie = false;
        if (evt !== undefined) {
            eventData = evt;
        } else {
            eventData = e;
        }
        eventData = (eventData.originalEvent !== undefined) ? eventData = eventData.originalEvent : eventData;

        if (eventData.wheelDelta && !eventData.wheelDeltaX) { // IE9
            ie = true;
        }

        if (eventData.wheelDeltaX) { // Chrome/Safari
            deltaX = eventData.wheelDeltaX / 10;
            deltaY = eventData.wheelDeltaY / 10;
        } else {
            delta = eventData.detail * 13; // Mozilla
            if (eventData.axis === 1) { // horizontal pan
                deltaX = -delta;
            } else {
                deltaY = -delta;
            }
        }
        if (ie) {
            return;
        } // do not allow pan with mousewheel in IE browsers
        delta = [deltaX, deltaY];
        handleMapPan(e, delta);
    };

    var handleZoomIn = function() {
        handleZoomMap(zoomLevel + 1);
    };

    var handleZoomOut = function() {
        handleZoomMap(zoomLevel - 1);
    };

    var handleZoomMap = function(newZoomLevel, smooth) {
        if (newZoomLevel < opts.minZoom) {
            newZoomLevel = opts.minZoom;
        }
        if (newZoomLevel > opts.maxZoom) {
            newZoomLevel = opts.maxZoom;
        }
        if (newZoomLevel === opts.minZoom) {
            // dim zoom out button
            $('.zoomout').addClass('zoommaxmin');
        } else if (newZoomLevel === opts.maxZoom) {
            // dim zoom in button
            $('.zoomin').addClass('zoommaxmin');
        } else {
            if ((zoomLevel === opts.minZoom) || (zoomLevel === opts.maxZoom)) {
                // remove dim on zoom buttons
                $('.zoomout').removeClass('zoommaxmin');
                $('.zoomin').removeClass('zoommaxmin');
            }
        }

        containerSize = zoomRatio * newZoomLevel;
        originalContainerSize = containerSize;
        sf = parseFloat(containerSize / originalContainerSize);
        if (zoomLevel === undefined) {
            zoomLevel = 1;
        }
        var delta = ((zoomRatio * zoomLevel) - containerSize) / 2;
        px += delta;
        py += delta;
        if (smooth) {
            $mapContainer.addClass('smooth').bind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend', function() {
                $mapContainer.removeClass('smooth');
            });
        }
        $mapContainer.css(csstransform, 'matrix(' + sf + ', 0, 0, ' + sf + ', ' + px + ', ' + py + ')');
        if (!smooth) {
            $mapContainer.removeClass('smooth');
        }
        canvas.setSize(containerSize, containerSize);

        prevZoomLevel = zoomLevel;
        zoomLevel = newZoomLevel;

        // trigger callbacks for onZoomChange
        triggerCallback('onZoomChange', [zoomLevel]);
    };

    var handleResizeMap = function() {
        if ($map.blueprint && mapReady) {
            // get map size
            mapVisibleWidth = $map.width();
            mapVisibleHeight = $map.height();
            // get appropriate zoom level for current map size
            var z = parseFloat(Math.min(mapVisibleHeight, mapVisibleWidth) / zoomRatio);

            if ((z >= opts.minZoom) && (z <= opts.maxZoom)) {
                handleZoomMap(z);
                handlePositionMap('center');
            }
        }
    };

    var handlePositionMap = function(action, smooth, force) {
        // repositions the map to one of the following:
        // topleft, top, topright, left, center, right, bottomleft, bottom, bottomright
        mapVisibleWidth = $map.width();
        mapVisibleHeight = $map.height();
        var reposition = {
            topleft: function() {
                px = 0;
                py = 0;
            },
            top: function() {
                px = (mapVisibleWidth - containerSize) / 2;
                py = 0;
            },
            topright: function() {
                px = mapVisibleWidth - containerSize;
                py = 0;
            },
            left: function() {
                px = 0;
                py = (mapVisibleHeight - containerSize) / 2;
            },
            center: function() {
                px = (mapVisibleWidth - containerSize) / 2;
                py = (mapVisibleHeight - containerSize) / 2;
            },
            right: function() {
                px = mapVisibleWidth - containerSize;
                py = (mapVisibleHeight - containerSize) / 2;
            },
            bottomleft: function() {
                px = 0;
                py = mapVisibleHeight - containerSize;
            },
            bottom: function() {
                px = (mapVisibleWidth - containerSize) / 2;
                py = mapVisibleHeight - containerSize;
            },
            bottomright: function() {
                px = mapVisibleWidth - containerSize;
                py = mapVisibleHeight - containerSize;
            }
        };
        if (force || ($map.blueprint && mapReady)) {
            if (action in reposition) {
                reposition[action]();
            } else {
                opts.beforeMapError.call(16);
                opts.onMapError.call(null, 16, 'ERR16: ' + action + ' is not a valid action', $map[0]);
            }
            if (ie8) {
                $mapContainer.css({
                    left: px + 'px',
                    top: py + 'px'
                });
            } else {
                if (smooth) {
                    $mapContainer.addClass('smooth').bind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend', function() {
                        $mapContainer.removeClass('smooth hwacc');
                        $svgContainer.removeClass('hwacc');
                    });
                }
                $mapContainer.addClass('hwacc');
                $svgContainer.addClass('hwacc');
                $mapContainer.css(csstransform, 'matrix(' + sf + ', 0, 0, ' + sf + ', ' + px + ', ' + py + ')');
                if (!smooth) {
                    $mapContainer.removeClass('smooth hwacc');
                    $svgContainer.removeClass('hwacc');
                }
            }
        }
    };

    var handleCenterSection = function(sectionId, smooth, horizontalOnly, verticalOnly) {
        var s = canvas.getById(sectionId);
        mapVisibleWidth = $map.width();
        mapVisibleHeight = $map.height();
        if (s) {
            var bbox = s.getBBox();
            var x = (bbox.x + (bbox.width / 2));
            var y = (bbox.y + (bbox.height / 2));
            var npx = (mapVisibleWidth / 2) - (x * containerSize / mapMaxSize);
            var npy = (mapVisibleHeight / 2) - (y * containerSize / mapMaxSize);

            if (horizontalOnly) {
                npy = py;
            }
            if (verticalOnly) {
                npx = px;
            }

            var xy = boundXY(npx, npy);

            px = xy[0];
            py = xy[1];

            if (smooth) {
                $mapContainer.addClass('smooth').bind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend', function() {
                    $mapContainer.removeClass('smooth hwacc');
                    $svgContainer.removeClass('hwacc');
                });
            }
            $mapContainer.addClass('hwacc');
            $svgContainer.addClass('hwacc');
            $mapContainer.css(csstransform, 'matrix(' + sf + ', 0, 0, ' + sf + ', ' + px + ', ' + py + ')');
            if (!smooth) {
                $mapContainer.removeClass('smooth hwacc');
                $svgContainer.removeClass('hwacc');
            }
        }
    };

    var handleHighlightSections = function(sectionIds) {
        if ($map.blueprint && mapReady) {
            var trigger = false;
            var sectionId;
            var allSectionsToHighlight = [];
            if (sectionIds.length > 0) {
                if (highlightedSections.length > 0) {
                    // dehighlighted currently highlighted section before
                    handleDehighlightSections();
                    // trigger = true;
                }
            }
            if (opts.selectSectionsByZone === true) {
                for (var j=0; j<sectionIds.length; j++) {
                    allSectionsToHighlight = allSectionsToHighlight.concat(zones[$.fn.blueprint.venueSections[sectionIds[j]].zi].sections);
                }
            }
            else {
                allSectionsToHighlight = sectionIds;
            }
            sectionIds = convertToString(allSectionsToHighlight);
            for (var i = 0; i < allSectionsToHighlight.length; i++) {
                sectionId = allSectionsToHighlight[i];
                if (sectionId !== null) {
                    if (($.fn.blueprint.venueSections[sectionId]) && ($.fn.blueprint.venueSections[sectionId].state == 'default')) {

                        //bring path to Front
                        if (opts.mapDisplayType === 'hybrid') {
                            toFront([sectionId]);
                        }

                        var el = canvas.getById(sectionId);
                        el.attr(opts.hoverStyle);
                        highlightedSections.push(sectionId);
                    }
                }
            }
            // trigger callbacks for onSectionOver
            if (trigger) {
                triggerCallback('onSectionOver', [undefined, sectionId]);
            }
        }
    };

    var handleDehighlightSections = function() { // dehighlight all currently highlighted sections
        if ($map.blueprint && mapReady) {
            var trigger = false;
            var sectionId;
            if (highlightedSections.length > 0) {
                for (var i = 0; i < highlightedSections.length; i++) {
                    sectionId = highlightedSections[i];
                    if (sectionId !== null) {
                        if (($.fn.blueprint.venueSections[sectionId]) && ($.fn.blueprint.venueSections[sectionId].state == 'default')) {

                            // send path to back if needed
                            if (opts.mapDisplayType === 'hybrid') {
                                var zoneId = $.fn.blueprint.venueSections[sectionId].zi;
                                var isZonePath = isTypeZone(sectionId);
                                if (zones[zoneId].mode && ((zones[zoneId].mode === 'zone' && !isZonePath) || (zones[zoneId].mode === 'section' && isZonePath))) {
                                    toBack([sectionId]); // sends behind JPG map image
                                }
                            }

                            var el = canvas.getById(sectionId);
                            el.attr(el.data('defaultStyle'));
                            // trigger = true;
                        }
                    }
                }
                // trigger callbacks for onSectionFocus
                if (trigger) {
                    triggerCallback('onSectionOut', [undefined, sectionId]);
                }
                highlightedSections = [];
            }
        }
    };

    var handleFocusSections = function(sectionIds, callback) { // selects a section or array of sections
        if ($map.blueprint && mapReady) {
            var trigger = false;
            if (sectionIds !== null) {
                for (var i = 0; i < sectionIds.length; i++) {
                    var el = canvas.getById(sectionIds[i]);
                    if (el !== null) {
                        if ($.fn.blueprint.venueSections[sectionIds[i]].state !== 'selected') { // select all sections in sectionIds, don't deselect already selected sections
                            handleSectionDown(el);
                        }
                        trigger = true;
                    }
                }
                // trigger callbacks for onSectionFocus
                if ((callback !== false) && (trigger === true)) {
                    triggerCallback('onSectionFocus', [sectionIds]);
                }
            }
        }
    };

    var handleBlurSections = function(sectionIds, callback) { // deselects a section or array of sections
        if ($map.blueprint && mapReady) {
            var trigger = false;
            if (sectionIds !== null) {
                sectionIds = convertToString(sectionIds);
                for (var i = 0; i < sectionIds.length; i++) {
                    var el = canvas.getById(sectionIds[i]);
                    if ((el !== null) && (selectedSections.indexOf(sectionIds[i]) >= 0)) {
                        handleSectionDown(el);
                        trigger = true;
                    }
                }
                // trigger callbacks for onSectionBlur
                if ((callback !== false) && (trigger === true)) {
                    triggerCallback('onSectionBlur', [sectionIds]);
                }
            }
        }
    };

    var makeTicketListInteractive = function() {
        $ticketItems.live({
            mouseenter: function() {
                var $this = $(this);
                var sid = $this.attr('data-tid');
                var zid = $this.attr('data-zid');
                if ($.fn.blueprint.venueSections[sid] !== undefined) {
                    // section ticket, highlight section
                    handleHighlightSections([sid]);
                } else {
                    // zone ticket, highlight zone
                    handleHighlightSections(zones[zid].sections);
                }
            },
            mouseleave: function() {
                handleDehighlightSections(highlightedSections);
            }
        });
    };

    var handleFetchTickets = function() { // fetch ticket listing from stubhub ticketAPI
        if (opts.useInventoryApi) { // using inventory API
            $.ajax({
                url: opts.inventoryApiUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server).replace('{{eventId}}', opts.eventId),
                dataType: 'json',
                success: function(data, status) {
                    // map is ready
                    mapReady = true;

                    for (var s = 0; s < data.section.length; s++) {
                        var sectionItem = data.section[s];
                        if ($.fn.blueprint.venueSections[sectionItem.sectionId] !== undefined) {
                            handleStyleSectionWith(sectionItem.sectionId, {
                                'fill': (opts.useStubHubStyle) ? $.fn.blueprint.venueSections[sectionItem.sectionId].c : opts.defaultStyle['fill'],
                                'fill-opacity': opts.defaultStyle['fill-opacity'],
                                'stroke': opts.defaultStyle['stroke'],
                                'stroke-opacity': opts.defaultStyle['stroke-opacity'],
                                'stroke-width': opts.defaultStyle['stroke-width']
                            });
                            $.extend($.fn.blueprint.venueSections[sectionItem.sectionId], {
                                mnp: sectionItem.minTicketPrice,
                                mxp: sectionItem.maxTicketPrice,
                                mxq: sectionItem.maxTicketQuantity,
                                mnq: sectionItem.minTicketQuantity,
                                tix: true,
                                state: 'default'
                            });
                        }
                    }
                    triggerCallback('onMapReady', [1]);
                },
                error: function() {
                    // error code 14: error fetching data from inventory api
                    opts.beforeMapError.call(14);
                    opts.onMapError.call(null, 14, 'ERR14: error fetching data from inventory api', $map[0]);
                },
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + opts.token);
                }
            });

        } else { // using ticket API
            var ts = new Date().getTime();
            var queryString = '_jsonp=?&amp;ts=' + ts;
            var url = opts.ticketApiUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server) + opts.eventId + '/sort/price/0';

            getJSONP(url, queryString, '_jsonp', function(data) {
                // map is ready
                mapReady = true;

                var ticketList;
                var ticketListItemHtml;
                var el;
                if (data.eventTicketListing.eventTicket === undefined) {
                    ticketList = [];
                } else {
                    ticketList = data.eventTicketListing.eventTicket;
                }
                var classname = 'odd';
                totalTickets = 0;
                for (var i = 0; i < ticketList.length; i++) {
                    var ticketListItem = ticketList[i];
                    if (ticketListItem.vi !== null) {
                        if ((ticketListItem.vi in availableSections) === false) {
                            if (classname === 'even') {
                                classname = 'odd';
                            }
                            if ($.fn.blueprint.venueSections[ticketListItem.vi] === undefined) {
                                if ((opts.extensions !== undefined) && (opts.extensions.hybrid !== undefined)) {
                                    // section id was not found in map metadata. It is probably a zone ticket (hybrid map)
                                    // see implementation of hybrid map in blueprint.hybrid module
                                    if (ticketsInZone[ticketListItem.zi] !== undefined) {
                                        if (!contains(ticketsInZone[ticketListItem.zi], ticketListItem.vi.toString())) {
                                            ticketsInZone[ticketListItem.zi].push(ticketListItem.vi.toString());
                                        }
                                    } else {
                                        ticketsInZone[ticketListItem.zi] = [ticketListItem.vi.toString()];
                                        // enable all sections within that zone
                                        var sectionsInZone = zones[ticketListItem.zi].sections;
                                        for (var j = 0; j < sectionsInZone.length; j++) {
                                            var s = sectionsInZone[j];
                                            if ($.fn.blueprint.venueSections[s].zoneTix !== false) {
                                                $.fn.blueprint.venueSections[s].state = 'default';
                                                $.fn.blueprint.venueSections[s].zoneTix = true;
                                                $map.blueprint.styleSection(s, {
                                                    'fill': '#fff',
                                                    'fill-opacity': 0.3,
                                                    'stroke': $.fn.blueprint.venueSections[s].c,
                                                    'stroke-width': 1,
                                                    'stroke-opacity': 1
                                                });
                                            }
                                        }
                                    }
                                }
                            } else {
                                $.extend($.fn.blueprint.venueSections[ticketListItem.vi], {
                                    mnp: ticketListItem.cp,
                                    mxp: ticketListItem.cp,
                                    mxq: ticketListItem.qt,
                                    mnq: 1, // store 1 as minTicketQuantity
                                    tix: true, // section contains tickets
                                    state: 'default',
                                    zoneTix: false
                                });
                                handleStyleSectionWith(ticketListItem.vi, {
                                    'fill': (opts.useStubHubStyle) ? $.fn.blueprint.venueSections[ticketListItem.vi].c : opts.defaultStyle['fill'],
                                    'fill-opacity': opts.defaultStyle['fill-opacity'],
                                    'stroke': opts.defaultStyle['stroke'],
                                    'stroke-opacity': opts.defaultStyle['stroke-opacity'],
                                    'stroke-width': opts.defaultStyle['stroke-width']
                                });
                                availableSections[ticketListItem.vi] = ticketListItem.va;
                            }
                            if (opts.autoCreateTicketList) {
                                ticketListItemHtml = '<div class="ticketlistitem ' + classname + '" data-tid="' + ticketListItem.vi + '" data-zid="' + ticketListItem.zi + '"><div class="sname">' + ticketListItem.va + '</div><div class="ticketprice">$' + ticketListItem.cp + '</div></div>';
                                $ticketlistContainer.append(ticketListItemHtml);                            }
                        } else {
                            if (ticketListItem.cp < $.fn.blueprint.venueSections[ticketListItem.vi].mnp) {
                                $.fn.blueprint.venueSections[ticketListItem.vi].mnp = ticketListItem.cp;
                            }
                            if (ticketListItem.cp > $.fn.blueprint.venueSections[ticketListItem.vi].mxp) {
                                $.fn.blueprint.venueSections[ticketListItem.vi].mxp = ticketListItem.cp;
                            }
                            $.fn.blueprint.venueSections[ticketListItem.vi].mxq += ticketListItem.qt;
                        }
                        totalTickets = totalTickets + ticketListItem.qt;
                        if (ticketListItem.cp < ticketStartPrice) {
                            ticketStartPrice = ticketListItem.cp;
                        }
                    }
                }
                if (opts.autoCreateTicketList) {
                    // store all ticketlist items in array
                    $ticketItems = $('.ticketlistitem');
                    makeTicketListInteractive();
                }
                triggerCallback('onMapReady', [1]);
            });
        }
    };

    var getCenter = function(el) { // returns center coordinate of Raphael element el.
        var bbox = el.getBBox();
        return [bbox.x + bbox.width / 2.0, bbox.y + bbox.height / 2.0];
    };

    var handleStyleSections = function(sectionIds) { // receives a list of section IDs to style
        if ($map.blueprint && mapReady) { // (usually with StubHub default scheme)
            if (sectionIds instanceof Array) {
                for (var i = 0; i < sectionIds.length; i++) {
                    if ((sectionIds[i]) && (contains(availableSections, sectionIds[i]) === false) && ($.fn.blueprint.venueSections[sectionIds[i]])) {
                        var el = canvas.getById(sectionIds[i]);
                        el.data('defaultStyle', {
                            'fill': ((opts.useStubHubStyle) && ($.fn.blueprint.venueSections[sectionIds[i]])) ? $.fn.blueprint.venueSections[sectionIds[i]].c : opts.defaultStyle['fill'],
                            'fill-opacity': opts.defaultStyle['fill-opacity'],
                            'stroke': opts.defaultStyle['stroke'],
                            'stroke-opacity': opts.defaultStyle['stroke-opacity'],
                            'stroke-width': opts.defaultStyle['stroke-width']
                        });

                        $.extend($.fn.blueprint.venueSections[sectionIds[i]], {
                            tix: true, // section contains tickets
                            state: 'default'
                        });
                        el.attr(el.data('defaultStyle'));
                        availableSections[sectionIds[i].vi] = 1;
                    }
                }
            }
        }
    };

    var handleStyleSectionWith = function(sectionId, style) { // receives a section IDs to style using passed style
        if ($map.blueprint && mapReady) {
            if ((sectionId !== null) && (isStyleValid(style))) {
                var el = canvas.getById(sectionId);
                if (el !== null) {
                    el.data('defaultStyle', style);
                    el.attr(el.data('defaultStyle'));

                    var state = $.fn.blueprint.venueSections[sectionId].state;
                    $.extend($.fn.blueprint.venueSections[sectionId], {
                        tix: true, // section contains tickets
                        state: (state === 'unavailable') ? 'default' : state
                    });
                }
            }
        }
    };

    var handleFilterSections = function(sectionIds) { // will color sections passed in sectionIds and disable others
        if ($map.blueprint && mapReady) {
            if (sectionIds !== null) {
                sectionIds = convertToString(sectionIds); // always store section IDs as strings
                for (var section in $.fn.blueprint.venueSections) {
                    if ((section === 'bbox') || (section === '') || (section === undefined) || ($.fn.blueprint.venueSections[section].state === 'unavailable')) {
                        continue;
                    }
                    var el = canvas.getById(section);
                    if (contains(sectionIds, section)) { // filter-in sections
                        if ($.fn.blueprint.venueSections[section].state !== 'selected') {
                            $.fn.blueprint.venueSections[section].state = 'default';
                            if (selectedSections.indexOf(section) >= 0) { // section is suppose to be selected
                                $.fn.blueprint.venueSections[section].state = 'selected';
                                el.attr(opts.selectedStyle);
                            } else {
                                el.attr(el.data('defaultStyle'));
                            }
                        }
                        filteredSections.push(section); // only store valid section IDs in filteredSections
                    } else { // filter-out sections
                        $.fn.blueprint.venueSections[section].state = 'filtered';
                        el.attr(opts.filteredOutStyle);
                    }
                }
                isMapFiltered = true;
            }
        }
    };

    var handleResetFilter = function() { // unfilters all filtered sections; selected sections before filtering stay selected
        if ($map.blueprint && mapReady) {
            for (var section in $.fn.blueprint.venueSections) {
                if ((section === 'bbox') || (section === '') || (section === undefined)) {
                    continue;
                }
                var el = canvas.getById(section);
                // if section is filtered out and selected, unfilter and change state to selected
                // if section is filtered out and not selected, unfilter and change state to default
                if ($.fn.blueprint.venueSections[section].state === 'filtered') {
                    if (contains(selectedSections, section)) { // handle filtered out & selected
                        $.fn.blueprint.venueSections[section].state = 'selected';
                        el.attr(opts.selectedStyle);
                    } else { // handle filtered out & not selected
                        $.fn.blueprint.venueSections[section].state = 'default';
                        el.attr(el.data('defaultStyle'));
                    }
                }
            }
            filteredSections = [];
            isMapFiltered = false;
        }
    };

    var handleResetMap = function() { // unselect all selected sections and resets filtered sections
        if ($map.blueprint && mapReady) {
            var sectionIds = selectedSections.slice();
            handleBlurSections(sectionIds, false);

            for (var section in $.fn.blueprint.venueSections) {
                if ((section === 'bbox') || (section === '') || (section === undefined)) {
                    continue;
                }
                var el = canvas.getById(section);
                // filter section in
                if ($.fn.blueprint.venueSections[section].state !== 'unavailable') {
                    $.fn.blueprint.venueSections[section].state = 'default';
                }
                el.attr(el.data('defaultStyle'));
            }
            selectedSections = [];
            filteredSections = [];
            isMapFiltered = false;
        }
    };

    var toBack = function(pathIds) { // send paths to the back of canvas, behind map jpg image
        for (var i = 0; i < pathIds.length; i++) {
            var el = canvas.getById(pathIds[i]);
            if (el) {
                el.toBack();
            }
        }
    };

    var toFront = function(pathIds) { // send paths to the front of canvas
        for (var i = 0; i < pathIds.length; i++) {
            var el = canvas.getById(pathIds[i]);
            if (el) {
                el.toFront();
            }
        }
    };

    var inZoneMode = function(zoneId) { // return true if zone is in zone mode
        if (zones[zoneId] && zones[zoneId].mode) {
            return zones[zoneId].mode === 'zone'; // mode can be 'zone' or 'section'
        }
    };

    var handleToZoneMode = function(zoneId) { // send zone path to front, send section paths to back
        if (zones[zoneId]) {

            // send zone path to front
            if (zones[zoneId].path) {
                var zone = zones[zoneId].path;
                toFront([zone]);
            }

            // send section paths to back, behind map jpg image (don't change any styling or state)
            var sections = zones[zoneId].sections;
            toBack(sections);

            zones[zoneId].mode = 'zone';
        }
    };

    var handleToSectionMode = function(zoneId) { // send section paths to front, send zone path to back
        if (zones[zoneId]) {

            // send section paths to front
            var sections = zones[zoneId].sections;
            toFront(sections);

            // send zone paths to back, behind map jpg image (don't change any styling or state)
            if (zones[zoneId].path) {
                var zone = zones[zoneId].path;
                toBack([zone]);
            }

            zones[zoneId].mode = 'section';
        }
    };

    var handleToggle2d3d = function(newOpts) {
        if (newOpts === undefined) {
            newOpts = {};
        }
        var oldType = opts.mapType;
        var newType;
        if (oldType === '2d') {
            newType = '3d';
        }
        else {
            newType = '2d';
        }

        newOpts.mapType = newType;
        newOpts.tileBaseUrl = opts.tileBaseUrl.replace(oldType, newType);
        newOpts.metadataUrl = opts.metadataUrl.replace(oldType, newType);

        $.extend(opts, newOpts);

        //clear the canvas & flush cache
        canvas.clear();

        // auto reload new svg
        if (opts.autoFetchMetadata) {
            getMetadata();
        }
    };

    var getMapCenterCoords = function() {
        var t = $mapContainer.css(csstransform).split(',');
        var cx = (parseFloat(t[4]) + containerSize) / 2;
        var cy = (parseFloat(t[5]) + containerSize) / 2;
        return [cx, cy];
    };

    var triggerCallback = function(callbackName, callbackArgs) {
        if (callbackName in callbacks) {
            for (var c = 0; c < callbacks[callbackName].length; c++) {
                var callback = callbacks[callbackName][c];
                callback.apply($map, callbackArgs);
            }
        }
    };

    var bindEvents = function() {
        if (ie8) {
            if ($map[0].attachEvent) {
                $map[0].attachEvent('onmousedown', handleMouseDown);
                $map[0].attachEvent('onmouseup', handleMouseUp);
                $map[0].attachEvent('onmousemove', handleMouseMove);
                $map[0].attachEvent('onmouseleave', handleMouseLeave);
            }
        } else {
            if ($map.on) {
                $map.on({
                    'mousedown': handleMouseDown,
                    'mouseup': handleMouseUp,
                    'mousemove': handleMouseMove,
                    'mouseleave': handleMouseLeave,
                    'mousewheel': handleMouseWheel,
                    'scroll': handleMapScroll
                });
            } else {
                $map.bind({
                    'mousedown': handleMouseDown,
                    'mouseup': handleMouseUp,
                    'mousemove': handleMouseMove,
                    'mouseleave': handleMouseLeave,
                    'mousewheel': handleMouseWheel,
                    'scroll': handleMapScroll
                });
            }
        }
        // add auto-resize event
        if (opts.autoResizeMap) {
            var rtime;
            var timeout = false;
            var delta = 200;
            var resizeend = function() {
                if (new Date() - rtime < delta) {
                    setTimeout(resizeend, delta);
                } else {
                    timeout = false;
                    $map.blueprint.resizeMap();
                }
            };
            $(window).resize(function() {
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(resizeend, delta);
                }
            });
        }

        // add events to zoom buttons
        if (opts.defaultZoomControl) {
            $('.zoomcontrol').bind('click touchend', function(ev) {
                if (ev.target.className === 'zoombutton zoomin') {
                    $map.blueprint.zoomIn();
                } else if (ev.target.className === 'zoombutton zoomout') {
                    $map.blueprint.zoomOut();
                }
            });
        }

        // add touch events only if on mobile device
        if (isTouchDevice()) {

            if (opts.enableTouchEvents) {
                // add touch events
                hammer.on('tap', function(ev) {
                	if( mouseuped ) {
                		return;
                	}
                	ev.preventDefault();
                    var el = ev.target;
                    if ((ev.target.nodeName === 'path') && (ev.target.id)) {
                        if (isMapFiltered) {
                            if (filteredSections.indexOf(ev.target.id) < 0) {
                                return;
                            }
                        }
                        var sectionWasSelected = true;
                        if (selectedSections.indexOf(ev.target.id) >= 0) {
                            sectionWasSelected = false;
                        }
                        if (opts.selectSectionsByZone) {
                            var zoneId = $.fn.blueprint.venueSections[ev.target.id].zi;
                            for (var s = 0; s < zones[zoneId].sections.length; s++) {
                                el = canvas.getById(zones[zoneId].sections[s]);
                                if (($.fn.blueprint.venueSections[el.id].state) !== 'unavailable') {
                                    handleSectionDown(el);
                                }
                            }
                        } else {
                            el = canvas.getById(ev.target.id);
                            if (($.fn.blueprint.venueSections[el.id].state) !== 'unavailable') {
                                handleSectionDown(el);
                            }
                        }
                        if (sectionWasSelected) {
                            $mapContainer.removeClass('smooth');
                            // trigger callbacks for onSectionFocus
                            triggerCallback('onSectionFocus', [ev.target.id]);
                        } else {
                            $mapContainer.removeClass('smooth');
                            // trigger callbacks for onSectionBlur
                            triggerCallback('onSectionBlur', [ev.target.id]);
                        }
                    }
                });

                hammer.on('doubletap', function() {
                    handleZoomIn();
                });

                if (opts.allowMapDrag) {

                    hammer.on('dragstart', function(ev) {
                        $mapContainer.removeClass('smooth').addClass('hwacc');
                        $svgContainer.addClass('hwacc');
                        dragstartpos = ev.gesture.center;
                        touchx = dragstartpos.pageX; // current touch pageX, updated every 'drag' event
                        touchy = dragstartpos.pageY; // current touch pageY
                    });

                    hammer.on('drag', function(ev) {
                        if (!transforming) {
                            ondragpos = ev.gesture.center;
                            var touches = ev.gesture.touches;
                            if (touches.length === 1) {
                                var $target = $(touches[0].target);
                                if ($target) {
                                    var changex = ondragpos.pageX - touchx; // x y change between this 'drag' and previous 'drag' event
                                    var changey = ondragpos.pageY - touchy;

                                    touchx = ondragpos.pageX;
                                    touchy = ondragpos.pageY;

                                    var xy = boundXY(px + changex, py + changey); // limit panning to stickToEdge bounds
                                    px = xy[0]; // update px and py every 'drag' event instead of at 'dragend'
                                    py = xy[1];

                                    $mapContainer.css(csstransform, 'matrix(' + sf + ', 0, 0, ' + sf + ', ' + px + ', ' + py + ')');
                                }
                            }
                        }
                    });

                    hammer.on('dragend', function() {
                        $mapContainer.removeClass('smooth hwacc');
                        $svgContainer.removeClass('hwacc');
                    });
                }

                if (opts.enablePinchToZoom) {

                    hammer.on('transformstart', function(ev) {
                        transforming = true; // disable 'drag' if one finger lifts during pinching
                        transformOrigin[0] = ((ev.gesture.touches[0].pageX + ev.gesture.touches[1].pageX) / 2) - $map.offset().left;
                        transformOrigin[1] = ((ev.gesture.touches[0].pageY + ev.gesture.touches[1].pageY) / 2) - $map.offset().top;
                    });

                    hammer.on('transform', function(ev) {
                        nsf = ev.gesture.scale * sf;

                        newContainerSize = originalContainerSize * nsf;
                        if ((newContainerSize / zoomRatio) < opts.minZoom) {
                            newContainerSize = zoomRatio * opts.minZoom;
                            nsf = parseFloat(newContainerSize / originalContainerSize);
                        }

                        if ((newContainerSize / zoomRatio) > opts.maxZoom) {
                            newContainerSize = zoomRatio * opts.maxZoom;
                            nsf = parseFloat(newContainerSize / originalContainerSize);
                        }
                        deltaX = (transformOrigin[0] - px) * (1 - (newContainerSize / containerSize));
                        deltaY = (transformOrigin[1] - py) * (1 - (newContainerSize / containerSize));
                        $mapContainer.css(csstransform, 'matrix(' + nsf + ', 0, 0, ' + nsf + ', ' + (px + deltaX) + ', ' + (py + deltaY) + ')');
                    });

                    hammer.on('transformend', function() {
                        sf = nsf;
                        px += deltaX;
                        py += deltaY;
                        containerSize = newContainerSize;
                        prevZoomLevel = zoomLevel;
                        zoomLevel = containerSize / zoomRatio;
                        triggerCallback('onZoomChange', [zoomLevel]); // trigger callbacks for onZoomChange
                        transforming = false; // enable 'drag' after 2nd finger lifts during pinching
                    });
                }
            }
        }
    };

    var initialize = function(mapEl) {
        $map = $(mapEl).empty().unbind();

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt /*, from*/ ) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0) {
                    from += len;
                }
                for (; from < len; from++) {
                    if (from in this && this[from] === elt) {
                        return from;
                    }
                }
                return -1;
            };
        }
        if (Raphael) {

            mapReady = false;
            selectedSections = [];

            // create div container for tiles & svg
            $map.append("<div class='mapcontainer'><div class='svgcontainer'></div><div class='copyright'></div></div>");
            $mapContainer = $map.find('.mapcontainer');
            $svgContainer = $map.find('.svgcontainer');
            if (opts.autoCreateTicketList) {
                $map.width(parseInt($map.css('width').split('px')[0]) - 300);
                $ticketlistContainer = $('#ticketListContainer').show();
            }

            // init & set raphael canvas size
            canvas = Raphael($svgContainer[0]).setSize($map.width(), $map.height());
            canvas.setViewBox(0, 0, mapMaxSize, mapMaxSize);

            $map.find('.copyright').html('blueprint.js - Copyright &copy; 2009 - 2014 StubHub, Inc. All rights reserved.');

            // add default zoom control
            if ((opts.defaultZoomControl) && (!mapStatic)) {
                var $zoomControl = $("<div class='zoomcontrol'></div>");
                $map.append($zoomControl.html("<div class='zoombutton zoomin'></div><div class='zoombutton zoomout'></div>"));
            }

            if (isTouchDevice()) {
                // add hammer touch
                if (hammer === undefined) {
                    hammer = Hammer($map[0], {
                        scale_treshold: 0,
                        drag_min_distance: 1,
                        drag_horizontal: true,
                        drag_vertical: true,
                        transform: true,
                        hold: false,
                        swipe: false,
                        prevent_default: true,
                        css_hacks: false,
                        tap_max_interval: 150
                    });
                }
            }

            // add events to map
            bindEvents();

            if (!mapStatic) {
                canvasImage = canvas.image(constructBkgImageUrl(0, 0, 8), 0, 0, mapMaxSize, mapMaxSize);

                // get section svg paths & render sections on map
                if (opts.autoFetchMetadata) {
                    getMetadata();
                }
            } else {
                getStaticMap();
            }

            // register and initialize extensions
            if (!mapStatic) {
                if (objectSize(opts.extensions) > 0) {
                    $.fn.blueprint.extensions = {};
                    for (var m in opts.extensions) {
                        $.extend($.fn.blueprint.extensions, opts.extensions);
                        $map.blueprint[m]($map, opts.extensions[m]);
                    }
                }
            }
        } else {
            mapStatic = true;
            // error code 10: browser doesn't support SVG or VML
            opts.beforeMapError.call(10);
            opts.onMapError.call(null, 10, 'ERR10: browser doesn\'t support svg or vml ', $map[0]);
            mapReady = false;
        }
    };

    $.fn.blueprint = function(options) {
        if (options.environment === 'dev') {
            options.server = 'srwq15'; // switch to appropriate dev server name
        }

        opts = $.extend(defaultOptions(), options);

        opts.defaultStyle = $.extend({
            'fill': '#999',
            'fill-opacity': 0.3,
            'stroke': '#000',
            'stroke-width': 0,
            'stroke-opacity': 0
        }, opts.defaultStyle);

        opts.hoverStyle = $.extend({
            'fill': '#ff9900',
            'fill-opacity': 0.8,
            'stroke': '#cc6600',
            'stroke-width': 2,
            'stroke-opacity': 1
        }, opts.hoverStyle);

        opts.selectedStyle = $.extend({
            'fill': '#ff6600',
            'fill-opacity': 0.8,
            'stroke': '#333333',
            'stroke-width': 2,
            'stroke-opacity': 1
        }, opts.selectedStyle);

        opts.noTicketsStyle = $.extend({
            'fill': '#ffffff',
            'fill-opacity': 0.4,
            'stroke': '#fff',
            'stroke-width': 0,
            'stroke-opacity': 0
        }, opts.noTicketsStyle);

        opts.filteredOutStyle = $.extend({
            'fill': '#ffffff',
            'fill-opacity': 0.4,
            'stroke': '#fff',
            'stroke-width': 0,
            'stroke-opacity': 0
        }, opts.filteredOutStyle);

        // register callbacks
        callbacks.onSectionOver.push(opts.onSectionOver);
        callbacks.onSectionOut.push(opts.onSectionOut);
        callbacks.onSectionFocus.push(opts.onSectionFocus);
        callbacks.onSectionBlur.push(opts.onSectionBlur);
        callbacks.onZoomChange.push(opts.onZoomChange);
        callbacks.onMapReady.push(opts.onMapReady);

        return this.each(function() {
            var thisMap = this;

            // fix css prefix
            if (thisMap.style.KhtmlTransform !== undefined) {
                csstransform = '-khtml-transform';
            }
            if (thisMap.style.WebkitTransform !== undefined) {
                csstransform = '-webkit-transform';
            }
            if (thisMap.style.MozTransform !== undefined) {
                csstransform = '-moz-transform';
            }
            if (thisMap.style.OTransform !== undefined) {
                csstransform = '-o-transform';
            }
            if (thisMap.style.msTransform !== undefined) {
                csstransform = 'msTransform';
            }

            protocol = (window.location.protocol.indexOf('http') >= 0) ? window.location.protocol : protocol;

            if ((opts.nodeId !== '0000') && (opts.configId !== '0000') && (opts.version !== '0')) {
                // load requested map
                opts.tileBaseUrl = opts.tileBaseUrl.replace('{{protocol}}', protocol).replace('{{nodeId}}', opts.nodeId).replace('{{configId}}', opts.configId).replace('{{mapType}}', opts.mapType).replace('{{version}}', opts.version);
                opts.metadataUrl = opts.metadataUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server).replace('{{nodeId}}', opts.nodeId).replace('{{configId}}', opts.configId).replace('{{mapType}}', opts.mapType).replace('{{version}}', opts.version);

                // check if interactive map is available
                if (opts.checkForInteractiveMap) {
                    var ti = $('<img/>');
                    ti[0].onload = function() {
                        initialize(thisMap);
                    };
                    ti[0].onerror = function() {
                        opts.beforeMapError.call(9);
                        opts.onMapError.call(null, 9, 'ERR9: No interactive map found.', thisMap);
                        mapReady = false;
                    };
                    ti[0].src = constructBkgImageUrl(0, 0, 1);
                } else {
                    initialize(thisMap);
                }
            } else {
                if (((opts.nodeId === '0000') || (opts.configId === '0000')) && (opts.eventId !== '0000')) {
                    // make ajax call to retrieve node id and config id

                    var venueConfigApiDeferred = $.ajax({
                        url: opts.venueConfigApiUrl + '?eventId=' + opts.eventId,
                        dataType: 'json',
                        cache: true,
                        beforeSend: function(xhr) {
                            if (opts.appendToken) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + opts.token);
                            }
                        }
                    });
                    var eventApiDeferred = $.ajax({
                        url: opts.eventApiUrl.replace('{{eventId}}', opts.eventId),
                        dataType: 'json',
                        cache: true,
                        beforeSend: function(xhr) {
                            if (opts.appendToken) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + opts.token);
                            }
                        }
                    });
                    $.when(venueConfigApiDeferred, eventApiDeferred).then(function(venueConfigApiResp, eventApiResp) {
                        var venueConfig = venueConfigApiResp[0].venueConfiguration[0];
                        var venue = eventApiResp[0].venue;
                        $.extend(opts, {
                            nodeId: venue.id,
                            configId: venue.configurationId,
                            version: venueConfig.venueConfigurationVersion,
                            viewFromSection: venueConfig.map.viewFromSection ? true : false,
                            staticImageUrl: venueConfig.staticImageUrl
                        });
                        opts.tileBaseUrl = opts.tileBaseUrl.replace('{{protocol}}', protocol).replace('{{nodeId}}', opts.nodeId).replace('{{configId}}', opts.configId).replace('{{mapType}}', opts.mapType).replace('{{version}}', opts.version);
                        opts.metadataUrl = opts.metadataUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server).replace('{{nodeId}}', opts.nodeId).replace('{{configId}}', opts.configId).replace('{{mapType}}', opts.mapType).replace('{{version}}', opts.version);
                        initialize(thisMap);
                    }, function() {
                        opts.beforeMapError.call(13);
                        opts.onMapError.call(null, 13, 'ERR13: node id and config id couldn\'t be retrieved for event ' + opts.eventId, thisMap);
                        mapReady = false;
                    });
                } else {

                    if ((opts.nodeId !== '0000') && (opts.configId !== '0000') && (opts.version === '0')) {
                        // Since venue config version has been fetched via venueConfig API before render seatmap view
                        // Here this is no necessary to call the venue config API again.
                        opts.beforeMapError.call(9);
                        opts.onMapError.call(null, 9, 'ERR9: No interactive map found.', thisMap);
                        mapReady = false;
                    } else {
                        // error code 15: error loading static map
                        opts.beforeMapError.call(15);
                        opts.onMapError.call(null, 15, 'ERR15: could not retrieve static map url', thisMap);
                        mapReady = false;
                    }
                }
            }
        });
    };

    // public methods

    $.fn.blueprint.canvas = function() {
        return canvas;
    };

    $.fn.blueprint.getmapurl = function() {
        if (!mapStatic) {
            return constructBkgImageUrl(0, 0, 8);
        } else {
            return opts.staticImageUrl? (opts.staticMapBaseUrl.replace('{{protocol}}', protocol).replace('{{server}}', opts.server).replace('{{nodeId}}', opts.nodeId) + opts.staticImageUrl) : opts.comingSoonImgUrl;
        }
    };

    $.fn.blueprint.getSectionNode = function(sectionId) {
        /* returns the section path DOM element */
        return canvas.getById(sectionId);
    };

    $.fn.blueprint.getSectionData = function(sectionId) {
        /* returns the section associated data */
        return $.fn.blueprint.venueSections[sectionId];
    };

    $.fn.blueprint.centerSection = function(sectionId, smooth, horizontalOnly, verticalOnly) {
        /* centers the section within the map viewport */
        if (smooth) {
            smooth = true;
        } else {
            smooth = false;
        }
        if (horizontalOnly) {
            horizontalOnly = true;
        } else {
            horizontalOnly = false;
        }
        if (verticalOnly) {
            verticalOnly = true;
        } else {
            verticalOnly = false;
        }
        return handleCenterSection(sectionId, smooth, horizontalOnly, verticalOnly);
    };

    $.fn.blueprint.styleSections = function(sectionIds) {
        /* receives a list of section IDs to style (usually with StubHub default color scheme) */
        return handleStyleSections(sectionIds);
    };

    $.fn.blueprint.styleSection = function(sectionId, style) {
        /* pass in a style to paint section with */
        return handleStyleSectionWith(sectionId, style);
    };

    $.fn.blueprint.highlightSections = function(sectionIds) {
        if (sectionIds.length > 0) {
            handleHighlightSections(sectionIds);
        }
    };

    $.fn.blueprint.dehighlightSections = function() {
        handleDehighlightSections();
    };

    $.fn.blueprint.focusSection = function(sectionId, callback) {
        /* selects section */
        if (sectionId !== null) {
            $.fn.blueprint.focusSections([sectionId], callback);
        }
    };

    $.fn.blueprint.focusSections = function(sectionIds, callback) {
        /* pass in an array of section ids to be selected on map */
        if (sectionIds instanceof Array) {
            handleFocusSections(sectionIds, callback);
        }
    };

    $.fn.blueprint.focusZoneBySection = function(sectionId) {
        /* focus a range on sections within the same zone based on the sectionId passed in */
        /* focusSection callback won't be triggered */
        var s = sectionId;
        var currentlySelectedSections = $map.blueprint.getSelectedSections();
        var sectionsInZone = $map.blueprint.getSectionsByZone($.fn.blueprint.venueSections[s].zi);
        for (var i = 0; i < sectionsInZone.length; i++) {
            if (!(contains(currentlySelectedSections, sectionsInZone[i]))) {
                $map.blueprint.focusSection(sectionsInZone[i], false);
            }
        }
    };

    $.fn.blueprint.focusSectionsInZone = function(zoneId) {
        /* focusSection callback won't be triggered */
        $map.blueprint.focusSections($map.blueprint.getSectionsByZone(zoneId), false);
    };

    $.fn.blueprint.blurSection = function(sectionId, callback) {
        /* deselect section */
        if (sectionId !== null) {
            $.fn.blueprint.blurSections([sectionId], callback);
        }
    };

    $.fn.blueprint.blurSections = function(sectionIds, callback) {
        /* pass in an array of section ids to be deselected on map */
        if (sectionIds instanceof Array) {
            handleBlurSections(sectionIds, callback);
        }
    };

    $.fn.blueprint.blurZoneBySection = function(sectionId) {
        /* deselect a range on sections within the same zone based on the sectionId passed in */
        /* blurSection callback won't be triggered */
        var s = sectionId;
        var currentlySelectedSections = $map.blueprint.getSelectedSections();
        var sectionsInZone = $map.blueprint.getSectionsByZone($.fn.blueprint.venueSections[s].zi);
        for (var i = 0; i < sectionsInZone.length; i++) {
            if (contains(currentlySelectedSections, sectionsInZone[i])) {
                $map.blueprint.blurSection(sectionsInZone[i], false);
            }
        }
    };

    $.fn.blueprint.blurSectionsInZone = function(zoneId) {
        /* deselect all sections in zone */
        /* blurSection callback won't be triggered */
        $map.blueprint.blurSections($map.blueprint.getSectionsByZone(zoneId), false);
    };

    $.fn.blueprint.filterSections = function(sectionIds) {
        /* will filter the map with the array of sectionIds (the rest will be filtered out) */
        if (sectionIds instanceof Array) {
            return handleFilterSections(sectionIds);
        }
    };

    $.fn.blueprint.resetFilter = function() {
        /* will reset all filtered out sections to default state or selected state if previously selected */
        return handleResetFilter();
    };

    $.fn.blueprint.zoomIn = function() {
        /* zooms in map */
        return handleZoomIn();
    };

    $.fn.blueprint.zoomOut = function() {
        /* zooms out map */
        return handleZoomOut();
    };

    $.fn.blueprint.zoomMap = function(z, smooth) {
        /* sets map to a specific zoom level */
        if (smooth === undefined) {
            smooth = false;
        }
        return handleZoomMap(z, smooth);
    };

    $.fn.blueprint.getMapType = function() {
        /* returns current map type (2d or 3d) */
        return opts.mapType;
    };

    $.fn.blueprint.getMapOffset = function() {
        /* returns the map offset */
        return {
            x: px,
            y: py
        };
    };

    $.fn.blueprint.resizeMap = function() {
        /* adjusts map to the optimum size available within container */
        return handleResizeMap();
    };

    $.fn.blueprint.positionMap = function(position, smooth) {
        /* sets the position of the map within the map viewport */
        return handlePositionMap(position, smooth);
    };

    $.fn.blueprint.centerMap = function(smooth, horizontalOnly, verticalOnly) {
        /* centers map within container */
        return handlePositionMap('center', smooth);
    };

    $.fn.blueprint.resetMap = function() {
        /* resets all selected sections on map */
        return handleResetMap();
    };

    $.fn.blueprint.destroyMap = function() {
        /*  remove the map from the DOM
            clear out all binded events
            reset all private variables
        */
        if ($map) {
            $map.unbind().empty();
        }
        selectedSections = [], availableSections = {}, filteredSections = [],
            mapStatic = false, hammer = undefined, isMapFiltered = false,
            callbacks = {
                onSectionOver: [],
                onSectionOut: [],
                onSectionBlur: [
                    function() {
                        if (isMapFiltered) {
                            handleFilterSections(filteredSections);
                        } // always refilter sections upon sectionBlur if user is in filter mode
                    }
                ],
                onSectionFocus: [],
                onZoomChange: [],
                onMapReady: []
            };
        // destroy map node
        var mapClone = $map[0].cloneNode(true);
        $map[0].parentNode.replaceChild(mapClone, $map[0]);
    };

    $.fn.blueprint.getCurrentZoom = function() {
        /* returns current zoom level */
        return zoomLevel;
    };

    $.fn.blueprint.getSelectedSections = function() {
        /* returns all currently selected section ids */
        return selectedSections;
    };

    $.fn.blueprint.getAllSections = function() {
        /* returns all available sections */
        var s = $.fn.blueprint.venueSections;
        delete s.bbox;
        return s;
    };

    $.fn.blueprint.getSectionsWithTickets = function() {
        var s = $.fn.blueprint.venueSections;
        delete s.bbox;
        var sArray = Object.keys(s);
        var rArray = [];
        for (var i = 0; i < sArray.length; i++) {
            if (s[sArray[i]].tix === true) {
                rArray.push(sArray[i]);
            }
        }
        return rArray;
    };

    $.fn.blueprint.getZones = function() {
        return zones;
    };

    $.fn.blueprint.getSectionsByZone = function(zoneId) {
        if (zones[zoneId] !== undefined) {
            return zones[zoneId].sections;
        } else {
            return false;
        }
    };

    $.fn.blueprint.getTicketsInZone = function(zoneId) {
        if ((zones[zoneId] !== undefined) && (ticketsInZone[zoneId] !== undefined)) {
            return ticketsInZone[zoneId];
        } else {
            return false;
        }
    };

    $.fn.blueprint.getTotalTickets = function() {
        return totalTickets;
    };

    $.fn.blueprint.getTicketStartPrice = function() {
        return ticketStartPrice;
    };

    $.fn.blueprint.filterTicketList = function(ticketIds) {
        if (($ticketItems !== undefined) && ($ticketItems.length > 0)) {
            if (ticketIds.length > 0) {
                var $ti;
                for (var i = 0; i < $ticketItems.length; i++) {
                    $ti = $($ticketItems[i]);
                    if (contains(ticketIds, $ti.attr('data-tid'))) {
                        $ti.show();
                    } else {
                        $ti.hide();
                    }
                }
            } else {
                // show all tickets in ticketlist
                $('.ticketlistitem').show();
            }
        }
    };

    $.fn.blueprint.multiSelectSection = function(mss) {
        if (mss !== undefined) {
            if (mss) {
                opts.multiSelectSection = mss;
            } else {
                var ss = $map.blueprint.getSelectedSections();
                var section0 = (ss.length > 0) ? ss[0] : undefined;
                $map.blueprint.resetMap();
                if (section0 !== undefined) {
                    $map.blueprint.focusSection(section0);
                }
                opts.multiSelectSection = false;
            }
        }
        return opts.multiSelectSection;
    };

    $.fn.blueprint.getViewFromSectionUrl = function(sectionId, size) {
        /* returns the url to the view from section */
        if (size === undefined) {
            size = '195x106';
        }
        if (sectionId === undefined) {
            return false;
        }
        return protocol + '//' + getImageDomain(sectionId) + '/sectionviews/venues/' + opts.nodeId + '/config/' + opts.configId + '/' + size + '/' + sectionId + '.jpg';
    };

    $.fn.blueprint.getMapSize = function() {
        /* returns current map size (at that zoom level) */
        return containerSize;
    };

    $.fn.blueprint.isMapStatic = function() {
        /* returns whether map is static or not */
        return mapStatic;
    };

    $.fn.blueprint.getMapTopLeftCoordinates = function() {
        /* returns coordinates of the top left of svg relative to $map {'left': px, 'top': py} */
        /* used for Distance Calculator */
        return {
            'left': px,
            'top': py
        };
    };

    $.fn.blueprint.isMapReady = function() {
        /* returns true if map is ready to be manipulated */
        return mapReady;
    };

    $.fn.blueprint.isIE8 = function() {
        return ie8;
    };

    $.fn.blueprint.canvasImage = function() {
        return canvasImage;
    };

    $.fn.blueprint.registerCallback = function(name, callback) {
        /* register a callback event */
        callbacks[name].push(callback);
        return $map.blueprint;
    };

    $.fn.blueprint.getAllExtensions = function() {
        /* returns an object of registered extensions */
        return opts.extensions;
    };

    $.fn.blueprint.pathType = function(pathId) {
        if (isTypeZone(pathId)) {
            return 'zone';
        } else {
            return 'section';
        }
    };

    $.fn.blueprint.toZoneMode = function(zoneIds) {
        /* switch the zones to zone mode*/
        for (var i = 0; i < zoneIds.length; i++) {
            handleToZoneMode(zoneIds[i]);
        }
    };

    $.fn.blueprint.toSectionMode = function(zoneIds) {
        /* switch the zones to section mode*/
        for (var i = 0; i < zoneIds.length; i++) {
            handleToSectionMode(zoneIds[i]);
        }
    };

    $.fn.blueprint.enableSelectSectionsByZone = function(flag) {
        opts.selectSectionsByZone = flag ? true : false;
    };

    $.fn.blueprint.getZoneBySection = function(sectionId) {
        /* get the zone id for a section */
        var s = sectionId;
        return $.fn.blueprint.venueSections[s].zi;
    };
});
