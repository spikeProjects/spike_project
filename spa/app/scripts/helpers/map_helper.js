define([
    'foobunny',
    'global_context',
    'collections/cart_collection',
    'models/cart_item_model',
    'helpers/event_helper'
], function(Foobunny, gc, CartCollection, CartItemModel, EventHelper) {
    var MapHelper = (function() {
        'use strict';

        var svgns = 'http://www.w3.org/2000/svg',
        xlink = 'http://www.w3.org/1999/xlink',
        selectedColor = '#D9367F',
        upgradeColor = '#00A6A0',
        whiteColor = '#FFFFFF',
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
        };

        var isStaticMap = function() {
            return $('#seatmap').blueprint.isMapStatic();
        };

        var createMarkerTags = function(id, type) {
            //pass the id for the marker tag and the type(selected or upgrade)
            var mapMarkerSpecs,
                productImages,
                yourSeatsHover,
                hotspot,
                oval97,
                seatFilled,
                d = 'M147.92013,114.116711 L140.441497,114.116711 L125.484232,114.116711 L140.441497,106.638078 L140.441497,84.3517536 C140.441497,74.068634 132.028036,65.6551724 121.744916,65.6551724 L99.3090186,65.6551724 C89.0258989,65.6551724 80.6124374,74.068634 80.6124374,84.3517536 L80.6124374,114.116711 L73.1338049,114.116711 L73.1338049,102.898762 L65.6551724,102.898762 L65.6551724,114.116711 L65.6551724,121.595343 L65.6551724,129.073976 C65.6551724,133.935087 68.8335912,138.048335 73.1338049,139.544061 L73.1338049,158.988506 L80.6124374,158.988506 L80.6124374,140.291925 L140.441497,140.291925 L140.441497,158.988506 L147.92013,158.988506 L147.92013,139.544061 C152.220343,138.048335 155.398762,133.935087 155.398762,129.073976 L155.398762,121.595343 L155.398762,114.116711 L155.398762,102.898762 L147.92013,102.898762 L147.92013,114.116711 Z';

            mapMarkerSpecs = document.createElementNS(svgns, 'g');
            productImages = document.createElementNS(svgns, 'g');
            yourSeatsHover = document.createElementNS(svgns, 'g');
            hotspot = document.createElementNS(svgns, 'ellipse');
            oval97 = document.createElementNS(svgns, 'ellipse');
            seatFilled = document.createElementNS(svgns, 'path');

            mapMarkerSpecs.setAttribute('id', id);
            mapMarkerSpecs.setAttribute('class', 'markers');
            mapMarkerSpecs.setAttribute('stroke', 'none');
            mapMarkerSpecs.setAttribute('stroke-width', 1);
            mapMarkerSpecs.setAttribute('fill', 'none');
            mapMarkerSpecs.setAttribute('fill-rule', 'evenodd');

            productImages.setAttribute('class', 'product-images');

            yourSeatsHover.setAttribute('class', 'your-seats-hover');

            hotspot.setAttribute('class', 'marker-hotspot');
            hotspot.setAttribute('stroke-opacity', '0');
            hotspot.setAttribute('stroke', whiteColor);
            hotspot.setAttribute('cx', '0');
            hotspot.setAttribute('cy', '0');
            if (EventHelper.isTouchDevice()) {
                //bigger hotspot for touch devices
                hotspot.setAttribute('stroke-width', '200');
                hotspot.setAttribute('rx', '200');
                hotspot.setAttribute('ry', '200');
            } else {
                hotspot.setAttribute('stroke-width', '112');
                hotspot.setAttribute('rx', '112');
                hotspot.setAttribute('ry', '112');
            }

            oval97.setAttribute('class', 'oval-97');
            if (type === 'selected') {
                //selected listing
               oval97.setAttribute('stroke', selectedColor);
               oval97.setAttribute('fill', selectedColor);
            } else {
                //upgrade listing
                oval97.setAttribute('stroke', upgradeColor);
                oval97.setAttribute('fill', upgradeColor);
            }
            oval97.setAttribute('stroke-opacity', '1');
            oval97.setAttribute('stroke-width', '0');
            oval97.setAttribute('cx', '0');
            oval97.setAttribute('cy', '0');
            oval97.setAttribute('rx', '112');
            oval97.setAttribute('ry', '112');

            seatFilled.setAttribute('class', 'seat-filled');
            seatFilled.setAttribute('stroke', whiteColor);
            seatFilled.setAttribute('stroke-width', 0.5775);
            seatFilled.setAttribute('fill', whiteColor);
            seatFilled.setAttribute('d', d);
            seatFilled.setAttribute('transform', 'matrix(1,0,0,1,-112,-112)');

            yourSeatsHover.appendChild(hotspot);
            yourSeatsHover.appendChild(oval97);
            yourSeatsHover.appendChild(seatFilled);

            productImages.appendChild(yourSeatsHover);
            mapMarkerSpecs.appendChild(productImages);

            return mapMarkerSpecs;
        };

        return {
            createMarkerTags: createMarkerTags,
            isStaticMap: isStaticMap
        };
    }());
    return MapHelper;
});
