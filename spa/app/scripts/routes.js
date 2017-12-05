define(function() {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    var routes = function(match) {
        //match(':eventId', 'event#start');
        match('ep2/index.html', 'viewselector#start');         // Path: /ep2/index.html?event_id=9037755
        match('event/:eventId', 'viewselector#start');         // Path: /event/9037755
        match('event/:eventId/', 'viewselector#start');        // Path: /event/9037755/
        match(':name/event/:eventId', 'viewselector#start');   // Path: /san-francisco-giants-vs-raiders/event/9037755
        match(':name/event/:eventId/', 'viewselector#start');  // Path: /san-francisco-giants-vs-raiders/event/9037755/
        match('', 'viewselector#start');                       // Path: Handles www.stubhub.com(/)?event_id=9037755. Also matches all cases not caught by above routes. 
    };

    return routes;
});
