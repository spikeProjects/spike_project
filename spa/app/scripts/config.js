var SH = SH || {};

define(['global_context'], function(gc) {
    'use strict';

    var defaultLocale = (gc.locale || 'en-us').toLowerCase();
    SH.appBaseUrl = SH.configBaseUrl + '/resources/shape/scripts/' + SH.appName + '-' + SH.appVersion + '/';
    SH.appBaseTemplateUrl = SH.configBaseUrl + '/resources/shape/templates/' + SH.appName + '-' + SH.appVersion + '/';

    // a shared configuration file for requireJS and rJS, used by both application and test code
    requirejs.config({
        baseUrl: SH.appBaseUrl,
        waitSeconds: 14,
        paths: {
            // Map libraries
            'blueprint-bundle': SH.appBaseUrl + 'optimized/blueprint-bundle',

            //static libraries
            'bugSnag': SH.configBaseUrl + '/promotions/scratch/analytics/bugsnag-2.min',

            // i18n Files
            'scriptsProps': SH.appBaseUrl + defaultLocale + '/i18nPropsForScripts',
            'templates-bundle': SH.appBaseTemplateUrl + defaultLocale + '/templates-bundle',

            // Boomerang
            //3/6/2015 - commenting boomerang out, until HTTPS support is enabled.
            //'sh-boomerang': SH.appCommonBaseUrl + 'lib/sh-boomerang-0.1.1.min',

            // Bundled and minimized JS
            'main': SH.appBaseUrl + 'optimized/main'
        },
        useStrict: true,
        shim: {
            'dust': {
                exports: 'dust'
            },
            'underscore': {
                exports: '_'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'backbone_associations': {
                deps: ['backbone'],
                exports: 'Backbone.AssociatedModel'
            },
            'dust_helpers': {
                deps: ['dust'],
                exports: 'dust.helpers'
            },
            'raphael': {
                deps: ['blueprint-bundle'],
                exports: 'Raphael'
            },
            'hammer': {
                deps: 'blueprint-bundle',
                exports: 'Hammer'
            },
            'main': {
                //deps: ['common-globalheader', 'common-banner', 'date-stamp-dust-helper', 'blueprint-bundle', 'common-globalContextVars', 'common-parkingpass']
                deps: ['common-globalheader', 'common-banner', 'date-stamp-dust-helper', 'blueprint-bundle', 'common-globalContextVars', 'common-batchModel']
            }
        }
    });
});
