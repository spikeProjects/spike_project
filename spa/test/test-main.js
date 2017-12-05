var allTestFiles = [];
var dependencies = [];
var TEST_REGEXP = /test\/unit\/(?:collections|models|helpers|views)\/.*spec\.js$/;
var TEST_REGEXP_TWO = /test\/unit\/.*spec\.js$/;

var SH = SH || {};
SH.trkAccount = '<%= trkAccount %>';
var tokens = {
    srwd : 'a2ed1cccb3e0bf9248a653c168e7',
    stubhub : 'gWwh4zP4l90Cj4wQCslKHpB67_8a',
    cors : 'JYf0azPrf1RAvhUhpGZudVU9bBEa'
};
SH.bugsnag = {
    'apikey' : 'd2800ed4b22286af4233c0543b6f47f6'
};
SH.appCommonVersion = '<%= appCommonVersion %>';

// Contains versioned app name
SH.appName = '<%= appName %>';
// Plain version number
SH.appVersion = '<%= appVersion %>';

SH.locale = '<%= locale %>';
SH.envHostname = document.location.hostname;
SH.environment = 'Development';
SH.configBaseUrl = '';
SH.target_host = '<%= targetHost %>';
SH.token = '';
SH.corsToken = '';
SH.shlocale = SH.locale;
SH.trkAccount = '<%= trkAccount %>';
SH.country = 'us';

/*QA*/
//srwd00 and Localhost are for local machines
SH.token = tokens.srwd;

//CORS token is read by logging and tracking api's and is different from QA token
SH.corsToken = tokens.cors;
SH.configBaseUrl = '';

SH.boomerangUrl = 'http://webperformance.stubcorp.dev:7000/';
SH.appCommonBaseUrl = SH.configBaseUrl + '/resources/shape/scripts/common-' + SH.appCommonVersion + '/';
SH.appBaseUrl = SH.configBaseUrl + '/resources/shape/scripts/' + SH.appName + '-' + SH.appVersion + '/';
SH.tracker = {
    targetHost : 'https://track.' + SH.target_host + '.com',
    account : SH.trkAccount
};
SH.trackerAccount = SH.tracker.account;
// @TODO deprecated. Needs to remove.
SH.OMN = {
    pageName : 'UE: Event Details',
    pageType : 'UE: Event Details'
};
//as set by UC
SH.targetHost = SH.target_host;
SH.appFolder = SH.appName + '-' + SH.appVersion;
SH.cacheStaticURL = '//localhost:7777';
SH.enableLog = true;
SH.icmsServerBaseURL = "";
SH.icmsServer = "";
SH.configBaseUrl = 'http://m.' + SH.targetHost + '.com';
SH.staticUrl = '';

SH.appCommonPath = SH.staticUrl + '/resources/shape/scripts/common-' + SH.appCommonVersion + '/';
SH.appComponentPath = SH.staticUrl + '/resources/shape/components/common-' + SH.appCommonVersion + '/';
SH.appCommonComponentPath = SH.configBaseUrl + '/resources/shape/components/common-' + SH.appCommonVersion + '/';

SH.appCommon = {};
SH.appCommon = {
    staticHost : 'http://slcq054-cache11.stubhubstatic.com'
};

// @TODO Deprecate configBaseUrl
SH.appCommonBaseUrl = SH.appCommon.staticHost + '/resources/shape/scripts/common-' + SH.appCommonVersion + '/';
SH.appModulePath = SH.appCommon.staticHost + '/resources/shape/modules/common-' + SH.appCommonVersion + '/';
SH.appBaseUrl = SH.appCommon.staticHost + '/resources/shape/scripts/' + SH.appName + '-' + SH.appVersion + '/';
SH.appBaseUrlTemplates = SH.appCommon.staticHost + '/resources/shape/templates/' + SH.appName + '-' + SH.appVersion + '/';

// Add global registry for local workspace
SH.gsConfig = SH.gsConfig || {};
SH.gsConfig.currencies = SH.gsConfig.currencies || {};
SH.gsConfig.domain = SH.gsConfig.domain || {};
SH.gsConfig.locales = SH.gsConfig.locales || {};
SH.gsConfig.countries = SH.gsConfig.countries || [];
SH.gsConfig.features = SH.gsConfig.features || [];
SH.gsConfig.siteId = '1';

if (SH.gsConfig.siteId === '1') {
    SH.gsConfig.siteDescription = 'US SITE';
    SH.gsConfig.currencies = {
        "defaultCurrency" : {
            "currencyCode" : "USD",
            "currencyId" : 1,
            "currencySymbol" : "$"
        },
        "supportedCurrencies" : [{
            "currencyCode" : "USD",
            "currencyId" : 1,
            "currencySymbol" : "$"
        }]
    };
    SH.gsConfig.domain = {
        "domainDescription" : "StubHub US",
        "domainId" : 1,
        "domainName" : "srwd00.com"
    };
    SH.gsConfig.locales = {
        "defaultLocale" : "en-US",
        "supportedLocales" : ["en-US", "es-MX", "fr-CA"]
    };
    SH.gsConfig.countries.push.apply(SH.gsConfig.countries, [{
        "countryCode" : "US",
        "countryId" : 1,
        "geoId" : 196976,
        "locales" : ["en-US", "es-MX"],
        "phoneCallingCode" : "1"
    }, {
        "countryCode" : "CA",
        "countryId" : 2,
        "geoId" : 197077,
        "locales" : ["fr-CA"],
        "phoneCallingCode" : "1"
    }]);
    SH.gsConfig.features.push.apply(SH.gsConfig.features, [{
        'featureDescription' : 'gs.features.1.common.pdoExperience',
        'featureName' : 'gs.features.1.common.pdoExperience',
        'featureValue' : 'TOGGLE'
    }, {
        'featureDescription' : 'gs.features.1.event.ABTestActive',
        'featureName' : 'gs.features.1.event.ABTestActive',
        'featureValue' : 'TRUE'
    }, {
        'featureDescription' : 'value can be true/false.',
        'featureName' : 'gs.features.1.event.advancedFiltersEnabled',
        'featureValue' : 'true'
    }, {
        'featureDescription' : 'Show Face Value in Event Page',
        'featureName' : 'gs.features.1.event.faceValue',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.1.event.quantityQuestion',
        'featureValue' : 'false'
    }, {
        'featureDescription' : 'Show Buyer Cost in Event page',
        'featureName' : 'gs.features.1.event.showBuyerCost',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : 'Display after \'x\' tickets.',
        'featureName' : 'gs.features.1.event.staticImages.interval',
        'featureValue' : '3'
    }, {
        'featureDescription' : 'Display price slider inside/outside',
        'featureName' : 'gs.features.1.eventpage.sliderPositionOutside',
        'featureValue' : 'true'
    }, {
        'featureDescription' : 'Ticket Reco Experience for event',
        'featureName' : 'gs.features.1.eventpage.ticketRecommendation',
        'featureValue' : 'VALUEBARLOWEST'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.1.eventpage.enableBuildYourOrder',
        'featureValue' : 'TRUE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.1.eventpage.parkingAddOn',
        'featureValue' : 'TRUE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.1.eventpage.cartEnabled',
        'featureValue' : 'TRUE'
    }]);
}

if (SH.gsConfig.siteId === '3') {
    SH.gsConfig.siteDescription = 'EUR SITE';
    SH.gsConfig.currencies = {
        'defaultCurrency' : {
            'currencyCode' : 'EUR',
            'currencyId' : 3,
            'currencySymbol' : 'EUR'
        },
        'supportedCurrencies' : [{
            'currencyCode' : 'EUR',
            'currencyId' : 3,
            'currencySymbol' : 'EUR'
        }]
    };
    SH.gsConfig.domain = {
        'domainDescription' : 'StubHub DE',
        'domainId' : 3,
        'domainName' : 'srwd00.de'
    };
    SH.gsConfig.locales = {
        'defaultLocale' : 'de-DE',
        'supportedLocales' : ['de-DE', 'fr-FR']
    };
    SH.gsConfig.countries.push.apply(SH.gsConfig.countries, [{
        'countryCode' : 'DE',
        'countryId' : 61,
        'geoId' : 9923,
        'locales' : ['de-DE'],
        'phoneCallingCode' : '49'
    }, {
        'countryCode' : 'FR',
        'countryId' : 81,
        'geoId' : 6623,
        'locales' : ['fr-FR'],
        'phoneCallingCode' : '33'
    }]);
    SH.gsConfig.features.push.apply(SH.gsConfig.features, [{
        'featureDescription' : 'gs.features.3.common.pdoExperience',
        'featureName' : 'gs.features.3.common.pdoExperience',
        'featureValue' : 'TOGGLE'
    }, {
        'featureDescription' : 'gs.features.3.event.ABTestActive',
        'featureName' : 'gs.features.3.event.ABTestActive',
        'featureValue' : 'TRUE'
    }, {
        'featureDescription' : 'value can be true/false.',
        'featureName' : 'gs.features.3.event.advancedFiltersEnabled',
        'featureValue' : 'true'
    }, {
        'featureDescription' : 'Show Face Value in Event Page',
        'featureName' : 'gs.features.3.event.faceValue',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.3.event.quantityQuestion',
        'featureValue' : 'false'
    }, {
        'featureDescription' : 'Show Buyer Cost in Event page',
        'featureName' : 'gs.features.3.event.showBuyerCost',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : 'Display after \'x\' tickets.',
        'featureName' : 'gs.features.3.event.staticImages.interval',
        'featureValue' : '3'
    }, {
        'featureDescription' : 'Display price slider inside/outside',
        'featureName' : 'gs.features.3.eventpage.sliderPositionOutside',
        'featureValue' : 'true'
    }, {
        'featureDescription' : 'Ticket Reco Experience for event',
        'featureName' : 'gs.features.3.eventpage.ticketRecommendation',
        'featureValue' : 'VALUEBARLOWEST'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.3.eventpage.enableBuildYourOrder',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.3.eventpage.parkingAddOn',
        'featureValue' : 'FALSE'
    }, {
        'featureDescription' : '',
        'featureName' : 'gs.features.3.eventpage.cartEnabled',
        'featureValue' : 'FALSE'
    }]);
}

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file) || TEST_REGEXP_TWO.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        allTestFiles.push(pathToModule(file));
    }
});

define("global_context", [], function() {
    'use strict';
    return {
        eventId : '',
        target_host : 'http://m.' + SH.target_host + '.com',
        app_token : SH.token,
        appCommonVersion : SH.appCommonVersion,
        appName : SH.appName,
        appVersion : SH.appVersion,
        appFolder : SH.appName + '-' + SH.appVersion,
        environment : SH.environment,
        configBaseUrl : SH.configBaseUrl,
        loggerURL : '//log.' + SH.target_host + '.com',
        corsToken : 'Bearer ' + SH.corsToken,
        accessToken : 'Bearer ' + SH.token,
        addToken : true,
        locale : SH.locale,
        shlocale : SH.locale,
        trkAccount : SH.trkAccount,
        enableTracker : true,
        OMN : SH.OMN,
        url_headers : {
            'Authorization' : 'Bearer ' + SH.token,
            'target_host' : SH.target_host
        }
    };
});

/* global SH */
define('globals', ['global_context'], function(gc) {
    'use strict';
    var urlSuffix = SH.localeUtil.getCurrentSiteInfo().urlSuffix || '.com';
    var imgFolder = SH.appCommon.staticHost + '/resources/shape/images/' + gc.appFolder + '/';

    var globals = {

        app_token : 'NO_TOKEN_PASSED',

        seatmap_metadata_url : '/shape/catalog/venues/v2/{{nodeId}}/venueconfig/{{configId}}/metadata?maptype=2d',

        section_summary_url : '/shape/search/inventory/v1/sectionsummary?eventID={{eventId}}',

        search_inventory_url : '/shape/search/inventory/v1/?eventId={{eventId}}&sectionIdList={{sectionId}}',

        xo_url : 'https://' + window.location.hostname + '/buy/review?ticket_id={{tid}}&quantity_selected={{qty}}&event_id={{eventId}}',

        vfs_url : '//cache11.stubhubstatic.com/sectionviews/venues/{{nodeId}}/config/{{configId}}/{{size}}/{{sectionId}}.jpg',

        comingSoonImgUrl : imgFolder + 'stubhub_SeatMapComingSoon.jpg',

        // bugSnag: {
        // apiKey: "d832457f73f97105ca37754ed67805e0",
        // endpoint: "http://slcd000bsn001.stubcorp.com:49000/js"
        // },

        bugSnag : {
            apiKey : 'd2800ed4b22286af4233c0543b6f47f6'
        },

        event_meta : {
            //this is a placeholder for any and all information from the catalog v3 api - info on the event
            isParking : false,
            country : '',
            parkingEventId : ''
        },

        constants : {
            PARKING : 'Parking'
        },

        urlFilters : {},

        vfs_available : false,

        vfs_sizes : {
            small : '195x106',
            medium : '500x271',
            large : '1000x542'
        },

        //TYPES ARE MAPPED HERE - https://wiki.stubcorp.dev/display/api/GetVenueConfig
        map_types : [[0, 'section'], [1, 'zone'], [2, 'hybrid']],

        zones_enabled : false,

        originalMapZoom : 3,

        // used for tracking
        OMN : gc.OMN,

        PDO : {
            experience : {
                DEFAULT : 'DEFAULT', // Control
                TOGGLE : 'TOGGLE' // Toggle/Checkbox experience - with/without fees
            },

            omnitureString : {
                DEFAULT : '',
                TOGGLE : 'Toggle'
            },

            withFees : true // DEFAULT is with fees.
        },

        TicketReco : {
            experience : {
                DEFAULT : 'DEFAULT',
                VALUEBARLOWEST : 'VALUEBARLOWEST'
            },
            recoExperience : {
                0 : 'DEFAULT',
                6 : 'VALUEBARLOWEST'
            },
            setRecoExperience : {
                'DEFAULT' : 0,
                'VALUEBARLOWEST' : 6
            },
            showTicketReco : 'DEFAULT'
        },

        priceSlider : {
            displayOutside : false,
            enablePriceSlider : {
                'VALUEBARLOWEST' : 'VALUEBARLOWEST'
            }
        },

        quantityOverlay : {
            quantityQuestion : false
        },

        disableSorting : {
            'VALUEBARLOWEST' : 'VALUEBARLOWEST'
        },

        price_type : {
            CURRENT : 'currentPrice',
            LISTING : 'listingPrice'
        },

        mbox : {},
        mboxTimeout : 1000,

        screen_breakpoints : {
            tablet : 768,
            desktop : 1200
        },

        byo : {
            ABdisplay : true,
            parkingAvailable : false,
            quantity : ''
        },

        inventoryCollection : {
            search : {
                DEFAULT : 'DEFAULT',
                BLENDED : 'BLENDED'
            },
            searchType : 'DEFAULT',
            blendedIndicator : false
        },

        // Verify if single ticket_id query parameter is displayed when the
        // rest of the ticket list is hidden
        ticketIdActive : false,

        // Slider min max values, initailly set as empty string insted of number as price can be 0
        sliderPrice : {
            eventMinPrice : '',
            eventMaxPrice : '',
            sliderMinPrice : -1,
            sliderMinPercent : -1,
            sliderMaxPrice : '',
            sliderMaxPercent : ''
        },

        // The following will be populated from the global registry.
        // gs.features.X.event.staticImages.interval
        staticImagesInTicketList : {
            currentImage : 1,
            lastTicketIndex : 0,
            interval : 3,

            events : {
                9336460 : {
                    images : [{
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_1sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 1'
                    }, {
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_6sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 6'
                    }, {
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_2sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 2'
                    }, {
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_3sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 3'
                    }, {
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_4sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 4'
                    }, {
                        imageUrl : '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_5sml.jpg',
                        imageLink : 'http://stubhub.com/ultimate-pregame',
                        imageAltKey : 'event.common.superbowl.image.alttext',
                        imageAltText : '',
                        imageTracking : 'Image 5'
                    }]
                }
            }
        }
    };

    return globals;

});

var defaultLocale = SH.gsConfig.locales.defaultLocale.toLowerCase();

require(['global_context'], function(gs) {

    if (window.phantom) {
        window.phantom.onError = function(msg, trace) {
            console.log(msg);
        }
    }

    requirejs.onError = function(option) {
        console.log('Error: ', option.message);
        console.log('Error Original: ', option.originalError);
    };

    requirejs.config({
        // we have to kickoff jasmine, as it is asynchronous
        baseUrl : '/base',
        waitSeconds : 60,
        paths : {
            'commonMainModules' : SH.appCommonBaseUrl + 'common-main',

            // 'dust_helpers' : 'node_modules/dustjs-helpers/lib/dust-helpers',
            // 'common' : SH.appCommonBaseUrl + 'optimized/common',
            // 'common-utils' : SH.appCommonBaseUrl + 'utils',
            // 'cors_request' : SH.appCommonBaseUrl + 'utils/cors_request',
            // 'ads-utils' : SH.appCommonBaseUrl + 'utils/ads',
            // 'shtracker' : SH.appCommonBaseUrl + '/utils/tracker/shtracker',
            // 'omni_sh_mapping' : SH.appCommonBaseUrl + '/utils/tracker/omni_sh_mapping',
            // 'priceValidator' : SH.appCommonBaseUrl + 'utils/priceValidator',

            'config' : SH.appCommon.staticHost + '/resources/shape/scripts/' + SH.appFolder + '/config',
            'globals' : SH.appCommon.staticHost + '/resources/shape/scripts/' + SH.appFolder + '/optimized/main',

            // Map libraries
            'blueprintModules' : SH.appBaseUrl + 'optimized/blueprint-bundle',

            //static libraries
            'mbox' : SH.configBaseUrl + '/promotions/scratch/test/mbox',
            'bugSnag' : SH.configBaseUrl + '/promotions/scratch/analytics/bugsnag-2.min',

            // i18n Files
            'scriptsProps' : SH.appBaseUrl + defaultLocale + '/i18nPropsForScripts',
            'templates-bundle' : SH.appBaseUrlTemplates + defaultLocale + '/templates-bundle',

            // Boomerang
            //3/6/2015 - commenting boomerang out, until HTTPS support is enabled.
            //'sh-boomerang': SH.appCommonBaseUrl + 'lib/sh-boomerang-0.1.1.min',

            // Bundled and minimized JS
            'main' : SH.appBaseUrl + 'optimized/main',
            'commonBoot' : SH.appCommonBaseUrl + 'common-boot',
            // 'commonTemp' : SH.appCommon.staticHost + '/promotions/scratch/ue-app-head/common-temp',
            'commonI18nMainModules' : SH.appCommonBaseUrl + defaultLocale + '/common-i18n-main',

            //'commonDelay' : SH.appCommonBaseUrl + 'common-delay',
            'common-temp' : SH.appBaseUrl + '/promotions/scratch/ue-app-head/common-temp',
            'foresee-surveydef' : SH.configBaseUrl + '/promotions/scratch/mobile/foresee-surveydef',

            // Source file mapping
            'helpers/event_helper' : 'app/scripts/helpers/event_helper',
            'routes' : 'app/scripts/routes',
            'collections/inventory_collection' : 'app/scripts/collections/inventory_collection',
            'controllers/page_controller' : 'app/scripts/controllers/page_controller',
            'models/buyer_cost_model' : 'app/scripts/models/buyer_cost_model',
            'models/inventory_metadata_model' : 'app/scripts/models/inventory_metadata_model',
            'models/filter_model' : 'app/scripts/models/filter_model',
            'models/listing_model' : 'app/scripts/models/listing_model',
            'models/singleticket_model' : 'app/scripts/models/singleticket_model',
            'layouts/page_layout' : 'app/scripts/layouts/page_layout',
            'helpers/event_helper' : 'app/scripts/helpers/event_helper',
            'viewcontainers/layout_view_container' : 'app/scripts/viewcontainers/layout_view_container',
            'views/delivery_method_view' : 'app/scripts/views/delivery_method_view',
            'views/ticketdetails_view' : 'app/scripts/views/ticketdetails_view',
            'views/ticketlist_view' : 'app/scripts/views/ticketlist_view',
            'views/static_image_view' : 'app/scripts/views/static_image_view',

            // JSON data file mapping
            'collectionJsonData' : 'test/data/collections_json'
        },
        bundles : {
            'commonMainModules' : ['jquery', 'dust', 'underscore', 'vendor', 'foobunny', 'dotdotdot', 'common-globalheader', 'common-banner', 'date-stamp-dust-helper', 'application_helper', 'component', 'logger', 'sh_currency_format', 'sh_global_registry', 'sh_site', 'loggerUtil', 'sh_image', 'sh_mbox_util', 'shcookie', 'sh_currency_format', 'i18n', 'priceValidator', 'url-parser', 'commonMain'],
            'commonI18nMainModules' : ['common-banner-i18n-props', 'common-login-i18n-props', 'common-global_header-i18n-props'],
            'blueprintModules' : ['blueprint-bundle', 'blueprint'],
            'collectionJsonData' : ['filterModelData', 'invResponse']
        },
        shim : {
            'dust' : {
                exports : 'dust'
            },
            'underscore' : {
                exports : '_'
            },
            'backbone' : {
                deps : ['underscore', 'jquery'],
                exports : 'Backbone'
            },
            'backbone_associations' : {
                deps : ['backbone'],
                exports : 'Backbone.AssociatedModel'
            },
            'dust_helpers' : {
                deps : ['dust'],
                exports : 'dust.helpers'
            },
            'raphael' : {
                deps : ['blueprint-bundle'],
                exports : 'Raphael'
            },
            'hammer' : {
                deps : 'blueprint-bundle',
                exports : 'Hammer'
            },
            'bugSnag' : {
                exports : 'Bugsnag'
            },
            'main' : {
                deps : ['globals', 'dust', 'commonMain', 'common-globalheader', 'common-banner', 'date-stamp-dust-helper', 'templates-bundle', 'blueprint-bundle', 'commonBoot', 'commonTemp', 'config', 'foresee-surveydef', 'sh_site', 'bugSnag']
            }
        }
    });

    //app
    require([], function() {
        //app
        require(['sh_site'], function(shSite) {
            SH.localeUtil = shSite;
            requirejs.config({
                deps : allTestFiles,
                callback : window.__karma__.start
            });
        });
    });
});