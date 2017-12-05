/* global SH */
define([
    'foobunny',
    'routes',
    'controllers/page_controller',
    'globals',
    'global_context',
    'i18n',
    'scriptsProps',
    'models/filter_model',
    'templates-bundle'
    ], function(Foobunny, routes, PageController, globals, gc, i18n, scriptsProps, FilterModel) {
        'use strict';
        var app = new Foobunny.Application();

        i18n.merge(scriptsProps);

        // i18n defaults for event page app
        app.i18nDefaults = function() {
            return {
                'locale': {
                    value: gc.locale,
                    replaceUserPref: true
                }
            };
        };

        app.initialize = function() {
            console.log('--app-- in initialize()');

            //Set the api key for bugSnag
            Bugsnag.apiKey = globals.bugSnag.apiKey;
            // Bugsnag.endpoint = globals.bugSnag.endpoint;
            Bugsnag.releaseStage = gc.environment;

            if (gc.environment === 'Development') {
                Bugsnag.autoNotify = false;
            }

            app.initAll(routes);

            app.addStartMethod(this.pageController.start);

            //Adding the page title
            //TBD: This needs to be revisited once the right solution is in place.
            document.title = i18n.get('event.common.page.title');


            // Add Accept-Language for API call
            gc.url_headers = gc.url_headers || {};
            gc.url_headers['Accept-Language'] = gc.shlocale;

            // Listen to the popstate events.
            this.subscribeEvent('event:pushState', app.pushState);
            this.subscribeEvent('event:replaceState', app.replaceState);
            $(window).on('popstate', app.processState);
        };

        // This function can be used to process the app states.
        app.processState = function(event) {
            // var state = (event && event.originalEvent && event.originalEvent.state) ? event.originalEvent.state : {};
            // if (state.eventName) {
            //     SH.app.publishEvent(state.eventName, state.eventData);
            // }

            if (document.location.href.indexOf('byo') !== -1) {
                SH.app.publishEvent('buildyourorder:hide');
            }
        };

        app.pushState = function(params) {
            window.history.pushState({
                eventName: params.eventName,
                eventData: params.eventData
            }, '', document.location.href);
        };

        app.replaceState = function(params) {
            window.history.replaceState({
                eventName: params.eventName,
                eventData: params.eventData
            }, '', document.location.href);
        };

        app.getOptoutUrl = function() {
            // opting out of unified experience
            return this.optoutUrl;
        };

        app.setOptoutUrl = function(url) {
            // opting out of unified experience
            this.optoutUrl = url;
        };

        app.initPageControllers = function() {
            console.log('--app-- in initPageControllers()');
            this.pageController = new PageController();
        };

        SH.app = app;

        return app;

});
