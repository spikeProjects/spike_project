define('routes',[],function() {
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

define('viewcontainers/layout_view_container',[
  'foobunny'
], function(Foobunny) {
  'use strict';

  var LayoutViewContainer = Foobunny.ViewContainer.extend({

    initialize: function() {
      console.log('--LayoutViewContainer--  in initialize()', this);

    },

    el: '#content_container'

  });
  return LayoutViewContainer;
});

/* global SH */
define('globals',['global_context'
    ], function(gc) {
    'use strict';
    var urlSuffix = SH.localeUtil.getCurrentSiteInfo().urlSuffix || '.com';
    var imgFolder = SH.appCommon.staticHost + '/resources/shape/images/' + gc.appFolder + '/';

    var globals = {

        app_token: 'NO_TOKEN_PASSED',

        seatmap_metadata_url: '/shape/catalog/venues/v2/{{nodeId}}/venueconfig/{{configId}}/metadata?maptype=2d',

        section_summary_url: '/shape/search/inventory/v1/sectionsummary?eventID={{eventId}}',

        search_inventory_url: '/shape/search/inventory/v1/?eventId={{eventId}}&sectionIdList={{sectionId}}',

        xo_url: 'https://' + window.location.hostname + '/buy/review?ticket_id={{tid}}&quantity_selected={{qty}}&event_id={{eventId}}',

        xo_url_cart: 'https://' + window.location.hostname + '/buy/review?cart_id={{cart_id}}&event_id={{eventId}}',

        parking_event_url: '/event/{{parkingEventId}}/?pA=1',

        vfs_url: '//cache11.stubhubstatic.com/sectionviews/venues/{{nodeId}}/config/{{configId}}/{{size}}/{{sectionId}}.jpg',

        comingSoonImgUrl: imgFolder + 'stubhub_SeatMapComingSoon.jpg',

        noVfsImgUrl: imgFolder + 'no-vfs-concert1x.jpg',

        // displayWithFeesToggle: true,

        // bugSnag: {
        //     apiKey: "d832457f73f97105ca37754ed67805e0",
        //     endpoint: "http://slcd000bsn001.stubcorp.com:49000/js"
        // },

        bugSnag: {
            apiKey: 'd2800ed4b22286af4233c0543b6f47f6'
        },

        event_meta: {
            //this is a placeholder for any and all information from the catalog v3 api - info on the event
            isParking: false,
            country: '',
            parkingEventId: null
        },

        constants: {
            PARKING: 'Parking'
        },

        urlFilters: {},

        isByoMapOverlayDisplayed: false,

        vfs_available: false,

        vfs_sizes: {
            small: '195x106',
            medium: '500x271',
            large: '1000x542'
        },

        //TYPES ARE MAPPED HERE - https://wiki.stubcorp.dev/display/api/GetVenueConfig
        map_types: [
            [0, 'section'],
            [1, 'zone'],
            [2, 'hybrid']
        ],

        zones_enabled: false,

        originalMapZoom: 3,

        // used for tracking
        OMN: gc.OMN,

        PDO: {
            experience: {
                DEFAULT: 'DEFAULT', // Control
                TOGGLE: 'TOGGLE'   // Toggle/Checkbox experience - with/without fees
            },

            omnitureString: {
                DEFAULT: '',
                TOGGLE: 'Toggle'
            },

            withFees: true // DEFAULT is with fees.
        },

        TicketReco: {
            experience: {
                DEFAULT: 'DEFAULT',
                VALUEBARLOWEST: 'VALUEBARLOWEST'
            },
            recoExperience: {
                0: 'DEFAULT',
                6: 'VALUEBARLOWEST'
            },
            setRecoExperience: {
                'DEFAULT': 0,
                'VALUEBARLOWEST': 6
            },
            showTicketReco: 'DEFAULT'
        },

        priceSlider: {
            displayOutside: false,
            enablePriceSlider: {
                'VALUEBARLOWEST': 'VALUEBARLOWEST'
            }
        },

        parkingPass: {
            enabled: false,
            id: ''
        },

        quantityOverlay: {
            quantityQuestion: false,
            quantityBtnInitialCountGA: 4,
            quantityBtnInitialCount: 6,
            quantityBtnMaxCountGA: 30,
            quantityBtnMaxCount: 30
        },

        disableSorting: {
            'VALUEBARLOWEST': 'VALUEBARLOWEST'
        },

        // Valid values for sorting on reco experience - price, value, seats
        defaultSorting: {
            DEFAULT: {sort: 'price+asc', element: '.lowestprice'},
            FIELD: {
                PRICE: 'price',
                VALUE: 'value',
                SEATS: 'seats',
                SECTION: 'section',
                ROW: 'row'
            },
            PERFORMER: {
                2746: {sort: 'value+desc', element: '.bestvalue'}
            }
        },

        price_type: {
            CURRENT: 'currentPrice',
            LISTING: 'listingPrice'
        },

        mbox: {},
        mboxTimeout: 1000,

        screen_breakpoints: {
            tablet: 768,
            desktop: 1200
        },

        byo: {
            ABdisplay: true,
            quantity: '',
            upsellAccordion: false
        },

        upgradeTicket: {
            display: false,
            isTicketUpgraded: false,
            oldTicketListingId: '',
            apiAlgorithmId: 1
        },

        parking: {
            display: false,
            isAddedToCart: false
        },

        inventoryCollection: {
            searchType: 'BLENDED',
            blendedEvent: false,
            blendedLogicApplied: false,
            blendedPerformers: {2746: true}
        },

        // Verify if single ticket_id query parameter is displayed when the
        // rest of the ticket list is hidden
        ticketIdActive: false,

        // Slider min max values, initailly set as empty string insted of number as price can be 0
        sliderPrice: {
            eventMinPrice: '',
            eventMaxPrice: '',
            sliderMinPrice: -1,
            sliderMinPercent: -1,
            sliderMaxPrice: '',
            sliderMaxPercent: ''
        },

        // The following will be populated from the global registry.
        // gs.features.X.event.staticImages.interval
        staticImagesInTicketList: {
            currentImage: 1,
            lastTicketIndex: 0,
            interval: 3,

            events: {
                9336460: {
                    images: [
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_1sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 1'
                        },
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_6sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 6'
                        },
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_2sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 2'
                        },
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_3sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 3'
                        },
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_4sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 4'
                        },
                        {
                            imageUrl: '/promotions/scratch/ue-staticimage/events/9336460/superbowl50banner_5sml.jpg',
                            imageLink: 'http://stubhub.com/ultimate-pregame',
                            imageAltKey: 'event.common.superbowl.image.alttext',
                            imageAltText: '',
                            imageTracking: 'Image 5'
                        }
                    ]
                }
            }
        }
    };

    return globals;

});

/* global SH,Backbone,_ */
define('helpers/event_helper',[
    'foobunny',
    'globals',
    'shcookie',
    'loggerUtil',
    'application_helper',
    'global_context',
    'sh_global_registry',
    'sh_mbox_util',
    'sh_currency_format',
    'url-parser',
    'i18n'
], function(Foobunny, globals, shcookie, loggerUtil, ApplicationHelper, gc, GlobalRegistry, MboxUtil, currencyFormatUtil, urlParser, i18n) {
    var EventHelper = (function() {
        'use strict';

        var queueTracking = [],
            pageViewTrackingDone = false,
            pageErrorTrackingDone = false,
            mboxDeferred,
            abNameSpace,
            abKey,
            blendedLogicApplied = false,
            returnTrue = function() { return true; };

        function geti18n(key) {
            if (i18n.propsJson[key]) {
                return i18n.propsJson[key];
            } else {
                return null;
            }
        }

        function getOS() {
            var userAgent = navigator.userAgent;
            var index;
            var OS, version;

            // Extract OS
            if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
                OS = 'iOS';
                index = userAgent.indexOf('OS ');

            } else if (userAgent.match(/Android/i)) {
                OS = 'Android';
                index = userAgent.indexOf('Android ');

            } else if (userAgent.match(/Windows Phone/i)) {
                OS = 'Windows Mobile';
                index = userAgent.indexOf('Windows Phone ');

            } else if (userAgent.match(/Macintosh/i)) {
                OS = 'Mac OS';
                index = userAgent.indexOf('OS X ');

            } else if (userAgent.match(/Windows NT/i)) {
                OS = 'Windows';
                index = userAgent.indexOf('Windows NT ');

            } else {
                OS = 'unknown';
            }

            // Extract version
            if (OS === 'iOS' && index > -1) {
                version = userAgent.substr(index + 3, 3).replace('_', '.');

            } else if (OS === 'Android' && index > -1) {
                version = userAgent.substr(index + 8, 3);

            } else if (OS === 'Windows Mobile' && index > -1) {
                version = userAgent.substr(index + 14, 3);

            } else if (OS === 'Mac OS' && index > -1) {
                version = userAgent.substr(index + 5, 4).replace('_', '.');

            } else if (OS === 'Windows' && index > -1) {
                version = userAgent.substr(index + 11, 3);

            } else {
                version = 'unknown';
            }

            return {
                'OS': OS,
                'version': version
            };
        }

        function getActiveBreakpoint() {
                // @mobile-size: < 768;
                // @tablet-size: 768px;
                // @desktop-size: 1200px;
            var breakpoint = 'mobile';

            if (isMobile()) {
                breakpoint = 'mobile';
            } else if (isTablet()) {
                breakpoint = 'tablet';
            } else if (isDesktop()) {
                breakpoint = 'desktop';
            }
            return breakpoint;
        }

        // TODO: move this to a more global space, and run it on the boot of the app.
        function getBrowser() {
            var uagent = navigator.userAgent.toLowerCase(),
                match = '',
                _browser = {},
                browserName = '';

            _browser.chrome  = /webkit/.test(uagent)  && /chrome/.test(uagent) &&
            !/edge/.test(uagent);

            _browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);

            _browser.msie    = /msie/.test(uagent)    || /trident/.test(uagent)     ||
            /edge/.test(uagent);

            _browser.safari  = /safari/.test(uagent)  && /applewebkit/.test(uagent) &&
            !/chrome/.test(uagent);

            _browser.opr     = /mozilla/.test(uagent) && /applewebkit/.test(uagent) &&
            /chrome/.test(uagent)  && /safari/.test(uagent)      &&
            /opr/.test(uagent);

            _browser.version = '';

            for (x in _browser) {
                if (_browser[x]) {

                    match = uagent.match(
                        new RegExp("(" + (x === "msie" ? "msie|edge" : x) + ")( |\/)([0-9]+)")
                    );

                    if (match) {
                        _browser.version = match[3];
                    } else {
                        match = uagent.match(new RegExp("rv:([0-9]+)"));
                        _browser.version = match ? match[1] : "";
                    }

                    browserName = x;
                    break;
                }
            }
            _browser.opera = _browser.opr;
            delete _browser.opr;

            return {
                browser: browserName,
                version: _browser.version
            };
        }


        function millisecondsToHours(ms) {
            return Math.floor(((ms / 1000) / 60) / 60);
        }

        /*  Get time in hours */
        function getTimeAheadOfEvent(eventDate) {
            return Math.floor((new Date(eventDate) - (new Date(Date.now()))) / 3600000);
        }

        function logAppState(callerInfo, error, customProperties) {
            var generaldata = {
                    app_id: 'Unified Event Page',
                    app_source: 'Unified-Event',
                    event_id: gc.event_id
                },
                logdata = $.extend(generaldata, customProperties);

            logdata.response_text = JSON.stringify(error);

            try {
                loggerUtil.error(callerInfo, error, logdata);
            } catch (ex) {
                console.log('-------- loggerUtil catch -------', ex, logdata, error.toString());
            }
        }

        // pageView has to be an object that can be passed onto the tracking as-is or
        // it should be a string that will then be used to create the properties of
        // the object that is to be passed to the tracking api.
        // NOTE: In case of Errors pageload and pageError both will be passed as true.
        // This is because we will not have a success pageload being fired since the APIs
        // would have resulted in failure. The success pageload will only fire when
        // APIs are successful.
        function track(params) {
            //pageView, appInteraction, pageload, pageError, filterType, ticketFilterType
            var interaction = '',
                interactionType = '',
                opts = {},
                pageView = params.pageView,
                appInteraction = params.appInteraction,
                pageload = params.pageload,
                pageError = params.pageError,
                filterType = params.filterType,
                userExperienceSnapshot = params.userExperienceSnapshot,
                finalStr = '';

            globals.userExperienceSnapshot = _.extend({}, globals.userExperienceSnapshot, userExperienceSnapshot);
            for (var attr in globals.userExperienceSnapshot) {
                if (globals.userExperienceSnapshot[attr] !== '') {
                    finalStr = globals.userExperienceSnapshot[attr] + '; ' + finalStr;
                }
            }

            // If we have not fired the pageload yet and this is not the pageload
            // then we queue up the tracking and then fire it once the pageload has
            // occurred.
            if (!pageload) {
                if (!pageViewTrackingDone) {
                    queueTracking.push(params);
                    return;
                }
            }

            // If an object is passed to this method then use that. Otherwise, create
            // the object from the string and then use that object.
            if (typeof pageView === 'string') {
                interactionType = globals.OMN.pageType;
                if (pageView !== '') {
                    interactionType = interactionType + ': ' + pageView;
                }
                if (appInteraction && appInteraction !== '') {
                    interaction = interactionType + ': ' + appInteraction;
                }
                opts = {
                        'appInteraction': interaction,
                        'appInteractionType': interactionType,
                        'appInteractionPage': globals.OMN.pageName,
                        'pageType': globals.OMN.pageType,
                        'filterType': filterType,
                        'userExperienceSnapshot': finalStr
                    };
            } else {
                opts = _.extend({}, pageView, {
                    userExperienceSnapshot: finalStr
                });
            }

            ApplicationHelper.track(opts, null, pageload);

            // If we have received a pageError then we do not want to send any other tracking
            // to the server. Empty the queue.
            if (pageError) {
                pageErrorTrackingDone = true;
                queueTracking.length = 0;
            } else if (pageload && !pageViewTrackingDone && !pageErrorTrackingDone) {
                // If this was a pageload and we have not received any pageload's before
                // this one we might have pending tracking that needs to be fired.
                pageViewTrackingDone = true;
                processQueuedTracking();
            }
        }

        function processQueuedTracking() {
            if (queueTracking.length <= 0) {
                return;
            }

            for (var i = 0, len = queueTracking.length; i < len; i++) {
                track(queueTracking[i]);
            }
            queueTracking.length = 0;
        }

        function singleTicketErrorObject(error) {
            var listingResponse,
                responseJSON;

            if (error.responseJSON) {
                listingResponse = error.responseJSON.ListingResponse;
            }

            // The single ticket API returns a different error object. Converting
            // the error object for ease of use in further processing upstream.
            // {"ListingResponse":{"errors":[{"type":"INPUTERROR","code":"SLA02","message":"Listing not found","parameter":"114012441"}]}}
            if (listingResponse && listingResponse.errors && listingResponse.errors.length > 0) {
                error.responseJSON.code = listingResponse.errors[0].code;
                error.responseJSON.description = listingResponse.errors[0].message;
            } else if (error.status) {
                error.responseJSON = {};
                error.responseJSON.code = error.status;
                error.responseJSON.description = error.statusText;
            } else if (error.fault) {
                error.responseJSON = {};
                error.responseJSON.code = error.status;
                error.responseJSON.description = error.statusText;
            }

            return $.extend(error, {responseJSON: responseJSON});
        }

        function createTrackingOpts(pageName, opts, eventDetails, singleTicket) {
            var pageType = '',
                id = gc.event_id,
                timeBeforeEvent = '',
                primaryCategory = 'Not Available',
                primaryGrouping = 'Not Available',
                primaryPerformer = 'Not Available';

            if (eventDetails) {
                pageType = ': Pageview';
                id = eventDetails.get('id');
                timeBeforeEvent = getTimeAheadOfEvent(eventDetails.get('eventDateLocal'));
                // Get category, group and performer information
                primaryCategory = _.isEmpty(eventDetails.get('categories')) ? 'Not Available' : eventDetails.get('categories')[0].name;
                primaryGrouping = _.isEmpty(eventDetails.get('groupings')) ? 'Not Available' : eventDetails.get('groupings')[0].name;
                primaryPerformer = _.isEmpty(eventDetails.get('performers')) ? 'Not Available' : eventDetails.get('performers')[0].name;

                if (eventDetails.get('performers')) {
                    opts.genreId = eventDetails.get('performers')[0].id;
                }
            }

            // Save shared tracking properties to Globals Object
            globals.OMN.ancestorGenrePath = primaryCategory + ': ' + primaryGrouping + ': ' + primaryPerformer;
            globals.OMN.pageType = globals.OMN.pageName + pageName;
            if (singleTicket && !gc.userComingBack) {
                globals.OMN.pageType += ': Single Ticket';
            }
            globals.OMN.appVersion = gc.appVersion;

            //set tracking properties for event details
            $.extend(opts, {
                pageName: globals.OMN.pageName,
                appInteraction: globals.OMN.pageType + pageType,
                appInteractionType: globals.OMN.pageType + pageType,
                appInteractionPage: globals.OMN.pageName,
                products: ';' + id,
                siteSections: 'Event details',
                pageType: globals.OMN.pageType,
                timeBeforeEvent: timeBeforeEvent,
                category: primaryCategory,
                subCategory: primaryCategory + ': ' + primaryGrouping,
                genre: globals.OMN.ancestorGenrePath,
                'core:productView': 1
            });

            return opts;

        }

        // @media (min-width:320px) { /* smartphones, iPhone, portrait 480 x 320 phones */ }
        // @media (min-width:481px) { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
        // @media (min-width:641px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800 x 480 or 854 x 480 phones */ }
        // @media (min-width:961px) { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
        // @media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
        // @media (min-width:1281px) { /* hi-res laptops and desktops */ }
        function isDesktop() {
            return (window.innerWidth >= globals.screen_breakpoints.desktop);
        }

        function isTablet() {
            return (window.innerWidth >= globals.screen_breakpoints.tablet) && (window.innerWidth < globals.screen_breakpoints.desktop);
        }

        function isMobile() {
            return (window.innerWidth < globals.screen_breakpoints.tablet);
        }

        function getHostName(idx) {
            var hostNameArray = document.location.hostname.split('.');
            if (idx === undefined) {
                return hostNameArray;
            } else {
                return (hostNameArray[idx] === 'localhost') ? 'www' : hostNameArray[idx];
            }
        }

        /**
         * document.referrer decomposed
         * referrer.origin;   // => "[http|https]://[domain][:port]"
         * referrer.protocol; // => "http:"
         * referrer.hostname; // => "example.com"
         * referrer.port;     // => "3000"
         * referrer.pathname; // => "/the/full/path/"
         * referrer.canonical;// => "the-seo-friendly-prefix"
         * referrer.SHType;   // => "event"
         * referrer.SHTypeId; // => "1234556789"
         * referrer.search;   // => "?search=test&search2=another&search3=etcetera"
         * referrer.params;   // => array of query param key, value pairs in format [0] = [0],[1]
         * referrer.hash;     // => "#hash"
         * referrer.host;     // => "example.com:3000"
         * @return Object referrer An object with keys as listed above
         *
         * Author: Hugh Chapman, hchapman@stubhub.com
         */
        function getReferrer() {
            var referrer = document.createElement('a'),
                parts = undefined;
            referrer.href = SH.event.referrer; // IE jankiness: does not record document.referrer
            parts = referrer.pathname.split('/');
            if (!referrer.origin) {
                if (referrer.protocol.length && referrer.host.length) {
                    referrer.origin = referrer.protocol + '//' + referrer.host + '/';
                } else {
                    referrer.origin = '';
                }
            }
            referrer.canonical = parts[1];
            referrer.SHType = parts[2];
            referrer.SHTypeId = parts[3];
            parts = referrer.search.replace('?','').split('&');
            referrer.params = parts.map(function(paramString) {
                return paramString.split('=');  // => 'key' [0], 'value' [1]
            });
            return referrer;
        }

        /**
         * parkingPassPushState - redirect using document.referrer with altered params
         * for parking pass only!
         * @param  String queryFrag URI fragment
         * @return none
         *
         * Author: Hugh Chapman, hchapman@stubhub.com
         */
        function parkingPassRedirectToBYO(queryFrag) {
            var ref = this.getReferrer(),
                referrer = ref.origin + ref.pathname; // see this.getReferrer()

            if (_.isEmpty(queryFrag)) {
                console.log('EventHelper.parkingPassRedirectToBYO() requires String parameter "queryFrag", found: ', queryFrag);
                return;
            }

            referrer += '?' + encodeURI(queryFrag);
            ref.params.forEach(function(param) {
                if (param[0] === '' ||
                    param[0] === 'pA' ||
                    param[0] === 'park_id' ||
                    param[0] === 'park_qty') { return; }
                referrer += '&' + param[0] + '=' + param[1];
            });
            urlParser.redirect(referrer);
        }


        function scrollEventHeader(element, scrollUp) {
            var containers = $('#header, #content_container');

            if (scrollUp) {
                containers.addClass('scroll-up');
                element.addClass('scrolled-up');
            } else {
                containers.removeClass('scroll-up');
                element.removeClass('scrolled-up');
            }
        }

        function checkFeatureType(listingAttribute) {
            var featureType = {
                featureIcon: 'none',
                valueType: 'none'
            };

            if (listingAttribute === 101) {
                featureType.featureIcon = 'aisleseat';
                featureType.valueType = 'add';
            } else if (listingAttribute === 102) {
                featureType.featureIcon = 'parking-2';
                featureType.valueType = 'add';
            } else if (listingAttribute === 13372) {
                featureType.featureIcon = 'primarypartner';
                featureType.valueType = 'add';
            } else if (listingAttribute === 202 || listingAttribute === 3006) {
                featureType.featureIcon = 'handicap';
                featureType.valueType = 'sub';
            } else if (listingAttribute === 201) {
                featureType.featureIcon = 'obstructed';
                featureType.valueType = 'sub';
            }
            return featureType;
        }

        function getCurrentUrl() {
            return Backbone.history.fragment;
        }

        function getUrlQuery(variable) {
            var vars = getUrlParamsArray();
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] === variable) {
                    return pair[1];
                }
            }
            return false;
        }

        function getUrlParamsArray() {
            var urlParam = Backbone.history.location.search;

            return urlParam ? urlParam.substr(1).split('&') : [];
        }

        function getUrlParamsMap() {
            return _.object(_.map(getUrlParamsArray(), function(elem, idx, list) {
                var pair = elem.split('=');
                return [pair[0], pair[1]];
            }));
        }

        // set-update params in url
        function setUrlParam(urlParam, paramValue) {
            var updatedParamUrl = '/' + getCurrentUrl(),
                urlParams = getUrlParamsMap();

            urlParams[urlParam] = paramValue;
            updatedParamUrl += '?' + _.map(urlParams, function(value, key) {
                return key + '=' + value;
            }).join('&');

            window.history.replaceState(window.history.state, '', updatedParamUrl);
        }

        function setUrlParams(paramsArray) {
            var updatedParamUrl = '/' + getCurrentUrl(),
                urlParams = getUrlParamsMap(),
                thisParam;

            for (var i = 0; i < paramsArray.length; i++) {
                thisParam = paramsArray[i];
                urlParams[thisParam.name] = thisParam.value;
            }

            updatedParamUrl += '?' + _.map(urlParams, function(value, key) {
                return key + '=' + value;
            }).join('&');

            window.history.replaceState(window.history.state, '', updatedParamUrl);
        }

        // remove url parameters
        function removeUrlParam(urlParam) {
            var updatedParamUrl = '/' + getCurrentUrl(),
                urlParams = getUrlParamsMap();

            if (urlParams[urlParam]) {
                delete urlParams[urlParam];
            }

            updatedParamUrl += '?' + _.map(urlParams, function(value, key) {
                return key + '=' + value;
            }).join('&');

            window.history.replaceState(window.history.state, '', updatedParamUrl);
        }

        function removeUrlParams(paramsArray) {
            var updatedParamUrl = '/' + getCurrentUrl(),
                urlParams = getUrlParamsMap();

            for (var i = 0; i < paramsArray.length; i++) {
                if (urlParams[paramsArray[i]]) {
                    delete urlParams[paramsArray[i]];
                }
            }

            updatedParamUrl += '?' + _.map(urlParams, function(value, key) {
                return key + '=' + value;
            }).join('&');

            window.history.replaceState(window.history.state, '', updatedParamUrl);
        }

        function removeAllUrlParams() {
            var currentUrl = '/' + getCurrentUrl();
            window.history.replaceState(window.history.state, '', currentUrl);
        }

        function setFiltersinStorage(paramName, paramValue) {
            var eventFilters = Foobunny.storage.getSessionItem('eventFilters') || {};

            eventFilters[paramName] = paramValue;
            Foobunny.storage.setSessionItem('eventFilters', eventFilters);
        }

        var getFeatureFn = function(featureName, valueType) {
            valueType = valueType || 'boolean';
            var gs = GlobalRegistry,
                siteId = gs.getSiteId(),
                fullName = 'gs.features.' + siteId + '.' + featureName,
                featureValue = gs.getFeatureValue(fullName, valueType);
            return function() {
                return featureValue;
            };
        };


        // Determine which PDO Experience to show.
        // If PDO is enabled and an experience # available then show that experience.
        // If PDO is disabled and a winning experience # is available then show that experience.
        // IF PDO is disabled and a winning experience # is NOT available then show the DEFAULT experience.
        // @TODO check remove this fn since showPdoExperience is always true
        var showPdoExperience = (function() {
            var showPdoExperience = (getFeatureFn('common.pdoExperience', 'string'))();

            // Fall back to DEFAULT/CONTROL if we have invalid data.
            if (!globals.PDO.experience[showPdoExperience]) {
                showPdoExperience = globals.PDO.experience.DEFAULT;
            }

            return function() {
                return showPdoExperience;
            };
        })();

        // @TODO check remove this fn since globals.PDO.showPdoExperience !== globals.PDO.experience.DEFAULT is always true
        var setPdoState = function() {
            // Fall back to DEFAULT/CONTROL if we have invalid data.
            if (!globals.PDO.experience[globals.PDO.showPdoExperience]) {
                globals.PDO.showPdoExperience = globals.PDO.experience.DEFAULT;
            }

            if (globals.PDO.showPdoExperience !== globals.PDO.experience.DEFAULT) {
                globals.PDO.withFees = false;
            }
        };

        var showRecoExperience = (function() {
            var showRecoExperience = (getFeatureFn('eventpage.ticketRecommendation', 'string'))();

            // Fall back to DEFAULT/CONTROL if we have invalid data.
            if (!showRecoExperience) {
                showRecoExperience = globals.TicketReco.experience.DEFAULT;
            }

            return function() {
                return showRecoExperience;
            };
        })();

        var isABTestActive = getFeatureFn('event.ABTestActive');

        var constructMboxData = function(eventModel) {
            var mboxEventObject = ApplicationHelper.constructAncestorIdArray(eventModel.get('ancestors'));

            // Set the PageName
            mboxEventObject.pageName = 'eventPage';

            // Set performer Id
            var performers = eventModel.get('performers'),
                performerIds = '';

            if(performers && performers.length > 0) {

                for(var i = 0; i < performers.length; i++){
                    performerIds += performers[i].id + ',';
                }
                // trim trailing "," from the end of the string
                performerIds = performerIds.substr(0, performerIds.length - 1);
            }

            // Create the event object that gets passed to the MBOX for further segmentation.
            // Add the data that you want the traffic segmentation to happen over here and then
            // Go to TNT to set the campaign accordingly.
            mboxEventObject.event = {
                id: eventModel.get('id'),
                primaryPerformer: eventModel.get('primaryPerformer'),
                performerIds: performerIds
            };

            try {
                mboxEventObject.event.venueCountry = eventModel.get('venue').country;
            } catch (e) {}

            return mboxEventObject;
        };

        var makeMboxCall = function(context, eventData, testReference, testKey) {
            mboxDeferred = $.Deferred();
            abNameSpace = testReference;
            abKey = testKey[0];

            if (isABTestActive()) {
                MboxUtil.MboxInit(eventData,
                            abNameSpace,
                            abKey,
                            mBoxSuccess,
                            mBoxFailure,
                            undefined,
                            globals.mboxTimeout || 500,
                            context);
            } else {
                // If there are no AB Tests active then resolve the deferred so that the
                // callbacks can be executed.
                mBoxSuccess();
            }

            return mboxDeferred.promise();
        };

        var mBoxSuccess = function() {
            var testKeyValues = {
                'priceSliderPositionOutside': abNameSpace.priceSliderPositionOutside,
                'PDOExperience': abNameSpace.PDOExperience,
                'quantityQuestion': abNameSpace.quantityQuestion,
                'TicketRecommendation': abNameSpace.TicketRecommendation,
                'ABdisplay': abNameSpace.displayBYO,
                'displayUpgrade': abNameSpace.displayUpgrade,
                'upsellAccordion': abNameSpace.upsellAccordion,
                'blendedLogicApplied': abNameSpace.blendedLogicApplied,
                'parkingPass': abNameSpace.parkingPass
                // 'displayWithFeesToggle': abNameSpace.showWithFees
            };

            mboxDeferred.resolve({
                abTestActive: isABTestActive(),
                abNameSpace: abNameSpace,
                abKey: abKey,
                abValue: testKeyValues
            });
        };

        var mBoxFailure = function() {
            var testKeyValues = {
                'priceSliderPositionOutside': abNameSpace.priceSliderPositionOutside,
                'PDOExperience': abNameSpace.PDOExperience,
                'quantityQuestion': abNameSpace.quantityQuestion,
                'TicketRecommendation': abNameSpace.TicketRecommendation,
                'ABdisplay': abNameSpace.displayBYO,
                'displayUpgrade': abNameSpace.displayUpgrade,
                'upsellAccordion': abNameSpace.upsellAccordion,
                'blendedLogicApplied': abNameSpace.blendedLogicApplied,
                'parkingPass': abNameSpace.parkingPass
                // 'displayWithFeesToggle': abNameSpace.showWithFees
            };

            mboxDeferred.reject({
                abTestActive: isABTestActive(),
                abNameSpace: abNameSpace,
                abKey: abKey,
                abValue: testKeyValues
            });
        };

        var getVfsUrl = function(sectionId, vfsSize) {
            return globals.vfs_url.replace('{{size}}', globals.vfs_sizes[vfsSize]).replace('{{sectionId}}', sectionId);
        };

        var formatPrice = function(value, discardCents) {
            var symbol = currencyFormatUtil.getCurrencySymbolByLocale(SH.locale),
                price;
            // Build price string with currency symbol
            price = currencyFormatUtil.formatPrice(value, SH.locale);

            // If we want to discard the cent values.
            // Note: currencyFormatUtils returns a value to 2 decimal places, plus a period or comma
            price = (discardCents ? price.slice(0, -3) : price);

            // If we are using German locale, append the currency symbol
            if (SH.locale === 'de-de') {
                price = price + ' ' + symbol;
            } else {
                price = symbol + price;
            }

            return price;
        };

        var setStaticImageDetails = function() {
            globals.staticImagesInTicketList.interval = (getFeatureFn('event.staticImages.interval', 'number'))();
        };

        var isAdvancedFiltersEnabled = getFeatureFn('event.advancedFiltersEnabled');

        var isTouchDevice = function isTouchDevice() {
            return !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
        };

        var isBYOEnabled = getFeatureFn('eventpage.enableBuildYourOrder', 'boolean');
        var isUpgradeEnabled = getFeatureFn('eventpage.displayUpgrade', 'boolean');
        var isUpsellAccordionEnabled = getFeatureFn('eventpage.upsellAccordion', 'boolean');
        var blendedEnabledSwitch = getFeatureFn('eventpage.blendedLogicApplied', 'boolean');
        // var isDisplayWithFeesToggle = getFeatureFn('eventpage.showWithFees', 'boolean');


        var showVfs = function showVfs(tag, size, sectionId, success, failure) {

            if (!sectionId) {
                return;
            }

            var vfsImg = new Image();

            vfsImg.onload = function() {
                tag.src = this.src;

                if (typeof success === 'function') {
                    success();
                }
            };
            vfsImg.onerror = function() {
                if (typeof failure === 'function') {
                    failure();
                }
                // Log the vfs failure.
                EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
            };
            vfsImg.src = getVfsUrl(sectionId, size);
        };

        var isQuantityOverlayEnabled = getFeatureFn('event.quantityQuestion');

        var getBrowserName = function() {
            var userAgent = navigator.userAgent,
                browserName = {
                    isSafari: function() {
                        if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
                            return true;
                        }
                    }
                };
            return browserName;
        };

        // Note: This function is going to be called for every listing. So, we have to return out of
        // this function as quickly as possible to avoid delays in the rendering.
        var determineBYO = function determineBYO(params) {
            var listingAttributeList = params.listingAttributeList || [],
                deliveryTypeList = params.deliveryTypeList || [];

            if (!EventHelper.isBYOEnabled()) {
                return false;
            }

            // If this event is a parking event.
            if (globals.event_meta.isParking === true) {
                return false;
            }

            // Phase1: We are using the AB to tell us whether or not to show the BYO.
            return globals.byo.ABdisplay;

            // // Phase2:
            // if (!globals.byo.ABdisplay) {
            //     return false;
            // }

            // // If this event is a parking event.
            // if (globals.event_meta.isParking === true) {
            //     return false;
            // }

            // // For ticket reco experiences we show the BYO.
            // if (globals.TicketReco.showTicketReco !== globals.TicketReco.experience.DEFAULT) {
            //     return true;
            // }

            // // Convert the array of objects into array of ids similar
            // // TODO: Maybe in ticketlist_view.js instead of array create an object?
            // listingAttributeList = _.map(listingAttributeList, function(item) {
            //     return item.id;
            // });

            // deliveryTypeList = _.map(deliveryTypeList, function(item) {
            //     return item.id;
            // });

            // // Don't show the BYO in the following cases
            // // - If the event itself is a parking event.
            // // - If the listing DOES NOT have instant download.
            // // - If the listing is instant download and includes parking.
            // if (globals.event_meta.parkingEventId ||
            //     _.indexOf(deliveryTypeList, 2) === -1 ||
            //     (_.indexOf(deliveryTypeList, 2) !== -1 && _.indexOf(listingAttributeList, 102) !== -1)
            //     ) {
            //     return false;
            // }

            // return true;
        };

        var isCartEnabled = getFeatureFn('eventpage.cartEnabled');

        var getParkingFeatureState = function() {
            return getFeatureFn('eventpage.parkingAddOn', 'boolean')();
        }

        var getParkingPerformers = function() {
            var performers = getFeatureFn('eventpage.parkingAddOn.alwaysOn', 'string')();

            if(typeof performers === 'string') {
                return performers.split(',');
            } else {
                return [];
            }

        }

        var showParkingAddon = function() {
            // TODO globals.inventoryCollection.blendedLogicApplied is toggle for enabling parking
            // on 76ers events only. Remove it when parking is enabled broadly.
            return (
                globals.parkingPass.enabled
                && isCartEnabled()
                && (globals.event_meta.parkingEventId !== null)
                );
        };

        var setBlendedEvent = function(blendedEvent) {
            globals.inventoryCollection.blendedEvent = blendedEvent;
        };

        var isBlendedEvent = function() {
            var _blendedEvent = (globals.inventoryCollection.blendedEvent === true || globals.inventoryCollection.blendedEvent === 'true'),
                _blendedLogicApplied = (globals.inventoryCollection.blendedLogicApplied === true || globals.inventoryCollection.blendedLogicApplied === 'true');
            return (_blendedEvent === true && _blendedLogicApplied === true);
        };

        var getLayoutType = function() {
            var layoutType;
            // identify current layout
            if(isBlendedEvent() === true) {
                layoutType = 'blended';
            } else if(gc.view === 'NON-GA') {
                layoutType = 'nonBlended';
            } else if(gc.view === 'GA') {
                layoutType = 'ga';
            }
            return layoutType;
        };

        var quantityQuestionEnabled = function(){

            var showState = false;

            if(globals.event_meta.isParking === true || isSingleTicketMode()) {
                // early exit on dominant factor
                return false;
            }

            var qqSwitchObj = {
                "blended": {
                    mobile: true,
                    tablet: true,
                    desktop: true
                },
                "nonBlended": {
                    mobile: true,
                    tablet: false,
                    desktop: false
                },
                "ga": {
                    mobile: true,
                    tablet: true,
                    desktop: true
                }
            }

            // check that a quantity hasn't already been selected
            if ((this.getUrlQuery('qty') !== false)) {
                showState = false;
            } else if ((this.getUrlQuery('qqd') !== false)) {
                showState = false;
            } else {
                var layoutType = getLayoutType(), // example: "non-blended",
                    deviceType = getActiveBreakpoint(); // example: "desktop",
                showState = qqSwitchObj[layoutType][deviceType];
            }

            return showState;
        };

        var useCart = function() {
            // Use Cart for parking Event when parking is ready
            return (isCartEnabled() && (showParkingAddon() || isBlendedEvent()));
        };

        var useListingsV2 = function() {
            return true;
        };

        var setBlendedLogicApplied = function(applied) {
            blendedLogicApplied = (_.isBoolean(applied) && applied === true);
        };

        var isBlendedLogicApplied = function() {
            return blendedLogicApplied;
        };

        var isSingleTicketMode = function() {
            return (gc.ticket_id || gc.cart_id);
        };

        var determineValueToPreserve = function(type, key, fnFallBack) {
            var preserveValue = key;
            if (key) {
                if (type === 'boolean') {
                    preserveValue = (key === 'true');
                }
            } else {
                if (typeof fnFallBack === 'function') {
                    preserveValue = fnFallBack();
                } else {
                    preserveValue = fnFallBack;
                }
            }

            return preserveValue;
        };

        return {
            geti18n: geti18n,
            getOS: getOS,
            getBrowserName: getBrowserName,
            millisecondsToHours: millisecondsToHours,
            getTimeAheadOfEvent: getTimeAheadOfEvent,
            logAppState: logAppState,
            track: track,
            singleTicketErrorObject: singleTicketErrorObject,
            createTrackingOpts: createTrackingOpts,
            isDesktop: isDesktop,
            isTablet: isTablet,
            isMobile: isMobile,
            getHostName: getHostName,
            getReferrer: getReferrer,
            parkingPassRedirectToBYO: parkingPassRedirectToBYO,
            getUrlQuery: getUrlQuery,
            scrollEventHeader: scrollEventHeader,
            checkFeatureType: checkFeatureType,
            setUrlParam: setUrlParam,
            setUrlParams: setUrlParams,
            removeUrlParam: removeUrlParam,
            removeUrlParams: removeUrlParams,
            removeAllUrlParams: removeAllUrlParams,
            setFiltersinStorage: setFiltersinStorage,
            hasBsfFeature: getFeatureFn('sellapp.BSFEnabled'),
            showBuyerCost: getFeatureFn('event.showBuyerCost'),
            hasFaceValueFeature: getFeatureFn('event.faceValue'),
            showServiceFeeInfo: getFeatureFn('event.showServiceFeeInfo'),
            showVenuePostCode: getFeatureFn('common.showPostcode'),
            showPdoExperience: showPdoExperience,
            setPdoState: setPdoState,
            showRecoExperience: showRecoExperience,
            constructMboxData: constructMboxData,
            makeMboxCall: makeMboxCall,
            isABTestActive: isABTestActive,
            getVfsUrl: getVfsUrl,
            formatPrice: formatPrice,
            setStaticImageDetails: setStaticImageDetails,
            isAdvancedFiltersEnabled: isAdvancedFiltersEnabled,
            isTouchDevice: isTouchDevice,
            getSliderPosition: getFeatureFn('eventpage.sliderPositionOutside'),
            setBlendedEvent: setBlendedEvent,
            useCart: useCart,
            isBYOEnabled: isBYOEnabled,
            determineBYO: determineBYO,
            showVfs: showVfs,
            isQuantityOverlayEnabled: isQuantityOverlayEnabled,
            urlParser: urlParser,
            useListingsV2: useListingsV2,
            isUpgradeEnabled: isUpgradeEnabled,
            isUpsellAccordionEnabled: isUpsellAccordionEnabled,
            blendedEnabledSwitch: blendedEnabledSwitch,
            setBlendedLogicApplied: setBlendedLogicApplied,
            isBlendedLogicApplied: isBlendedLogicApplied,
            isSingleTicketMode: isSingleTicketMode,
            getFeatureFn: getFeatureFn,
            determineValueToPreserve: determineValueToPreserve,
            isBlendedEvent: isBlendedEvent,
            // isDisplayWithFeesToggle: isDisplayWithFeesToggle,
            quantityQuestionEnabled: quantityQuestionEnabled,
            getActiveBreakpoint: getActiveBreakpoint,
            getLayoutType: getLayoutType,
            showParkingAddon: showParkingAddon,
            getParkingFeatureState: getParkingFeatureState,
            getParkingPerformers: getParkingPerformers
        };
    }());
    return EventHelper;
});

/* global _ */
define('models/cart_item_model',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var CartItemModel = Foobunny.BaseModel.extend({
        cache: false,

        urlRoot: '/shape/purchase/carts/v3',

        initialize: function(params) {
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': gc.shlocale
            });

            this.apiUrl = this.urlRoot;
        },

        url: function() {
            return this.apiUrl;
        },

        getUrl: function(action, cartItemId) {
            var _url = this.urlRoot;

            if (this.cartId) {
                _url += '/' + this.cartId;

                if (action === 'ADDITEM') {
                    _url += '/items';
                } else if (action === 'DELETEITEM') {
                    _url += '/items/' + cartItemId;
                }
            }

            return _url;
        },

        getApiHeaders: function() {
            return {
                headers: this.urlHeaders,
                emulateJSON: true
            };
        },

        // Add or replace item as necessary.
        saveItem: function(data) {
            this.cartId = data.cartId;
            if (!data.cartId) {
                return this.createCart(data);
            } else {
                return this.addItem(data);
            }
        },

        createCart: function(data) {
            var self = this,
                apiParams = {
                    orderSourceId: 7,
                    deleteIfExist: 'Y',
                    items: data.listing
                },
                listingId = data.listing.listingId;

            this.apiUrl = this.getUrl('CREATECART');

            return this.save({}, {
                headers: self.urlHeaders,
                emulateJSON: true,
                data: JSON.stringify(apiParams),
                method: 'POST',
                success: function(model, response, options) {
                    self.cartId = response.cartId;
                    self.id = listingId;
                    self.setSilent('listingId', listingId);
                }
            });
        },

        addItem: function(data) {
            var self = this,
                apiParams = {
                    orderSourceId: 7,
                    items: data.listing
                },
                listingId = data.listing.listingId;

            this.apiUrl = this.getUrl('ADDITEM');

            return this.save({}, {
                headers: self.urlHeaders,
                emulateJSON: true,
                data: JSON.stringify(apiParams),
                method: 'POST',
                success: function(model, response, options) {
                    self.cartId = response.cartId;
                    self.id = listingId;
                    self.setSilent('listingId', listingId);
                }
            });
        },

        destroy: function(cartId) {
            this.cartId = cartId;
            this.apiUrl = this.getUrl('DELETEITEM', this.get('cartItemId'));

            return Foobunny.BaseModel.prototype.destroy.call(this, {
                headers: this.urlHeaders
            });
        }
    });

    return CartItemModel;
});

/* global _ */
define('collections/cart_collection',[
    'foobunny',
    'global_context',
    'models/cart_item_model'
], function(Foobunny, gc, CartItemModel) {
    'use strict';

    var cartInstance;

    var CartCollection = Foobunny.BaseCollection.extend({
        cache: false,

        urlRoot: '/shape/purchase/carts/v3',

        model: CartItemModel,

        fetchTimeout: 2000,
        maxNrOfReFetch: 3,

        initialize: function() {
            this.apiUrl = this.urlRoot;

            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': gc.shlocale
            });
        },

        url: function() {
            return this.apiUrl;
        },

        getUrl: function() {
            var _url = this.urlRoot;

            if (this.id) {
                _url += '/' + this.id;
            }

            return _url;
        },

        fetch: function() {
            this.apiUrl = this.getUrl();
            return Foobunny.BaseCollection.prototype.fetch.apply(this, [{cache: false}]);
        }
    });

    CartCollection.getInstance = function() {
        if (!cartInstance) {
            cartInstance = new CartCollection();
        }

        return cartInstance;
    };

    return CartCollection;
});

/* global _ */
define('helpers/cart_helper',[
    'foobunny',
    'global_context',
    'collections/cart_collection',
    'models/cart_item_model',
    'helpers/event_helper',
    'globals'
], function(Foobunny, gc, CartCollection, CartItemModel, EventHelper, globals) {
    var CartHelper = (function() {
        'use strict';

        var cartCollection = CartCollection.getInstance();

        var getCart = function() {
            var collectionPromise = cartCollection.fetch();
            collectionPromise.done(function(response) {
                // Set the id of all the models.
                for (var i in response.items) {
                    if (!response.items[i].id) {
                        response.items[i].id = response.items[i].cartItemId;
                    }
                }

                cartCollection.id = response.cartId;
                cartCollection.reset(response.items);

            }).fail(function(error) {
                if (error && error.responseJSON) {
                    switch (error.responseJSON.code) {
                        case 'purchase.cart.badRequest':
                        case 'purchase.cart.cartDoesnotBelongsToUser':
                        case 'purchase.cart.usercartCannotBeAccessed':
                        case 'purchase.cart.listingOrQuantityUnavailable':
                             // this case added to handle some effects of Jira EVENTS-2114
                        case 'purchase.cart.quantityUnacceptable':
                            // this case added to handle some effects of Jira EVENTS-2114
                            gc.cart_id = null;
                            EventHelper.removeUrlParam('cart_id');
                            CartHelper.resetCart();
                            break;
                    }
                }

                EventHelper.logAppState('fetch', error);
            });

            return collectionPromise;
        };

        var getListingsItems = function(model) {
            var listings = [],
                seats = model.get('seats'),
                qty = model.get('qty'),
                i = 0;

            if (seats) {
                // v3
                if (EventHelper.isBlendedLogicApplied()) {
                    // Since the blending logic is applied sent the ticketId to the cart api.
                    for (i = 0; i < seats.length; i++) {
                        listings.push({
                            listingId: seats[i].listingId,
                            itemId: seats[i].ticketSeatId,
                            itemType: 1
                        });
                    }
                } else {
                    listings.push({
                        listingId: seats[0].listingId,
                        quantity: (qty !== -1 ? qty : model.get('splitVector')[0])
                    });
                }
            } else {
                // v2
                listings.push({
                    listingId: model.get('id'),
                    quantity: (qty >= 1 ? qty : 1)
                });
            }

            return listings;
        };

        var addToCart = function(model) {
            var cartModel,
                cartId = cartCollection.id,
                addCartPromise = $.Deferred(),
                cartPromise,
                fetchPromise,
                listing = getListingsItems(model);

            // Check whether we need to create a new cart or not.
            if (abandonCart(model)) {
               // Carry over non-ticket items to the new cart
               listing = listing.concat(addCarryOverItems());
               cartId = null;
            }

            cartModel = new CartItemModel();
            cartPromise = cartModel.saveItem({
                listing: listing,
                cartId: cartId
            });
            cartPromise.done(function(response, status, xhr) {
                cartCollection.add(cartModel);
                cartCollection.id = response.cartId;
                console.log('Listing Added to Cart:' + response.cartId + ' / ' + listing[0].listingId + ' / ' + cartCollection.length);

                fetchPromise = getCart();
                fetchPromise.done(function(response, status, xhr) {
                    cartCollection.reset(response.items);

                    gc.cart_id = response.cartId;
                    EventHelper.setUrlParam('cart_id', response.cartId);
                    addCartPromise.resolve(response, status, xhr);
                }).fail(function(xhr, status, statusText) {
                    console.log('Get cart after adding to cart failed', xhr);
                    addCartPromise.reject(xhr, status, statusText);
                    EventHelper.logAppState('fetch', xhr);
                });
            }).fail(function(xhr, status, statusText) {
                console.log('Cart Error: Adding/Update failed:' + listing[0].listingId + ' / ' + cartCollection.length, xhr);
                addCartPromise.reject(xhr, status, statusText);
                EventHelper.logAppState('fetch', xhr);
            });

            return addCartPromise.promise();
        };

        var deleteFromCart = function(model) {
            var cartModels,
                thisModel,
                destroyDeferred = $.Deferred(),
                destroyPromise,
                modelDestroyPromises = [],
                listing = {
                    listingId: model.get('listingId')
                };

            if (!cartCollection || cartCollection.length === 0) {
                return $.Deferred().resolve();
            }

            cartModels = cartCollection.where({listingId: Number(listing.listingId)});
            for (var i = 0; i < cartModels.length; i++) {
                thisModel = cartModels[i];
                console.log('Deleting listing:' + thisModel.get('listingId') + ' / ' + thisModel.get('cartItemId'));

                destroyPromise = thisModel.destroy(cartCollection.id);
                destroyPromise.done(function(response, status, xhr) {
                    console.log('Listing deleted from Cart:' + thisModel.get('listingId') + ' / ' + thisModel.get('cartItemId'));
                    cartCollection.remove(thisModel, {silent: true});
                }.bind(thisModel)).fail(function(error) {
                    console.log('Listing failed with error', error);
                });

                modelDestroyPromises.push(destroyPromise);
            }

            // Resolve the deferred when all the items are deleted.
            $.when.apply($, modelDestroyPromises).then(function() {
                console.log('All listings deleted from cart for listing:' + listing.listingId);
                destroyDeferred.resolve();
            }).fail(function(xhr, status, statusText) {
                destroyDeferred.reject(xhr, status, statusText);
                EventHelper.logAppState('fetch', xhr);
            });

            return destroyDeferred;
        };

        // Every listing will have an event associated with it.
        // For example, tickets, parking, hospitality etc.
        var getEventListingsFromCart = function(eventId) {
            var event;
            return cartCollection.filter(function(model, index, collection) {
                event = model.get('event');

                return (event.eventId === eventId);
            });
        };

        var getNonTicketItemsFromCart = function() {
            return cartCollection.filter(function(model, index, collection) {
                return (model.get('itemType') !== 'TICKET' && model.get('status') === 'AVAILABLE');
            });
        };

        var addCarryOverItems = function() {
            var nonTicketItems = getNonTicketItemsFromCart(),
                carryOverItems = [];

            for (var i = 0; i < nonTicketItems.length; i++) {
                carryOverItems.push({
                    listingId: nonTicketItems[i].get('listingId'),
                    quantity: nonTicketItems[i].get('quantity')
                });
            }

            return carryOverItems;
        };

        // Create listings object from the cart models.
        // TODO: Determine whether to return listingId/itemId or listingId/quantity?
        var getItemsFromCart = function(eventId) {
            var itemType,
                thisListing,
                listings;

            listings = _.map(getItemsByEvent(eventId), function(model) {
                itemType = model.get('itemType');
                thisListing = {};
                thisListing.listingId = model.get('listingId');
                if (model.get('id') === model.get('cartItemId')) {
                    thisListing.quantity = model.get('quantity');
                } else {
                    thisListing.ticketSeatId = model.get('id');
                }

                return thisListing;
            });

            return listings;
        };

        var getItemsByType = function(type) {
            var cartModels = _.filter(cartCollection.models, function(model) {
                return (model.get('itemType') === type);
            });

            return cartModels;
        };

        var getItemsByEvent = function(eventId) {
            var eventInfo,
                cartModels = _.filter(cartCollection.models, function(model) {
                    eventInfo = model.get('event');

                    if (_.isEmpty(eventInfo) || _.isNaN(eventInfo.eventId) || eventInfo.eventId !== eventId) {
                        return false;
                    }

                    return true;
                });

            return cartModels;
        };

        var multipleListingsInCart = function(eventId) {
            var listingModels = getItemsByEvent(eventId),
                multipleListings = false;

            if (listingModels.length > 0) {
                // Now find out if there is another listingid in the cart.
                for (var i = 1; i < listingModels.length; i++) {
                    if (listingModels[i].get('listingId') !== listingModels[0].get('listingId')) {
                        multipleListings = true;
                        break;
                    }
                }
            }

            return multipleListings;
        };

        var invalidListingsInCart = function(eventId) {
            var cartModels = _.filter(getItemsByEvent(eventId), function(model) {
                return (model.get('status') !== 'AVAILABLE');
            });

            // Return true if there are invalid listings in cart. If not, return false.
            return (cartModels.length > 0);
        };

        var getCartId = function() {
            if (!cartCollection) {
                return null;
            }

            return cartCollection.id;
        };

        var setCartId = function(cart_id) {
            cartCollection.id = cart_id;
        };

        var resetCart = function() {
            if (!cartCollection) {
                return;
            }

            cartCollection.reset();
            cartCollection.id = null;
        };

        var abandonCart = function(model) {
            // Abandon the cart if we have blended listings in the cart. ie., number of TICKET items
            // is more than 1.
            // var itemCount = cartCollection.filter(function(model, index, collection) {
            //     return (model.get('itemType') === 'TICKET');
            // });

            // If we are adding the parking model then do not abandon the cart.
            if (model.get('parkingEventId')) {
                return false;
            }

            var cartModels = cartCollection.where({itemType: 'TICKET'});
            return (cartModels.length > 0);
        };

        return {
            cartCollection: cartCollection,
            getCart: getCart,
            resetCart: resetCart,
            abandonCart: abandonCart,
            getCartId: getCartId,
            setCartId: setCartId,
            addToCart: addToCart,
            deleteFromCart: deleteFromCart,
            multipleListingsInCart: multipleListingsInCart,
            invalidListingsInCart: invalidListingsInCart,
            getItemsFromCart: getItemsFromCart,
            getItemsByEvent: getItemsByEvent,
            getItemsByType: getItemsByType,
            getEventListingsFromCart: getEventListingsFromCart
        };
    }());

    return CartHelper;
});

define('layouts/page_layout',[
    'foobunny',
    'viewcontainers/layout_view_container',
    'globals',
    'global_context',
    'common-globalheader',
    'common-banner',
    'helpers/event_helper',
    'helpers/cart_helper'
    //'login_component'
    ], function(Foobunny, LayoutViewContainer, globals, gc, GlobalHeader, Banner, EventHelper, CartHelper) {
        'use strict';

        var login, loginModule, globalHeader;

        var PageLayout = Foobunny.Layout.extend({

        events: {
            'click': 'onAppClick'
        },

        onAppClick: function(evt) {
            this.publishEvent('app:click', evt);
        },

        initialize: function() {
            console.log('--PageLayout-- in initialize()', this);

            this.subscribeEvent('url:checkout', this.checkoutRedirector);
            this.subscribeEvent('globalHeader:show', this.showGlobalHeader);
            this.subscribeEvent('globalHeader:hide', this.hideGlobalHeader);

            //Login component in OFF state
            //TBD: This is a simple check for secure protocol - Not secure:: Dont enable this feature in production
            //https should be forced by server, good to set Strict-Transport-Security header

            //this.isLoginComponentEligible = (window.location.protocol === 'https:');

            // login component
            //this.initLoginComponent();

            this.viewContainers = {
                layoutContainer: new LayoutViewContainer({
                    el: '#content_container'
                })
            };

            $(window).resize(_.bind(this.layoutSettings, this));
        },

        el: '#app_container',

        template: gc.appFolder + '/page_layout',

        //login component
        initLoginComponent: function() {
            // var self = this;

            // //Initialized only once
            // if (!login && this.isLoginComponentEligible) {
            //     require(['common-login'], function(Login) {
            //         login = new Login({
            //                 'element': '#login-container',
            //                 'isVisible': 'false',
            //                 'attributes': {
            //                     'include-fb-connect': false,
            //                     'pageName': globals.OMN.pageName
            //                 }
            //             });

            //         login.setVisibility(false); //TBD : Remove this, waiting for components bug to be fixed.
            //         login.render();
            //         loginModule = login.model;

            //         self.subscribeEvent('login:closeClick', function() {
            //             login.setVisibility(false);
            //         });

            //         self.subscribeEvent('login:registrationSuccess', function() {
            //             self.redirectTo(self.xoUrl);
            //         });

            //         self.subscribeEvent('login:signInSuccess', function() {
            //             login.setVisibility(false);
            //             self.redirectTo(self.xoUrl);
            //         });

            //         self.subscribeEvent('login:resetPasswordSuccess', function() {
            //             //TBD: Need to work with UX on the experience
            //             console.log('user reset password sucessfully!');
            //         });
            //     });
            // }
        },

        afterRender: function() {
            globalHeader = new GlobalHeader({
                   'element': this.$el.find('#header')
                });
            var banner = new Banner({
                    element: '#banner-container'
                });
            banner.render();

            globalHeader.render();

        },

        checkoutRedirector: function(params) {
            var cart_id = CartHelper.getCartId();
            if (EventHelper.useCart() && cart_id) {
                this.xoUrl = globals.xo_url_cart.replace('{{target_host}}', gc.target_host).replace('{{cart_id}}', cart_id).replace('{{eventId}}', gc.event_id);
            } else {
                this.xoUrl = globals.xo_url.replace('{{target_host}}', gc.target_host).replace('{{tid}}', params.tid).replace('{{qty}}', params.qty).replace('{{eventId}}', gc.event_id);
            }
            if (this.isLoginComponentEligible && !loginModule.isLoggedIn()) {
                login.setVisibility(true);
            }else {
                this.redirectTo(this.xoUrl);

            }
        },

        redirectTo: function(redirectURL) {
            EventHelper.urlParser.redirect(redirectURL);
        },

        showGlobalHeader: function() {
            globalHeader.unhide();
        },

        hideGlobalHeader: function() {
            globalHeader.hide();
        },

        layoutSettings: function() {
            if (!EventHelper.isMobile()) {
                this.publishEvent('globalHeader:show');
            }
        }

    });
    return PageLayout;
});

define('controllers/page_controller',[
    'foobunny',
    'layouts/page_layout'
    ], function(Foobunny, PageLayout) {
        'use strict';

        var PageController = Foobunny.Controller.extend({
            initialize: function() {
                console.log('--PageController-- in initialize()', {'this': this});

                _.bindAll(this, 'start', 'show', 'update');

                this.view = new PageLayout();

                return this.view;
            },

            start: function() {
                console.log('--PageController-- in start()');
                this.show();
            },

            show: function() {
                console.log('--PageController-- in show()');
                this.view.render();
            },

            update: function(args) {
                console.log('--PageController-- in update()  args:', args);
            }

        });


    return PageController;

});

define('models/filter_model',[
    'foobunny',
    'globals',
    'global_context',
    'helpers/event_helper'
    ], function(Foobunny, globals, gc, EventHelper) {

    'use strict';

    var globalModelName = 'FilterModel',
        mediator = Foobunny.mediator;

    var FilterModel = Foobunny.BaseModel.extend({
        defaults: {
            lastchanged: 'initial',
            qty: '-1',
            qtyMax: globals.quantityOverlay.quantityBtnMaxCount,
            minPrice: -1,
            maxPrice: -1,
            sections: [],
            zones: [],
            sectionStats: true,
            zoneStats: true,
            rowStart: 0,
            ticketRecommendation: true,
            seeMoreLink: true,
            startInterval: 20,
            filterApplied: false,
            zonesEnabled: false,  /* Set to true if zone selections are enabled in maps */
            sortField: 'price',
            secondarySort: null,
            listingAttributeCategoryList: [],
            excludeListingAttributeCategoryList: [],
            deliveryTypeList: [],
            allSectionZoneStats: true,
            eventLevelStats: true,
            quantitySummary: true
        },

        filterAppliedAttributes: ['qty', 'minPrice', 'maxPrice', 'withFees', 'listingAttributeCategoryList', 'excludeListingAttributeCategoryList', 'deliveryTypeList'],
        filterUrlParams: ['qty', 'minPrice', 'maxPrice', 'priceWithFees', 'categ', 'excl', 'dt'],

        initialize: function() {
            this.fetchPromise = Foobunny.utils.resolvedPromise();
            mediator.publishEvent('app:addStartPromise', this.fetchPromise);

            this.on('change', function() {
                console.log('Filter Model Changed:' + JSON.stringify(this.changedAttributes()));
            });
            // Future Change: Figure out how to get rid of the lastchanged attribute.
            // Once the lastchanged attribute has been sorted, re-visit the model functions toc
            // combine them.
            this.on('change:withFees change:lastchanged', this.resetForNewTicketList);

        },

        // Reset should only reset the items that are inside the advanced filters section.
        reset: function() {
            var newAttributes = {},
                attr,
                i = 0,
                len = this.filterAppliedAttributes.length,
                removeParams = [];

            for (i = 0; i < len; i++) {
                attr = this.filterAppliedAttributes[i];
                if (attr === 'qty' && gc.view === 'GA') {
                    continue;
                }
                if (this.defaults[attr] !== this.attributes[attr]) {
                    newAttributes[attr] = (gc.addParking ? 1 : this.defaults[attr]);
                    removeParams.push(this.filterUrlParams[i]);
                }
            }
            EventHelper.removeUrlParams(removeParams);

            newAttributes.reset = true;

            this.set(newAttributes);
        },

        resetSections: function() {
            if (this.get('zonesEnabled')) {
                this.set('zones', []);
            } else {
                this.set('sections', []);
            }
        },

        isFiltersApplied: function() {
            // Check the current attributes against the default attributes.
            // If any one of them is different then filters have been applied.
            var filtersApplied = false,
                attr,
                i = 0,
                len = this.filterAppliedAttributes.length;

            for (i = 0; i < len; i++) {
                attr = this.filterAppliedAttributes[i];
                if (attr === 'qty' && this.resetQty()) {
                    continue;
                }

                if (this.defaults[attr] !== this.attributes[attr]) {
                    if (typeof this.attributes[attr] === 'object') {
                        if (this.attributes[attr].length === 0) {
                            continue;
                        }
                    }
                    // Price slider values will never return to default of -1 ... need special handler.
                    // Occassionally 0 is returned for minPrice.
                    if ((attr === 'minPrice' || attr === 'maxPrice') && this.get('minPrice') <= this.get('sliderMinValue') && this.get('maxPrice') === 0) {
                        continue;
                    }
                    console.log('Filters Applied:' + attr + ': ' + this.defaults[attr] + ' ==> ' + this.attributes[attr]);
                    filtersApplied = true;
                    break;
                }
            }

            return filtersApplied;
        },

        resetQty: function() {
            return (gc.view === 'GA' ||
                    (gc.view === 'NON-GA' && window.innerWidth >= globals.screen_breakpoints.tablet && globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT));
        },

        // Move the updating of the attributes based on what changes over here.
        resetForNewTicketList: function(model, lastchanged) {
            // Update the filter model based on where the model was changed from. Doing this in
            // one place since there are many other places this is being done from and most
            // importantly we do not want to raise another change event with this action.
            if (lastchanged === 'qty' ||
                lastchanged === 'section-selected' ||
                lastchanged === 'section-deselected' ||
                lastchanged === 'filters') {
                model.setSilent({
                    rowStart: 0,
                    sectionStats: true,
                    zoneStats: true,
                    sortByPrice: 'desc',
                    sortBySection: null,
                    sortByRows: null
                });
            }
        },

        // Update the withFees related fields since the data is only available
        // after the MBOX call is done or when AB Test status has been determined.
        updateDefaultsForWithFees: function(withFees) {
            var priceType = (withFees ? globals.price_type.CURRENT : globals.price_type.LISTING);
            this.defaults.withFees = withFees;
            this.defaults.primarySort = gc.urlSortOption ? gc.urlSortOption : (priceType + '+asc');

            this.set({
                lastchanged: 'initial',
                withFees: this.defaults.withFees,
                priceType: priceType,
                priceSort: priceType,
                primarySort: this.defaults.primarySort
            });
        },

        updateForQty: function(attr, options) {
            var newAttributes = _.extend({}, attr, {lastchanged: 'filters'});
            this.set(newAttributes, options);
        },

        updateForWithFees: function(attr, options) {
            var withFees = attr.withFees,
                priceType = (withFees ? globals.price_type.CURRENT : globals.price_type.LISTING);

            globals.PDO.withFees = withFees;

            this.set({
                lastchanged: 'filters',
                withFees: withFees,
                priceType: priceType,
                priceSort: priceType
            }, options);
        },

        updateForSorting: function(attr, options) {
            var newAttributes = _.extend({}, attr, {
                rowStart: 0,
                sectionStats: false,
                zoneStats: false
            });
            this.set(newAttributes, options);
        },

        updateForLoadMore: function(attr, options) {
            var newAttributes = _.extend({}, attr, {
                    lastchanged: 'start',
                    rowStart: this.get('rowStart') + this.get('startInterval'),
                    sectionStats: false,
                    zoneStats: false
                });
            this.set(newAttributes, options);
        }
    });

    mediator.subscribeEvent('app:init:start', getInstance);

    function getInstance() {
        var singleton = FilterModel.prototype._singleton;
        if (!singleton) {
            singleton = new FilterModel();
            FilterModel.prototype._singleton = singleton;
            delete FilterModel.prototype.disposed;
            mediator.registerObject(globalModelName, singleton);
            mediator.publishEvent(globalModelName + ':instanceCreated', singleton);
        }
        return singleton;
    }

    return FilterModel.prototype._singleton;

});

/* global SH */
define('app',[
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

require([
    'app'
], function(app) {

    console.log('---main--- app:', app);
    app.initialize();
    app.start();
});

define("main.js", function(){});

define('views/quantity_filter_view',[
    'foobunny',
    'hammer',
    'global_context',
    'helpers/event_helper',
    'models/filter_model',
    'globals',
    'i18n'
], function(Foobunny, Hammer, gc, EventHelper, FilterModel, globals, i18n) {
    'use strict';

    var QuantityFilterView = Foobunny.BaseView.extend({

        type: 'overlay',
        buttonClass: 'qty-button ',
        filterClass: 'qty-filter',
        theme: 'default',
        maxButtonCount: 30,
        minButtonCount: 4,
        startCount: 1,
        shouldDisposeModel: false,
        selfModelUpdateStatus: false,
        modelEvents: {
            'change:reset change:qty change:qtyMax change:qtyMin change:quantityVector': 'handleModelChange'
        },
        el: '#quantityfilter',

        uiEl: {
            $qtyHeader: '.qty_header',
            $qtyIndex: '.qty_index',
            $viewMoreContent: '#view_more_content',
            $qtySubt: '#qty_subt',
            $qtyAdd: '#qty_add',
            $qty_filter_header: '#qty_filter_header',
            $qtyClose: '.qty-close'
        },

        events: {
            'tap #qty_add': 'incrementQty',
            'tap #qty_subt': 'decrementQty',
            'click .qty_index': 'selectQty',
            'click .qty-close': 'closeButtonClick',
            'change .evt-dropdown select': 'selectQty',
            'click .btn-view-all': 'viewAllButtonClick'
        },

        initialize: function(args) {
            console.log('--QuantityfiltersView--  in initialize()', this);
            this.options = _.extend(this.options, args);
            this.switchType(this.options.type);
            this.options.qtySelected = this.model.get('qty');
            this.options.startCount = (this.options.qtySelected > Number(this.options.minButtonCount)) ? Number(this.options.qtySelected) - (Number(this.options.minButtonCount) - 1 ) : this.startCount;
            this.options.quantityFilter = this.generateQuantityFilter(this.options);
            this.options.disableUnavailableQuantities = (this.options.disableUnavailableQuantities === false)? false : true;

            this.$eventDetails = $('#event-details');
        },

        /**
         * function: handleModelChange
         * purpose: filter model change updates this view, and re-renders.
         *
          */

        handleModelChange: function() {


            var maxButtonCount = this.options.maxButtonCount,
                minButtonCount = this.options.minButtonCount;

            if(this.options.type === 'select' || this.options.type === 'list') {
                minButtonCount = maxButtonCount;
                $(this.options.filterId).val(this.options.qtySelected);
            }

            if (((this.options.type === 'overlay' || this.options.type === 'select') && (this.options.qtySelected > 0 || EventHelper.getUrlQuery('qtyq') === false))) {
                return;
            }


            this.options.maxButtonCount = maxButtonCount;
            this.options.minButtonCount = minButtonCount;
            this.options.qtySelected = this.model.get('qty');
            this.options.quantityVector = this.model.get('quantityVector');
            this.displaySelectedQty(this.options.qtySelected);
            this.render();

        },

        applyButtonStates: function(buttonArray) {
            var qtySelected = this.options.qtySelected,
                qtyMax = this.options.maxButtonCount;

            for (var i in buttonArray) {


                var buttonValue = buttonArray[i].value;

                buttonArray[i].buttonState = '';

                if(qtySelected == buttonValue){
                    buttonArray[i].buttonState = 'selectQty';
                }

                if (this.options.disableUnavailableQuantities && ((Number(buttonValue) > Number(qtyMax) || this.checkQuantityAvailability(buttonValue) === 0))){
                    buttonArray[i].buttonState += ' disabled';
                }
            }
            return buttonArray;
        },

        generateQuantityButtons: function(buttonCountArg, buttonClassArg) {
            var buttonArray = [],
                buttonCount = buttonCountArg + this.options.startCount - 1,
                buttonClass = buttonClassArg || this.buttonClass;

            for (var i = this.options.startCount; i <= buttonCount; i++) {
                buttonArray.push({
                    'label': i,
                    'value': i,
                    'buttonClass': buttonClass
                });
            }

            return buttonArray;
        },

        generateQuantityFilter: function(args) {
            var args = args || {},
                maxButtonCount = Number(args.maxButtonCount),
                minButtonCount = Number(args.minButtonCount),
                buttonClass = args.buttonClass || this.buttonClass,
                navigation = args.navigation,
                extraButtons = args.extraButtons,
                disabledAdd = (this.options.startCount + minButtonCount > maxButtonCount || isNaN(maxButtonCount) === true)? 'disabled' : '',
                disabledSubt = (this.options.startCount <= 1)? 'disabled' : '',
                navigationButtons = args.navigationButtons || [
                    {
                        'label': '-',
                        'value': '-',
                        'buttonClass': 'left-nav ' + disabledSubt + ' ' + buttonClass,
                        'id': 'qty_subt'
                    },
                    {
                        'label': '+',
                        'value': '+',
                        'id': 'qty_add',
                        'buttonClass': disabledAdd + ' ' + buttonClass
                    }
                ],
                buttonArray = this.generateQuantityButtons(minButtonCount, buttonClass),
                quantityFilter = {};

            this.buttonClass = buttonClass;

            if (typeof(extraButtons) === 'object' && extraButtons !== null) {
                // can pass additional buttons as needed
                buttonArray = buttonArray.concat(extraButtons);
            }

            if (navigation === true) {
                buttonArray = buttonArray.concat(navigationButtons);
            }

            buttonArray = this.applyButtonStates(buttonArray);
            quantityFilter.buttons = buttonArray;
            quantityFilter.navigation = navigation;
            quantityFilter.maxButtonCount = maxButtonCount;
            quantityFilter.minButtonCount = minButtonCount;

            return quantityFilter;
        },

        context: function() {
            return this.options;
        },

        afterRender: function() {
            if (typeof(this.el) !== 'string'){
                Hammer(this.el);
            }

            this.$html = $('html');
            this.$ticketList = $('#ticketlist');

            // Display Qty as the label for the Phone.
            if (gc.ticket_id && window.innerWidth < globals.screen_breakpoints.tablet) {
                this.uiEl.$qtyHeader.text(i18n.get('event.quantityfilter.header.singleticket.ga'));
            }

            this.$el.removeClass('hide');

        },

        switchType: function(filterType) {
            switch (filterType) {
                case 'select':
                    this.template = gc.appFolder + '/partials/quantity_select_dropdown';
                    break;
                case 'list':
                    this.template = gc.appFolder + '/partials/quantity_list_dropdown';
                    break;
                case 'carousel':
                    this.template = gc.appFolder + '/partials/quantity_select_carousel';
                    break;
                case 'overlay':
                default:
                    if (gc.view === 'GA') {
                        this.template = gc.appFolder + '/quantity_filters';
                    } else {
                        this.template = gc.appFolder + '/quantity_filters_overlay';
                    }
            }
        },
        checkQuantityAvailability: function (quantityValue) {

            if(isNaN(quantityValue) === true) {
                // if value is not a number, leave it enabled;
                return 1;
            }
            //make sure the value is in range
            if(quantityValue <= this.options.maxButtonCount && quantityValue > 0){
                // check to see if quantityVector is populated as an array
                if(this.options.quantityVector && typeof(this.options.quantityVector.pop) === 'function'){
                    return (this.options.quantityVector[quantityValue]) ? this.options.quantityVector[quantityValue] : 0;
                } else {
                    return 1;
                }
            } else {
                return 0;
            }
        },
        findQtyRangeStart: function(selectedQty) {
            var endCount = this.options.startCount + this.options.minButtonCount,
                selectedQty = Number(selectedQty),
                startCount = selectedQty;

            if (isNaN(selectedQty) === true) {
                return this.options.startCount;
            }

            // if not a carousel and overlay, then this must be a drop down
            if (this.options.type !== 'carousel' && this.options.type !== 'overlay') {
                return 1;
            }

            var range = this.options.startCount + this.options.minButtonCount;

            // if quantity selected is within the displayed range, don't change the range
            if (selectedQty < range && selectedQty > this.options.startCount) {
                startCount = this.options.startCount;
            } else {
                endCount = startCount + this.options.minButtonCount;
            }

            // if the upper range exceeds the max button count, adjust it to only display up to the max
            if (endCount > this.options.maxButtonCount ) {
                startCount = this.options.maxButtonCount - this.options.minButtonCount + 1;
            }

            // if the start count gets adjusted to negative, then move start to 1
            if(startCount <= 1){
                startCount = 1;
            }

            return startCount;
        },

        // Increment the values displayed in the quantity picker by
        incrementQty: function(evt) {

            if (evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }

            var startCount = this.options.startCount + this.options.minButtonCount;

            this.displayStartingQty(startCount);

            if(startCount + this.options.minButtonCount > this.options.maxButtonCount){
                this.uiEl.$qtyAdd.addClass('disabled');
            }

            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Plus Clicked',
                pageload: false
            });
        },

        // Decrements the values displayed in the quantity picker by
        decrementQty: function(evt) {

            if (evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }

            var startCount = this.options.startCount - this.options.minButtonCount;

            this.displayStartingQty(startCount);

            if(this.options.startCount <= 1){
                this.uiEl.$qtySubt.addClass('disabled');
            }

            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Minus Clicked',
                pageload: false
            });
        },

        closeButtonClick: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.closeQtyOverlay();
            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Close Overlay',
                pageload: false
            });
        },
        
        viewAllButtonClick: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.closeQtyOverlay();
            EventHelper.track({
                pageView: 'QtyQuestOverlay',
                appInteraction: 'Quantity View All',
                pageload: false
            });
        },

        closeQtyOverlay: function() {
            var self = this;
            this.updateQtyOverlay();
            if(this.options.dispose !== false){
                this.dispose();
            }
            $('.quantityQuestionHeader').removeClass('quantityQuestionHeader');

            // allow 300 ms for quantity question to fully close / resize animations
            setTimeout(function(){
                self.publishEvent('quantityFilter:overlayClosed');
            }, 400);

            // on close always remove
            this.remove();
        },

        updateQtyOverlay: function() {
            this.$el.addClass('hide');
            this.$html.removeClass('noscroll');
            this.$ticketList.removeClass('noscroll');
            this.$eventDetails.removeClass('noclick');
            EventHelper.setUrlParam('qqd', '1');
            EventHelper.setUrlParam('qtyq', false);
        },

        validationPatterns: {
            'n+': /^\d+\+$/,
            'n': /^\d+$/
        },

        validateQuantity: function(qtySelected) {
            var status = false,
                qty = String(qtySelected);

            for (var pattern in this.validationPatterns) {
                if(qty.match(this.validationPatterns[pattern]) !== null){
                    status = true;
                }
            }

            return status;
        },

        reset: function() {
            // toggle button if the same button is clicked twice
            this.uiEl.$qtyIndex.removeClass('selectQty');
            this.options.qtySelected = -1;
            EventHelper.setUrlParams(
                [
                    {
                        name: 'qty',
                        value: this.options.qtySelected
                    },
                    {
                        name: 'qqd',
                        value: 1
                    },
                    {
                        name: 'qtyq',
                        value: false
                    },
                ]);

        },

        selectQty: function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (e.currentTarget.classList.contains('disabled')) {
                return;
            }

            if (gc.view === 'NON-GA') {
                this.updateQtyOverlay();
            }

            var $currentTarget = $(e.currentTarget);
            var selectedQty = ($currentTarget.val() === '') ? $currentTarget.data('value') : $currentTarget.val();
            if ($currentTarget.hasClass('btn-view-all')){
                return;
            }

            if (this.options.qtySelected === selectedQty && selectedQty > 0) {
                this.reset(e);
            }

            if (selectedQty <= 0){
                this.reset(e);
                this.model.updateForQty({qty: selectedQty});
            }

            this.options.qtySelected = selectedQty;


            if (this.validateQuantity(this.options.qtySelected)) {
                // set model update status to true to prevent duplicate render
                // calls
                this.selfModelUpdateStatus = true;
                this.model.updateForQty({qty: this.options.qtySelected});

                EventHelper.setUrlParams(
                    [
                        {
                            name: 'qty',
                            value: this.options.qtySelected
                        },
                        {
                            name: 'qqd',
                            value: 1
                        },
                        {
                            name: 'qtyq',
                            value: false
                        }
                    ]
                );
                this.displaySelectedQty(this.options.qtySelected);

                // hide text
                this.uiEl.$qtyHeader.addClass('hide');

                this.publishEvent('quantityFilter:qtyUpdated', {'qtySelected': this.options.qtySelected});

                if (gc.view === 'NON-GA'){
                    EventHelper.track({
                        pageView: 'QtyQuestOverlay',
                        appInteraction: 'Quantity',
                        pageload: false,
                        filterType: 'Selected QuantityQ: ' + this.options.qtySelected,
                        userExperienceSnapshot: {quantity: 'Quantity: ' + this.options.qtySelected}
                    });
                } else {
                    EventHelper.track({
                        pageView: '',
                        appInteraction: this.options.qtySelected,
                        pageload: false,
                        filterType: 'Selected Quantity: ' + this.options.qtySelected,
                        userExperienceSnapshot: {quantity: 'Quantity: ' + this.options.qtySelected}
                    });
                }
            }
        },

        removeState: function(state) {
            var stateFilter = new RegExp('\.*' + state + '\.*');
            for (var i in this.options.quantityFilter.buttons) {
                if(this.options.quantityFilter.buttons[i].buttonState){
                    var button = this.options.quantityFilter.buttons[i];
                    button.buttonState = button.buttonState.replace(stateFilter, '');
                }
            }
        },

        // The user selected the desired quantity from the panel.
        displayStartingQty: function(qtySelected) {
            this.options.startCount = this.findQtyRangeStart(qtySelected);
            this.options.quantityFilter = this.generateQuantityFilter(this.options);
            this.render();
        },

        displaySelectedQty: function(qtySelected) {
            this.options.qtySelected = qtySelected;
            this.displayStartingQty(qtySelected);
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: QuantityFilterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return QuantityFilterView;
});
/**
 * @module DeliveryHelper
 * @TODO tech debt https://jira.stubcorp.com/browse/EVENTS-1617 name should be localized from API
 * localized name should be returned from API instead of hard code in front-end
 */
define('helpers/delivery_helper',[
    'i18n',
    'helpers/event_helper'
], function(i18n, EventHelper) {

    var combinePaperDeliveryFeature = EventHelper.getFeatureFn('eventpage.combinePaperDelivery')() || false,
        paperDeliveryTypeIds = [5, 6, 7],
        paperDeliveryMethodIds = [22, 23, 24, 25, 27, 36, 37, 38, 39];

    /**
     * @private
     * get i18n property value, return fallback if not found
     */
    function getI18n(propertyName, fallback) {
        var value = i18n.get(propertyName);
        if (value.trim() !== '' && value.indexOf('ERROR') === -1) {
            return value;
        }
        return fallback;
    }

    return {

        getDeliveryTypeName: function(deliveryTypeId, fallback) {
            var propertyName = 'event.common.deliveryType.' + deliveryTypeId;
            return getI18n(propertyName, fallback);
        },

        /**
         * @public
         * get delivery method name by delivery method id
         */
        getDeliveryMethodName: function(deliveryMethodId, fallback) {
            var propertyName = 'event.common.deliveryMethod.' + deliveryMethodId;

            if (combinePaperDeliveryFeature && deliveryMethodId > 20) {
                propertyName = 'event.common.delivery.post';
            }

            return getI18n(propertyName, fallback);
        },

        /**
         * combine paper deliveries
         * @param {Array} deliveryList - array of delivery type ids or delivery method ids
         * @param {string} typeName=deliveryType -- value should be 'deliveryType' or 'deliveryMethod'
         * @return Array
         */
        combinePaperDelivery: function(deliveryList, typeName) {
            typeName = _.contains(['deliveryType', 'deliveryMethod'], typeName) ? typeName : 'deliveryType';

            var idList = typeName === 'deliveryType' ? paperDeliveryTypeIds : paperDeliveryMethodIds,
                combinedList = deliveryList,
                primaryPaperId = idList[0];

            if (combinePaperDeliveryFeature) {
                combinedList = _.filter(deliveryList, function(id) {
                    id = parseInt(id);
                    return id === primaryPaperId || !_.contains(idList, id);
                });
            }

            return combinedList;
        },

        /**
         * Seprate paper types for pass delivery types to api.
         * If deliveryTypes contains paper delivery, all paper delivery ids should be added to the list
         * @param {Array|string} deliveryTypes - delivery type list
         * @return {Array}
         */
        separatePaper: function(deliveryTypes) {
            if (typeof deliveryTypes === 'string') {
                deliveryTypes = deliveryTypes.split(',');
            }
            var types = deliveryTypes;

            if (combinePaperDeliveryFeature) {
                types = _.map(deliveryTypes, function(id) {
                    return parseInt(id);
                });

                if (_.contains(types, paperDeliveryTypeIds[0])) {
                    _.each(paperDeliveryTypeIds, function(id) {
                        if (!_.contains(types, id)) {
                            types.push(id);
                        }
                    });
                }
            }

            return types;
        }
    };
});

/* global _ */
define('views/price_slider_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'models/filter_model',
    'globals',
    'global_context',
    'i18n',
    'priceValidator',
    'sh_currency_format'
], function(Foobunny, Hammer, EventHelper, FilterModel, globals, gc, i18n, priceValidator, currencyFormatUtil) {
    'use strict';

    var PriceSliderView = Foobunny.BaseView.extend({

        el: '#price-slider',

        template: gc.appFolder + '/price_slider',

        initialize: function() {
            console.log('--SliderView--  in initialize()', this);

            this.oldx = 0;
            this.sliderMinPrice = 0; // used only in priceSlider reset

            this.subscribeEvent('slider:dataFetched', this.displaySliderPrice);
            this.subscribeEvent('filter:reset', this.resetSlider);
            this.subscribeEvent('filter:reset', this.renderSlider);

            // Listen for orientation changes
            //$(window).resize(_.bind(this.layoutSettings, this));
        },

        priceSliderNumberFormat: {
            decimalSymbol: '.',
            groupingSymbol: ',',
            decimalDigits: 0
        },

        events: {
            'mousedown #min-handle': 'mousedown',
            'mousedown #max-handle': 'mousedown',
            'touchstart #min-handle': 'mousedown',  // touch events are for non-desktop modes
            'touchstart #max-handle': 'mousedown'
        },

        uiEl: {
            $histogram: '.histogram',
            $trackSelection: '.track-selection',
            $track: '.track',
            $minHandle: '#min-handle',
            $maxHandle: '#max-handle',
            $minPrice: '#min-price .price_value',
            $maxPrice: '#max-price .price_value',
            $maxPlus: '.plus-max'
        },

        afterRender: function() {
            // Added a defensive check to verify if the el is in dom,
            // before passing it to hammer.
            if($(this.el).length) {
                Hammer(this.el);
            }
            this.updateSliderInfo();
            this.minHandle = document.getElementById('min-handle');
            this.maxHandle = document.getElementById('max-handle');

            if (globals.sliderPrice.sliderMinPrice && globals.sliderPrice.sliderMaxPrice) {
                this.preserveSliderValues();
            }
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        show: function() {
            this.$el.removeClass('hide');
        },

        renderSliderView: function() {
            return this.render();
        },

        layoutSettings: function() {
            this.reset();
            this.updateSliderInfo();
        },

        resetSlider: function() {
            this.percentage = [0, 100];
            this.minPrice = this.sliderMinPrice;
            this.maxPrice = this.model.get('sliderMaxValue');
            this.value = [this.minPrice, this.maxPrice];

            //update slider handle and prices
            this.uiEl.$minHandle.css('left', this.percentage[0] - 5 + '%');
            this.uiEl.$maxHandle.css('right', (95 - this.percentage[1]) + '%');
            this.uiEl.$trackSelection.css('left', Math.min(this.percentage[0], this.percentage[1]) + '%');
            this.uiEl.$trackSelection.css('width', Math.abs(this.percentage[0] - this.percentage[1]) + '%');

            this.setDragPrice();
        },

        renderSlider: function() {
            globals.sliderPrice.sliderMinPrice = '';
            globals.sliderPrice.sliderMaxPrice = '';

            // do not re-render the slider for single ticket case
            // on clicking filter reset its not making search inventory api call
            if (!gc.ticket_id) {
                this.model.setSilent({
                    sliderMaxValue: ''
                });
            }
        },

        calculateValue: function() {
            var val = [this.minPrice, this.maxPrice];

            if (this.percentage[0] !== 0) {
                val[0] = this.dragged === 0 ? this.toValue(this.percentage[0]) : this.value[0];
            }
            if (this.percentage[1] !== 100) {
                val[1] = this.dragged === 1 ? this.toValue(this.percentage[1]) : this.value[1];
            }
            return val;
        },

        // Called by 'mousedown' and 'mousemove'
        getPercentageDragged: function(evt) {
            // If it is not in desktop mode
            if (!EventHelper.isDesktop() && (evt.type === 'touchstart' || evt.type === 'touchmove')) {
                evt = evt.touches[0];
            }

            var eventPosition = evt.pageX,
                sliderOffset = this.offset.left,
                distanceToSlide = eventPosition - sliderOffset,
                percentage;

            // Calculate what percentage of the length the slider handle has slid
            percentage = (distanceToSlide / this.size) * 100;
            percentage = Math.round(percentage / this.step) * this.step;

            if (this.dragged === 0 && percentage > this.toPercentage(this.intervals[this.numIntervals - 1].min)) {
                percentage = this.toPercentage(this.intervals[this.numIntervals - 1].min);
            } else if (this.dragged === 1 && percentage < this.toPercentage(this.intervals[0].max)) {
                percentage = this.toPercentage(this.intervals[0].max);
            }

            // Make sure the percent is within the bounds of the slider.
            // 0% corresponds to the 'min' value of the slide
            // 100% corresponds to the 'max' value of the slide
            return Math.max(0, Math.min(100, percentage));
        },

        mousedown: function(evt) {
            // display price while slider drag
            this.setDragPrice();
            this.updateSliderInfo();
            this.currValues = this.value;

            var $currentTargetId = $(evt.currentTarget).prop('id');

            this.dragged = ($currentTargetId === 'min-handle' ? 0 : 1);

            // If in mobile/tablet mode
            if (!EventHelper.isDesktop()) {
                document.removeEventListener('touchmove', this.mousemove, false);
                document.removeEventListener('touchend', this.mouseup, false);
                this.minHandle.removeEventListener('touchstart', function(e) {e.preventDefault();}, false);
                this.maxHandle.removeEventListener('touchstart', function(e) {e.preventDefault();}, false);
            }

            if (this.mousemove) { // if the mousemove function is already bound, remove it
                document.removeEventListener('mousemove', this.mousemove, false);
            }
            if (this.mouseup) {
                document.removeEventListener('mouseup', this.mouseup, false);
            }

            this.mousemove = this.mousemove.bind(this);
            this.mouseup = this.mouseup.bind(this);

            // If in mobile/tablet mode, bind touch event handlers
            if (!EventHelper.isDesktop()) {
                // only For chrome browser on touch device add preventDefault
                this.minHandle.addEventListener('touchstart', function(e) {e.preventDefault();}, false);
                this.maxHandle.addEventListener('touchstart', function(e) {e.preventDefault();}, false);

                document.addEventListener('touchmove', this.mousemove, false);
                document.addEventListener('touchend', this.mouseup, false);
            }

            // Bind mouse events:
            document.addEventListener('mousemove', this.mousemove, false);
            document.addEventListener('mouseup', this.mouseup, false);
        },

        mousemove: function(evt) {
            // Where is the handle now?
            var rawPercentage = this.getPercentageDragged(evt),
                bubbleDistance = 10;


            // Set the position of the currently dragged handle
            if (this.dragged === 0) {
                if (this.percentage[1] - rawPercentage > bubbleDistance) {
                    this.percentage[0] = rawPercentage;
                } else if (rawPercentage > this.percentage[1]) {
                    this.percentage[0] = this.percentage[1] - bubbleDistance;
                }
            } else if (this.dragged === 1) {
                if (rawPercentage - this.percentage[0] > bubbleDistance) {
                    this.percentage[1] = rawPercentage;
                } else if (rawPercentage < this.percentage[0]) {
                    this.percentage[1] = this.percentage[0] + bubbleDistance;
                }
            }

            // Calculates the new price values from this.percentage
            this.setValue(this.calculateValue());
            this.updateLayout();
        },

        mouseup: function(evt) {
            var val = this.calculateValue(),
                minVal = 0,
                dragged = this.dragged,
                minMax = '',
                minMaxValue = '',
                minStr = 'Min Price: ' + val[0],
                maxStr = 'Max Price: ' + val[1];
            // If in mobile/tablet mode, unbind touch event handlers
            if (!EventHelper.isDesktop()) {
                document.removeEventListener('touchmove', this.mousemove, false);
                document.removeEventListener('touchend', this.mouseup, false);
            }
            // Unbind mouse event handlers:
            document.removeEventListener('mousemove', this.mousemove, false);
            document.removeEventListener('mouseup', this.mouseup, false);

            this.setValue(val);
            this.updateLayout();

            // If event occurred of min and max price but the value didn't change, return
            if ((dragged === 0 && this.currValues[0] === val[0]) || (dragged === 1 && this.currValues[1] === val[1])) {
                return;
            }

            if (this.percentage[0] === 0 && this.percentage[1] === 100) {
                this.resetSlider();
            } else {
                minVal = this.value[0];
            }

            // User made a slider selection, so fetch tickets to update ticketlist view
            this.model.set({
                minPrice: ~~currencyFormatUtil.unFormatPrice(minVal),
                maxPrice: this.value[1] !== this.model.get('sliderMaxValue') ? ~~currencyFormatUtil.unFormatPrice(this.value[1]) : 0,
                lastchanged: 'filters'
            }, {});

            if (dragged === 0) {
                minMax = 'Min price';
                minMaxValue = minMax + ': ' + val[0];
                if (this.percentage[0] !== 0) {
                    EventHelper.setUrlParam('sliderMin', this.percentage[0].toFixed(2) + ',' + val[0]);
                } else {
                    EventHelper.removeUrlParam('sliderMin');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: minMax, pageload: false, filterType: 'Selected ' + minMaxValue, userExperienceSnapshot: {priceSliderMin: minStr}});
            } else {
                minMax = 'Max Price';
                minMaxValue = minMax + ': ' + val[1];

                if (this.value[1] !== this.model.get('sliderMaxValue')) {
                    EventHelper.setUrlParam('sliderMax', this.percentage[1].toFixed(2) + ',' + val[1]);
                } else {
                    EventHelper.removeUrlParam('sliderMax');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: minMax, pageload: false, filterType: 'Selected ' + minMaxValue, userExperienceSnapshot: {priceSliderMax: maxStr}});
            }
        },

        reset: function() {
            this.percentage = [0, 100];
            this.value = [this.minPrice, this.maxPrice];
        },

        displaySliderPrice: function(data) {

            if (!data.eventPricingSummary || data.eventPricingSummary.minTicketPrice === data.eventPricingSummary.maxTicketPrice) {
                this.minMaxPriceEqual = true;
                this.hide();
                return;
            }

            // If we have preserved values set them now then configure sliders
            if (!this.model.get('sliderMaxValue')) {
                if (globals.sliderPrice.sliderMinPrice || globals.sliderPrice.sliderMaxPrice) {
                    this.preserveSliderValues();
                }
            }

            var pricePercentiles, i, minVal, maxVal,feeMinPrice,feeMaxPrice;

            this.minMaxPriceEqual = false;
            minVal = this.minPrice;
            maxVal = this.maxPrice;
            // data.eventPricingSummary.XXXXX has correct values with or w/o fees
            feeMinPrice = Math.floor(data.eventPricingSummary.minTicketPrice);
            // get 95th percentile price
            pricePercentiles = _.findWhere(data.eventPricingSummary.percentiles, {name: 95});
            feeMaxPrice = Math.ceil(pricePercentiles.value);

            // Abort if there's no change to the slider
            if (minVal === feeMinPrice && maxVal === feeMaxPrice) { return; }

            // Slider results are handled separately to react to only one of them in home position
            // Only change prices when in home position
            // Handle Min Slider
            if (this.percentage[0] === 0 || minVal === 0) {
                this.value[0] = feeMinPrice;
            }
            // Handle Max
            if (this.percentage[1] > 99.99) { // ~ 1 in 6 repositions of max slider exhibit a floating point error when slid to 100%
                this.value[1] = feeMaxPrice;
            }
            // Always change the slider min and max when API returns new values
            this.minPrice = feeMinPrice;
            this.maxPrice = feeMaxPrice;
            this.eventMinPrice = feeMinPrice;
            this.eventMaxPrice = feeMaxPrice;
            this.sliderMinPrice = feeMinPrice;
            this.sliderMaxPrice = feeMaxPrice;
            this.model.setSilent({
                sliderMinValue: feeMinPrice,
                sliderMaxValue: feeMaxPrice
            });

            this.totalTickets = data.totalTickets;
            this.totalListings = data.totalListings;
            this.step = 1.0;

            // We don't need to render anymore just update
            this.updateLayout();

            // (1) Determine how many bars/intervals to use for the histgram
            this.numIntervals = 30; // this.getNumIntervals(data.section_stats.length);

            // (2) Prepare the lower and upper bounds associated with each histogram bar/interval
            this.intervals = [];

            for (i = 0; i < this.numIntervals; i++) {
                this.intervals.push({
                    min: this.toValue((i / this.numIntervals) * 100),
                    max: this.toValue(((i + 1) / this.numIntervals) * 100) - 1, // minus one to remove range overlaps
                    quantity: 0
                });
            }

            // Cap the upper bound at 95%
            this.intervals[this.numIntervals - 2].max = this.maxPrice;
            this.intervals[this.numIntervals - 2].quantity += this.intervals[this.numIntervals - 1].quantity;
            this.numIntervals = this.numIntervals - 1;
        },

        preserveSliderValues: function() {
            var minPercentage = 0,
                maxPercentage = 100;

            if (globals.sliderPrice.sliderMinPrice >= 0) {
                this.minPrice = globals.sliderPrice.sliderMinPrice;
            }

            if (globals.sliderPrice.sliderMaxPrice >= 0) {
                this.maxPrice = globals.sliderPrice.sliderMaxPrice;
            }

            minPercentage = globals.sliderPrice.sliderMinPercent ? globals.sliderPrice.sliderMinPercent : minPercentage;
            maxPercentage = globals.sliderPrice.sliderMaxPercent ? globals.sliderPrice.sliderMaxPercent : maxPercentage;

            this.value = [this.minPrice, this.maxPrice];
            this.percentage = [minPercentage, maxPercentage];

            this.updateLayout();

            if (!this.minMaxPriceEqual) {
                this.show();
            } else {
                this.hide();
            }

            this.minPrice = this.eventMinPrice;
            this.maxPrice = this.eventMaxPrice;
        },

        searchForIndex: function(handle) {
            var handlePosition = this.percentage[handle],
                index = this.searchForInterval(this.toValue(handlePosition));

            return index;
        },

        searchForInterval: function(value, left) {
            var right = this.numIntervals - 1,
                mid;

            left = left || 0;

            while (left < right) {
                mid = Math.floor(left + ((right - left) / 2));
                if (this.intervals[mid].max < value) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        },

        searchForRange: function(min, max) {
            var firstInterval = this.searchForInterval(min),
                lastInterval = this.searchForInterval(max, firstInterval);

            return { firstInterval: firstInterval, lastInterval: lastInterval };
        },

        setValue: function(val) {
            this.value = val;
            this.value[0] = Math.max(this.minPrice, Math.min(this.maxPrice, this.value[0]));
            this.value[1] = Math.max(this.minPrice, Math.min(this.maxPrice, this.value[1]));

            if (this.maxPrice > this.minPrice) {
                this.percentage = [
                    this.toPercentage(this.value[0]),
                    this.toPercentage(this.value[1])
                ];
            } else {
                this.percentage = [0, 0];
            }
        },

        toPercentage: function(value) {
            if (this.maxPrice === this.minPrice) {
                return 0;
            } else {
                var max = Math.log(this.maxPrice),
                    min = this.minPrice === 0 ? 0 : Math.log(this.minPrice),
                    v = value === 0 ? 0 : Math.log(value);

                return 100 * (v - min) / (max - min);
            }
        },

        toValue: function(percentage) {
            var min = (this.minPrice === 0) ? 0 : Math.log(this.minPrice),
                max = Math.log(this.maxPrice),
                value = Math.exp(min + (max - min) * percentage / 100);

            value = this.minPrice + Math.round((value - this.minPrice) / this.step) * this.step;

            // Rounding to the nearest step could exceed the min or
            // max, so clip to those values.
            if (value < this.minPrice) {
                return this.minPrice;
            } else if (value > this.maxPrice) {
                return this.maxPrice;
            } else {
                return value;
            }
        },

        updateLayout: function() {
            var positionPercentages = [this.percentage[0], this.percentage[1]];

            // Update handle positions
            this.uiEl.$minHandle.css('left', positionPercentages[0] - 5 + '%');
            this.uiEl.$maxHandle.css('right', (95 - positionPercentages[1]) + '%');
            // Update selection track
            this.uiEl.$trackSelection.css('left', Math.min(positionPercentages[0], positionPercentages[1]) + '%');
            this.uiEl.$trackSelection.css('width', Math.abs(positionPercentages[0] - positionPercentages[1]) + '%');

            this.setDragPrice();
        },

        updateSliderInfo: function() {
            this.offset = this.uiEl.$track.offset();
            this.size = this.uiEl.$track.width();
        },

        getNumIntervals: function(totalSections) {
            // use for histogram
            // if (totalSections <= 10) {
            //     return 10;
            // }
            // if (totalSections <= 50) {
            //     return 20;
            // }
            return 30;
        },

        setDragPrice: function() {
            this.uiEl.$minPrice.text(currencyFormatUtil.format(this.value[0], this.priceSliderNumberFormat));
            this.uiEl.$maxPrice.text(currencyFormatUtil.format(this.value[1], this.priceSliderNumberFormat));

            if (this.value[1] === this.eventMaxPrice) {
                this.uiEl.$maxPlus.removeClass('hide');
            } else {
                this.uiEl.$maxPlus.addClass('hide');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: PriceSliderView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });
    return PriceSliderView;
});

define('models/listing_model',[
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper'
], function(Foobunny, gc, globals, EventHelper) {
    'use strict';

    var ListingModel = Foobunny.BaseModel.extend({
        initialize: function() {
            console.log('--ListingMode-- on initialize()');
        }
    });

    return ListingModel;
});

define('collections/inventory_collection',[
    'foobunny',
    'global_context',
    'globals',
    'models/listing_model',
    'helpers/event_helper',
    'helpers/delivery_helper'
], function(Foobunny, gc, globals, ListingModel, EventHelper, DeliveryHelper) {
    'use strict';
    var inventoryCollectionInstance;
    var InventoryCollection = Foobunny.BaseCollection.extend({
        initialize: function(eventId) {
            console.log('--InventoryCollection--  in initialize()', this);

            this.eventId = eventId;

            this.url = '';
            this.urlHeaders = gc.url_headers || {};
            inventoryCollectionInstance = this;
        },

        // model: ListingModel,

        prepareAPIUrl: function(filterModelData) {
            // allSectionZoneStats=true - this is to make sure section stats ignores any section /zone filters applied - fix for EVENTS-268
            var _url = '',
                s = [],
                sortOptions = [];

            _url += this.getUrl();

            if (gc.view === 'GA') {
                filterModelData.sectionStats = false;
                filterModelData.zoneStats = false;
                filterModelData.allSectionZoneStats = false;
                filterModelData.eventLevelStats = true;
            }

            if (filterModelData.zonesEnabled) {
                s = filterModelData.zones;
                if (s.length > 0) {
                    _url += '&zoneIdList=' + s;
                }
            } else {
                //sections
                s = filterModelData.sections;
                if (s.length > 0) {
                    _url += '&sectionIdList=' + s;
                }
            }

            //filter quantity
            if (filterModelData.qty > '0') {
                if (filterModelData.qty === '5+') {
                    filterModelData.qty = '>5';
                }
                _url += '&quantity=' + filterModelData.qty;

                if (EventHelper.useListingsV2() && JSON.parse(globals.inventoryCollection.blendedLogicApplied) === true) {
                    _url += '&applyBlendedLogic=true';
                }

            }

            if (filterModelData.minPrice > 0) {
                _url += '&pricemin=' + parseFloat(filterModelData.minPrice);
            }
            if (filterModelData.maxPrice > 0) {
                _url += '&pricemax=' + parseFloat(filterModelData.maxPrice);
            }

            if (filterModelData.blendedAlgoId > 0) {
                _url += '&blendedAlgoId=' + filterModelData.blendedAlgoId;
            }

            _url = _url.replace('{{start}}', filterModelData.rowStart);
            _url = _url.replace('{{sectionStats}}', filterModelData.sectionStats);
            _url = _url.replace('{{zoneStats}}', filterModelData.zoneStats);
            _url = _url.replace('{{allSectionZoneStats}}', filterModelData.allSectionZoneStats);
            _url = _url.replace('{{eventLevelStats}}', filterModelData.eventLevelStats);
            _url = _url.replace('{{quantitySummary}}', filterModelData.quantitySummary);

            // ToDo: Check filtering is needed to filter out sort properties
            // that don't match price (default), value or quality. priceType default is
            // now listingPrice. Was currentPrice
            if (EventHelper.useListingsV2()) {
                if (gc.view === 'NON-GA') {
                    _url += '&rows=' + filterModelData.startInterval;
                }
                if (filterModelData.priceType) {
                    if (filterModelData.priceType === 'currentPrice') {
                        filterModelData.priceType = 'bundledPrice';
                    } else {
                        filterModelData.priceType = 'nonBundledPrice';
                    }
                }
                if (filterModelData.sortField) {
                    var primarySort = filterModelData.primarySort;

                    if (filterModelData.primarySort === 'listingPrice+asc' || filterModelData.primarySort === 'listingPrice+desc') {
                        filterModelData.primarySort = filterModelData.primarySort.replace(/listingPrice/, 'price');
                    } else if (filterModelData.primarySort === 'currentPrice+asc' || filterModelData.primarySort === 'currentPrice+desc') {
                        filterModelData.primarySort = filterModelData.primarySort.replace(/currentPrice/, 'price');
                    }

                    EventHelper.setUrlParam('sort', filterModelData.primarySort);
                    sortOptions.push(filterModelData.primarySort);

                    if (filterModelData.secondarySort !== primarySort) {
                        if (filterModelData.secondarySort === 'listingPrice+asc' || filterModelData.secondarySort === 'listingPrice+desc') {
                            filterModelData.secondarySort = filterModelData.secondarySort.replace(/listingPrice/, 'price');
                        } else {
                            filterModelData.secondarySort = filterModelData.secondarySort.replace(/currentPrice/, 'price');
                        }
                        sortOptions.push(filterModelData.secondarySort);
                    }
                }
                if (sortOptions.length > 0) {
                    _url += '&sort=' + sortOptions.join();
                }
            } else {
                if (gc.view === 'GA') {
                    _url += '&sort=' + filterModelData.priceType + '+asc';
                } else {
                    _url += '&rows=' + filterModelData.startInterval;
                    if (filterModelData.sortField) {
                        sortOptions.push(filterModelData.primarySort);

                        if (filterModelData.secondarySort !== filterModelData.primarySort) {
                            sortOptions.push(filterModelData.secondarySort);
                        }
                    }
                    if (sortOptions.length > 0) {
                        _url += '&sort=' + sortOptions.join();
                    }
                }
            }

            if (filterModelData.listingAttributeCategoryList.length > 0) {
                _url += '&listingAttributeCategoryList=' + filterModelData.listingAttributeCategoryList;
            }

            if (filterModelData.excludeListingAttributeCategoryList.length > 0) {
                _url += '&excludeListingAttributeCategoryList=' + filterModelData.excludeListingAttributeCategoryList;
            }

            if (filterModelData.deliveryTypeList.length > 0) {
                _url += '&deliveryTypeList=' + DeliveryHelper.separatePaper(filterModelData.deliveryTypeList);
            }

            _url += '&priceType=' + filterModelData.priceType;

            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                _url += '&valuePercentage=true';
            }
            this.url = _url;

            console.log('--InventoryCollection-- in getAPIUrl(), request URL  --', this.url);
        },

        parse: function(result) {
            // publish inventory api response to globalContextVars
            if (result) {
                this.publishEvent('module:globalcontextvars:apiresponseready', {APIName: 'inventory', data: result});
            }
            console.log('--InventoryCollection-- in parse(), collection result  --', result);
            var seatNumbersArray,
                withFees = globals.PDO.withFees,
                seats = null,
                self = this;

            // Set the blendedLogicApplied in the EventHelper to be used for creating the cart.
            EventHelper.setBlendedLogicApplied(result.blendedLogicApplied);
            if(result.eventLevelStats && result.eventLevelStats.quantitySummary) {
                result.qtyAvailableVector = self.getQtyAvailableVector(result);
                result.qtyVectorMaximumQuantity = self.getMaximumQuantityAvailable(result.qtyAvailableVector);
                result.qtyVectorMinimumQuantity = self.getMinimumQuantityAvailable(result.qtyAvailableVector);
            }
            if (result.listing) {
                if (EventHelper.useListingsV2()) {

                    result.listing.forEach(function(listing) {
                        seats = [];

                        listing.seats.forEach(function(seat) {
                            seats.push(seat.seatNumber);
                        });

                        listing.usePrice = listing.price;
                        listing.seatNumbersArray = seats;

                        if (!listing.listingId) {
                            listing.listingId = listing.seats[0].listingId;
                        }
                        if (seats.length > 1) {
                            listing.seatNumbers = listing.seatNumbersArray.join(', ');
                        } else if (listing.seats.length === 1) {
                            listing.seatNumbers = listing.seats[0].seatNumber;
                        }

                        if (!listing.seatNumberFirst) {
                            listing.seatNumberFirst = listing.seats[0].seatNumber;
                        }

                        if (!listing.seatNumberLast && listing.seats.length > 1) {
                            listing.seatNumberLast = listing.seats[listing.seats.length - 1].seatNumber;
                        }

                        listing.quantity = listing.splitVector[listing.splitVector.length - 1];
                        // Put the valuePercentage into appropriate buckets.
                        listing.valueBucket = self.getValueBucket(listing.valuePercentage);
                    });
                    // add qtyAvailableVector
                    if(result.eventLevelStats && result.eventLevelStats.quantitySummary) {
                        result.qtyAvailableVector = self.getQtyAvailableVector(result);
                        result.qtyVectorMaximumQuantity = self.getMaximumQuantityAvailable(result.qtyAvailableVector);
                        result.qtyVectorMinimumQuantity = self.getMinimumQuantityAvailable(result.qtyAvailableVector);
                    }
                } else {
                    // Add new attributes
                    result.blendedLogicApplied = false;
                    result.blendedEvent = false;

                    // add qtyAvailableVector
                    if(result.eventLevelStats && result.eventLevelStats.quantitySummary) {
                        result.qtyAvailableVector = self.getQtyAvailableVector(result);
                        result.qtyVectorMaximumQuantity = self.getMaximumQuantityAvailable(result.qtyAvailableVector);
                        result.qtyVectorMinimumQuantity = self.getMinimumQuantityAvailable(result.qtyAvailableVector);
                    }

                    // Delete and modify attributes
                    if (result.listing) {
                        result.listing.forEach(function(listing) {
                            // Add new properties
                            listing.isBlendedListing = false;
                            listing.multipleListing = false;

                            listing.usePrice = (withFees ? listing.currentPrice : listing.listingPrice);

                            listing.price = {
                                'amount': listing.usePrice.amount,
                                'currency': listing.usePrice.currency
                            };

                            if (listing.seatNumbers) {
                                seatNumbersArray = listing.seatNumbers.split(',') || [];
                                listing.seatNumbersArray = seatNumbersArray;
                                listing.seatNumberFirst = seatNumbersArray[0];
                                listing.seatNumberLast = seatNumbersArray[seatNumbersArray.length - 1];

                                listing.seats = [{
                                    'ticketSeatId': '',
                                    'seatNumber': listing.seatNumbers,
                                    'listingId': listing.listingId,
                                    'row': listing.row,
                                    'seatNumbersArray': seatNumbersArray,
                                    'seatNumberFirst': seatNumbersArray[0],
                                    'seatNumberLast': seatNumbersArray[seatNumbersArray.length - 1]
                                }];
                            } else {
                                listing.seats = [{
                                    'ticketSeatId': null,
                                    'seatNumber': null,
                                    'listingId': listing.listingId,
                                    'row': listing.row,
                                    'seatNumbersArray': null,
                                    'seatNumberFirst': null,
                                    'seatNumberLast': null
                                }];
                            }

                            // Put the valuePercentage into appropriate buckets.
                            listing.valueBucket = self.getValueBucket(listing.valuePercentage);

                            // Remove old properties
                            delete listing.currentPrice;
                            delete listing.listingPrice;
                            delete listing.row;
                            delete listing.sellerSectionName;
                            delete listing.seatNumbers;
                            delete listing.splitOption;
                            delete listing.ticketSplit;
                            delete listing.serviceFee;
                            delete listing.deliveryFee;
                            delete listing.totalCost;
                            delete listing.score;
                        });
                    }

                    if (result.section_stats) {
                        result.sectionStats = [];
                        result.section_stats.forEach(function(val) {
                            result.sectionStats.push({
                                'sectionId': val.sectionId,
                                'sectionName': val.sectionName,
                                'minTicketPrice': val.minTicketPrice,
                                'maxTicketPrice': val.maxTicketPrice,
                                'averageTicketPrice': val.averageTicketPrice,
                                'maxTicketQuantity': val.maxTicketQuantity,
                                'totalTickets': val.totalTickets,
                                'totalListings': val.totalListings
                            });
                        });
                        delete result.section_stats;
                    }

                    if (result.zone_stats) {
                        result.zoneStats = [];
                        result.zone_stats.forEach(function(val) {
                            result.zoneStats.push({
                               'zoneId': val.zoneId,
                               'zoneName': val.zoneName,
                               'minTicketPrice': val.minTicketPrice,
                               'maxTicketPrice': val.maxTicketPrice,
                               'totalTickets': val.totalTickets,
                               'totalListings': val.totalListings,
                               'averageTicketPrice': val.averageTicketPrice
                            });
                        });
                        delete result.zone_stats;
                    }

                    if (result.deliveryTypeSummary) {
                        result.deliveryTypeSummary.forEach(function(val) {
                            delete val.deliveryTypeId;
                            delete val.totalListings;
                        });
                    }

                    if (result.listingAttributeCategorySummary) {
                        result.listingAttributeCategorySummary.forEach(function(val) {
                            delete val.listingAttributeCategoryId;
                            delete val.totalListings;
                        });
                    }
                }

                _.each(result.listing, function(listing) {
                    listing.deliveryTypeList = DeliveryHelper.combinePaperDelivery(listing.deliveryTypeList || [], 'deliveryType');
                });
            }
            return result;
        },

        getMinimumQuantityAvailable: function(quantityVector) {
            // ticketQuantity === the number of tickets for the buyer to purchase
            // ticketListingAvailableQuantity === the number of listings for a specific ticketQuantity

            for (var ticketQuantity = 1; ticketQuantity < quantityVector.length; ticketQuantity++) {
                if (quantityVector.hasOwnProperty(ticketQuantity) && isNaN(quantityVector[ticketQuantity]) === false && quantityVector[ticketQuantity] > 0) {
                    return ticketQuantity;
                }
            }
        },

        getMaximumQuantityAvailable: function(quantityVector) {
            // ticketQuantity === the number of tickets for the buyer to purchase
            // ticketListingAvailableQuantity === the number of listings for a specific ticketQuantity

            for (var ticketQuantity = quantityVector.length; ticketQuantity > 0; ticketQuantity--) {
                if (quantityVector.hasOwnProperty(ticketQuantity) && isNaN(quantityVector[ticketQuantity]) === false && quantityVector[ticketQuantity] > 0) {
                    return ticketQuantity;
                }
            }
        },

        getQtyAvailableVector: function(qtyResponse) {
            var qtyAvailableVector = [],
                qtyListings = qtyResponse.eventLevelStats.quantitySummary;

            for(var i in qtyListings) {
                qtyAvailableVector[qtyListings[i].quantity] = qtyListings[i].totalListings;
            }

            return qtyAvailableVector;
        },

        getUrl: function() {
            var url = null;

            if (EventHelper.useListingsV2()) {
                url = '/shape/search/inventory/v2/listings/?eventId=' + this.eventId + '&sectionStats={{sectionStats}}&zoneStats={{zoneStats}}&start={{start}}&allSectionZoneStats={{allSectionZoneStats}}&eventLevelStats={{eventLevelStats}}&quantitySummary={{quantitySummary}}';
            } else {
                url = '/shape/search/inventory/v2/?eventId=' + this.eventId + '&sectionStats={{sectionStats}}&zoneStats={{zoneStats}}&start={{start}}&allSectionZoneStats={{allSectionZoneStats}}&eventLevelStats={{eventLevelStats}}&quantitySummary={{quantitySummary}}';
            }

            return url;
        },

        getValueBucket: function(valuePercentage) {
            if (valuePercentage <= 20) {
                return 1;
            } else if (valuePercentage >= 21 && valuePercentage <= 40) {
                return 2;
            } else if (valuePercentage >= 41 && valuePercentage <= 60) {
                return 3;
            } else if (valuePercentage >= 61 && valuePercentage <= 80) {
                return 4;
            } else if (valuePercentage >= 81) {
                return 5;
            }
        }
    });
    InventoryCollection.getInstance = function(options) {
        if(!inventoryCollectionInstance) {
            var options = options || {};
            inventoryCollectionInstance = new InventoryCollection(options);
        }
        return inventoryCollectionInstance;
    }
    return InventoryCollection;
});

/* global _ */
define('views/filter_view',[
    'foobunny',
    'hammer',
    'models/filter_model',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'views/price_slider_view',
    'collections/inventory_collection',
    'globals',
    'global_context',
    'i18n',
    'priceValidator',
    'sh_currency_format',
    'views/quantity_filter_view'
], function(Foobunny, Hammer, FilterModel, EventHelper, DeliveryHelper, PriceSliderView, InventoryCollection, globals, gc, i18n, priceValidator, currencyFormatUtil, QuantityFilterView) {
    'use strict';

    var FilterView = Foobunny.BaseView.extend({

        el: '#filter',

        template: gc.appFolder + '/filter',

        subViews: {},

        initialize: function() {
            console.log('--FilterView--  in initialize()', this);
            this.timer = '';
            this.seatTraits = [];
            this.deliveryTypes = [];
            this.$clonedModal = null;
            this.$modalOverlays = null;

            this.subscribeEvent('ticketListFooter:hidden', this.show);
            this.subscribeEvent('filter:show', this.show);
            this.subscribeEvent('filter:hide', this.closeFilters);
            this.subscribeEvent('ticketlist:seeAllTickets', this.reset);
            this.subscribeEvent('eventmodel:dataready', this.setSeatTraits);
            this.subscribeEvent('deliveryTypes:ready', this.setdeliveryTypes);

            if (gc.view === 'NON-GA' && !globals.priceSlider.displayOutside) {
                this.subViews = {sliderView: new PriceSliderView()};
            }

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));

            // Future Change: Figure out the 250 ms delay.
            this.debouncedToggleReset = _.debounce(this.toggleReset, 250);

            var layoutType = EventHelper.getLayoutType();
            switch(layoutType) {
                case 'blended':
                    var urlParamQtyBtnCount = Number(EventHelper.getUrlQuery('qtyBtnCount')),
                        maxButtonCount = urlParamQtyBtnCount || EventHelper.getFeatureFn('event.qqBlendedMaxQty', 'string')() || globals.quantityOverlay.quantityBtnMaxCount,
                        qtyFilterArgs;

                    if(EventHelper.isMobile() === true) {
                        qtyFilterArgs = {
                            el: '#qty_container',
                            filterId: 'qty_filter_mobile',
                            filterClass: 'qty_content qty-filter-drop-down',
                            buttonClass: 'select-item',
                            type: 'select',
                            qtySelected:  this.model.get('qty'),
                            maxButtonCount: maxButtonCount,
                            minButtonCount: maxButtonCount,
                            navigation: false
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);

                    } else {

                        var qtyFilterArgs = {
                            el: '#sortfilter-qty-selector .select-dropdown',
                            filterId: 'sortfilter-qty-dropdown',
                            filterClass: '',
                            type: 'list',
                            qtySelected:  this.model.get('qty'),
                            maxButtonCount: maxButtonCount,
                            minButtonCount: maxButtonCount,
                            navigation: false
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);
                    }
                    break;
                case 'nonBlended':
                    if(EventHelper.isDesktop() === false){
                        // this is going to go away, only to support the default / current circle selector buttons 12345+
                        var qtyFilterArgs = {
                            el: '#qty_container',
                            filterId: 'qty_filter_mobile',
                            filterClass: 'qty_content filter-mobile-carousel flexbox flex-container',
                            buttonClass: 'btn-default qty-button qty_index btn-small flex-item',
                            type: 'carousel',
                            maxButtonCount: 5,
                            minButtonCount: 4,
                            navigation: false,
                            qtySelected: this.model.get('qty'),
                            modelEvents: {},
                            extraButtons: [
                                {
                                    "label": '5+',
                                    "value": '5+',
                                    buttonClass: 'btn-default qty-button btn-small flex-item'
                                }
                            ]
                        };

                        this.subViews.qtyFilter = new QuantityFilterView(qtyFilterArgs);
                        this.subViews.qtyFilter.selectQty = this.selectQty;
                    }
                    break;
                case 'ga':

                    break;

                default:

            }
        },

        modelEvents: {
            'change': 'debouncedToggleReset',
            'change:qty': 'displayUpdatedQuantity'
        },

        context: function() {
            return {
                globals: globals,
                seatTraits: this.seatTraits,
                deliveryTypes: this.deliveryTypes,
                isAdvancedFiltersEnabled: EventHelper.isAdvancedFiltersEnabled(),
                isFiltersApplied: this.model.isFiltersApplied()
            };
        },

        afterRender: function() {
            Hammer(this.el);

            this.$body = $('body');
            this.$modalOverlays = $('.modal-overlay-cover');
            this.$clonedModal = $(this.$modalOverlays[0]).clone();
            this.$clonedModal.attr('id', 'ticketlist-modal-overlay');

            this.layoutSettings();
        },

        layoutSettings: function() {
            // Display How Many Tickets as the label for the Tablet and Desktop for NON-GA events only.
            if (gc.view === 'NON-GA') {
                if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                    this.$el.find('.lbl-quantity').text(i18n.get('event.filter.qty.text'));
                } else {
                    this.$el.find('.lbl-quantity').text(i18n.get('event.filter.howmany.text'));
                }
            }
        },

        uiEl: {
            '$feeOption': '.fee-option',
            '$feesIncluded': '#feesIncluded',
            '$feesIncludedLabel': '.withfeeslabel',
            '$filterSubmit': '.filter-submit',
            '$qtyIndex': '#qty_container .qty_index',
            '$eiFromPriceTxt': '#eifromPriceTxt',
            '$eiToPriceTxt': '#eitoPriceTxt',
            '$filterReset': '.filter-reset',
            '$feeCheck': '#feesIncluded',
            '$sortByQty': '#qtyselector',
            '$sortByQtyTxt': '.qtyText',
            '$advFilterDropdown': '#filter-container .select-dropdown',
            '$sortfilterQtySelector': '#sortfilter-qty-selector',
            '$sortfilterQtySelectorMobile': '#qty_filter_mobile',
            '$sortfilterSelector': '#sortfilter-selector',
            '$priceSlider': '#price-slider',
            '$filterDropdownInputs': '#filter-dropdown li',
            '$deliveryFeature': '#delivery-cont .checkbox-icon',
            '$seatFeature': '#seatfeature-cont .checkbox-icon',
            '$qtySubt': '.qty-subt',
            '$qtyAdd': '.qty-add'
        },

        events: {
            'tap .filter-submit': 'closeFilters',
            'tap .filter-reset': 'reset',
            'keyup #eitoPriceTxt': 'updateMaxPrice',
            'change #eitoPriceTxt': 'updateMaxPrice',
            'keypress #eitoPriceTxt': 'validatePrice',
            'change #feesIncluded': 'feesIncluded',
            'change #qtyselector': 'applyQuantity',
            'change #qty_filter_mobile': 'applyQuantity',
            'mousedown #delivery-cont': 'handleFilter',
            'mousedown #seatfeature-cont': 'handleFilter',
            'click #delivery-dropdown > li': 'handleFilterCheckbox',
            'click #seatfeature-dropdown > li': 'handleFilterCheckbox',
            'click #delivery-done': 'handleFilterCloseButton',
            'click #seatfeature-done': 'handleFilterCloseButton',
            'click #delivery-x-done': 'handleFilterCloseButton',
            'click #seatfeature-x-done': 'handleFilterCloseButton',
            'focusout #filter-dropdown .dropdown-cont': 'handleFilterClose'
        },

        handleFilterCheckbox: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            // Fix focus out on checkbox click.
            var $target = $(evt.currentTarget),
                $targetChild = $target.find('.checkbox-icon'),
                $targetName = $targetChild.data('name'),
                $targetId = $targetChild.data('id'),
                $targetChecked = ($target.hasClass('selected')) ? 'de-selected' : 'selected',
                $checkList = [],
                categoryId = null,
                $selectedCb = null,
                $selectedCbId = null,
                $selectedCbLi = null,
                filterList = [],
                filterExcludeList = [],
                deliveryFilterList = [],
                seatFeatures = [],
                deliveryTypes = [],
                categorySelection = '',
                filterListCombined = [],
                filterExcludeListCombined = [],
                deliveryFilterListCombined = [],
                paramCount = 0,
                wasChecked = false;

            if (typeof $targetName === 'undefined') {
                return;
            }

            if ($targetName === 'seatfeature') {
                $checkList = this.uiEl.$seatFeature;
            } else {
                $checkList = this.uiEl.$deliveryFeature;
            }

            $checkList.each(function() {
                $selectedCb = $(this);
                $selectedCbId = $selectedCb.data('id');
                $selectedCbLi = $selectedCb.closest('li');

                if ($targetId === 0) {
                    $target.addClass('selected');

                    if ($selectedCbId !== $targetId) {
                        $selectedCbLi.removeClass('selected');
                    }
                } else {
                    if ($selectedCbId === 0) {
                        if ($selectedCbLi.hasClass('selected')) {
                            $selectedCbLi.removeClass('selected');
                        }
                    } else {
                        if ($targetId === $selectedCbId) {
                            if ($selectedCbLi.hasClass('selected')) {
                                wasChecked = true;
                                $selectedCbLi.removeClass('selected');
                            } else {
                                $selectedCbLi.addClass('selected');

                                if ($selectedCb.data('name') === 'seatfeature') {
                                    categoryId = $selectedCb.data('category-id');

                                    if (categoryId === 1) {
                                        filterExcludeList.push(categoryId);
                                    } else {
                                        filterList.push(categoryId);
                                    }
                                    seatFeatures.push($selectedCb.data('category'));
                                } else {
                                    deliveryFilterList.push($selectedCbId);
                                    deliveryTypes.push($selectedCb.data('category'));
                                }
                            }
                        } else {
                            if ($selectedCbLi.hasClass('selected')) {
                                if ($selectedCb.data('name') === 'seatfeature') {
                                    categoryId = $selectedCb.data('category-id');

                                    if (categoryId === 1) {
                                        filterExcludeList.push(categoryId);
                                    } else {
                                        filterList.push(categoryId);
                                    }
                                    seatFeatures.push($selectedCb.data('category'));
                                } else {
                                    deliveryFilterList.push($selectedCbId);
                                    deliveryTypes.push($selectedCb.data('category'));
                                }
                            }
                        }
                    }
                }
            });

            paramCount = seatFeatures.length + deliveryFilterList.length + deliveryTypes.length;

            if (paramCount === 0) {
                // No filters are selected, select All
                $($checkList[0]).closest('li').addClass('selected');
            }

            if (wasChecked && paramCount === 0 && $targetId === 0) {
                return;
            }

            categorySelection = $targetChild.data('category') + ' ' + $targetChecked;

            if ($targetName === 'seatfeature') { // For SeatTrait Feature
                if (filterList.length > 0) {
                    filterListCombined = filterList.join();
                    EventHelper.setUrlParam('categ', filterListCombined);
                } else {
                    EventHelper.removeUrlParam('categ');
                }

                if (filterExcludeList.length > 0) {
                    filterExcludeListCombined = filterExcludeList.join();
                    EventHelper.setUrlParam('excl', filterExcludeListCombined);
                } else {
                    EventHelper.removeUrlParam('excl');
                }

                this.model.set({
                    listingAttributeCategoryList: filterListCombined,
                    excludeListingAttributeCategoryList: filterExcludeListCombined,
                    lastchanged: 'filters'
                }, {});

                seatFeatures = seatFeatures.join(', ');

                EventHelper.track({
                    pageView: 'FilterView',
                    appInteraction: 'Seat Feature: ' + categorySelection,
                    pageload: false, filterType: 'Seat Features: ' + categorySelection,
                    userExperienceSnapshot: {seatFeatures: (seatFeatures !== '') ? 'Seat Features: ' + seatFeatures : 'Seat Features: All'}
                });
            } else { // For DeliveryType Feature
                if (deliveryFilterList.length > 0) {
                    deliveryFilterListCombined = deliveryFilterList.join();
                    EventHelper.setUrlParam('dt', deliveryFilterListCombined);
                } else {
                    EventHelper.removeUrlParam('dt');
                }

                this.model.set({
                    deliveryTypeList: deliveryFilterListCombined,
                    lastchanged: 'filters'
                }, {});

                deliveryTypes = deliveryTypes.join(', ');

                EventHelper.track({
                    pageView: 'FilterView',
                    appInteraction: 'Delivery Methods: ' + categorySelection,
                    pageload: false, filterType: 'Delivery Methods: ' + categorySelection,
                    userExperienceSnapshot: {deliveryTypes: (deliveryTypes !== '') ? 'Delivery Methods: ' + deliveryTypes : 'Delivery Methods: All'}
                });
            }
        },

        handleFilterCloseButton: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $origTarget = $(evt.currentTarget),
                seatOrDelivery = $origTarget.hasClass('seatfeature-done') ? 'Close Seat Features' : 'Close Delivery Methods';

            $origTarget.closest('.select-dropdown').hide();

            if (EventHelper.isMobile()) {
                $('#ticketlist-modal-overlay').remove();
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: seatOrDelivery, pageload: false});
        },

        handleFilter: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget),
                $origDropdown = $origTarget.closest('.dropdown-cont').find('.select-dropdown'),
                $origDropdownVisible = $origDropdown.is(':visible'),
                $target = $(evt.target),
                seatOrDelivery;

            if (!$origTarget.is(':focus')) {
                $origTarget.focus();
            }

            $origDropdown.toggle(0, function() {
                $(this).hide();
            }, function() {
                $(this).show();
                if (EventHelper.isMobile()) {
                    $(that.el).append(that.$clonedModal);
                }
            });

            seatOrDelivery = $origTarget.attr('id') === 'seatfeature-cont' ? 'Show Seat Features' : 'Show Delivery Methods';

            if($target.hasClass('seatfeature-header') || $target.hasClass('delivery-header')) {
                EventHelper.track({pageView: 'Advanced filter', appInteraction: seatOrDelivery, pageload: false});
            }
        },

        handleFilterClose: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $origTarget = $(evt.currentTarget);

            $origTarget.find('.select-dropdown').hide();

            if (EventHelper.isMobile()) {
                $('#ticketlist-modal-overlay').remove();
            }
        },

        setdeliveryTypes: function(deliveryObj) {
            var allObj = {
                    'category': i18n.get('event.common.all.text'),
                    'categoryId': 0,
                    'id': 0,
                    'description': i18n.get('event.common.all.text'),
                    'iconset': '',
                    'checked': 'true'
                },
                dtList = this.model.get('deliveryTypeList'),
                tempList = [],
                deliveryArray = deliveryObj.deliveryTypes;

            if (dtList.length > 0) {
                // initially on pageLoad, allObj checked is true & dtList has length 0.
                // so, if dtList has values, set allObj checked to false
                allObj.checked = 'false';
            }

            this.deliveryTypes = _.filter(deliveryArray, function(obj) {
                return obj.id && (tempList.indexOf(obj.id) === -1) && (tempList.push(obj.id));
            });

            _.each(this.deliveryTypes, function(obj) {
                obj.value = obj.id;
                obj.description = DeliveryHelper.getDeliveryTypeName(obj.id, obj.description);

                if (dtList.length > 0 && _.contains(dtList, obj.value.toString())) {
                    obj.checked = 'true';
                } else {
                    obj.checked = 'false';
                }

                if (obj.id === 2) {
                    obj.iconset = 'sh-iconset-instantdnld';
                }
            });

            this.deliveryTypes.sort(function(a, b) {
                if (a.description < b.description) {return -1;}
                if (a.description > b.description) {return 1;}
                return 0;
            });

            this.deliveryTypes.unshift(allObj);
            this.renderFilterView();
        },

        renderFilterView: function() {
            return this.render();
        },

        setSeatTraits: function(mySeats) {
            var allObj = {
                    'category': i18n.get('event.common.all.text'),
                    'categoryId': 0,
                    'id': 0,
                    'name': i18n.get('event.common.all.text'),
                    'iconset': '',
                    'checked': 'true'
                },
                tempList = [],
                seatTraitsList = this.model.get('listingAttributeCategoryList').concat(this.model.get('excludeListingAttributeCategoryList')),
                tempDesc = '';

            if (seatTraitsList.length > 0) {
                // initially on pageLoad, allObj checked is true & seatTraitsList has length 0.
                // so, if seatTraitsList has values, set allObj checked to false
                allObj.checked = 'false';
            }

            // 6 - aisle; 4 - parking; 2 - wheelchair; 1 - obstructed view.
            this.seatTraits = _.filter(mySeats.attributes.seatTraits, function(obj) {
                return obj.categoryId && (
                        obj.categoryId === 1 ||
                        obj.categoryId === 2 ||
                        obj.categoryId === 4 ||
                        obj.categoryId === 6) && (tempList.indexOf(obj.categoryId) === -1) && (tempList.push(obj.categoryId));
            });

            _.each(this.seatTraits, function(obj) {
                tempDesc = EventHelper.geti18n('event.filter.seatTraits.label.' + obj.categoryId);
                obj.category = (tempDesc ? tempDesc : obj.category);

                if (seatTraitsList.length > 0 && _.contains(seatTraitsList, obj.categoryId.toString())) {
                    obj.checked = 'true';
                } else {
                    obj.checked = 'false';
                }

                switch (obj.categoryId) {
                    case 1:
                        obj.iconset = 'sh-iconset-obstructed';
                        obj.value = 'obstructed';
                        break;
                    case 2:
                        obj.iconset = 'sh-iconset-handicap';
                        obj.value = 'handicap';
                        break;
                    case 4:
                        obj.iconset = 'sh-iconset-parking-2';
                        obj.value = 'parking';
                        break;
                    case 6:
                        obj.iconset = 'sh-iconset-aisleseat';
                        obj.value = 'aisleseat';
                        break;
                    default:
                        break;
                }
            });

            this.seatTraits.sort(function(a, b) {
                if (a.category < b.category) {return -1;}
                if (a.category > b.category) {return 1;}
                return 0;
            });

            this.seatTraits.unshift(allObj);

            if (!EventHelper.isDesktop()) {
                this.renderFilterView();
            }
        },

        show: function() {
            var self = this;

            clearTimeout(this.timer);

            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                this.$el.addClass('overlayAnimate').removeClass('hide');
                this.$body.addClass('overlay-active');
                this.publishEvent('filterView:displayed', {displayed: true});
            } else {
                this.publishEvent('filterView:displayed', {displayed: true});
                this.$el.slideDown(100, function() {
                    self.$el.removeClass('hide');
                    self.publishEvent('ticketlist:resize');
                });
            }
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var qty = evt.target.value;
            var filterType = 'Quantity';

            this.model.updateForQty({qty: qty});

            if (qty === '-1') {
                evt.target.text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
            }

            EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false});
        },

        hide: function() {
            var self = this;

            self.$el.slideUp(50, function() {
                self.$el.addClass('hide');
                self.publishEvent('filterView:hidden', {displayed: false});
                self.publishEvent('ticketlist:resize');
            });
        },

        displayUpdatedQuantity: function() {
            var qty = this.model.get('qty') || '-1';

            if (qty === '>5') {
                qty = '5+';
            }
            if(this.subViews.qtyFilter !== undefined) {
                this.subViews.qtyFilter.displaySelectedQty(qty);
            }
        },

        selectQty: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if(evt && evt.currentTarget.classList.contains('disabled')) {
                return;
            }
            var $currentTarget = $(evt.currentTarget),
                qtySelected = $currentTarget.data('value') || -1;

            if(this.model.get('qty') === qtySelected) {
                this.model.set('qty', -1);
                return;
            }
            this.model.updateForQty({qty: qtySelected});
            EventHelper.setUrlParam('qty', qtySelected);

            EventHelper.track({pageView: 'FilterView', appInteraction: 'Quantity', pageload: false});
        },

        reset: function(evt, params) {
            var qty,
                pageView = (!$.isEmptyObject(params) && params.pView) ? params.pView : 'FilterView',
                appInteraction = (!$.isEmptyObject(params) && params.appInter) ? params.appInter : 'Reset',
                $filterDDInputs;

            evt.stopPropagation();
            evt.preventDefault();

            // reset the filter text fields
            this.uiEl.$qtyIndex.removeClass('selectQty');
            this.uiEl.$eiFromPriceTxt.val('');
            this.uiEl.$eiToPriceTxt.val('');
            
            // setting false, as this is only for toggle experience
            // globals.PDO.withFees only being overwritten in toggle experience
            if (globals.PDO.showPdoExperience === globals.PDO.experience.TOGGLE) {
                // Uncheck price with Fees checkbox
                this.uiEl.$feeCheck.prop('checked', false);
                globals.PDO.withFees = false;
            }

            // reset the filter values for the api call
            if (gc.view === 'GA') {
                // GA - The user selects the quantity before seeing the tickets.
                // Hence whenever we reset the filters we do not want to reset the
                // QTY.
                // TBD: Check with UX/PO on what they want to do.
                qty = this.model.get('qty');
            }

            if (!$.isEmptyObject(params) && params.resetAll) {
                this.publishEvent('filter:resetQty');
            }

            this.uiEl.$filterDropdownInputs.each(function() {
                $filterDDInputs = $(this);

                if ($filterDDInputs.find('.checkbox-icon').data('id') === 0) {
                    $filterDDInputs.addClass('selected');
                } else {
                    if ($filterDDInputs.hasClass('selected')) {
                        $filterDDInputs.removeClass('selected');
                    }
                }
            });

            this.model.reset();
            // remove slidermin and slidermax for Non-GA & GA
            EventHelper.removeUrlParams(['sliderMin', 'sliderMax']);

            // Publish the event so that all the views can reset attributes/data as needed.
            this.publishEvent('filter:reset');

            EventHelper.track({pageView: pageView, appInteraction: appInteraction, pageload: false, userExperienceSnapshot: {
                quantity: (this.model.get('qty') !== '-1') ? ('Quantity: ' + this.model.get('qty')) : '',
                ticketId: '',
                priceSliderMin: '',
                priceSliderMax: '',
                PDO: '',
                deliveryTypes: '',
                deliveryMethods: '',
                seatFeatures: '',
                ticketRank: '',
                blendedListing: ''
            }});
        },

        closeFilters: function(evt) {
            var self = this;

            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            // For Table Desktop Close Price filter
            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                self.$el.slideUp(50, function() {
                    self.$el.addClass('hide');
                    self.publishEvent('filterView:hidden', {displayed: false});
                    self.publishEvent('ticketlist:resize');
                });
            } else {
                this.$body.removeClass('overlay-active');
                this.$el.addClass('hide').removeClass('overlayAnimate');
                this.publishEvent('filterView:hidden', {displayed: false});
                this.publishEvent('ticketlist:resize');
            }

            this.uiEl.$eiToPriceTxt.blur();

            if (globals.priceSlider.displayOutside && EventHelper.isMobile()) {
                // price slider inside sort filter
                $('#price-slider').addClass('hide-slider').removeClass('display-slider');
                this.uiEl.$feeOption.removeClass('slider-space');
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Close Filter', pageload: false});
        },

        // allow only 0-9 digits to Enter in max Price input field
        validatePrice: function(evt) {
            var key = evt.which,
                priceLen = $(evt.currentTarget).val().length;

            if (key !== 8 && ((key < 48 || key > 57) || priceLen > 5) && (priceLen > 5 || key !== 8)) {
                return false;
            }
        },

        // Only for Table/Desktop experience
        updateMaxPrice: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var self = this,
                maxPrice = $(evt.currentTarget).val(),
                priceLen = maxPrice.length,
                priceFieldFocus = this.uiEl.$eiToPriceTxt.is(':focus'),
                key = evt.which;

            if (!priceFieldFocus || typeof(key) === 'undefined') {
                return;
            }

            if (key !== 8 && ((key < 48 || key > 57) && (key < 95 || key > 106)) || priceLen > 5) {
                return;
            }

            if (self.priceFilterTimer) {
                clearTimeout(self.priceFilterTimer);
            }

            self.priceFilterTimer = setTimeout(function() {
                self.model.set({
                    maxPrice: ~~currencyFormatUtil.unFormatPrice(maxPrice),
                    lastchanged: 'filters'
                }, {});
                if (maxPrice !== '') {
                    EventHelper.setUrlParam('sliderMax', 0 + ',' + maxPrice);
                } else {
                    EventHelper.removeUrlParam('sliderMax');
                }
                EventHelper.track({pageView: 'FilterView', appInteraction: 'Max price', pageload: false, filterType: 'Selected Max Price: ' + maxPrice, userExperienceSnapshot: {priceSliderMax: 'Max Price: ' + maxPrice}});
            }, 1200);
        },

        feesIncluded: function(evt) {
            var $currentTarget = $(evt.currentTarget),
                checked = $currentTarget.is(':checked');
            if (checked) {
                EventHelper.setUrlParam('priceWithFees', checked);
                EventHelper.track({pageView: 'Toggle', appInteraction: (checked ? 'With fees' : 'Without fees'), pageload: false, userExperienceSnapshot: {PDO: 'Price With Fees'}});
            } else {
                EventHelper.removeUrlParam('priceWithFees');
                EventHelper.track({pageView: 'Toggle', appInteraction: (checked ? 'With fees' : 'Without fees'), pageload: false, userExperienceSnapshot: {PDO: 'Price Without Fees'}});
            }

            evt.stopPropagation();
            evt.preventDefault();

            this.model.updateForWithFees({withFees: checked});
        },

        toggleReset: function() {
            if (this.model.isFiltersApplied()) {
                this.uiEl.$filterReset.removeClass('hide');
            } else {
                this.uiEl.$filterReset.addClass('hide');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: FilterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return FilterView;
});

define('models/seller_model',[
    'foobunny',
    'global_context',
    'underscore'
    ], function(Foobunny, gc, _) {

    'use strict';

    var BsfModel = Foobunny.BaseModel.extend({

        parse: function(response) {
            var seller = response.businessSellerInfo,
                locale = SH.locale,
                notes = seller.notes,
                addInfo = '',
                returnPolicy = '',
                termsCondition = '';

            _.each(notes, function(note) {
                if (note.locale.toLowerCase().replace('_', '-') === locale) {
                    addInfo = note.noteText;
                    returnPolicy = note.returnPolicyText;
                    termsCondition = note.termsConditionText;
                    return false;
                }
            });

            seller.addInfo = addInfo;
            seller.returnPolicy = returnPolicy;
            seller.termsCondition = termsCondition;

            return seller;
        },

        initialize: function() {
            this.urlHeaders = gc.url_headers || {};
        },

        url: function() {
            return '/shape/user/business/v1/' + this.get('businessGuid');
        }
    });

    return BsfModel;

});

define('views/seller_view',[
    'foobunny',
    'hammer',
    'models/seller_model',
    'helpers/event_helper',
    'global_context'
    ], function(Foobunny, Hammer, BsfModel, EventHelper, gc) {
        'use strict';

        var SellerView = Foobunny.BaseView.extend({

            el: '#bsf',

            template: gc.appFolder + '/seller',

            initialize: function() {
                console.log('--FilterView--  in initialize()', this);
                this.model = new BsfModel();
                this.$body = $('body');

                this.subscribeEvent('sellerInfo:show', this.showSellerInfo);
            },

            afterRender: function() {
                Hammer(this.el);
            },

            events: {
                'tap .bsf-overlay-close' : 'close'
            },

            close: function(evt) {
                this.$body.removeClass('overlay-active');

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('overlayAnimate');
            },

            fetchOnRender: true,
            fetchOnInitialize: false,

            showSellerInfo: function(opts) {
                if (!opts.businessGuid) {
                    return false;
                }

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Business Seller Info', pageload: false});
                var that = this;
                this.$body.addClass('overlay-active');

                // new another model, else the last one would leave dirty data
                this.model = new BsfModel();
                this.model.set('businessGuid', opts.businessGuid);
                var promise = this.model.fetch();

                promise.done(function() {
                    that.render();
                    that.$el.addClass('overlayAnimate');
                });
                promise.fail(function() {
                    that.$body.removeClass('overlay-active');
                    EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Business Seller Info Load Failed', pageload: false});
                });
            }

        });

        return SellerView;
});

define('models/event_model',[
    'foobunny',
    'global_context',
    'globals',
    'sh_image'
], function(Foobunny, gc, globals, SHImage) {
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
                    response.sh_images[image.type] = {urls: {}}
                    //if the image cannot be resized, no point building the resizeable url
                    if (image.resizableInd === true) { 
                        imageSizes.forEach(function(size, index, sizes) {
                            imageSize = Object.keys(size)[0];
                            imageUrl = SHImage.zoomImageUrlBuilder(image.url, {
                                size: size[imageSize],
                                progressive: true,
                                quality: imageQuality
                            });
                            response.sh_images[image.type].urls[imageSize] = imageUrl; 
                        });
                    } else {
                        response.sh_images[image.type].urls['default'] = image.url;
                        response.sh_images[image.type].urls['mobile'] = image.url;
                        response.sh_images[image.type].urls['desktop'] = image.url;
                        response.sh_images[image.type].urls['tablet'] = image.url;
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
                performerName = '',
                performerId = '',
                performers = response.performers,
                ancestorGroupings = response.ancestors.groupings,
                webURI = null;

            if (performers) {
                for (var i = 0, len = performers.length; i < len; i++) {
                    if (!performers[i].webURI) {
                        continue;
                    }

                    performerName = this.stripPerformerName(performers[i].name);
                    performerId = performers[i].id;
                    webURI = performers[i].webURI;
                    eventNameLinked = eventNameLinked.replace(new RegExp(performerName, 'i'), this.convertToLink(performerName, webURI, performerId));
                }
            } else if (ancestorGroupings && ancestorGroupings.length > 0) {
                performerName = this.stripPerformerName(eventNameLinked);
                webURI = ancestorGroupings[ancestorGroupings.length - 1].webURI;
                if (webURI) {
                    eventNameLinked = eventNameLinked.replace(new RegExp(performerName, 'i'), this.convertToLink(performerName, webURI, performerId));
                }
            }

            return eventNameLinked;
        },

        stripPerformerName: function(name) {
            var idx = name.toLowerCase().lastIndexOf(' tickets');
            return (idx < 0 ? name : name.substring(0, idx));
        },

        convertToLink: function(performerName, performerURI, performerId) {
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

define('views/event_info_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'global_context',
    'globals',
    'dotdotdot'
    ], function(Foobunny, Hammer, EventHelper, gc, globals, dotdotdot) {
        'use strict';

        var EventInfoView = Foobunny.BaseView.extend({
            initialize: function() {
                console.log('--Event_infoView--  in initialize()', this);

                this.setPerformerBanner(); // TODO control code TBD
                
                // show info when asked for
                this.subscribeEvent('eventinfo:show', this.show);
                this.subscribeEvent('eventdisclosure:available', this.showDisclosureIcon);
            },

            el: '#eventInfo',

            template: gc.appFolder + '/event_info',

            events: {
                'tap .closeEventInfo' : 'close',
                'tap #event-info-flag' : 'showEventDisclosure',
                'tap .performer' : 'trackEventNameClick',
                'tap .venue' : 'trackVenueClick'
            },

            afterRender: function() {
                Hammer(this.el);

                // Add ellipsis to the title and update it when the window is re-sized.
                this.$el.find('.header').dotdotdot({
                    watch: 'window'
                });

                // Add the 'year' class if the event date is not the current year.
                var evtDate = new Date(this.model.get('eventDateLocal'));
                var today = new Date();
                if (today.getFullYear() !== evtDate.getFullYear()) {
                    this.$el.find('.event-meta').addClass('event-year').find('.year').removeClass('hide');
                }
            },

            show: function() {
                $('body').addClass('overlay-active');
                this.$el.addClass('overlayAnimate');
            },

            setPerformerBanner: function() {
                var imgs = this.model.get("sh_images");
                this.model.set('showPerformerBanner', false);
                if(!_.isEmpty(imgs.BANNER) && SH.skinName === '76ers') {
                    if (EventHelper.isMobile()) {

                    } else if (EventHelper.isTablet()) {
                        this.model.set('performerBannerUrl', imgs.BANNER.urls.tablet);
                        this.model.set('showPerformerBanner', true);
                    } else {
                        this.model.set('performerBannerUrl', imgs.BANNER.urls.desktop);
                        this.model.set('showPerformerBanner', true);
                    }

                }
            },

            close: function(evt) {
                $('body').removeClass('overlay-active');

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('overlayAnimate');
                EventHelper.track({pageView: 'EventCard', appInteraction: 'Close', pageload: false});
            },

            showDisclosureIcon: function() {
                var self = this;
                //make sure the rendered fragment has been appended to the DOM
                window.setTimeout(function() {
                    self.$el.find('#event-info-flag').removeClass('hide');
                }, 0);
            },

            showEventDisclosure: function() {
                this.publishEvent('eventdisclosure:show', {trackDisclosureFlagClick: {
                    prefix: 'EventInfo',
                    value: 'Event Disclosure Flag'
                }});
            },

            trackEventNameClick: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                EventHelper.track({pageView: 'EventInfo', appInteraction:  'Go to performer page',  pageload: false});
            },

            trackVenueClick: function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Go to venue page', pageload: false});
            },

            context: function() {
                return {
                    showVenuePostCode: EventHelper.showVenuePostCode()
                };
            }
        });
    return EventInfoView;
});

/* global SH,_ */
define('views/event_details_view',[
    'foobunny',
    'hammer',
    'models/event_model',
    'views/event_info_view',
    'helpers/event_helper',
    'global_context',
    'globals',
    'application_helper'
], function(Foobunny, Hammer, EventModel, EventInfoView, EventHelper, gc, globals, ApplicationHelper) {
    'use strict';

    var EventDetailsView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--EventDetailsView--  in initialize()', this);

            this.subscribeEvent('eventdisclosure:available', this.showDisclosureIcon);
            this.subscribeEvent('app:render-ready', this.processAppRenderReady);
            this.subscribeEvent('buildyourorder:displayed', this.showBackButton);
            this.subscribeEvent('buildyourorder:hidden', this.showFilterIcon);
            this.subscribeEvent('globalHeader:show', this.resetEventDetails);

            this.model = new EventModel();
            this.subViews = {};

            this.byoDisplayed = false;
        },

        el: '#event-details',

        template: gc.appFolder + '/event_details',

        events: {
            'click': 'scrollHeaderBack',
            'click .filterButton' : 'showFilterView',
            'click .infoButton' : 'showInfoView',
            'click #event-details-flag' : 'showEventDisclosure',
            'click .back-button' : 'processBackButton'
        },

        uiEl: {
            '$backButton': '.back-button',
            '$filterButton': '.filterButton'
        },

        fetchData: function() {
            var self = this,
                fetchDataPromise = this.model.fetch();

                fetchDataPromise
                    .done(function(data) {
                        self.successfulFetchData(data);
                    })
                    .fail(function(error) {
                        self.publishEvent('dataready:error', error);
                    });

            return fetchDataPromise;
        },

        afterRender: function() {
            Hammer(this.el);
        },

        context: function() {
            return {
                globals: globals
            };
        },

        processBackButton: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Back Button Clicked', pageload: false});

            if (this.byoDisplayed) {
                this.publishEvent('buildyourorder:hide');
            } else if (gc.isAddParking) {
                EventHelper.urlParser.redirect(EventHelper.getReferrer());
            } else {
                this.publishEvent('eventdetailsview:goToUpcomingEvents', evt, true);
            }
        },

        successfulFetchData: function(data) {
            if (this.model.get('expiredInd') === true) {
                this.publishEvent('eventmodel:expiredEvent', this.model.getUpcomingEventsLink());
            }

            globals.event_meta.country = this.model.get('venue').country;

            //initialize the info view only when the event details model has been fetched and then pass it on.
            this.subViews.eventinfo = new EventInfoView({
                model: this.model
            });

            //update meta tags now that the meta information is available
            this.updateMetaTags();

            //add this model data to globals object, this is used for displaying the alt/title on vfs images
            globals.event_meta.venue = this.model.toJSON().venue;
            // this.model.get('eventAttributes').isBYO = EventHelper.determineBYO({ });;

            try {
                globals.event_meta.isParking = (this.model.get('eventAttributes').eventType === globals.constants.PARKING);
                globals.event_meta.parkingEventId = this.model.get('eventAttributes').parkingEventId[0] ? this.model.get('eventAttributes').parkingEventId[0] : null;
            } catch (e) {}

            this.publishEvent('eventmodel:dataready', this.model);

            try {
                Foobunny.storage.setItem('event:' + gc.event_id + ':event', data, 'local', 1000 * 60 * 60);
            } catch (e) {}

        },

        scrollHeaderBack: function(evt) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            var isScrolledUp = this.$el.hasClass('scrolled-up');
            EventHelper.scrollEventHeader(this.$el, !isScrolledUp);
            if (!isScrolledUp) {
                this.hideGlobalHeader();
            } else {
                this.showGlobalHeader();
            }
        },

        hideGlobalHeader: function() {
            if (EventHelper.isMobile()) {
                this.publishEvent('globalHeader:hide');
                this.publishEvent('ticketlist:resize');
            }
        },

        showGlobalHeader: function() {
            this.publishEvent('globalHeader:show');
            this.publishEvent('ticketlist:resize');
        },

        resetEventDetails: function() {
            EventHelper.scrollEventHeader(this.$el, false);
        },

        showFilterView: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.publishEvent('filter:show');
            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Filter', pageload: false});
        },

        showInfoView: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.publishEvent('eventinfo:show');
            EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show EventCard', pageload: false});
        },

        showDisclosureIcon: function() {
            this.$el.find('#event-details-flag').removeClass('hide');
        },

        showEventDisclosure: function() {
            this.publishEvent('eventdisclosure:show', {trackDisclosureFlagClick: {
                prefix: 'EventInfo',
                value: 'Event Disclosure Flag'
            }});
        },

        showLeftIcon: function() {
            if (gc.view === 'NON-GA') {
                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST ||
                    gc.isAddParking === true) {
                    this.uiEl.$filterButton.addClass('hide');
                    this.uiEl.$backButton.removeClass('hide');
                } else {
                    this.uiEl.$backButton.addClass('hide');
                    this.uiEl.$filterButton.removeClass('hide');
                }
            }
        },

        updateMetaTags: function() {

            // TODO: - keeping the static tags here as well, easy to maintain - until we have a complete server side solution
            var self = this,
                seoMeta = this.model.get('seoMeta'),
                metaTags, domainName, eventUrl, deepLinkUrl, imgWidth, imgHeight, imgUrl = '',
                title;

            if (seoMeta.title && !_.isEmpty(seoMeta.title)) {
                title = seoMeta.title;
            } else {
                title = this.model.get('name');
            }

            domainName = (gc.gsConfig) ? gc.gsConfig.domain.domainName : 'stubhub.com';
            eventUrl = domainName.toLowerCase() + '/' + self.model.get('webURI');
            deepLinkUrl = 'stubhub://stubhub.com/?event_id=' + self.model.get('id');

            if (!_.isEmpty(this.model.get('images'))) {
                imgUrl = this.model.get('images')[0].url;
                imgWidth = this.model.get('images')[0].width;
                imgHeight = this.model.get('images')[0].height;
            }

            window.setTimeout(function() {
                metaTags = [
                            {type: 'title', content: title},
                            {type: 'link', attribute: ['rel', 'canonical'], contents: [['href', 'https://www.' + eventUrl]] },
                            {type: 'meta', attribute: ['name', 'description'], contents: [['content', seoMeta.metaDescription]]},

                            //twitter meta tags
                            {type: 'meta', attribute: ['name', 'twitter:title'], contents: [['content', seoMeta.seoDescription]]},
                            {type: 'meta', attribute: ['name', 'twitter:description'], contents: [['content', seoMeta.metaDescription]]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:iphone'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:ipad'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},
                            {type: 'meta', attribute: ['name', 'twitter:app:url:googleplay'], contents: [['content', deepLinkUrl + '&GCID=Twitter:Card:Event']]},

                            //open graph
                            {type: 'meta', attribute: ['property', 'og:title'], contents: [['content', seoMeta.seoDescription]]},
                            {type: 'meta', attribute: ['property', 'og:description'], contents: [['content', seoMeta.metaDescription]]},
                            {type: 'meta', attribute: ['property', 'og:url'], contents: [['content', 'https://www.' + eventUrl]]},

                            //AppLinks
                            {type: 'meta', attribute: ['name', 'al:ios:url'], contents: [['content', deepLinkUrl + '&GCID=AppLinks:Event']]},
                            {type: 'meta', attribute: ['name', 'al:android:url'], contents: [['content', deepLinkUrl + '&GCID=AppLinks:Event']]}
                        ];

                if (imgUrl !== '') {
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image'], contents: [['content', imgUrl]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image:width'], contents: [['content', imgWidth]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'og:image:height'], contents: [['content', imgHeight]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image'], contents: [['content', imgUrl]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image:width'], contents: [['content', imgWidth]]});
                    metaTags.push({type: 'meta', attribute: ['property', 'twitter:image:height'], contents: [['content', imgHeight]]});
                }
                ApplicationHelper.updateHeadTags(metaTags);
            },0);
        },

        showBackButton: function(hideGlobalHeader) {
            // Show the back button if the BYO is visible.
            if (hideGlobalHeader) {
                this.hideGlobalHeader();
            }
            this.uiEl.$filterButton.addClass('hide');
            this.uiEl.$backButton.removeClass('hide');
            this.byoDisplayed = true;
        },

        showFilterIcon: function() {
            this.byoDisplayed = false;
            this.showLeftIcon();
        },

        processAppRenderReady: function() {
            var buyerMessages = this.model.getBuyerMessages();

            this.showLeftIcon();

            // Check for disclosure
            if (buyerMessages !== '') {
                this.publishEvent('eventdisclosure:available', buyerMessages);
            }
        }
    });
    return EventDetailsView;
});

define('views/enlarge_vfs_view',[
    'foobunny',
    'app',
    'hammer',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, app, Hammer, EventHelper, gc, globals) {
    'use strict';

    var EnlargeVfsView = Foobunny.BaseView.extend({
        initialize: function() {
            console.log('--EnlargeVfsView--  in initialize()');
            //this.vfsUrl = '//cache11.stubhubstatic.com/sectionviews/venues/{{nodeId}}/config/{{configId}}/500x271/{{sectionId}}.jpg';

            this.subscribeEvent('eventmodel:dataready', this.prepareVfsUrl);
            this.subscribeEvent('enlargevfs:show', this.showEnlargeVfs);
            this.subscribeEvent('enlargevfs:hide', this.hideEnlargeVfs);
            this.subscribeEvent('enlargevfs:switchVfs', this.swapWithEnlargeVfs);
        },

        afterRender: function() {
            Hammer(this.el);
            this.$smallVfs = $('#small-vfs');
            this.$tooltip = $('#seatmap-tooltip');
        },

        el: '#large-vfs',

        template: gc.appFolder + '/enlarge_vfs',

        events: {
            'hold .image' : 'hold',
            'release .image' : 'release',
            'tap .seatmap-overlay' : 'swapWithEnlargeVfs'
        },

        prepareVfsUrl: function(dataModel) {
           globals.vfs_url = globals.vfs_url.replace('{{nodeId}}', dataModel.get('venue').id).replace('{{configId}}', dataModel.get('venue').configurationId);
        },

        hold: function() {
            this.publishEvent('seatmap:hold');
        },

        release: function() {
            this.publishEvent('seatmap:release');
        },

        showEnlargeVfs: function(sid) {
            var vfsImg = new Image(),
                self = this;

            this.$smallVfs.addClass('hide');
            vfsImg.src = EventHelper.getVfsUrl(sid, 'medium');
            vfsImg.onload = function() {
                self.$el.find('.image ')[0].style.backgroundImage = 'url(' + this.src + ')';
                self.$el.removeClass('hide').removeClass('vfs-small');
                self.publishEvent('seatmap:hide');
                self.$tooltip.addClass('hide');
            };
            vfsImg.onerror = function() {
                self.hideEnlargeVfs();
                // Log the vfs failure.
                EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
            };
            vfsImg = null;
        },

        hideEnlargeVfs: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            // Hide this only if it is not visible. If we publish the seatmap:show when
            // the seat map is already visible the size of the map is changed based on
            // the handler of the seatmap:show event.
            if (!this.$el.hasClass('hide')) {
                this.$el.addClass('hide');
                this.publishEvent('seatmap:show');
            }
            this.$smallVfs.addClass('hide');
        },

        swapWithEnlargeVfs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (this.$el.hasClass('hide')) {
                this.$smallVfs.addClass('hide');
                this.$el.removeClass('hide');
                this.publishEvent('seatmap:hide');
                this.$tooltip.addClass('hide');
                EventHelper.track({pageView: 'Blueprint', appInteraction: 'Map2VFS', pageload: false});
            } else {
                this.$smallVfs.empty();
                this.$el.children('.image').clone().appendTo('#small-vfs');
                this.$el.addClass('hide');
                this.$smallVfs.removeClass('hide');
                this.publishEvent('seatmap:show');
                this.$tooltip.removeClass('hide');
                EventHelper.track({pageView:'Blueprint', appInteraction: 'VFS2Map', pageload: false});
            }
        },

        showVfsImage: function(evt) {
           this.removeClass('hidden');
        }

    });
    return EnlargeVfsView;
});

/* global _ */
define('views/seatmap_view',[
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

/*global _ */
define('views/seatmap_tooltip_view',[
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

define('models/singlelisting_model',[
    'foobunny',
    'global_context',
    'globals',
    'helpers/event_helper',
    'helpers/delivery_helper'
], function(Foobunny, gc, globals, EventHelper, DeliveryHelper) {
    'use strict';

    var SingleListingModel = Foobunny.BaseModel.extend({
        initialize: function(singleListingId) {
            this.urlHeaders = gc.url_headers || {};

            this.url = '/shape/inventory/listings/v2/' + singleListingId;

            this.on('change:qty change:usePrice', this.updateTotalCost);
        },

        defaults: {
            'singleTicketError': false // to display Error Message
        },

        // Overwriting the base class fetchFail since we want to reset the
        // gc.ticket_id to null.
        fetchFail: function(error) {
            var logdata;
            gc.ticket_id = null;
            Foobunny.BaseModel.prototype.fetchFail.apply(this, arguments);

            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        validate: function(attrs, options) {
            var validateMessage;
            // Throw an error if the event id in the URL does not match the event id returned
            // by the API. The single ticket listing does not have event id as an input
            // parameter.
            if (Number(attrs.eventId) !== Number(gc.event_id)) {
                validateMessage = 'Event id does not match listing';
            }

            // If the validateMessage is not null then it means that we have an error
            // and hence we have to clear the gc.ticket_id.
            if (!!validateMessage) {
                gc.ticket_id = null;
            }

            return validateMessage;
        },

        isQtyAvailableOnThisTicket: function(qty) {
            return this.fetched && this.get('splitVector').indexOf(qty) >= 0;
        },

        // In Single Ticket GA we are showing the drop down irrespective of whether the
        // ticket has vector splits or not. Hence, we need to convert non vector into
        // vector splits.
        convertIntoVector: function() {
            if (this.get('splitOption') === 'MULTIPLES') {
                var splitVector = this.get('splitVector').map(Number);
                this.set('splitVector', splitVector);
            }
        },

        updateTotalCost: function() {
            this.set('totalCost', (this.get('usePrice').amount * this.get('qty')).toFixed(2));
        },

        parse: function(result) {

            var listing = result,
                featureType,
                deliveryMethods,
                currentDate,
                nextDate,
                ticketRow = '',
                iconFeature = [],
                disclosures = [],
                seats = [],
                deliveryIds = [17, 22],
                withFees = globals.PDO.withFees,
                deliveryMethodList = {};

            listing.usePrice = (withFees ? listing.buyerSeesPerProduct : listing.pricePerProduct);

            // Create split vector array from response string
            if (listing.splitOption !== 'NONE') {
                // Convert split vector from string to array of integers
                listing.splitVector = listing.splitVector.split(',').map(Number);
                listing.qty = listing.splitVector[0];
            } else {
                // listing.qty = Number(listing.splitVector);
                listing.qty = listing.quantity;
            }
            listing.totalCost = listing.qty * listing.usePrice.amount;

            // Add single ticket section to globals for parsing in ticketlist_view
            globals.singleTicketSection = listing.venueConfigSectionId;

            listing.listingId = listing.id;
            listing.sectionName = listing.scrubbedSectionName;
            listing.sectionId = listing.venueConfigSectionId;
            listing.singleTicket = true;

            for (var index = 0; index < listing.products.length; index++) {
                if (listing.products[index].productType !== 'PARKING_PASS') {
                    ticketRow = listing.products[index].row;

                    if (typeof(listing.products[index].seat) === 'undefined') {
                        listing.products[index].seat = 'General Admission';
                        seats.push(listing.products[index].seat);
                        break;
                    }
                    seats.push(listing.products[index].seat);
                }
            }

            listing.seatNumbersArray = seats;

            listing.seatNumbers = listing.seatNumbersArray.join(', ');

            listing.seatNumberFirst = listing.seatNumbersArray[0];

            listing.seatNumberLast = listing.seatNumbersArray[listing.seatNumbersArray.length - 1];


            deliveryMethods = listing.deliveryMethods;

            if (listing.deliveryMethods && listing.deliveryMethods.length > 0) {
                // For UPS delivery, choose the delivery type closer to the event date except
                // id = 17 for Pickup
                // 22 for UPS worldwide
                for (index = 0; index < listing.deliveryMethods.length; index++) {
                    if (deliveryMethods[index].id && _.indexOf(deliveryIds, deliveryMethods[index].id) === -1) {
                        if (!listing.deliveryDate) {
                            listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                        } else {
                            currentDate = new Date(listing.deliveryDate).getTime();
                            nextDate = new Date(deliveryMethods[index].estimatedDeliveryTime).getTime();

                            if (nextDate > currentDate) {
                                listing.deliveryDate = deliveryMethods[index].estimatedDeliveryTime;
                            }
                        }
                    }
                }

                // create delivery id, name mapping
                _.each(listing.deliveryMethods, function(deliveryMethod) {
                    var name = DeliveryHelper.getDeliveryMethodName(deliveryMethod.id, deliveryMethod.name);
                    deliveryMethodList[deliveryMethod.id] = name;
                });

                listing.deliveryTypeList = listing.deliveryMethods.map(function(deliveryMethod) {
                    var name = DeliveryHelper.getDeliveryMethodName(deliveryMethod.id, deliveryMethod.name);

                    return {
                        id: deliveryMethod.id, // TODO  let the API to return deliveryTypeId
                        deliveryAttribute: name
                    };
                });
            }

            // Convert the deliveryMethods to deliveryTypeList making it easy on the templates.
            if (listing.ticketTraits) {
                listing.listingAttributeList = listing.ticketTraits.map(function(listingAttribute) {

                    featureType = EventHelper.checkFeatureType(Number(listingAttribute.id));

                    if (listingAttribute.id === '501') {
                        for (var index = 0; index < listing.products.length; index++) {
                            if (listing.products[index].productType !== 'PARKING_PASS') {
                                if (listing.products[index].row !== listing.products[index + 1].row) {
                                    ticketRow = listing.products[index].row + ', ' + listing.products[index + 1].row;
                                    break;
                                }
                            }
                        }
                    }

                    return {
                        id: listingAttribute.id,
                        listingAttribute: listingAttribute.name,
                        featureIcon: featureType.featureIcon,
                        valueType: featureType.valueType
                    };
                });

                //add the count of categorized and un-categorized ticket feature types to make it easier on dust
                listing.iconCounts = _.countBy(listing.listingAttributeList, function(attribute) {
                    if (!attribute) {
                        return;
                    }
                    return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
                });

                // re-arrange listingAttribute to display in BYO page
                for (index = 0; index < listing.listingAttributeList.length; index++) {
                    if (listing.listingAttributeList[index].featureIcon) {
                        if (listing.listingAttributeList[index].featureIcon === 'none') {
                            if (disclosures.length < 1) {
                                listing.listingAttributeList[index].displayAlertIcon = true;
                            }
                            disclosures.push(listing.listingAttributeList[index]);
                        } else {
                            iconFeature.push(listing.listingAttributeList[index]);
                        }
                    }
                }

                listing.features = iconFeature.concat(disclosures);
            }

            if (listing.seatNumbers) {
                listing.seats = [{
                    'ticketSeatId': null,
                    'listingId': listing.id,
                    'row': ticketRow,
                    'seatNumber': listing.seatNumbers,
                    'seatNumbersArray': listing.seatNumbersArray,
                    'seatNumberFirst': listing.seatNumberFirst,
                    'seatNumberLast': listing.seatNumberLast
                }];
            } else {
                listing.seats = [{
                    'ticketSeatId': null,
                    'listingId': listing.id,
                    'row': ticketRow,
                    'seatNumber': null,
                    'seatNumbersArray': null,
                    'seatNumberFirst': null,
                    'seatNumberLast': null
                }];
            }

            // Work around for setting the bucket.
            if (gc.tktbkt) {
                listing.valueBucket = gc.tktbkt;
            }

            if (listing.businessGUID) {
                listing.businessGuid = listing.businessGUID;
            }

            return listing;
        }
    });
    return SingleListingModel;
});

/* global _ */
define('models/buyer_cost_model',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var BuyerCostModel = Foobunny.BaseModel.extend({
        initialize: function() {
            console.log('--BuyerCostModel-- initilize');
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
        },

        url: function() {
            return '/shape/pricing/aip/v1/buyercost';
        }
    });
    return BuyerCostModel;
});

/* global _ */
define('collections/listingcontroller_collection',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var ListingControllerCollection = Foobunny.BaseModel.extend({
        url: '/shape/inventory/listingcontroller/v2/?action=lookup',
        method: 'POST',
        data: {
            listings: []
        },

        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
        },

        setListings: function(listings) {
            this.addListingToRequest(listings);
        },

        addListingToRequest: function(listings) {
            var thisListing,
                requestListings = [];

            for (var i = 0; i < listings.length; i++) {
                thisListing = listings[i];
                if (thisListing.quantity) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'quantity': thisListing.quantity
                    });
                } else if (thisListing.ticketSeatId) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'productId': thisListing.ticketSeatId
                    });
                }
            }
            this.data.listings = requestListings;
        }
    });

    return ListingControllerCollection;

});

/* global _ */
define('models/buyerpays_model',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {
    'use strict';

    var BuyerPaysModel = Foobunny.BaseModel.extend({
        url: '/shape/pricing/aip/v1/buyerpays',
        method: 'POST',
        data: {
            buyerPaysRequest: {
                listings: []
            }
        },

        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            });
        },

        setListings: function(listings) {
            this.addListingToRequest(listings);
        },

        addListingToRequest: function(listings) {
            var thisListing,
                requestListings = [];

            for (var i = 0; i < listings.length; i++) {
                thisListing = listings[i];
                if (thisListing.quantity) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'quantity': thisListing.quantity
                    });
                } else if (thisListing.ticketSeatId) {
                    requestListings.push({
                        'listingId': thisListing.listingId,
                        'itemId': thisListing.ticketSeatId
                    });
                }
            }
            this.data.buyerPaysRequest.listings = requestListings;
        }
    });

    return BuyerPaysModel;

});

/* global _ */
define('models/singlelisting_batch_model',[
    'foobunny',
    'globals',
    'global_context',
    'common-batchModel',
    'collections/listingcontroller_collection',
    'models/buyerpays_model',
    'helpers/event_helper',
    'i18n'
], function(Foobunny, globals, gc, BatchModel, ListingCollection, BuyerPaysModel, EventHelper, i18n) {
    'use strict';

    /*
        06/17/2016: Single ticket view is using the listings/v1 data structure to render.
        The inventory/listings/v2 data structure is different from inventory/listings/v1.
        Hence, we are going to have to re-structure the data to match what is being returned by the
        inventory/listings/v1 so that we can render the single ticket view.

        Note: The inventory/listings/v2 is missing certain pieces of information. Hence, we cannot
        move to inventory/listings/v2 just yet. Also, moving to inventory/listings/v2 would mean that
        we should get the data structure from the search inventory also aligned. It is not a simple
        change to move from search/inventory/v2 and inventory/listings/v1 combination to
        search/inventory/v2/listings and inventory/listings/v2 combination. It will require a significant
        amount of effort.

        Solution: Introduction of the ListingModel. This model will be an interface between the various
        APIs and the views. All the data that is required by the views/templates should come *ONLY* from
        this model and nowhere else. This solution requires some thought and a lot of work.
    */

    var SingleListingBatchModel = BatchModel.extend({
        initialize: function(params, options) {

            options = options || {};
            params = params || {};

            this.collections = {
                listings: new ListingCollection()
            };

            this.models = {
                buyerPays: new BuyerPaysModel()
            };

            BatchModel.prototype.initialize.apply(this, arguments, options);
        },

        fetch: function(listings, options) {
            this.urlHeaders = _.extend(this.urlHeaders, gc.url_headers || {}, {
                Timeout: 15000
            });

            // Set whether the blended logic was applied or not.
            this.setSilent('blendedApplied', listings[0].ticketSeatId ? true : false);

            this.collections.listings.setListings(listings);
            this.models.buyerPays.setListings(listings);

            return BatchModel.prototype.fetch.call(this, options);
        },

        setListings: function(listings) {
            this.collections.listings.setListings(listings);
            this.models.buyerPays.setListings(listings);
        },

        checkApiErrors: function(responses) {
            var thisResponse,
                errorObject = {
                    error: false
                };

            for (var i = 0; i < responses.length; i++) {
                thisResponse = responses[i];
                if (thisResponse.batchRequestId) {
                    if (thisResponse.batchRequestId === '-1' || thisResponse.status !== '200') {
                        EventHelper.logAppState('fetch', null, {
                            'apiName': thisResponse.batchRequestId,
                            'apiStatus': thisResponse.status,
                            'apiResponse': thisResponse.body
                        });
                        errorObject.error = true;
                        errorObject.status = thisResponse.status;
                        errorObject.statusText = thisResponse.body;
                        break;
                    }
                }
            }

            return errorObject;
        },

        collateSingleListing: function() {
            var listing = {},
                listings,
                buyerPays;

            // Get the Listings Information from the listings collection.
            listings = this.collections.listings.get('listings');
            buyerPays = this.models.buyerPays.get('buyerPaysResponse');

            listing = _.extend(listing, {}, this.getListingDetails(listings));
            listing = _.extend(listing, {}, this.getListingPrice(listing.quantity, buyerPays));

            listing.singleTicket = true;
            listing.usePrice = (globals.PDO.withFees ? listing.displayPricePerTicket : listing.currentPrice);
            listing.totalCost = listing.qty * listing.usePrice.amount;
            listing.deliveryTypeList = listing.deliveryMethods;

            listing.listingAttributeList = this.getListingsAttributeList(listings);

            //add the count of categorized and un-categorized ticket feature types to make it easier on dust
            listing.iconCounts = _.countBy(listing.listingAttributeList, function(attribute) {
                if (!attribute) {
                    return;
                }
                return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
            });
            // Work around for setting the bucket.
            if (gc.tktbkt) {
                listing.valueBucket = gc.tktbkt;
            }

            return listing;
        },

        getListingDetails: function(listings) {
            // NOTE: The zone id is not available from the listing controller api.
            // Altnerative solution might be to update the ticket details to find out
            // the zone id if it is not available (?)

            var listingObj = listings[0],
                seats = this.getSeats(listings),
                seatNumbersArray = (this.get('blendedApplied') ? _.map(seats, function(element) {
                        return element.seat;
                    }) : listingObj.seats.split(',')),
                qty = this.getTotalQuantity(listings),
                returnObj = {
                    listingId: listingObj.listingId,
                    eventId: listingObj.event.eventId,
                    eventName: listingObj.event.name,
                    currencyCode: listingObj.pricePerProduct.currency,
                    totalTickets: qty,
                    sectionId: listingObj.venueConfigSectionsId,
                    sectionName: listingObj.scrubbedSectionName || listingObj.products[0].section,
                    row: listingObj.products[0].row,
                    quantity: qty,
                    qty: qty,
                    seatNumbers: seatNumbersArray.join(', '),
                    seatNumbersArray: seatNumbersArray,
                    seatNumberFirst: seatNumbersArray[0],
                    seatNumberLast: seatNumbersArray[seatNumbersArray.length - 1],
                    seats: seats,
                    splitVector: (this.get('blendedApplied') ? [qty] : listings[0].splitVector.split(',')),
                    // Deliverymethod is being hard code because the phase 1 of the blended for 76ers is only going to be instant download.
                    deliveryMethods: [{
                        id: 2,
                        name: i18n.get('event.common.deliveryType.2'),
                        deliveryAttribute: i18n.get('event.common.deliveryType.2')
                    }]
                };

            return returnObj;
        },

        getListingPrice: function(quantity, priceObj) {
            var totalPrices = priceObj.totalPrices,
                returnObj = {};

            // For Blended we are going to show the average price per ticket.
            // Since the API does not provide it we have to calculate it.
            for (var i = 0; i < totalPrices.length; i++) {
                if (totalPrices[i].categoryId === 1) {
                    returnObj.displayPricePerTicket = totalPrices[i].cost;
                } else if (totalPrices[i].categoryId === 8) {
                    returnObj.currentPrice = totalPrices[i].cost;
                }
            }

            returnObj.displayPricePerTicket.amount = (parseFloat(returnObj.displayPricePerTicket.amount) / quantity).toFixed(2);

            return returnObj;
        },

        getListingsAttributeList: function(listings) {
            var seatTraits = {},
                listingTraits,
                thisTrait,
                featureType;

            for (var i = 0; i < listings.length; i++) {
                if (!listings[i].traits) {
                    continue;
                }
                listingTraits = listings[i].traits;

                for (var j = 0; j < listingTraits.length; j++) {
                    thisTrait = listingTraits[j];

                    // Convert string to number.
                    thisTrait.id = Number(thisTrait.id);
                    if (seatTraits[thisTrait.id]) {
                        continue;
                    }
                    seatTraits[thisTrait.id] = thisTrait;
                }
            }

            seatTraits = _.map(seatTraits, function(thisTrait, key) {
                featureType = EventHelper.checkFeatureType(thisTrait.id);

                return {
                    id: thisTrait.id,
                    listingAttribute: thisTrait.name,
                    featureIcon: featureType.featureIcon,
                    valueType: featureType.valueType
                };
            });

            return seatTraits;
        },

        getSeats: function(listings) {
            var seats = [],
                seat1,
                seat2;

            for (var i = 0; i < listings.length; i++) {
                for (var j = 0; j < listings[i].products.length; j++) {
                    listings[i].products[j].listingId = listings[i].listingId;
                    listings[i].products[j].ticketSeatId = listings[i].products[j].productId;
                    listings[i].products[j].seatNumber = listings[i].products[j].seat;
                }
                seats = seats.concat(listings[i].products);
            }

            return seats.sort(function(a, b) {
                seat1 = Number(a.seat);
                seat2 = Number(b.seat);
                if (seat1 < seat2) { return -1; }
                if (seat1 > seat2) { return 1; }
            });
        },

        getTotalQuantity: function(listings) {
            var qty = 0;

            for (var i = 0; i < listings.length; i++) {
                qty += listings[i].products.length;
            }

            return qty;
        }
    });

    return SingleListingBatchModel;

});

/* global _ */
define('views/ticketdetails_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'helpers/cart_helper',
    'models/buyer_cost_model',
    'global_context',
    'globals',
    'i18n',
    'sh_currency_format'
], function(Foobunny, Hammer, EventHelper, CartHelper, BuyerCostModel, gc, globals, i18n, currencyFormatUtil) {
    'use strict';

    var TicketdetailsView = Foobunny.BaseView.extend({

        initialize: function(options) {
            console.log('--TicketdetailsView--  in initialize()', this);

            // bind all handlers to the view
            _.bindAll(this, 'openTicketDetails', 'displayQuantitySelector', 'processCheckout');

            this.isSplitAvailable = (this.model.get('splitVector').length > 1) ? 1 : 0;
            this.model.set('isSplitAvailable', this.isSplitAvailable);
            this.subModels = {
                BuyerCostModel: new BuyerCostModel()
            };

            if (this.model.get('isSplitAvailable') === 0) {
                options.model.set('qty', this.model.get('splitVector')[0]);
            } else {
                options.qty = options.qty || 0;
                options.model.set('qty', options.qty);
            }

            options.model.set('totalCost', (options.model.get('usePrice').amount * options.model.get('qty')).toFixed(2));

            // check the ticket's section name if starts with 'Zone' - assume zone ticket, do not show tooltip then
            this.isZoneTicket = (this.model.get('sectionName').indexOf('Zone') === 0) ? true : false;

            this.subscribeEvent('ticketdetails:hideSideVfs', this.hideSideVfs);
            this.subscribeEvent('ticketdetails:showSideVfs', this.showSideVfs);
        },

        afterRender: function() {
            Hammer(this.el);

            var qty = this.model.get('qty');

            this.uiEl.$ticketItem.attr('data-qty', qty);

            if (qty > 0) {
                this.updateBuyButton((qty * this.model.get('usePrice').amount).toFixed(2));
                this.updatePriceInfo((qty * this.model.get('usePrice').amount).toFixed(2));

                this.showSeatNumbers(qty);
            }

            // Cache frequently used variables
            this.$ticketlist = $('#ticketlist');
            this.$tickets = this.$ticketlist.find('#tickets');
            this.$sideVfs = this.$el.find('.side-vfs');

            this.uiEl.$valuebarImage.addClass('valuebar' + this.model.get('valueBucket'));
        },

        template: gc.appFolder + '/ticketdetails',

        className: 'ticket-item-wrapper',

        events: {
            'tap .ticket-item .ticket-container' : 'openTicketDetails',
            'tap .ticket-item .ticket-details-container' : 'openTicketDetails',
            'tap .ticket-item .quantity' : 'qtyProp',
            'change .quantity' : 'displayQuantitySelector',
            'tap .checkout button' : 'processCheckout',
            'tap .sellerInfo' : 'viewUserInfo',
            'mouseenter .ticket-item' : 'listingHighlighted',
            'mouseleave .ticket-item' : 'removeListingHighlight',
            'tap .side-vfs' : 'enlargeSideVfs',
            'mouseenter .valuebarimage': 'displayValueBarTooltip',
            'mouseleave .valuebarimage': 'hideValueBarTooltip',
            'tap .valuecell': 'displayModalValueBarTooltip',
            'tap .ticket-container .tooltip': 'animateTooltipDown',
            'focusout .ticket-container .tooltip': 'animateTooltipUp'
        },

        uiEl: {
            '$ticketItem': '.ticket-item',
            '$ticketItemError': '.ticket-item-error',
            '$valuebarImage': '.valuebarimage',
            '$seatInfo': '.seatInfo',
            '$tooltipInfo': '.tooltip-seatinfo',
            '$seatInfoText': '.seatInfoText',
            '$infoIcon': '.infoIcon',
            '$detailsContainer': '.detailsContainer',
            '$singleTicket' : '#single-ticket',
            '$spinner': '.spinner'
        },

        animateTooltipDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (EventHelper.isDesktop()) {
                return;
            }

            var winTop = 20,
                $toolTip = $(evt.currentTarget),
                $ticketItem = $toolTip.closest('.ticket-item');

            if ($ticketItem.position().top <= winTop) {
                $toolTip.addClass('tooltip-bottom').removeClass('tooltip-top');
            }
        },

        animateTooltipUp: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (EventHelper.isDesktop()) {
                return;
            }

            var $toolTip = $(evt.currentTarget);

            $toolTip.addClass('tooltip-top').removeClass('tooltip-bottom');
        },

        qtyProp: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        },

        timer: false,

        openTicketDetails: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (this.timer) {
                return;
            }

            var self = this,
                addPromise;

            if (gc.isAddParking) {
                EventHelper.parkingPassRedirectToBYO('park_id=' + this.model.get('listingId') + '&park_qty=' + this.model.get('qty'));
                return; // prevent further processing
            }

            // If the cart is enabled then make the cart api call to add this listing to the cart.
            if (EventHelper.useCart()) {
                EventHelper.removeUrlParams(['ticket_id', 'ticketRank']);
                addPromise = this.addToCart();
                addPromise.done(function() {
                    self.processOpenTicket(evt);
                });
            } else {
                this.processOpenTicket(evt);
            }
        },

        addToCart: function() {
            var self = this,
                addPromise;

            this.$el.addClass('adding-to-cart');
            this.uiEl.$spinner.removeClass('hide');

            if (this.model.get('listingInCart') && CartHelper.getCartId()) {
                addPromise = Foobunny.utils.resolvedPromise();
                self.uiEl.$spinner.addClass('hide');
                self.$el.removeClass('adding-to-cart');
            } else {
                addPromise = CartHelper.addToCart(this.model);
                addPromise.fail(function() {
                    self.uiEl.$ticketItemError.removeClass('hide');
                    self.$el.animate({'height': '100%'}, 4000).slideUp(1000, function() {
                        // If the single ticket view is visible then close the view and then
                        // show all the tickets.
                        if (self.model.get('singleTicket')) {
                            self.publishEvent('singleticket:error');
                        }

                        // Disposing off the model and view.
                        self.dispose();
                        self.$el.remove();
                    });
                }).always(function() {
                    self.uiEl.$spinner.addClass('hide');
                    self.$el.removeClass('adding-to-cart');
                });
            }

            return addPromise;
        },

        processOpenTicket: function(evt) {
            var currTgt = $(evt.currentTarget).parent(),
                sectionId = currTgt.attr('data-sid'),
                ticketId = currTgt.attr('data-tid'),
                self = this,
                qty = this.model.get('qty'),
                showBYO = EventHelper.determineBYO({
                    listingAttributeList: this.model.get('listingAttributeList'),
                    deliveryTypeList: this.model.get('deliveryTypeList')
                });

            if (showBYO) {
                // Add to the cart
                this.publishEvent('buildyourorder:listing', this.model);
                return;
            }

            if (!EventHelper.isDesktop()) {
                if ($(evt.target)[0] === this.uiEl.$infoIcon[0]) {
                    if (this.uiEl.$seatInfoText.hasClass('hide')) {
                        this.uiEl.$seatInfoText.removeClass('hide');
                    } else {
                        this.uiEl.$seatInfoText.addClass('hide');
                    }
                    return;
                } else {
                    this.uiEl.$seatInfoText.addClass('hide');
                }
            }

            // and hide the side vfs image
            this.hideSideVfs();

            this.hideValueBarTooltip();

            // hide other open containers if open
            var $ticketContainerOpen = this.$tickets.find('.container-open');
            if ($ticketContainerOpen && ticketId !== $ticketContainerOpen.attr('data-tid')) {
                $ticketContainerOpen.removeClass('container-open').find('.ticket-details-container, .single-ticket-vfs').slideUp(400);
                $ticketContainerOpen.parent().removeClass('ticket-item-wrapper-open');
                if (EventHelper.showBuyerCost() && qty > 0) {
                    this.getBuyerCost(qty, function(buyerCostResponse) {
                        self.$el.find('.totalcost-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(buyerCostResponse.totalCost.amount));
                        self.$el.find('.serviceFee-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(buyerCostResponse.totalBuyFee.amount));
                    });
                }
                if (this.model.get('singleTicket')) {
                    globals.ticketIdActive = false;
                }

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Viewed Ticket Details', pageload: false, filterType: 'ListingId Selected: ' + ticketId + '; Ticket Rank: ' + self.model.get('ticketRank'), userExperienceSnapshot: {ticketId: 'ListingId: ' + ticketId, ticketRank: 'Ticket Rank: ' + self.model.get('ticketRank')}});
            }

            // also remove the first div highlighted since the focus is now on this selected listing
            this.$tickets.find('.highlight').removeClass('highlight');

            // open the ticketlisting now clicked
            if (currTgt.hasClass('container-open')) {
                currTgt.removeClass('container-open').find('.ticket-details-container, .single-ticket-vfs').slideUp(400);
                currTgt.parent().removeClass('ticket-item-wrapper-open');

                this.showVfs(currTgt, sectionId);

                if (EventHelper.isDesktop()) {
                    this.highlightCurrentListing(currTgt);
                } else {
                    this.publishEvent('ticketlist:highlightFirstTicketDiv');
                }

                if (!gc.ticket_id || !$('#single-ticket').is(':visible')) {
                    EventHelper.removeUrlParams(['ticket_id', 'ticketRank', 'tktbkt']);
                }
            } else {
                $.when(currTgt.addClass('container-open').find('.ticket-details-container, .single-ticket-vfs').slideDown(400)).then(function() {
                    currTgt.parent().addClass('ticket-item-wrapper-open');
                    if (gc.ticket_id) {
                        self.publishEvent('ticketlist:resize');
                    }

                    if (currTgt.hasClass('container-open')) {
                        if (self.model.get('singleTicket')) {
                            globals.ticketIdActive = true;
                        }
                        // Pass the element offset bottom to scrollToView
                        self.publishEvent('ticketlist:scrollToView', currTgt);
                    }
                });

                this.showVfs(currTgt, sectionId);

                this.publishEvent('ticketdetails:highlighted', sectionId, this.$el.find('.amount-value').text(), this.isZoneTicket);

                if (!EventHelper.useCart()) {
                    EventHelper.setUrlParams([
                        {
                            name: 'ticket_id',
                            value: ticketId
                        },
                        {
                            name: 'ticketRank',
                            value: this.model.get('ticketRank')
                        }
                    ]);

                    if (this.model.get('valueBucket')) {
                        EventHelper.setUrlParam('tktbkt', this.model.get('valueBucket'));
                    }
                }

                if (!gc.ticket_id) {
                    EventHelper.setUrlParam('cb', '1');
                }
            }

            this.timer = true;
            setTimeout(function() {
                self.timer = false;
            }, 300);
        },

        getBuyerCost: function(qty, successCallBack, errorCallBack) {
            var buyerCostResponse,
                buyercost = {
                    'buyerCostRequest': {
                        'listingId': this.model.get('listingId'),
                        'quantity': qty,
                        'deliveryMethodId' : this.model.get('deliveryMethodList') && this.model.get('deliveryMethodList').length > 0 ? this.model.get('deliveryMethodList')[0] : this.model.get('deliveryMethods')[0].id
                    }
                };
            this.subModels.BuyerCostModel.fetch({
                data: JSON.stringify(buyercost),
                type: 'POST'
            }).done(function(data) {
                buyerCostResponse = data.buyerCostResponse;
                if (successCallBack) {
                    successCallBack(buyerCostResponse);
                }
            }).fail(function(error) {
                if (errorCallBack) {
                    errorCallBack();
                }
                EventHelper.logAppState('getBuyerCost', error);
            });

            return buyerCostResponse;
        },

        // The hover functionality is only available in desktop mode.
        listingHighlighted: function(evt) {
            if (!EventHelper.isDesktop()) {
                return;
            }

            evt.stopPropagation();
            evt.preventDefault();

            this.highlightCurrentListing($(evt.currentTarget));

            if (! $(evt.currentTarget).hasClass('container-open')) {
                // Hide other VFS before showing this one.
                this.$tickets.find('.side-vfs').addClass('hide');

                this.showSideVfs($(evt.currentTarget).attr('data-tid'), $(evt.currentTarget).attr('data-sid'));
            }
        },

        highlightCurrentListing: function(listing) {
            var sectionId, price,
                winTop = 20,
                $toolTips = this.uiEl.$ticketItem.find('.sh-iconset');

            // Remove the highlight from other tickets.
            this.$tickets.find('.highlight').removeClass('highlight');
            // Highlight the current listing.
            this.$el.addClass('highlight');

            sectionId = listing.attr('data-sid');
            price = listing.find('.amount-value').text();

            this.publishEvent('ticketdetails:highlighted', sectionId, price, this.isZoneTicket);

            if ($toolTips.length > 0) {
                if (this.uiEl.$ticketItem.position().top <= winTop) {
                    this.uiEl.$ticketItem.find('.tooltip').addClass('tooltip-bottom').removeClass('tooltip-top');
                }
            }
        },

        removeListingHighlight: function(evt) {
            var $currentTgt;

            evt.stopPropagation();
            evt.preventDefault();

            if (!EventHelper.isDesktop()) {
                return;
            }

            $currentTgt = $(evt.currentTarget);

            // If the ticket view is open don't remove the highlight from the ticket or map.
            if ($currentTgt.hasClass('container-open')) {
                return;
            }

            this.$el.removeClass('highlight');
            this.uiEl.$ticketItem.find('.tooltip').addClass('tooltip-top').removeClass('tooltip-bottom');
            this.publishEvent('ticketdetails:dehighlighted');
            this.hideSideVfs();
        },

        showVfs: function(currTgt, sectionId) {
            var self = this, altText = '', sectionName, rowName;

            if (!globals.vfs_available || !sectionId) {
                return;
            }

            // create altText
            try {
                altText = globals.event_meta.venue.name;
                if ((sectionName = currTgt.find('.ticket-sectionname').text()) !== '') {
                    altText += ', ' + sectionName;
                }
                if ((rowName = currTgt.find('.ticket-rowinfo').text()) !== '') {
                    altText += ', ' + rowName;
                }
            } catch (err) {
                console.log('Could not create altText', err);
            }

            // show vfs
            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                if (currTgt.hasClass('container-open')) {
                    this.publishEvent('enlargevfs:show', sectionId);
                } else {
                    this.publishEvent('enlargevfs:hide');
                }
            } else {
                var vfsImg = new Image(),
                    vfsTicketImg = this.$el.find('.single-ticket-vfs');

                // Fetch the VFS only if the ticket is now open.
                if (this.uiEl.$ticketItem.hasClass('container-open') &&
                    $(vfsTicketImg).html() === '') {
                    vfsImg.src = EventHelper.getVfsUrl(sectionId, 'medium');
                    vfsImg.alt = altText;
                    vfsImg.title = altText;

                    vfsImg.onload = function() {
                        vfsTicketImg.html('').append(this);
                        vfsTicketImg.fadeIn(1000).removeClass('hidden');

                        // Need this to avoid a jank when image is loaded, runs smoothly.
                        self.publishEvent('ticketlist:scrollToView', currTgt);
                    };
                    vfsImg.onerror = function() {
                        vfsTicketImg.addClass('hidden');

                        // Log the vfs failure.
                        EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
                    };
                }
                vfsImg = null;
            }
        },

        displayQuantitySelector: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var currTgt = $(evt.currentTarget),
                qty = evt.target.value,
                $qtyButton = this.$el.find('button'),
                $priceCellBottom = this.$el.find('.pricecellbottom'),
                parent = currTgt.parents('.ticket-item'),
                price = parent.attr('data-price'),
                amount = qty * price,
                defaultPrice = amount.toFixed(2),
                self = this;
            parent.attr('data-qty', parseInt(qty));

            // Update the model with the qty selected.
            this.model.set('qty', qty);
            // console.log(parent, price, checkoutButton, evt.target.value, price);

            // update quantity value
            $qtyButton.addClass('applyQuantity active');
            $qtyButton.find('.qtyText').text(qty);
            if (EventHelper.showBuyerCost() && qty > 0) {
                this.getBuyerCost(qty, function(buyerCostResponse) {
                    self.updatePriceInfo(buyerCostResponse.totalCost.amount);
                    self.$el.find('.serviceFee-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(buyerCostResponse.totalBuyFee.amount));
                },function() {
                    self.updatePriceInfo(defaultPrice);
                });
            } else {
                this.updatePriceInfo(defaultPrice);
            }
            $priceCellBottom.removeClass('hidden');

            this.showSeatNumbers(evt.target.value);

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Selected Quantity', pageload: false, filterType: 'Selected QuantityL: ' + qty});
        },

        showSeatNumbers: function(qtySelected) {
            var seatTextString = '',
                seatNumberString = '',
                infoTextString = '',
                seatNumberObj = '',
                seatNumbers = '',
                seatNumberFirst = '',
                seatNumberLast = '';

            if (EventHelper.useListingsV2()) {
                seatNumberObj = this.model.get('seats');

                if (seatNumberObj[0].seatNumber === 'General Admission') {
                    seatNumbers = seatNumberObj[0].seatNumber;
                } else {
                    seatNumbers = (seatNumberObj.length > 1) ? seatNumberObj[0].seatNumber + ',' + seatNumberObj[seatNumberObj.length - 1].seatNumber : seatNumberObj[0].seatNumber;
                }

                seatNumberFirst = seatNumberObj[0].seatNumber;
                seatNumberLast = seatNumberObj[seatNumberObj.length - 1].seatNumber;
            } else {
                seatNumberObj = this.model.get('seats')[0];

                seatNumbers = seatNumberObj.seatNumber;
                seatNumberFirst = seatNumberObj.seatNumberFirst;
                seatNumberLast = seatNumberObj.seatNumberLast;
            }

            var isSeatNumberAvailable = (seatNumbers &&
                                        seatNumbers !== '' &&
                                        seatNumbers !== 'General Admission'),
                listingAttributeList = this.model.get('listingAttributeList') || [],
                splitVector = this.model.get('splitVector'),
                listingAttributeListLength = listingAttributeList.length;

            // Update the string to be displayed in the ticket details.
            if (qtySelected > 1) {
                seatTextString = 'event.common.ticketdetails.seats.text';
                infoTextString = i18n.get('event.common.ticketdetails.seats.info', {qty: qtySelected});

                if (isSeatNumberAvailable && seatNumbers !== 'General Admission') {
                    seatNumberString = seatNumberFirst + ' - ' + seatNumberLast;
                } else {
                    seatTextString = 'event.common.ticketdetails.seatstogether.text';
                }

                // Check if ticket has piggyback attribute
                if (listingAttributeListLength > 0) {
                    for (var attributeId = 0; attributeId < listingAttributeListLength; attributeId++) {
                        if (listingAttributeList[attributeId].id === 501) {
                            infoTextString = i18n.get('event.common.ticketdetails.seats.piggyback.info', {qty: qtySelected});
                            break;
                        }
                    }
                }
                if (!(_.isEmpty(infoTextString))) {
                    this.$el.find('.seatInfo').html(infoTextString);
                }
            } else {
                infoTextString = 'event.common.ticketdetails.seat.one';
                if (!isSeatNumberAvailable) {
                    seatTextString = 'event.common.ticketdetails.seatprintedonticket.text';
                } else {
                    seatTextString = 'event.common.ticketdetails.seat.text';
                    if (!(_.isEmpty(infoTextString))) {
                        this.$el.find('.seatInfo').html(i18n.get(infoTextString));
                    }
                    if (splitVector && splitVector.length > 1) {
                        seatNumberString = seatNumberFirst + ' - ' + seatNumberLast;
                    } else {
                        seatNumberString = seatNumberFirst;
                    }
                }
            }

            if (splitVector.length > 1) {
                if (isSeatNumberAvailable === true) {
                    this.uiEl.$tooltipInfo.removeClass('hide');
                }
            } else {
                if (isSeatNumberAvailable === true && qtySelected > 1) {
                    this.uiEl.$tooltipInfo.removeClass('hide');
                }
            }

            if (!(_.isEmpty(seatTextString))) {
                this.$el.find('.seattext').html(i18n.get(seatTextString));
            }
            if (!(_.isEmpty(seatNumberString))) {
                this.$el.find('.seatnumbers').html(seatNumberString);
            }

            // Show the seat numbers.
            this.$el.find('.ticket-qty-text').addClass('hide');
            this.$el.find('.ticket-seat-text').removeClass('hide');
        },

        updatePriceInfo: function(cost) {
            // Update the model with the total cost.
            this.model.set('totalCost', cost);

            this.$el.find('.checkout').removeClass('disabled');
            this.$el.find('.totalcost-container').removeClass('disabled');
            this.$el.find('.serviceFee-container').removeClass('disabled');
            this.$el.find('.emptytotal').addClass('hidden');
            this.$el.find('.totalcost-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(cost));
        },

        updateBuyButton: function(cost) {
            var $checkoutButton = this.$el.find('.checkout button');
            $checkoutButton.find('.totalCost').text(currencyFormatUtil.formatPrice(cost));
            $checkoutButton.find('.costInfo').removeClass('hide');
            $checkoutButton.addClass('active');
        },

        processCheckout: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var $currentTarget = $(evt.currentTarget),
                $parent = $currentTarget.parents('.ticket-item');

            if ($currentTarget.hasClass('active')) {
                this.goToCheckout();
            } else {
                $parent.find('.quantityBtn').addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $(this).removeClass('shake');
                });
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout: Inactive', pageload: false});
            }
        },

        goToCheckout: function() {
            var self = this;

            setTimeout(function() {
                self.publishEvent('url:checkout', {
                    tid: self.model.get('listingId'),
                    qty: self.model.get('qty')
                });
            }, 300);

            if (!gc.ticket_id) {
                EventHelper.setUrlParam('cb', '1');
            }
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout', pageload: false});
        },

        highlightSectionOnMap: function(sectionId) {
            var $map = $('#map');
            $map.blueprint.dehighlightSections();
            $map.blueprint.highlightSections([sectionId]);
        },

        viewUserInfo: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.publishEvent('sellerInfo:show', {
                businessGuid: this.model.get('businessGuid')
            });
        },

        context: function() {
            return {
                globals: globals,
                hasBsfFeature: EventHelper.hasBsfFeature(),
                hasFaceValueFeature: EventHelper.hasFaceValueFeature()
            };
        },

        showSideVfs: function(listingId, sectionId) {
            if (!globals.vfs_available || !sectionId || !EventHelper.isDesktop() || Number(listingId) !== this.model.get('listingId')) {
                return;
            }

            // Don't show the side-vfs if it will overlap the ticketlist boundaries
            var ticketlistTop = this.$ticketlist.offset().top,
                ticketlistBottom = ticketlistTop + this.$ticketlist.outerHeight(),
                imgTop = this.$el.offset().top,
                imgBottom = imgTop + this.$el.outerHeight(),
                imgLeft,
                self = this,
                vfsImg,
                vfsTicketImg = this.$sideVfs.find('img')[0];

            if (imgTop < ticketlistTop || imgBottom > ticketlistBottom) {
                return;
            }
            imgLeft = this.$el.offset().left - this.$sideVfs.outerWidth() - 1; // minus 1 for ticketlist border OR... minus parseInt(self.$ticketlist.css('border-left-width'))

            // If the user already hovered over this ticketdetails, the side-vfs image would
            // have already been retrieved. Therefore, all we need to do is unhide it and
            // reposition the image just in case the ticketlist was scrolled.
            if (vfsTicketImg.src) {
                this.$sideVfs.css({'top': imgTop + 'px', 'left': imgLeft + 'px'});
                this.$sideVfs.removeClass('hide');
                return;
            }

            vfsImg = new Image();
            vfsImg.onload = function() {
                // Position the side-vfs image
                self.$sideVfs.css({'top': imgTop + 'px', 'left': imgLeft + 'px'});
                vfsTicketImg.src = this.src;

                // Safe check to ensure ticket listing is still highlighted
                if (! self.$el.hasClass('highlight')) {
                    self.$sideVfs.addClass('hide');
                } else {
                    self.$sideVfs.removeClass('hide');
                }
            };
            vfsImg.onerror = function() {
                self.hideSideVfs();

                // Log the vfs failure.
                EventHelper.logAppState('VFSImage', null, {vfsImage: this.src});
            };
            vfsImg.src = EventHelper.getVfsUrl(sectionId, 'small');
        },

        hideSideVfs: function() {
            this.$sideVfs.addClass('hide');
        },

        enlargeSideVfs: function() {
            this.publishEvent('showWindowVfs', this.model.get('sectionId'));

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'VFS expanded', pageload: false});
        },

        displayValueBarTooltip: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            this.publishEvent('recotooltip:show', evt.currentTarget);
        },

        hideValueBarTooltip: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }

            this.publishEvent('recotooltip:hide');
        },

        displayModalValueBarTooltip: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            // We need to disable the "Tap" on desktops and allow only the "hover" effect.
            if (!EventHelper.isDesktop() && EventHelper.isTouchDevice()) {
                this.publishEvent('recotooltip:showmodal', $(evt.currentTarget).find('.valuebarimage'));
            } else {
                this.publishEvent('recotooltip:show', $(evt.currentTarget).find('.valuebarimage'));
            }
        }
    });

    return TicketdetailsView;

});

define('views/singleticket_view',[
    'foobunny',
    'hammer',
    'models/filter_model',
    'models/singlelisting_model',
    'models/buyer_cost_model',
    'models/singlelisting_batch_model',
    'views/ticketdetails_view',
    'helpers/event_helper',
    'helpers/cart_helper',
    'global_context',
    'globals',
    'sh_currency_format'
], function(Foobunny, Hammer, FilterModel, SingleListingModel, BuyerCostModel, SingleListingBatchModel, TicketdetailsView, EventHelper, CartHelper, gc, globals, currencyFormatUtil) {
    'use strict';

    var SingleticketView = Foobunny.BaseView.extend({

        el: '#single-ticket',

        template: gc.appFolder + '/single_ticket',

        events: {
            'tap .single-ticket-see-more ' : 'showMoreTickets',
            'tap .find-another-ticket' : 'showAllTickets'
        },

        modelEvents: {
            'change:singleTicketError': 'displayErrorMesage',

            FilterModel: {
                'change:withFees': 'updatePrice'
            }
        },

        uiEl: {
            $ticketWrapper: '.single-ticket-wrapper',
            $seeMore: '.single-ticket-see-more'
        },

        initialize: function() {
            console.log('--SingleTicketView-- in initialize', this);

            if (gc.ticket_id) {
                this.model = new SingleListingModel(gc.ticket_id);
            } else {
                this.model = new SingleListingBatchModel();
            }
            this.model.on('invalid', this.errorOnFetchedData, this);

            // Please use the following approach to adding subModels since the Global FilterModel
            // is going to be added by the framework before the code gets here.
            this.subModels.BuyerCostModel = new BuyerCostModel();

            this.subscribeEvent('singleticket:error', this.closeSingleTicketMode);
        },

        unSubscribeFilterModelEvents: function() {
            this.subModels.FilterModel.off('change:withFees', this.updatePrice);
        },

        fetchData: function() {
            var self = this,
                fetchDeferred = $.Deferred(),
                singleTicketPromise,
                listings,
                cartPromise;

            if (gc.ticket_id) {
                singleTicketPromise = this.fetchDataSingleTicket();
                singleTicketPromise.done(function() {
                    fetchDeferred.resolve();
                }).fail(function() {
                    fetchDeferred.reject();
                });
            } else {
                // Get the Cart, then fetch the listing based on the cart items.
                CartHelper.setCartId(gc.cart_id);
                cartPromise = CartHelper.getCart();
                cartPromise.done(function(response, status, xhr) {
                    // Check if the listings are valid. If not, then show error.
                    // TODO/Verify: If the TICKET in the cart is invalid then return an error.
                    // If other tickets are valid in the cart then they might be parking or other types of tickets.
                    listings = CartHelper.invalidListingsInCart(Number(gc.event_id));
                    if (listings) {
                        self.errorOnFetchedData(self.model, xhr);
                        fetchDeferred.reject();
                        return;
                    }

                    listings = CartHelper.getItemsFromCart(Number(gc.event_id));
                    if (listings.length === 0) {
                        self.errorOnFetchedData(self.model, xhr);
                        fetchDeferred.reject();
                        return;
                    }

                    self.model.setSilent({
                        multipleListing: CartHelper.multipleListingsInCart(Number(gc.event_id)),
                        listingInCart: true
                    });

                    singleTicketPromise = self.fetchDataSingleListing(listings);
                    singleTicketPromise.done(function() {
                        fetchDeferred.resolve();
                    }).fail(function() {
                        fetchDeferred.reject();
                    });
                }).fail(function(xhr, status, statusText) {
                    self.errorOnFetchedData(self.model, xhr);
                    fetchDeferred.reject();
                });
            }

            return fetchDeferred.promise();
        },

        fetchDataSingleTicket: function() {
            var self = this,
                singleTicketFetchPromise;

            singleTicketFetchPromise = this.model.fetch({validate: true});

            singleTicketFetchPromise.done(function() {
                self.model.set('multipleListing', false);
                if (!self.model.validationError) {
                    self.addSingleTicket(false);
                }
            }).fail(function(error) {
                globals.upgradeTicket.isTicketUpgraded = false;
                self.errorOnFetchedData(self.model, error);
            });
            return singleTicketFetchPromise;
        },

        fetchDataSingleListing: function(listings) {
            var self = this,
                errorObject = {},
                singleTicketFetchPromise = this.model.fetch(listings, {validate: true});

            singleTicketFetchPromise.done(function(response) {
                // Check for batching api errors
                errorObject = self.model.checkApiErrors(response.responses);
                if (errorObject.error) {
                    self.errorOnFetchedData(self.model, errorObject);
                } else {
                    self.model.setSilent(self.model.collateSingleListing());
                    self.addSingleTicket(false);
                }
            }).fail(function(error) {
                self.errorOnFetchedData(self.model, error);
            });

            return singleTicketFetchPromise;
        },

        // This function will be called when the API fails or the MODEL is invalid.
        // When the API fails the error will be an object which will be passed by
        // the Ajax call. If the MODEL is invalid then the error will be a string
        // which is created by the MODEL.
        errorOnFetchedData: function(model, error) {
            var singleTicketError = true;

            if (model.validationError) {
                EventHelper.track({pageView: '', appInteraction: model.validationError, pageload: false});
            } else if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 404) {
                if (error.responseJSON) {
                    switch (error.responseJSON.code) {
                        case 'purchase.cart.badRequest':
                        case 'purchase.cart.cartDoesnotBelongsToUser':
                        case 'purchase.cart.usercartCannotBeAccessed':
                            singleTicketError = false;
                            break;
                    }
                }

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Ticket Sold Out', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Ticket Error', pageload: false});
            }

            if (singleTicketError) {
                this.model.set('singleTicketError', singleTicketError);
            } else {
                // Log into splunk (?)
                this.closeSingleTicketMode();
            }
        },

        removeSingleTicketUrlParams: function() {
            // Remove the BYO url parameter.
            globals.byo.quantity = '';
            EventHelper.removeUrlParams(['byo', 'byo_qty', 'ticket_id', 'ticketRank']);
        },

        displayErrorMesage: function() {
            if (!this.model.get('singleTicketError')) {
                return;
            }

            var self = this;

            this.render();

            this.showTicketTimer = setTimeout(function() {
                // Hide ticket view if listing is not available but event is active
                self.showAllTickets();
            }, 5000);
        },

        addSingleTicket: function(expanded) {
            var self = this,
                renderPromise;

            this.model.set('ticketRank', globals.OMN.ticketRank || '');
            this.ticketView = new TicketdetailsView({
                    model: this.model,
                    qty: this.model.get('qty')
                });

            renderPromise = this.ticketView.render();

            renderPromise.done(function() {
                var ticketItem = self.ticketView.$el.find('.ticket-item'),
                    qty = this.model.get('qty');

                // If BYO is present in the URL then launch the BYO page.
                if (EventHelper.isBYOEnabled() && gc.showBYO) {
                    this.publishEvent('buildyourorder:listing', this.model);
                    // Resetting this to null to ensure that the BYO does not get
                    // launched automatically again.
                    gc.showBYO = null;
                }

                if (expanded) {
                    ticketItem.addClass('container-open');
                    ticketItem.find('.ticket-details-container').show();
                    self.ticketView.showVfs(
                        ticketItem,
                        self.model.get('sectionId')
                    );
                    globals.ticketIdActive = true;
                } else {
                    ticketItem.removeClass('container-open');
                    ticketItem.find('.ticket-details-container').hide();
                    globals.ticketIdActive = false;
                }

                self.uiEl.$ticketWrapper.empty().append(self.ticketView.el);

                // Un-hide the see other tickets button.
                self.uiEl.$seeMore.removeClass('hide');

                if (EventHelper.showBuyerCost() && qty > 0) {
                    self.getBuyerCost(qty, function(buyerCostResponse) {
                        self.$el.find('.totalcost-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(buyerCostResponse.totalCost.amount));
                        self.$el.find('.serviceFee-container .pricecellbottom .price_value').text(currencyFormatUtil.formatPrice(buyerCostResponse.totalBuyFee.amount));
                    });
                }
            });
        },

        getBuyerCost: function(qty, successCallBack, errorCallBack) {
            var buyerCostResponse,
                buyercost = {
                    'buyerCostRequest': {
                           'listingId': this.model.get('listingId'),
                           'quantity': qty,
                           'deliveryMethodId' : this.model.get('deliveryMethodList') && this.model.get('deliveryMethodList').length > 0 ? this.model.get('deliveryMethodList')[0] : this.model.get('deliveryMethods')[0].id
                    }
                };
            this.subModels.BuyerCostModel.fetch({
                data: JSON.stringify(buyercost),
                type: 'POST'
            }).done(function(data) {
                buyerCostResponse = data.buyerCostResponse;
                if (successCallBack) {
                    successCallBack(buyerCostResponse);
                }
            }).fail(function(error) {
                if (errorCallBack) {
                    errorCallBack();
                }
                EventHelper.logAppState('getBuyerCost', error);
            });

            return buyerCostResponse;
        },

        updatePrice: function(model, withFees) {
            if (withFees) {
                this.model.set('usePrice', this.model.get('displayPricePerTicket'));
            } else {
                this.model.set('usePrice', this.model.get('currentPrice'));
            }

            this.addSingleTicket(globals.ticketIdActive);
        },

        showAllTickets: function(evt) {
            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }

            clearTimeout(this.showTicketTimer);

            this.closeSingleTicketMode();

            // omniture tracking only when user clicked on find another ticket button
            if (evt && $(evt.currentTarget).hasClass('find-another-ticket')) {
                EventHelper.track({pageView: 'NON-GA ticket id expired', appInteraction: 'Find another ticket', pageload: false});
            }
        },

        showMoreTickets: function(evt) {
            var self = this;

            evt.stopPropagation();
            evt.preventDefault();

            this.$el.slideUp(400, function() {
                self.closeSingleTicketMode();
            });
        },

        closeSingleTicketMode: function() {
            this.$el.addClass('hide');

            gc.ticket_id = null;

            this.publishEvent('ticketlist:resize');
            this.publishEvent('ticketlist:seeall');
            this.removeSingleTicketUrlParams();

            this.unSubscribeFilterModelEvents();
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SingleticketView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return SingleticketView;
});

/*global _ */
define('views/sortfilter_header_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'models/filter_model',
    'views/price_slider_view',
    'globals',
    'global_context',
    'i18n'], function(Foobunny, Hammer, EventHelper, FilterModel, PriceSliderView, globals, gc, i18n) {
    'use strict';

    var SortFilterHeaderView = Foobunny.BaseView.extend({

        el: '#sortfilter_header',

        template: gc.appFolder + '/sortfilter_header',

        initialize: function() {
            console.log('--SortFilterHeaderView--  in initialize()', this);

            this.currentSort = null;

            if (globals.priceSlider.displayOutside === true && globals.priceSlider.enablePriceSlider[globals.TicketReco.showTicketReco]) {
                this.subViews = {
                    sliderView: new PriceSliderView()
                };
            }

            if (this.model.get('primarySort').split('+')) {
                this.pSort = this.model.get('primarySort').split('+');
                if (this.pSort.length > 1) {
                    switch (this.pSort[0]) {
                        case 'row':
                            this.currentSort = '.rowhdr';
                            break;
                        case 'sectionname':
                            this.currentSort = '.sectionhdr';
                            break;
                    }
                }
            }

            this.subscribeEvent('ticketlist:numberOfListings', this.numberOfListings);
            this.subscribeEvent('filterView:hidden', this.switchFilterIcon);
            this.subscribeEvent('recotooltip:show', this.displayValueBarTooltip);
            this.subscribeEvent('recotooltip:hide', this.hideValueBarTooltip);
            this.subscribeEvent('recotooltip:showmodal', this.displayModalValueBarTooltip);
            this.subscribeEvent('filter:resetQty', this.resetFilterQty);
        },

        modelEvents: {
            'change:qty': 'displayUpdatedQuantity',
            'change:withFees': 'updatePriceSortOptions'
        },

        events: {
            'change #qtyselector': 'applyQuantity',
            'click .sectionhdr': 'sortData',
            'click .rowhdr': 'sortData',
            'click .pricehdr': 'sortData',
            'mousedown #sortfilter-qty-dropdown li': 'applyQuantityDD',
            'click #sortfilter-qty-selector .sortfilter-title': 'handleFilterDD',
            'focusout #sortfilter-qty-selector .sortfilter-title': 'handleFilterCloseDD',
            'click #sortfilter-selector .sortfilter-filter-icon': 'openFilterTray',
            'click #sortfilter-selector .sortfilter-close-icon': 'closeFilterTray',
            'tap .lowestprice' : 'sortTabs',
            'tap .bestvalue' : 'sortTabs',
            'tap .bestseats' : 'sortTabs',
            'tap .closeTooltip': 'closeModalValueBarTooltip'
        },

        uiEl: {
            $sortBySection: '.sectionhdr',
            $sortByRows: '.rowhdr',
            $sortByPrice: '.pricehdr',
            $sortByQty: '#qtyselector',
            $sortByQtyTxt: '.qtyText',
            $feesIncluded: '#feesIncluded',
            $sortSelectionTitle: '#sortfilter-selection-title-cont',
            $sortQtyTitleTxt: '#sortfilter-qty-title',
            $applyQtyLiList: '#sortfilter-qty-dropdown li',
            $tabbar: '.tabbar',
            $tabButtons: '.tabbar button',
            $tabLowestPrice: '.tabbar .lowestprice',
            $tabBestValue: '.tabbar .bestvalue',
            $iconFilter: '#sortfilter-selector .sortfilter-filter-icon',
            $iconClose: '#sortfilter-selector .sortfilter-close-icon',
            $recoTooltip: '#recotooltip',
            $recoTooltipMessage: '#recotooltip .ttMessage',
            $recoTooltipClose: '.closeTooltip',
            $sortfilterQtyTitle: '#sortfilter-qty-title',
            $sortfilterQtyDropdown: '#sortfilter-qty-dropdown'
        },

        disableEvents: function() {
            if (globals.disableSorting[globals.TicketReco.showTicketReco]) {
                $(this.$el).off('click', '.sectionhdr');
                $(this.$el).off('click', '.rowhdr');
                $(this.$el).off('click', '.pricehdr');
            }
        },

        determineSortOptionTab: function() {
            var splitUrlSort,
                currentElement = '.bestvalue';

            if (!gc.urlSortOption) {
                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    return this.model.get('sortElement') || '.lowestprice';
                }
            }

            splitUrlSort = gc.urlSortOption.split('+');

            this.uiEl.$tabButtons.removeClass('selected');

            // sortfilter_header_dropdown has only currentPrice for 'data-sort-value'
            if (splitUrlSort[0] === 'listingPrice' || splitUrlSort[0] === 'price') {
                splitUrlSort[0] = 'currentPrice';
            }

            currentElement = this.uiEl.$tabButtons.filter('[data-sort-value^="' + splitUrlSort[0] + '"]').addClass('selected');

            return currentElement;
        },

        afterRender: function() {
            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                this.currentSort = this.determineSortOptionTab();
                this.$el.addClass('valuebar');
            }

            // PDO may have changed the priceType during initialization. Update the DOM
            // based on the current withFees value.
            this.updatePriceSortOptions(this.model, this.model.get('withFees'));

            this.disableEvents();
        },

        resetFilterQty: function() {
            EventHelper.removeUrlParam('qty');

            if (this.uiEl.$sortByQty.length > 0) {
                if (gc.isAddParking) {
                    EventHelper.setUrlParam('qty', '1');
                    this.uiEl.$sortByQty.val('1');
                    this.uiEl.$sortByQtyTxt.text('1').parent().addClass('applyQuantity');
                } else {
                    this.uiEl.$sortByQty.val('-1');
                    this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');
                }
            } else {
                var qtyText = this.uiEl.$applyQtyLiList.eq(0).data('qty-title');
                this.uiEl.$applyQtyLiList.removeClass('selected');
                this.uiEl.$applyQtyLiList.eq(0).addClass('selected');
                this.uiEl.$sortfilterQtyTitle.text(qtyText);
            }

        },

        openFilterTray: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.switchFilterIcon(false);
            this.publishEvent('filter:show');

            if (!globals.priceSlider.displayOutside && (EventHelper.isDesktop() || EventHelper.isTablet())) {
                $('.recoExpSlider').addClass('slider-top');
            }

            if (globals.priceSlider.displayOutside && EventHelper.isMobile()) {
                $('#price-slider').removeClass('hide-slider').addClass('display-slider');
                $('#filter-container .fee-option').addClass('slider-space');
            }

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Show Filter', pageload: false});
        },

        closeFilterTray: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.switchFilterIcon(true);
            this.publishEvent('filter:hide');
        },

        switchFilterIcon: function(show) {
            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                return;
            }

            show = (show === undefined ? true : show);

            if (show) {
                this.uiEl.$iconClose.addClass('hide');
                this.uiEl.$iconFilter.removeClass('hide');
            } else {
                this.uiEl.$iconFilter.addClass('hide');
                this.uiEl.$iconClose.removeClass('hide');
            }
        },

        handleFilterDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget);

            $origTarget.parent().find('.select-dropdown').toggle(0, function() {
                if ($(this).is(':visible')) {
                    that.uiEl.$sortSelectionTitle.removeClass('canHover');
                } else {
                    that.uiEl.$sortSelectionTitle.addClass('canHover');
                }
            });
        },

        handleFilterCloseDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget);

            $origTarget.parent().find('.select-dropdown').hide();
            that.uiEl.$sortSelectionTitle.addClass('canHover');
        },

        applyQuantityDD: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var that = this,
                $origTarget = $(evt.currentTarget),
                qty = $origTarget.attr('data-value'),
                qtyTitle = $origTarget.attr('data-qty-title'),
                $qtyHeader = this.uiEl.$sortQtyTitleTxt,
                filterType = 'Quantity';

            this.uiEl.$applyQtyLiList.removeClass('selected');
            $origTarget.addClass('selected');
            $origTarget.closest('.select-dropdown').hide(0, function() {
                if (!that.uiEl.$sortSelectionTitle.hasClass('canHover')) {
                    that.uiEl.$sortSelectionTitle.addClass('canHover');
                }
            });

            this.model.updateForQty({
                qty: qty
            });

            if (qty === '-1') {
                filterType = 'Removed Quantity';
                qtyTitle = i18n.get('event.common.sortfilter.selector.quantity.alltickets.text');
                this.uiEl.$sortQtyTitleTxt.removeClass('no-blue');
                EventHelper.removeUrlParam('qty');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: ''}});
            } else {
                EventHelper.setUrlParam('qty', qty);
                this.uiEl.$sortQtyTitleTxt.addClass('no-blue');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: 'Quantity: ' + qty}});
            }

            $qtyHeader.text(qtyTitle);
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var qty = this.uiEl.$sortByQty.val(),
                filterType = 'Quantity';

            //preserveFilters Qty
            if (qty !== '-1') {
                EventHelper.setUrlParam('qty', qty);
            } else {
                EventHelper.removeUrlParam('qty');
            }

            this.model.updateForQty({
                qty: qty
            });

            //show quantity selected on the label
            if (qty === '-1') {
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');
                filterType = 'Removed Quantity';
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: ''}});
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
                EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false, filterType: 'Selected Quantity: ' + qty, userExperienceSnapshot: {quantity: 'Quantity: ' + qty}});
            }
        },

        displayUpdatedQuantity: function(model, params) {
            var qty = model.get('qty'),
                qtyText = this.uiEl.$sortfilterQtyDropdown.find("[data-value='"+ qty +"']").attr('data-qty-title');

            if (qty === '>5') {
                qty = ('5+');
            }

            if (qty > '0') {
                this.uiEl.$sortByQty.val(qty);
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
                this.uiEl.$applyQtyLiList.first().removeClass('selected');
                this.uiEl.$sortfilterQtyDropdown.find("[data-value='"+ qty +"']").addClass('selected');
                this.uiEl.$sortfilterQtyTitle.html(qtyText);
            } else {
                this.uiEl.$sortByQty.val('-1');
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.qty.text')).parent().removeClass('applyQuantity');

                // For experice Ticket Reco Version C,D,E
                this.uiEl.$applyQtyLiList.removeClass('selected');
                this.uiEl.$applyQtyLiList.first().addClass('selected');
                this.uiEl.$sortQtyTitleTxt.text(i18n.get('event.common.sortfilter.selector.quantity.alltickets.text'));
            }
            this.uiEl.$sortByQty.val(qty);
        },

        sortData: function(evt) {
            evt.stopPropagation();

            var $sortElem = $(evt.currentTarget),
                sortField = $sortElem.attr('data-sort'),
                sortValue = $sortElem.attr('data-sort-value'), //preserveFilters for sortState
                sortObject = _.extend({}, this.getSortOptions($sortElem, false), {
                    lastchanged: 'sortOptions'
                }),

                sortDirection = sortObject.sortDirection,
                sortTracking = $sortElem.attr('data-tracking-prefix');

            this.currentSort = evt.currentTarget;

            EventHelper.setUrlParam('sort', sortValue + '+' + sortDirection); //preserve sortState

            this.resetElems(sortField);
            this.updateDirection($sortElem, sortField, sortDirection);

            this.model.updateForSorting(sortObject);

            if (sortField !== 'value') {
                EventHelper.track({
                    pageView: 'Filter Header',
                    appInteraction: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                    pageload: false,
                    filterType: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                    userExperienceSnapshot: {sortTab: sortValue + ' ' + (sortDirection === 'asc' ? 'asc' : 'desc')}
                });
            }
        },

        getSortOptions: function($sortElem, preserveSort) {
            var sortField = $sortElem.attr('data-sort'),

                // Secondary sort is always going to be price in ascending order.
                priceValue = this.uiEl.$sortByPrice.attr('data-sort-value'),
                priceDirection = 'asc',
                secSortValue = priceValue,
                secSortDirection = priceDirection,
                priSortValue = $sortElem.attr('data-sort-value') || priceValue,
                priSortDirection = 'asc';

            if (preserveSort) {
                priSortDirection = $sortElem.attr('data-sort-direction');
            } else {
                priSortDirection = ($sortElem.attr('data-sort-direction') === 'asc' ? 'desc' : 'asc');
            }

            //RITESH: Re-factor condition check.
            if (globals.TicketReco.showTicketReco !== globals.TicketReco.experience.DEFAULT) {
                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    if (sortField === 'price') {
                        secSortValue = this.uiEl.$tabBestValue.attr('data-sort-value');
                        secSortDirection = this.uiEl.$tabBestValue.attr('data-sort-direction');
                    } else {
                        secSortValue = priceValue;
                        secSortDirection = priceDirection;
                    }
                }
            }

            return {
                priceType: priceValue,
                sortField: sortField,
                primarySort: priSortValue + '+' + priSortDirection,
                secondarySort: secSortValue + '+' + secSortDirection,
                sortDirection: priSortDirection
            };
        },

        updateDirection: function($sortElem, sortField, sortDirection) {
            var $arrowElem = $sortElem.find('.dropdownArrow');

            if (sortDirection === 'asc') {
                $arrowElem.addClass('upArrow');
            } else {
                $arrowElem.removeClass('upArrow');
            }
            $sortElem.attr('data-sort-direction', sortDirection);
        },

        resetElems: function(sortField) {
            this.uiEl.$sortBySection.find('.dropdownArrow').removeClass('upArrow');
            this.uiEl.$sortByRows.find('.dropdownArrow').removeClass('upArrow');

            this.uiEl.$sortBySection.attr('data-sort-direction', 'desc');
            this.uiEl.$sortByRows.attr('data-sort-direction', 'desc');

            if (sortField !== 'price') {
                this.uiEl.$sortByPrice.find('.dropdownArrow').addClass('upArrow');
                this.uiEl.$sortByPrice.attr('data-sort-direction', 'asc');
            }
        },

        numberOfListings: function(nbr) {
            if (nbr === 0) {
                if (this.model.isFiltersApplied()) {
                    this.$el.removeClass('hide');
                    this.uiEl.$tabbar.removeClass('invisible');
                } else {
                    this.$el.addClass('hide');
                }
            } else {
                this.$el.removeClass('hide');

                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    this.uiEl.$tabbar.removeClass('invisible');
                }
            }
        },

        updatePriceSortOptions: function(model, withFees) {
            console.log('Model Changed: updatePriceSortOptions');

            var value = (withFees ? 'CURRENT' : 'LISTING'),
                sortObject, sortDirection, sortField;

            //RITESH: Re-factor code.
            if (globals.TicketReco.showTicketReco !== globals.TicketReco.experience.DROPDOWN) {
                this.uiEl.$sortByPrice.attr('data-sort-value', globals.price_type[value]);

                if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                    this.uiEl.$tabLowestPrice.attr('data-sort-value', globals.price_type[value]);
                }
            }

            sortObject = this.getSortOptions($(this.currentSort || '.pricehdr'), true);
            sortDirection = sortObject.sortDirection;
            sortField = sortObject.sortField;

            this.resetElems(sortField);
            this.updateDirection($(this.currentSort), sortField, sortDirection);

            this.model.setSilent(sortObject);
        },

        updatePriceAttribute: function(withFees) {
            var value = (withFees ? 'CURRENT' : 'LISTING');
            this.uiEl.$sortByPrice.attr('data-sort-value', globals.price_type[value]);
        },

        sortTabs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $sortElem = $(evt.currentTarget),
                sortField = $sortElem.attr('data-sort'),
                sortValue = $sortElem.attr('data-sort-value'),
                sortObject = _.extend({}, this.getSortOptions($sortElem, true), {
                    lastchanged: 'sortOptions'
                }),
                sortDirection = sortObject.sortDirection,
                sortTracking = $sortElem.attr('data-tracking-prefix');

            // Update the look of the elements
            this.uiEl.$tabButtons.removeClass('selected');
            $sortElem.addClass('selected');

            this.currentSort = evt.currentTarget;

            if (sortField === 'price') {
                sortValue = this.uiEl.$sortByPrice.attr('data-sort-value');
            }

            EventHelper.setUrlParam('sort', sortValue + '+' + sortDirection);

            this.model.updateForSorting(sortObject);

            EventHelper.track({
                pageView: 'Filter Header',
                appInteraction: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                pageload: false,
                filterType: sortTracking + ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending'),
                userExperienceSnapshot: {sortTab: sortValue + ' ' + (sortDirection === 'asc' ? 'asc' : 'desc')}
            });
        },

        displayValueBarTooltip: function(currentTarget) {
            var currTgt = $(currentTarget),
                elemOffset = currTgt.offset(),
                elemHeight = currTgt.height(),
                elemWidth = currTgt.width(),
                tooltipOffset = {},
                winHeight = $(window).height(),
                tooltipHeight = 180,
                tooltipWidth = 280,
                arrowHeight = 15,
                ttArrowUp = 'tt-arrow-up',
                ttArrowDown = 'tt-arrow-down',
                ttAddArrowClass = ttArrowUp,
                ttRemoveArrowClass = ttArrowDown;

            if (!this.uiEl.$recoTooltip || this.uiEl.$recoTooltip.hasClass('modal')) {
                return;
            }

            // Check if the hover point is near the bottom. If yes, then display the tooltip on the top.
            if (elemOffset.top + elemHeight + tooltipHeight + arrowHeight > (winHeight - 50)) {
                ttAddArrowClass = ttArrowDown;
                ttRemoveArrowClass = ttArrowUp;
                tooltipOffset.top = elemOffset.top - tooltipHeight - arrowHeight;
            } else {
                ttAddArrowClass = ttArrowUp;
                ttRemoveArrowClass = ttArrowDown;
                tooltipOffset.top = elemOffset.top + elemHeight + arrowHeight;
            }
            tooltipOffset.left = (elemOffset.left + (elemWidth / 2)) - tooltipWidth;

            // Position and Show
            this.uiEl.$recoTooltipClose.addClass('hide');
            this.uiEl.$recoTooltipMessage.removeClass(ttRemoveArrowClass).addClass(ttAddArrowClass).show();
            this.uiEl.$recoTooltip.css(tooltipOffset).show();
        },

        hideValueBarTooltip: function() {
            if (!this.uiEl.$recoTooltip || this.uiEl.$recoTooltip.hasClass('modal')) {
                return;
            }

            this.uiEl.$recoTooltip.hide();
        },

        displayModalValueBarTooltip: function(currentTarget) {
            $('body').addClass('overlay-active');
            this.uiEl.$recoTooltipClose.removeClass('hide');
            this.uiEl.$recoTooltipMessage.removeClass('tt-arrow-up tt-arrow-down').show();
            this.uiEl.$recoTooltip.css({top: '', left: ''}).addClass('overlayAnimate modal').show();

            EventHelper.track('Tooltip', 'Show best value tooltip', false);
        },

        closeModalValueBarTooltip: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            $('body').removeClass('overlay-active');
            this.uiEl.$recoTooltip.removeClass('overlayAnimate modal').hide();
            this.uiEl.$recoTooltipMessage.hide();
            this.uiEl.$recoTooltipClose.addClass('hide');
            EventHelper.track('Tooltip', 'Close best value tooltip', false);
        },

        context: function() {
            return {
                globals: globals,
                sortArrows: (!globals.disableSorting[globals.TicketReco.showTicketReco]),
                sortBy: this.pSort[0],
                sortDir: this.pSort[1]
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SortFilterHeaderView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return SortFilterHeaderView;
});

/* global _ */
define('models/fulfillment_window_model',[
    'foobunny',
    'global_context',
    'i18n',
    'helpers/delivery_helper'
], function(Foobunny, gc, i18n, DeliveryHelper) {
    'use strict';

    var InventoryMetadataModel = Foobunny.BaseModel.extend({
        initialize: function(attr, options) {

            this.urlHeaders = gc.url_headers || {};
        },

        //setting cache to true since subsequent requests would have the same meta data
        //no need to fetch again once cached
        cache: true,

        url: function() {
            // return '/shape/catalog/events/v1/' + gc.event_id + '/metadata/inventoryMetaData';
            return '/shape/fulfillment/window/v1/event/' + gc.event_id;
        },

        parse: function(result) {
            var deliveryTypes,
                fulfillmentWindows = result.fulfillmentWindows,
                tmpTypes = {};

            // filter same delivery type
            _.each(fulfillmentWindows, function(fulfillmentWindow) {
                if (fulfillmentWindow && fulfillmentWindow.deliveryMethod) {
                    var deliveryTypeId = fulfillmentWindow.deliveryMethod.deliveryTypeId,
                        deliveryName = fulfillmentWindow.deliveryMethod.deliveryTypeName;

                    tmpTypes[deliveryTypeId] = DeliveryHelper.getDeliveryTypeName(deliveryTypeId, deliveryName);
                }
            });

            // conbime post and convert to array
            deliveryTypes = _.map(DeliveryHelper.combinePaperDelivery(_.keys(tmpTypes), 'deliveryType'), function(typeId) {
                return {
                    id: parseInt(typeId),
                    description: tmpTypes[typeId]
                };
            });

            return {
                InventoryEventMetaData: {
                    deliveryTypeList: deliveryTypes
                }
            };
        }

    });
    return InventoryMetadataModel;
});

/*global SH,_ */
define('views/static_image_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n'
], function(Foobunny, Hammer, EventHelper, globals, gc, i18n) {
    'use strict';

    var StaticImageView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/static_image',

        initialize: function(options) {
            this.imageHost = options.imageHost || '';
            this.imageUrl = options.imageUrl || '';
            this.imageLink = options.imageLink || '';
            this.imageTracking = options.imageTracking || '';
            this.imageAltKey = options.imageAltKey || '';
            this.imageAltText = options.imageAltText || '';
        },

        events: {
            'click .static-image-item': 'imageClicked'
        },

        uiEl: {
            $staticImageItem: '.static-image-item',
            $staticImage: '.static-image'
        },

        addImage: function(imageUrl) {
            var staticImage = new Image(),
                self = this;

            staticImage.onload = function() {
                self.uiEl.$staticImage[0].src = this.src;
                if (self.imageAltKey !== '') {
                    self.uiEl.$staticImage[0].alt = i18n.get(self.imageAltKey);
                } else if (self.imageAltText !== '') {
                    self.uiEl.$staticImage[0].alt = this.imageAltText;
                }
            };
            staticImage.onerror = function() {
                self.uiEl.$staticImageItem.addClass('hide');
            };
            staticImage.src = imageUrl;
        },

        imageClicked: function(evt) {
            EventHelper.track('Static image clicked', this.imageTracking, false);
        },

        afterRender: function() {
            this.addImage(this.imageHost + this.imageUrl);

            if (!this.imageLink || this.imageLink === '') {
                $(this.$el).off('click', '.static-image-item');
            }
        },

        context: function() {
            return {
                imageLink: this.imageLink
            };
        }
    });
    return StaticImageView;
});

/*global SH,_ */
define('views/ticketlist_view',[
    'foobunny',
    'models/filter_model',
    'models/fulfillment_window_model',
    'collections/inventory_collection',
    'views/ticketdetails_view',
    'views/static_image_view',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'global_context',
    'globals',
    'i18n',
    'url-parser'
    ], function(Foobunny, FilterModel, FulfillmentWindowModel, InventoryCollection, TicketdetailsView, StaticImageView, EventHelper, DeliveryHelper,  gc, globals, i18n, urlParser) {
    'use strict';

    var timer;

    var reg = /^\d+(,\d+)*$/;

    var TicketlistView = Foobunny.BaseView.extend({

        initialize: function(params) {
            console.log('--TicketlistView--  in initialize()', this);

            this.fetchOnInitialize = false;
            this.eventDeferred = Foobunny.utils.deferred();
            this.eventPromise = this.eventDeferred.promise();

            this.fulfillmentFetchPromise = null;

            this.subModels = {
                metadata: new FulfillmentWindowModel()
            };

            this.lastchanged = 'initial';

            //initialize the collection
            this.collection = InventoryCollection.getInstance(gc.event_id);

            this.subCollections = {
                ticketlist: new Foobunny.BaseCollection(),
                sectionlist: new Foobunny.BaseCollection()
            };

            // Array of ticket views to keep track of the ticket collection
            this.ticketDetailsViews = [];

            //delivery type and listing attribute mappings
            this.deliveryMappings = [];
            this.attributeMappings = [];
            this.attributeMappingsForIcons = [];

            this.deliveryTypeList = [];
            this.listingAttributeList = [];

            this.isMapStatic = false;
            this.isMapAvailable = false;

            this.seatmap = null;
            this.mapHighlightedSectionId = null;
            this.mapHighlightedSectionPrice = '';

            this.enablePrimaryPartner = false;
            this.isHost = false;

            this.viewingAllTickets = (EventHelper.isSingleTicketMode() ? false : true);
            this.totalListings = 0;

            //once the seatmap is ready, style the sections
            this.subscribeEvent('seatmap:ready', this.syncMapInformation);
            this.subscribeEvent('ticketdetails:highlighted', this.highlightSectionOnMap);
            this.subscribeEvent('ticketlist:highlightFirstTicketDiv', this.highlightFirstTicketDiv);
            this.subscribeEvent('ticketlist:resize', this.layoutSettings);
            this.subscribeEvent('ticketlist:scrollToView', this.scrollToView);
            this.subscribeEvent('eventmodel:dataready', this.setEventModel);
            this.subscribeEvent('primarypartner:ready', this.setEnablePrimaryPartner);
            this.subscribeEvent('seatmap:zoneOrSectionToggle', this.zoneOrSectionToggle);
            this.subscribeEvent('ticketlist:seeall', this.seeAllTickets);
            this.subscribeEvent('eventdetailsview:goToUpcomingEvents', this.goToUpcomingEvents);
            this.subscribeEvent('quantityFilter:overlayClosed', this.highlightFirstTicketDiv);

            //is it still loading...
            this.isLoading = false;

            $('.see-more').html(i18n.get('event.common.seemore.text')).removeAttr('disabled');

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));
        },

        modelEvents: {
            'change': 'processFilterModelChanged'
        },

        uiEl: {
            '$primaryPerformer': '.primaryPerformer',
            '$ticketsWrapper': '#tickets-wrapper'
        },

        el: '#ticketlist',

        template: gc.appFolder + '/ticketlist',

        events: {
            'scroll' : 'highlightOrLoadMore',
            'click .see-more' : 'fetchMoreTickets',
            'click .see-partner-tickets-button': 'goToPrimaryPartner',
            'click .see-upcoming-events-button': 'goToUpcomingEvents',
            'click .see-all-tickets-button' : 'reset',
            'click .parking-go-back-button' : 'goBack'
        },

        processFilterModelChanged: function(model) {
            if (!model) {
                return;
            }

            // If this was part of the reset from filter then nullify the value of the reset attribute.
            model.unset('reset', {silent: true});

            this.model.setSilent('filterApplied', true);

            // If the user has not clicked on See more tickets then do not get additional tickets.
            // This is true in the single ticket mode.
            if (!this.viewingAllTickets) {
                return;
            }

            // Hide the tooltip
            this.publishEvent('tooltip:hide');

            this.getTickets();

            // if not single ticket case, remove ticket_id url param
            if (!gc.ticket_id) {
                EventHelper.removeUrlParams(['ticket_id', 'tktbkt']);
            }
        },

        setEventModel: function(eModel) {
            this.subModels.eventModel = eModel;

            // Update up-coming section
            var self = this;
            this.renderPromise.done(function() {
                self.uiEl.$primaryPerformer.text(eModel.get('primaryPerformer'));
            });
            this.eventDeferred.resolve();
        },

        setEnablePrimaryPartner: function(ppModel) {
            var primaryPerformer;

            if (!ppModel || (!ppModel.get('isPartner') && !ppModel.get('isHost'))) {
                return;
            }

            this.subModels.primaryPartnerModel = ppModel;
            this.enablePrimaryPartner = ppModel.get('isPartner');
            this.isHost = ppModel.get('isHost');

            primaryPerformer = ppModel.get('primaryPerformer');
            if (primaryPerformer !== '') {
                this.$el.find('.primaryPerformer').text(primaryPerformer);
            }

            // If the performer and the partner integration api's take a long time and then
            // return with appropriate data, check to see if the inventory collection has also
            // returned and that there are no tickets available before displaying the no tickets
            // message.
            // If the performer and partner integration api's returned before the inventory
            // collection has returned then do not do anything. The showing of the no tickets message
            // will be executed by the fetchData chain of functions.
            if (this.fulfillmentFetchPromise && this.fulfillmentFetchPromise.state() === 'resolved' &&
                this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }
        },

        goToUpcomingEvents: function(evt, track) {
            evt.preventDefault();
            evt.stopPropagation();

            var upComingLink = this.subModels.eventModel.getUpcomingEventsLink();

            if (!track) { //checks if the call is from a different View
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See upcoming events', pageload: false});
            }

            window.setTimeout(function() {
                urlParser.redirect(upComingLink);
            }, 300);
        },

        goToPrimaryPartner: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            this.publishEvent('primarypartner:goToPrimaryPartner', evt);
        },

        fetchData: function() {
            var self = this,
                metadataFetchPromise,
                deferred = $.Deferred(),
                fetchDataPromise = deferred.promise();

            // Show the Spinner when loading the page.
            this.prepareView();
            //pass the filter model data to prepare the url
            this.collection.prepareAPIUrl(this.model.toJSON());

            //now finally fetch
            this.fulfillmentFetchPromise = this.collection.fetch();

            //get the inventory meta data
            metadataFetchPromise = this.subModels.metadata.fetch();

            this.fulfillmentFetchPromise
                .done(function(response) {
                    self.successfulInventoryDataFetch(response);
                });

            $.when(this.fulfillmentFetchPromise, metadataFetchPromise, self.eventPromise).done(function() {
                //prepare attribute dictionary, this needs to be done only once
                if (self.deliveryMappings.length <= 0) {
                    self.setupAttributeDictionary();
                }

                //map this data onto each ticket
                self.prepareMetaDataMappings();

                // If the fetchOnInitialize is true then the rendering happens after the fetchDone is completed.
                // fetchDone is performing the task of adding the tickets. Hence, forcing the render so that the
                // parent element is rendered for the addTickets to add the tickets to.
                // We are force rendering only for the initial load.
                if (self.lastchanged === 'initial') {
                    self.render();
                    self.renderPromise.done(function() {
                        self.fetchDone();
                    });
                } else {
                    self.fetchDone();
                }

                //finally resolve the promise of promises
                deferred.resolve();
            }).fail(function(error) {
                deferred.reject(error);
            });

            return fetchDataPromise;

        },

        getTickets: function() {
            var self = this,
                fetchPromise;

            this.lastchanged = this.model.get('lastchanged');
            this.prepareView();

            //now fetch only search inventory, true prevents the metadata fetch
            fetchPromise = this.fetchData();
            fetchPromise.fail(function(error) {
                self.publishEvent('dataready:error', error);
            });
        },

        fetchDone: function() {
            console.log('fetchDone in TicketListView');

            //prepare view for appending of tickets - almost what beforeRender would be but since,
            //here we are explicity appending to DOM, can't use those hooks
            this.prepareView();

            //add tickets for each listing
            this.addTickets();

            if (this.seatmap) {
                this.syncMapInformation({'isMapStatic': this.seatmap.blueprint.isMapStatic()});
            }

            //filter map if needed
            this.refillMap();

            // EVENTS-1446 - fix.
            this.uiEl.$ticketsWrapper.removeClass('hide');

            this.initialTicketFetch();

            // We need to do this because the ticket list is now going to be size/re-sized
            // through multiple scenarios.
            this.layoutSettings();

            //work on if load more is needed or not
            this.prepareLoadMore();
        },

        initialTicketFetch: function() {
            // Do not show the ticket list in single ticket mode only when we are
            // fetching the tickets on page load.
            if ($('#single-ticket').is(':visible')) {
                this.$el.addClass('hide');
            } else {
                this.$el.removeClass('hide');
            }

            // Display the 0 tickets available. This is only to be displayed on page load.
            // 0 tickets available because a filter is applied is taken care of in repeatedTicketFetch.
            if (this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }

            this.publishEvent('ticketlist:numberOfListings', this.subCollections.ticketlist.length);
        },

        repeatedTicketFetch: function() {
            console.log('repeatedTicketFetch in TicketListView');

            this.$el.removeClass('hide');

            if (this.subCollections.ticketlist.length === 0) {
                this.showNoTicketsMessage();
            }
        },

        successfulInventoryDataFetch: function(response) {
            // give the sub collection, its data
            this.subCollections.ticketlist.reset(this.collection.models[0].get('listing'));
            if (this.model.get('sectionStats')) {
                this.subCollections.sectionlist.reset(this.collection.models[0].get('sectionStats'));
                // pass on section/zone stats to seatmap_tooltip_view
                this.publishEvent('ticketlist:statsFetched', { section_stats: this.collection.models[0].get('sectionStats') ,
                                                               zone_stats: this.collection.models[0].get('zoneStats') });
            }
            this.model.setSilent('quantityVector', response.qtyAvailableVector);
            // save total listings info
            this.totalListings = this.collection.models[0].get('totalListings');

            // Pass on data to the price slider
            this.publishEvent('slider:dataFetched', this.collection.models[0].attributes);

            // we can now empty the main collection - no need to keep it!
            this.collection.reset();

            // If the totalListings is 0 then send the tracking call.
            if (this.totalListings === 0) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Zero tickets returned', pageload: false});
            }
        },

        showNoTicketsMessage: function() {
            var $ppGetTickets = this.$el.find('#partner-gettickets');
            
            if (this.model.isFiltersApplied() ||
                (globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT && this.model.get('qty') >= '0')) {
                 if (!gc.ticket_id) {
                    this.$el.removeClass('hide');
                    $('.no-tickets-message').removeClass('hide');
                 }
            } else {
                if (this.enablePrimaryPartner &&
                    !this.isHost &&
                    this.subModels.primaryPartnerModel.get('primaryEventPageURL') &&
                    this.subModels.primaryPartnerModel.get('primaryEventPageURL') !== '') {
                    $('#upcoming-events').addClass('hide');
                    $ppGetTickets.removeClass('hide');
                } else {
                    this.uiEl.$ticketsWrapper.addClass('hide');
                    $ppGetTickets.addClass('hide');
                    $('#upcoming-events').removeClass('hide');
                }
            }
        },

        showPrimaryPartnerGetTickets: function() {
            var $ppGetTickets = this.$el.find('#partner-gettickets');

            // Hide the partner get tickets for the phone.
            // if (window.innerWidth < globals.screen_breakpoints.desktop) {
            //     $ppGetTickets.addClass('hide');
            //     return;
            // }

            // Display or hide the partner get tickets depending on whether we have the
            // inventory or not. This is only for the 1st time page load.
            if (this.enablePrimaryPartner &&
                !this.isHost &&
                this.subModels.primaryPartnerModel.get('primaryEventPageURL') &&
                this.subModels.primaryPartnerModel.get('primaryEventPageURL') !== '') {
                $ppGetTickets.removeClass('hide');
            } else {
                $ppGetTickets.addClass('hide');
            }
        },

        layoutSettings: function() {
            var win = $(window),
            winHeight = win.height(),
            $ticketlist = $('#ticketlist'),
            $headerView = $('#header'),
            $parkingHeaderView = $('#eventParkingHeader'),
            $contentContainer = $('#content_container'),
            $eventMapContainer = $('#eventMapContainer'),
            $eventContainer = $('#eventContainer'),
            $ticketListFooter = $('#ticketlist_footer'),
            $advancedFilter = $('#filter'),
            $singleTicket = $('#single-ticket'),
            $serviceFeeInfo = $('#eventContainer .serviceFeeInfo'),
            $vfsLarge,
            headerHeight = $headerView.is(':visible') ? $headerView.outerHeight() : 0,
            parkingHeaderHeight = $parkingHeaderView.is(':visible') ? $parkingHeaderView.outerHeight() : 0,
            eventDetailsHeight = $('#event-details').outerHeight(),
            sortFilterHeaderHeight = $('#sortfilter_header').is(':visible') ? $('#sortfilter_header').outerHeight() : 0,
            ticketlistFooterHeight = $ticketListFooter.is(':visible') ? $ticketListFooter.outerHeight() : 0,
            advancedFilterHeight = $advancedFilter.is(':visible') ? $advancedFilter.outerHeight() : 0,
            serviceFeeInfoHeight = $serviceFeeInfo.outerHeight() ? $serviceFeeInfo.outerHeight() : 0,
            singleTicketHeight = 0,
            arrowHeight = 33,
            areatotal,
            twoRowHeight,
            cellheight,
            actualHeight,
            eventContainerSpacing,
            contentContainerMarginTop = 74; //74 is the Height of event header in tablet view

            if (gc.ticket_id) {
                singleTicketHeight = $singleTicket.is(':visible') ? $singleTicket.outerHeight() : 0;
            }

            if ($headerView.hasClass('scroll-up')) {
                headerHeight = 0;
                $headerView.removeClass('scroll-up');
                this.publishEvent('globalHeader:hide');
                $contentContainer.removeClass('scroll-up');
                //Mobile: Handling the edgecase when the user expands ticketlist for full view and clicks event header
                if (window.innerWidth < globals.screen_breakpoints.tablet) {
                    if ($('#arrowButton').hasClass('arrowFlipDown')) {
                        $eventContainer.height(winHeight - eventDetailsHeight);
                        $ticketlist.height(winHeight - eventDetailsHeight - sortFilterHeaderHeight - serviceFeeInfoHeight);
                    } else {
                        areatotal = winHeight - headerHeight - eventDetailsHeight;
                        twoRowHeight = areatotal / 2;

                        $eventMapContainer.height(twoRowHeight);
                        $eventContainer.height(twoRowHeight + arrowHeight);

                        if (gc.ticket_id) {
                            // Adjust height of ticket list if in single ticket view
                            $ticketlist.height('80%');
                        } else {
                            $ticketlist.height(twoRowHeight - sortFilterHeaderHeight - serviceFeeInfoHeight + arrowHeight);
                        }
                    }
                }
            }

            // for tablets and up
            // Tablet: 10px top padding, 10px bottom padding.
            // Desktop: 20px top padding, 20px bottom padding.
            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                eventContainerSpacing = 45;
                cellheight = winHeight - headerHeight - parkingHeaderHeight - contentContainerMarginTop;
                actualHeight = cellheight - eventContainerSpacing;
                $vfsLarge = $('#large-vfs');

                $eventMapContainer.css('height', cellheight);
                $eventContainer.height(actualHeight);
                $ticketlist.height(actualHeight - sortFilterHeaderHeight - singleTicketHeight - ticketlistFooterHeight - advancedFilterHeight - serviceFeeInfoHeight);

                if ($vfsLarge.is(':visible')) {
                    this.publishEvent('enlargevfs:hide');
                }
                this.publishEvent('ticketdetails:hideSideVfs');
                return;
            }

            //For smartphone layout - Once the layout setting is done, dont execute this
            if (!($('#arrowButton').hasClass('arrowFlipUp') || $('#arrowButton').hasClass('arrowFlipDown'))) {
                areatotal = winHeight - headerHeight - eventDetailsHeight;
                twoRowHeight = areatotal / 2;

                $contentContainer.height(winHeight - headerHeight - eventDetailsHeight);
                $eventMapContainer.height(twoRowHeight);
                $eventContainer.height(twoRowHeight + arrowHeight);

                if (gc.ticket_id) {
                    // Adjust height of ticket list if in single ticket view
                    $ticketlist.height('80%');
                    //ticketlist.height(twoRowHeight + singleTicketHeight);
                } else {
                    $ticketlist.height(twoRowHeight - sortFilterHeaderHeight - serviceFeeInfoHeight + arrowHeight);
                }
            }
        },

        refresh: function() {
            //clear the existing array of views
            this.ticketDetailsViews = [];

            $('#tickets > .spinner').removeClass('hide');

            //clear the existing list
            $('#tickets-wrapper').empty('');
            $('#upcoming-events, #partner-gettickets, .see-more, .no-tickets-message').addClass('hide');
        },

        goBack: function() {
            EventHelper.parkingPassRedirectToBYO('park_id=0&park_qty=0');
        },

        reset: function(evt) {
            var params = {
                pView: 'Ticket Listings',
                appInter: 'See all tickets',
                resetAll: true
            };

            this.publishEvent('ticketlist:seeAllTickets', evt, params);
        },

        prepareView: function() {
            if (this.lastchanged && (this.lastchanged === 'section-selected' ||
                this.lastchanged === 'section-deselected' ||
                this.lastchanged === 'show-all' ||
                this.lastchanged === 'filters' ||
                this.lastchanged === 'sortOptions' ||
                this.lastchanged === 'initial'
            )) {

                //if a section on the map is selected or deselected, clear the existing ticket list
                //the new ticket list should not be appended but replacing the existing DOM
                this.refresh();
            }
        },

        addTickets: function() {
            var renderPromise = [],
                self = this,
                domFrag = [],
                qty = this.model.get('qty'),
                selectedQty = (qty > 0 && qty <= 4 ? qty : -1),
                staticImagesinterval = globals.staticImagesInTicketList.interval,
                staticImagesEventObject = globals.staticImagesInTicketList.events[gc.event_id],
                currentImage = globals.staticImagesInTicketList.currentImage,
                lastTicketIndex = (this.lastchanged === 'start' ? globals.staticImagesInTicketList.lastTicketIndex : 0),
                nbrOfImages,
                imageObject,
                sectionId = EventHelper.getUrlQuery('sid'),
                isEbayTickets = EventHelper.getUrlQuery('gcid');

            self.ticketRank = self.model.get('rowStart');

            if (staticImagesEventObject) {
                nbrOfImages = staticImagesEventObject.images.length;
            }

            // fix for ebay inline listing. If the section id from ebay is invalid or there is no tickets
            // under this section, all the tickets should be display.
            if (isEbayTickets && sectionId && (this.subCollections.ticketlist.models.length === 0 || !reg.test(sectionId))) {
                EventHelper.removeUrlParam('sid');
                this.model.set('sections', []);
            } else {
                 //for each ticket in the collection , add a view to the list of all tickets
                this.subCollections.ticketlist.each(_.bind(function(ticket) {
                    lastTicketIndex++;

                    ticket.set('ticketRank', ++self.ticketRank);

                    if (staticImagesinterval > 0 && staticImagesEventObject &&
                        (lastTicketIndex % staticImagesinterval) === 1) {

                        imageObject = staticImagesEventObject.images[currentImage - 1];
                        renderPromise.push(this.addStaticImage(imageObject));

                        currentImage++;
                        if (currentImage > nbrOfImages) {
                            currentImage = 1;
                        }
                    }
                    renderPromise.push(this.addView(ticket, selectedQty));

                    if (lastTicketIndex >= staticImagesinterval) {
                        lastTicketIndex = 0;
                    }
                }, this));

                globals.staticImagesInTicketList.currentImage = currentImage;
                globals.staticImagesInTicketList.lastTicketIndex = lastTicketIndex;

                //append to the tickets to the DOM
                $.when.apply($, renderPromise).always(function() {

                    //get the DOM fragments to append to the wrapper
                    self.ticketDetailsViews.forEach(function(view) {
                        domFrag.push(view.el);
                    });
                    //now append all dom fragments once
                    if ($('#tickets-wrapper').length === 0) {
                        console.error('tickets-wrapper not ready');
                    }
                    $('#tickets-wrapper').append(domFrag);

                    //reset see more
                    $('.see-more').html(i18n.get('event.common.seemore.text'));

                    $('#tickets > .spinner').addClass('hide');
                    self.isLoading = false;

                    self.highlightFirstTicketDiv();
                });
            }

        },

        addView: function(ticket, selectedQty) {
            var ticketView = new TicketdetailsView({
                model: ticket,
                qty: selectedQty
            });

            this.ticketDetailsViews.push(ticketView);
            return ticketView.render();
        },

        addStaticImage: function(imageObject) {
            var staticImageView = new StaticImageView(_.extend(imageObject, {imageHost: gc.staticUrl}));
            this.ticketDetailsViews.push(staticImageView);
            return staticImageView.render();
        },

        prepareLoadMore: function() {
            if (this.totalListings <= (this.model.get('rowStart') + this.model.get('startInterval'))) {
                $('.see-more').addClass('hide');
            }else {
                $('.see-more').removeClass('hide');
            }
        },

        highlightOrLoadMore: function(evt) {
            var that = this;
            clearTimeout(timer);
            var triggerPoint = 100, // 100px from the bottom
            $eventHeader = $('#event-details'); //apply only to the phone layout

            if (!this.isLoading && (this.el.scrollTop + this.el.clientHeight + triggerPoint) > this.el.scrollHeight && !$('.see-more').hasClass('hide')) {
                this.fetchMoreTickets();

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Load more tickets', pageload: false});
            }

            if (!EventHelper.isDesktop()) {
                timer = setTimeout(function() {
                    that.highlightFirstTicketDiv();
                }, 250);
            }

            if (!$eventHeader.hasClass('scrolled-up') && window.innerWidth < globals.screen_breakpoints.tablet && !$('#header #hamburger').hasClass('clicked')) {
                EventHelper.scrollEventHeader($eventHeader, true);
                //after transition ends - reposition tooltip
                $('#header').one('webkitAnimationEnd mozAnimationEnd animationend', function(e) {
                    that.publishEvent('tooltip:reposition');
                    that.layoutSettings();
                });
            }

            // Hide the side-vfs image when scrolling
            this.publishEvent('ticketdetails:hideSideVfs');
        },

        fetchMoreTickets: function(evt) {
            this.isLoading = true;
            $('.see-more').html(i18n.get('event.common.loading.text')).attr('disabled', 'disabled');
            this.model.updateForLoadMore();
        },

        refillMap: function() {
            var self = this,
                sections = [];

            if (!this.seatmap) {
                return;
            }

            if (this.model.get('zonesEnabled')) {
                _.each(this.model.get('zones'), function(zid) {
                    sections = sections.concat(self.$el.blueprint.getSectionsByZone(zid));
                });
            } else {
                sections = this.model.get('sections');
            }

            this.seatmap.blueprint.resetMap();
            this.filterMap();

            if (sections.length > 0) {
                //FIX FOR- EVENTS-38 -setting callback trigger to false; only want the focus applied at this point; do not tigger associated callback
                this.seatmap.blueprint.focusSections(sections, false);
            }
        },

        syncMapInformation: function(data) {

            this.seatmap = $('#seatmap');

            //isMapStatic - ?, then dont attempt to highlight section on map and dont show tooltips
            this.isMapStatic = data.isMapStatic;
            this.isMapAvailable = true;

            //color the sections on map
            this.styleMapSections();
            //also now that the map is rendered highlist the first div and corresponding section on the map
            this.highlightFirstTicketDiv();

            //TODO: the api does return zone ids,
            // this is a redundant function. Wouldn't exist if Inventory API returned zoneIds!
            this.colorizeSectionlist();
        },

        styleMapSections: function() {
            this.seatmap.blueprint.styleSections(this.getSectionIds());
        },

        //filter map when filters ae applied
        filterMap: function() {
            this.seatmap.blueprint.filterSections(this.getSectionIds());
        },

        getSectionIds: function() {
            return _.map(this.subCollections.sectionlist.models, function(s) {
                return s.get('sectionId');
            });
        },

        highlightFirstTicketDiv: function(evt) {
            console.log('--TicketlistView--  in highlightFirstTicketDiv()');

            var self = this,
                price = '';

            // If the ticket view is open don't highlight the first ticket
            if ((this.lastchanged !== 'initial' && EventHelper.isDesktop()) || this.$el.find('.ticket-item.container-open').length > 0) {
                return;
            }

            $('#tickets-wrapper .ticket-item-wrapper').removeClass('highlight').each(function() {

                var $this = $(this),
                    $ticketItem = $this.find('.ticket-item'),
                    elTop = $this.position().top + $this.outerHeight() / 4;

                price = $ticketItem.find('.amount-value').text();

                if (elTop >= 0) {

                    //add highlight to the ticket now in view
                    $this.addClass('highlight');
                    self.publishEvent('ticketdetails:showSideVfs', $ticketItem.attr('data-tid'), $ticketItem.attr('data-sid'));

                    //also highlight the section on the map, but only if the map shows up
                    if (self.isMapAvailable && !self.isMapStatic) {
                        self.highlightSectionOnMap($ticketItem.attr('data-sid'), price);
                    }

                    return false;
                } else {
                    $this.removeClass('highlight');
                }
            });
        },

        highlightSectionOnMap: function(sectionId, price, isZoneTicket) {
            if (!this.seatmap) {
                return;
            }

            // If a ticket is dispalyed form a ticket_id url parameter,
            // add the section id and price
            if (globals.ticketIdActive) {
                sectionId = this.parentView.views.singleTicket.model.get('sectionId');
                price = $('.single-ticket-wrapper').find('.amount-value').text();
            }

            // highlight the section or zone on map
            this.seatmap.blueprint.highlightSections([sectionId]);

            // now show the tooltip but only for non zone tickets or tickets with sections.
            if (!!sectionId && !isZoneTicket) {
                this.publishEvent('ticketlist:showTooltip', sectionId, price);
            }
        },

        prepareMetaDataMappings: function() {
            var self = this,
                featureType,
                listingAttributeDesc = '',
                listingId = '',
                country = SH.country.toUpperCase();

            this.subCollections.ticketlist.each(_.bind(function(ticket) {

                if (ticket.get('deliveryTypeList') === null || ticket.get('deliveryTypeList') === undefined || (ticket.get('deliveryTypeList') && ticket.get('deliveryTypeList').length === 0)) {
                    return;
                }

                listingId = ticket.get('listingId');

                //update the mappings if not already done
                if (!ticket.attributes.deliveryTypeList[0].deliveryAttribute) {
                    //for all the delivery attributes
                    ticket.attributes.deliveryTypeList = (ticket.attributes.deliveryTypeList || []).map(function(deliveryAttribute) {
                        return {
                            id: deliveryAttribute,
                            deliveryAttribute: self.deliveryMappings[deliveryAttribute]
                        };
                    });
                }

                //add additional property if listing attribute has more ticket features
                if (_.intersection(ticket.attributes.listingAttributeList, self.attributeMappingsForIcons).length > 0) {
                    ticket.set('showDisclosure', 'yes');
                } else {
                    ticket.set('showDisclosure', 'no');
                }

                //listing attributes and associated icons
                if (!ticket.attributes.deliveryTypeList[0].listingAttribute) {
                    //for all the listing attributes
                    ticket.attributes.listingAttributeList = (ticket.attributes.listingAttributeList || []).map(function(listingAttribute) {
                        listingAttributeDesc = self.attributeMappings[listingAttribute];

                        //append final attribute, only if the description has been correctly mapped
                        if (listingAttributeDesc) {

                            //add feature icons if applicable
                            featureType = EventHelper.checkFeatureType(listingAttribute);

                            return {
                                id: listingAttribute,
                                listingAttribute: listingAttributeDesc,
                                featureIcon: featureType.featureIcon,
                                valueType: featureType.valueType
                            };
                        } else {
                            // Splunk log this error for visibility.
                            // Delaying actual sending because we do not to hold up the UI at all.
                            // We don't need this here because the call is going to be Async. But
                            // There is additional logic that logAppState does that we do not want
                            // to at this point in time. Hence, setting a timeout.
                            setTimeout(function(listingId, listingAttribute) {
                                try {
                                    EventHelper.logAppState('MissingListingAttributeList', null, {
                                        ticket_id: listingId,
                                        listingAttributeList: listingAttribute
                                    });
                                } catch (e) {}
                            }, 150, listingId, listingAttribute);

                            // Return an empty object conformant with what is expected downstream.
                            return {
                                id: null
                            };
                        }
                    });
                }

                //add the count of categorized and un-categorized ticket feature types to make it easier on dust
                ticket.set('iconCounts', _.countBy(ticket.get('listingAttributeList'), function(attribute) {
                    if (!attribute) {
                        return;
                    }
                    return attribute.featureIcon === 'none' ? 'uncategorized' : 'categorized';
                }));
            }));
        },

        setupAttributeDictionary: function() {
            var self = this,
                deliveryTypeList = this.subModels.metadata.get('InventoryEventMetaData').deliveryTypeList,
                listingAttributeList = this.subModels.eventModel.get('seatTraits'),
                country = SH.country.toUpperCase();

            if (deliveryTypeList) {
                this.deliveryTypeList = deliveryTypeList;
                this.deliveryTypeList.forEach(function(deliveryAttribute) {
                    var desc = deliveryAttribute.description;
                    self.deliveryMappings[deliveryAttribute.id] = desc;
                });
            }

            if (listingAttributeList) {
                this.listingAttributeList = listingAttributeList;
                this.listingAttributeList.forEach(function(listingAttribute) {
                    self.attributeMappings[listingAttribute.id] = listingAttribute.name;
                    //pick features other than seller comments
                    if (listingAttribute.type !== 'Seller Comments') {
                        self.attributeMappingsForIcons.push(listingAttribute.id);
                    }
                });
                //for these id's special icons are shown
                //101 - aisle; 102 - parking; 202, 3006 - wheelchair; 201, 5370, 4750, 4369, 2001, 348 - obstructed view, 13372 - Partner ticket.
                self.attributeMappingsForIcons = _.difference(self.attributeMappingsForIcons, [101, 102, 202, 3006, 201, 13372]);
            }

            self.publishEvent('deliveryTypes:ready', {deliveryTypes: this.deliveryTypeList});
        },

        colorizeSectionlist: function() {

            function lightenDarkenColor(col, amt) {
                var usePound = false;
                if (col && col[0] == '#') {
                    col = col.slice(1);
                    usePound = true;
                }
                var num = parseInt(col, 16);
                var r = (num >> 16) + amt;
                if (r > 255) r = 255;
                else if (r < 0) r = 0;
                var b = ((num >> 8) & 0x00FF) + amt;
                if (b > 255) b = 255;
                else if (b < 0) b = 0;
                var g = (num & 0x0000FF) + amt;
                if (g > 255) g = 255;
                else if (g < 0) g = 0;
                return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
            }

            function hexToRgb(hex, opacity) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ', ' + opacity + ')' : null;
            }

            console.log('--TicketlistView-- in colorizeSectionlist()');
            var zones = this.parentView.views.seatmap.$el.blueprint.getZones();
            var zoneIds = _.keys(zones);
            //set the default color, for when the map is static
            //border should actually be 0, but it will be overwritten by the high specificity of the styles in app.les
            var zoneCssStyle = '.zonecolor { border-color: transparent; }\n';
            var color = '';
            _.each(zoneIds, function(z) {
                var col1 = hexToRgb(zones[z].color, '0.5');
                var col2 = lightenDarkenColor(zones[z].color, -20);
                col2 = '#000';
                zoneCssStyle += '.zid-' + z + ' { border-left-color:' + col1 + '; color: ' + col2 + '; }\n';
            });
            console.log('zone css style=', zoneCssStyle);
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = zoneCssStyle;
            document.getElementsByTagName('head')[0].appendChild(style);

        },

        seeAllTickets: function() {
            this.viewingAllTickets = true;

            // Triggering the show-all since the filters might have changed.
            // This will trigger an API request. There are some cases where the user
            // might have changed the filters but is not shown the ticket list at that time.
            // Hence, making sure the ticket list is "refreshed" based on update/not-update filter
            // data.
            this.model.set('lastchanged', 'show-all');

            //also hide vfs
            this.publishEvent('enlargevfs:hide');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See All Listings', pageload: false});
        },

        /*
            The following use cases need to be considered when scrolling the ticket into the view -
            1. The ticket can be partially above the fold when the user clicks on the ticket.
            2. The ticket can be partially below the fold when the user clicks on the ticket.
            3. The height of the ticket can be greater than the height of the ticket list in which case
               the ticket should be top aligned.
        */
        scrollToView: function($ticket) {
            var $ticketList = this.$el,
                tlScrollTop = $ticketList.scrollTop(),
                tlHeight = $ticketList.height(),
                tktHeight = $ticket.height() + 10, // 10 = padding of the ticket.
                tktTop = $ticket.position().top,
                alignTicket = '',
                newScroll = 0;

            if (tktTop < 0 ||
                tktHeight > tlHeight) {
                alignTicket = 'top';
            } else if ((tktTop + tktHeight) > tlHeight) {
                alignTicket = 'bottom';
            }
            if (alignTicket === 'top') {
                newScroll = tlScrollTop + tktTop;
            } else if (alignTicket === 'bottom') {
                newScroll = tlScrollTop + tktHeight - (tlHeight - tktTop);
            }

            if (alignTicket !== '') {
                $ticketList.scrollTop(newScroll);
            }

        },

        zoneOrSectionToggle: function(data) {
            globals.zones_enabled = (data.isSelectByZone ? true : false);
            this.model.setSilent({
                zonesEnabled: globals.zones_enabled,
                lastchanged: 'filters'
            });
            if (globals.zones_enabled) {
                this.publishEvent('seatmap:enableSelectionByZone');
            } else {
                this.publishEvent('seatmap:enableSelectionBySection');
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistView;
});

define('views/ticketlist_footer_view',[
    'foobunny',
    'hammer',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n',
    'models/filter_model'
], function(Foobunny, Hammer, EventHelper, globals, gc, i18n, FilterModel) {
    'use strict';

    var TicketlistFooterView = Foobunny.BaseView.extend({

        el: '#ticketlist_footer',

        template: gc.appFolder + '/ticketlist_footer',

        initialize: function() {
            console.log('--TicketlistFooterView--  in initialize()', this);
            this.subscribeEvent('filterView:hidden', this.show);
            this.subscribeEvent('quantityFilter:qtyUpdated', this.show);
            this.subscribeEvent('eventmodel:expiredEvent', this.hide);
            this.subscribeEvent('filter:show', this.hide);
        },

        uiEl: {
            '$priceFilterOptions': '#footer-wrapper',
            '$priceFilterWrapper': '.filter-wrapper',
            '$advancedFilterTxt': '#price-filter-txt',
            '$sortByQty': '#qtyselector',
            '$sortByQtyTxt': '.qtyText',
            '$sortByQtyhdr': '.qtyhdr'
        },

        events: {
            'tap .filterTitle': 'openPriceFilter',
            'change #qtyselector': 'applyQuantity'
        },

        modelEvents: {
            'change:qty': 'displayUpdatedQuantity'
        },

        afterRender: function() {
            Hammer(this.el);
        },

        applyQuantity: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var filterType = 'Quantity';

            var qty = this.uiEl.$sortByQty.val();

            this.model.updateForQty({qty: qty});

            if (qty === '-1') {
                this.uiEl.$sortByQtyTxt.text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            } else {
                this.uiEl.$sortByQtyTxt.text(qty).parent().addClass('applyQuantity');
            }

            EventHelper.track({pageView: 'FilterView', appInteraction: filterType, pageload: false});
        },

        displayUpdatedQuantity: function(model, params) {
            var qty = model.get('qty');

            if (qty === '>5') {
                qty = '5+';
            }
            if (qty > '0') {
                this.uiEl.$sortByQty.val(qty);
                this.uiEl.$sortByQtyTxt.addClass('applyBlue').text(qty).parent().addClass('applyQuantity');
            } else {
                this.uiEl.$sortByQty.val('-1');
                this.uiEl.$sortByQtyTxt.removeClass('applyBlue').text(i18n.get('event.common.all.text')).parent().removeClass('applyQuantity');
            }
        },

        show: function() {
            if (gc.view === 'NON-GA' &&
                globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                return;
            }

            if ($('#filter').is(':visible')) {
                this.hide();
            } else {
                this.$el.removeClass('hide');
            }
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        openPriceFilter: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (gc.view === 'NON-GA' ||
                (gc.view === 'GA' && window.innerWidth >= globals.screen_breakpoints.tablet)
            ) {
                this.hide();
            }

            this.publishEvent('ticketListFooter:hidden');

            EventHelper.track({pageView: 'Advanced filter', appInteraction: 'Show Filter', pageload: false});
        },

        context: function() {
            return {
                globals: globals
            };
        }
    });
    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistFooterView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistFooterView;
});

define('models/event_disclosure_model',[
    'foobunny'
], function(Foobunny) {
    'use strict';

    var EventDisclosureModel = Foobunny.BaseModel.extend({

        initialize: function() {
            this.subscribeEvent('eventdisclosure:available', this.disclosuresReady);
        },

        disclosuresReady: function(alertMessage) {
            this.set('alertMessage', alertMessage);
        }
    });
    return EventDisclosureModel;
});

define('views/event_disclosure_view',[
    'foobunny',
    'hammer',
    'models/event_disclosure_model',
    'helpers/event_helper',
    'global_context'
    ], function(Foobunny, Hammer, EventDisclosureModel, EventHelper, gc) {
        'use strict';

        var $body = $('body');

        var EventDisclosureView = Foobunny.BaseView.extend({

            initialize: function() {
                console.log('EventDisclosureView-- in initialize()', this);

                this.model = new EventDisclosureModel();

                //show the disclosue when the flag is clicked on
                this.subscribeEvent('eventdisclosure:show', this.showDisclosures);

                //for disclosure onload - tracking has to fire after the page load tracking itself has fired
                this.subscribeEvent('eventdisclosure:setClickTracking', function() {
                    //make sure the disclosure is present
                    if (this.model.get('alertMessage')) {
                        //tracking for disclosure dialog upon first load
                        EventHelper.track({pageView: 'EventDisclosure', appInteraction: 'Viewed event disclosure', pageload: false});
                    }
                });

                this.disclosureShown = null;
                this.disclosureCookieName = 'event_' + gc.event_id + '_disclosureShown';
            },

            el: '#eventDisclosure',

            template: gc.appFolder + '/event_disclosure',

            events: {
                'tap #disclosure_button': 'close'
            },

            //this takes care of displaying the disclosue on load
            modelEvents: {
                'change': 'onModelChange'
            },

            onModelChange: function() {
                this.render();

                try {
                    this.disclosureShown = Foobunny.storage.getFromCookie(this.disclosureCookieName);
                } catch (e) {}

                if (!this.disclosureShown) {
                    this.showDisclosures();
                }
            },

            showDisclosures: function(data) {
                $body.addClass('overlay-active');
                this.$el.addClass('disclosureOverlayAnimate').removeClass('hide');

                // Set omniture for event disclosure view i.e for click from flag icon scenario
                if (data && data.trackDisclosureFlagClick) {
                    EventHelper.track({pageView: data.trackDisclosureFlagClick.prefix, appInteraction: data.trackDisclosureFlagClick.value, pageload: false});
                }
            },

            afterRender: function() {
                Hammer(this.el);
            },

            close: function(evt) {
                var domainMap = EventHelper.urlParser.getDomainMap();

                evt.stopPropagation();
                evt.preventDefault();

                this.$el.removeClass('disclosureOverlayAnimate').addClass('hide');
                $body.removeClass('overlay-active');

                try {
                    Foobunny.storage.setInCookie(this.disclosureCookieName, true, true, null, '.' + domainMap.domainName + '.' + domainMap.domainSuffix, '/', false);
                } catch (e) {}

                EventHelper.track({pageView: 'EventDisclosure', appInteraction: 'Acknowledged event disclosures', pageload: false});
            }

        });

    return EventDisclosureView;
});

define('models/primarypartner_model',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {

    'use strict';

    var PrimaryPartnerModel = Foobunny.BaseModel.extend({
        defaults: {
            isPartner: false,
            designation: ''
        },

        initialize: function() {
            this.urlHeaders = gc.url_headers || {};
        }
    });

    return PrimaryPartnerModel;

});

define('models/primarypartnerintegration_model',[
    'foobunny',
    'global_context'
    ], function(Foobunny, gc) {

    'use strict';

    // The Sell API hosts this API and returns the url to the partner's web page.
    var PrimaryPartnerIntegrationModel = Foobunny.BaseModel.extend({
        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {});
        },

        url: function() {
            return '/shape/partnerintegration/partnerevents/v1/' + gc.event_id;
        }
    });

    return PrimaryPartnerIntegrationModel;

});

define('models/performer_model',[
    'foobunny',
    'global_context'
], function(Foobunny, gc) {

    'use strict';

    var PerformerModel = Foobunny.BaseModel.extend({
        initialize: function() {
            this.urlHeaders = _.extend({}, gc.url_headers || {});
        },

        setPerformerId: function(performerId) {
            this.url = '/shape/catalog/performers/v3/' + performerId + '/?mode=internal';
        },

        parse: function(result) {
            var protocolPrefix = window.location.protocol + '//',
                partnerObject;

            // publish performers api response to globalContextVars
            if (result) {
                this.publishEvent('module:globalcontextvars:apiresponseready', {APIName: 'performers', data: result});
            }

            if (result.teamColors && result.teamColors[0] && result.teamColors[0].hexCode && result.teamColors[0].hexCode !== '') {
                result.primaryPerformerColor = result.teamColors[0].hexCode;
            }

            if (result.attributes) {
                result.isPartner = result.isHost = false;
                if (result.attributes.sell.host) {
                    partnerObject = result.attributes.sell.host;
                    result.isPartner = partnerObject.isInventorySupported || false;
                    result.isHost = true;
                    result.partnerLogo = null;
                    result.performerLogo = protocolPrefix + partnerObject.imageURL;
                } else if (result.attributes.sell.partner) {
                    partnerObject = result.attributes.sell.partner;
                    result.isPartner = partnerObject.isOfficialPartner || false;
                    result.isHost = false;
                    result.partnerLogo = protocolPrefix + partnerObject.groupingLogoUrl;
                    result.performerLogo = protocolPrefix + partnerObject.performerLogoUrl;
                }
            }

            return result;
        }
    });

    return PerformerModel;

});

define('views/primarypartner_view',[
    'foobunny',
    'hammer',
    'models/primarypartner_model',
    'models/primarypartnerintegration_model',
    'models/performer_model',
    'helpers/event_helper',
    'globals',
    'global_context',
    'i18n'
], function(Foobunny, Hammer, PrimaryPartnerModel, PrimaryPartnerIntegrationModel, PerformerModel, EventHelper, globals, gc, i18n) {
    'use strict';

    var PrimaryPartnerView = Foobunny.BaseView.extend({
        el: '#primary-partner-links',
        template: gc.appFolder + '/primarypartner_banner',

        initialize: function() {
            this.model = new PrimaryPartnerModel();

            this.subModels = {
                ppiModel: new PrimaryPartnerIntegrationModel(),
                performerModel: new PerformerModel()
            };

            this.ticketsAvailable = true;

            this.subscribeEvent('eventmodel:dataready', this.setEventModel);
            this.subscribeEvent('primarypartner:goToPrimaryPartner', this.goToPrimaryPartner);
            this.subscribeEvent('ticketlist:numberOfListings', this.numberOfListings);
        },

        events: {
            'click .see-partner-tickets-link': 'goToPrimaryPartner',
            'click .see-partner-tickets-button': 'goToPrimaryPartner'
        },

        fetchOnInitialize: false,

        setEventModel: function(eModel) {
            var self = this,
                groupings,
                groupingId,
                designationPrefix = 'event.primarypartner.designation.',
                designationString = '';

            this.subModels.eventModel = eModel;

            // Set the Name of the performer in the "Get more tickets for"
            this.model.set('primaryPerformer', this.subModels.eventModel.get('primaryPerformer'));

            // Set the designation since the designation is not returned by the API.
            // ancestor -> groupings
            //  81 = sports tickets
            try {
                // Some events may not have groupings. Hence, checking to see if it does have
                // grouping and if not then get the default.
                groupings = this.subModels.eventModel.get('ancestors').groupings;
                if (groupings && groupings.length > 0) {
                    groupingId = this.subModels.eventModel.get('ancestors').groupings[0].id;

                    // Lookup the string in the localization. If not found then use the default.
                    designationString = i18n.propsJson[designationPrefix + groupingId];

                    this.model.set('primaryGroupingId', groupingId);
                }

                if (!designationString) {
                    designationString = i18n.propsJson[designationPrefix + 'default'];
                }
            } catch (e) {
                designationString = i18n.propsJson[designationPrefix + 'default'];
            }
            this.model.set('designation', designationString);

            // Use setTimeout to make sure eventView rendered before this component fetchData/render
            setTimeout(function() {
                self.fetchData().then(function() {
                    self.render();
                });
            }, 0);
        },

        fetchData: function() {
            var self = this,
                fetchDeferred = $.Deferred(),
                fetchPerformerDeferred,
                fetchDataPromise = fetchDeferred.promise(),
                performerFetchDataPromise,
                primaryPerformerId = this.subModels.eventModel.getPrimaryPerformerId();

            // Make the API call only if we have valid data.
            if (primaryPerformerId !== '') {
                this.subModels.performerModel.setPerformerId(primaryPerformerId);
                performerFetchDataPromise = this.subModels.performerModel.fetch();
            } else {
                fetchPerformerDeferred = $.Deferred();
                performerFetchDataPromise = fetchPerformerDeferred.promise();
                fetchPerformerDeferred.resolve();
            }

            performerFetchDataPromise.done(function() {
                // Call the Partner API if this performer has isPartner set to true
                if (self.subModels.performerModel.get('isPartner') &&
                    !self.subModels.performerModel.get('isHost')) {
                    self.fetchPartnerIntegrationData();
                }

                // Update the model based on business logic. :(
                // 81 = MLB has a partner Logo.
                if (self.model.get('primaryGroupingId') === 81) {
                    self.model.set('partnerLogo', self.subModels.performerModel.get('partnerLogo'));
                    self.model.set('primaryPerformerHexColor', self.subModels.performerModel.get('primaryPerformerColor'));
                }
                self.model.set('primaryPerformerLogo', self.subModels.performerModel.get('performerLogo'));
                self.model.set('isPartner', self.subModels.performerModel.get('isPartner'));
                self.model.set('isHost', self.subModels.performerModel.get('isHost'));

                self.publishEvent('primarypartner:ready', self.model);
                fetchDeferred.resolve();
            });

            performerFetchDataPromise.fail(function(error) {
                self.errorOnFetchedData(error);
            });

            return fetchDataPromise;
        },

        fetchPartnerIntegrationData: function() {
            var self = this,
                ppiFetchDataPromise = this.subModels.ppiModel.fetch();
            ppiFetchDataPromise.done(function() {
                self.model.set('primaryEventPageURL', self.subModels.ppiModel.get('primaryEventPageURL'));
                self.updatePartnerBanner();
                self.publishEvent('primarypartner:ready', self.model);
            });
            ppiFetchDataPromise.fail(function(error) {
                // We are not using the regular errorOnFetchedData since we do not want
                // to hide the partner images even if the PPI API fails.
                //log failures in Splunk
                EventHelper.logAppState('fetch', error);
            });
        },

        errorOnFetchedData: function(error) {
            // Hide the Partner Links since we do not have the partner information.
            this.$el.addClass('hide');

            //log failures in Splunk
            EventHelper.logAppState('fetch', error);
        },

        afterRender: function() {
            var partnerGroupingId = this.model.get('primaryGroupingId'),
                primaryPerformer = this.model.get('primaryPerformer');

            if (this.model.get('isPartner')) {
                if (partnerGroupingId === 81) {
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-logo'), this.model.get('partnerLogo'));
                }

                this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), this.model.get('primaryPerformerLogo'));

                if (primaryPerformer !== '') {
                    this.$el.find('.primaryPerformer').text(primaryPerformer);
                }

                this.updatePartnerBanner();

                this.$el.removeClass('hide');
            } else if (this.subModels.eventModel && (SH.country === 'gb' || SH.country === 'de')) {
                // Ugly temp solution for UK to show performer, venue & grouping as partner performer. Should be removed once
                // front end teams finish building middle orchestration layer to support this.
                var logoURL,
                    partnerDesignation,
                    eventModel = this.subModels.eventModel,
                    eventPerformers = !!eventModel && eventModel.get('performers'),
                    primaryPerformerId = !!eventPerformers && eventPerformers[0].id,
                    venueId = !!eventModel && !!eventModel.get('venue') && this.subModels.eventModel.get('venue').id,
                    groupingId = !!eventModel && !!eventModel.get('groupings') && eventModel.get('groupings')[0].id,
                    partners = {
                        performers: [{
                            id: 165237,
                            name: 'Everton',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/165237.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 711353,
                            name: 'Northampton Saints',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/711353.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 711648,
                            name: 'Gloucester Rugby',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/711648.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 164987,
                            name: 'Tottenham Hotspur Tickets',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/164987.svg',
                            partnerDesignation: 'Official Ticket Marketplace'
                        }, {
                            id: 1495979,
                            name: 'Anthony Joshua',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/1495979.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, ],
                        venues: [{
                            id: 99499,
                            name: 'The O2',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-99499.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }, {
                            id: 197980,
                            name: 'Indigo O2',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-197980.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }, {
                            id: 7103,
                            name: 'SSE Wembley Arena',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/venue-7103.svg',
                            partnerDesignation: 'Official Ticket Resale Marketplace'
                        }],
                        groupings: [{
                            id: 1500210,
                            name: 'Matchroom Boxing',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/1500210.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 732823,
                            name: 'We Are FSTVAL',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/fstvl.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 700215,
                            name: 'Aviva Premiership Rugby Final',
                            logoURL: 'https://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/700215.svg',
                            partnerDesignation: 'Official Ticketing Partner'
                        }, {
                            id: 1505661,
                            name: 'Splash! Festival',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/splash.svg',
                            partnerDesignation: 'Offizieller Ticketing Partner'
                        }, {
                            id: 1505660,
                            name: 'Melt! Festival',
                            logoURL: 'http://cache1.stubhubstatic.com/promotions/scratch/ue-partners-logo/Melt!2016_Logo_SW.SVG',
                            partnerDesignation: 'Offizieller Ticketing Partner'
                        }]
                    };

                var primaryPerformerPartner = _.find(partners.performers, function(performer) {
                        return performer.id === primaryPerformerId;
                    }),
                    venuePartner = _.find(partners.venues, function(venue) {
                        return venue.id === venueId;
                    }),
                    groupingPartner = _.find(partners.groupings, function(grouping) {
                        return grouping.id === groupingId;
                    });

                // if is performer partner and grouping partner, show both logos
                if (!!primaryPerformerPartner && primaryPerformerPartner.logoURL && !!groupingPartner && groupingPartner.logoURL) {
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-logo'), groupingPartner.logoURL);
                    this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), primaryPerformerPartner.logoURL);
                    this.$el.find('.partner-designation').text(groupingPartner.partnerDesignation);
                    this.$el.removeClass('hide');
                }
                else {
                    logoURL = !!primaryPerformerPartner && primaryPerformerPartner.logoURL || !!venuePartner && venuePartner.logoURL ||
                        !!groupingPartner && groupingPartner.logoURL;
                    partnerDesignation = primaryPerformerPartner && primaryPerformerPartner.partnerDesignation || !!venuePartner && venuePartner.partnerDesignation ||
                        !!groupingPartner && groupingPartner.partnerDesignation;

                    if (logoURL && partnerDesignation) {
                        this.$el.addClass('partner-peformer-only');
                        this.addPrimaryPartnerLogos(this.$el.find('.partner-performer-logo'), logoURL);
                        this.$el.find('.partner-designation').text(partnerDesignation);
                        this.$el.removeClass('hide');
                    }
                }
            } else {
                this.$el.addClass('hide');
            }
        },

        addPrimaryPartnerLogos: function(elem, url) {
            var img = document.createElement('img');
            img.src = url;
            img.onload = function() {
                elem.append(this);
            };
            img.onerror = function() {
                elem.addClass('hide');
            };
        },

        addPrimaryPartnerIconSet: function(spanElem, iconset) {
            spanElem.addClass('sh-iconset ' + iconset);
            spanElem.removeClass('hide');
        },

        goToPrimaryPartner: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (!primaryPartnerUrl) {
                return;
            }

            EventHelper.track({pageView: 'Primary Partner', appInteraction: 'Go To Partner Site', pageload: false});
            window.open(primaryPartnerUrl);

            return false;
        },

        numberOfListings: function(nbr) {
            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (nbr === 0) {
                this.ticketsAvailable = false;
                $('.partner-gettickets-banner').addClass('hide');
            } else if (primaryPartnerUrl && primaryPartnerUrl !== '') {
                this.ticketsAvailable = true;
                $('.partner-gettickets-banner').removeClass('hide');
            }
        },

        updatePartnerBanner: function() {
            var primaryPartnerUrl = this.model.get('primaryEventPageURL');
            if (!this.ticketsAvailable) {
                $('.partner-gettickets-banner').addClass('hide');
            } else if (primaryPartnerUrl && primaryPartnerUrl !== '') {
                $('.partner-gettickets-banner').removeClass('hide');
            }
        }
    });

    return PrimaryPartnerView;

});

define('views/byomap_tooltip_view',[
    'foobunny',
    'global_context',
    'helpers/event_helper'
], function(Foobunny, gc, EventHelper) {
    'use strict';

    var ByomapTooltipView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/byomap_tooltip',

        events: {
            'tap': 'scrolltoUpgrade'
        },

        initialize: function() {
            //close tooltip on window resize
            $(window).resize(_.bind(this.winresize, this));
        },

        winresize: function() {
            if (this.$el.hasClass('byomap-tooltip')) {
                this.$el.addClass('hide');
            }
        },

        scrolltoUpgrade: function(ev) {
            //scroll to Upgrade Div

            if ($(ev.currentTarget).hasClass('upgrade') && $(ev.currentTarget).hasClass('byomap-tooltip')) {
                $('#event-byo-container').animate({scrollTop: $('.upgrade-listing').offset().top}, 400);
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade Seats Bubble Clicked', pageload: false});
            }
        },

        context: function() {
            return {
                markerType: this.$el.hasClass('upgrade') ? 'upgrade' : 'selected'
            };
        }
    });

    return ByomapTooltipView;
});
define('views/delivery_method_view',[
    'foobunny',
    'global_context',
    'models/singlelisting_model',
    'helpers/event_helper'
    ], function(Foobunny, gc, SingleListingModel, EventHelper) {
        'use strict';

        var DeliveryMethodView = Foobunny.BaseView.extend({
            initialize: function() {
                this.render();
                this.subscribeEvent('buildyourorder:getDeliveryDate', this.callSingleListing);
            },

            template: gc.appFolder + '/delivery_method',

            uiEl: {
                $deliverySpinner: '.delivery-spinner',
                $deliveryDate: '.deliverydate'
            },

            show: function() {
                this.uiEl.$deliveryDate.removeClass('hide');
            },

            callSingleListing: function(byoTicketModel) {
                var singleTicketPromise,
                    deliveryDate = byoTicketModel.get('deliveryDate'),
                    listingId = byoTicketModel.get('listingId'),
                    error,
                    self = this;

                this.uiEl.$deliverySpinner.removeClass('hide');

                // If delivery Date is present for Single ticket mode, do not make another api call
                if (deliveryDate) {
                    this.model = byoTicketModel;
                    this.displayDate();
                } else {
                    this.model = new SingleListingModel(listingId);

                    singleTicketPromise = this.model.fetch();

                    singleTicketPromise.done(function(response) {
                        if (response && response.deliveryMethods) {
                            byoTicketModel.setSilent('deliveryDate', response.deliveryMethods[0].estimatedDeliveryTime);
                            self.displayDate();
                        } else {
                            self.uiEl.$deliverySpinner.addClass('hide');
                        }
                    }).fail(function(errorResponse) {
                        self.uiEl.$deliverySpinner.addClass('hide');

                        if (errorResponse) {
                            error = errorResponse.responseJSON;

                            if (error && error.code === 'inventory.listings.listingAlreadySold' || error.code === 'inventory.listings.invalidListingid') {
                                self.publishEvent('deliveryMethodView:byoTicketExpired', byoTicketModel);
                                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
                            }
                        }
                    });
                }
            },

            displayDate: function() {
                var self = this;

                this.render();
                setTimeout(function() {
                    self.show();
                },0);
            }

        });

    return DeliveryMethodView;
});

define('views/parking_added_view',[
    'foobunny',
    'globals',
    'global_context',
    'helpers/event_helper'
    ], function(Foobunny, globals, gc, EventHelper) {
        'use strict';

        var ParkingAddedView = Foobunny.BaseView.extend({
            initialize: function() {
                this.subscribeEvent('parkingpass:add', this.addParking);
                this.subscribeEvent('parkingpass:remove', this.removeParking);
                this.subscribeEvent('buildyourorder:hidden', this.removeParking);
                this.subscribeEvent('buildyourorder:showParking', this.show);
            },

            template: gc.appFolder + '/parking_added',

            uiEl: {
                $totalParking: '.total-parking',
                $totalParkingQuantity: '.total-parking-quantity',
                $totalParkingSection: '.total-parking-section',
                $totalParkingAmount: '.total-parking-price',
                $totalParkingCurrency: '.total-parking-info .currency',
                $totalParkingEachText: '.total-parking-info .each',
            },

            addParking: function(parkingModel) {
                this.model = parkingModel;
                this.render();
                this.animate();
                globals.parking.isAddedToCart = true;
                this.model.set('parkingAdded', true);
            },

            removeParking: function(parkingModel) {
                var self = this;

                // animate
                if (parkingModel) {
                    this.uiEl.$totalParking.removeClass('animate-enter').addClass('animate-exit').parent().removeClass('animate-open');
                } else {
                    this.uiEl.$totalParking.removeClass('animate-enter').parent().removeClass('animate-open');
                }
                if (EventHelper.isMobile()) {
                    self.uiEl.$totalParking.addClass('hide');
                } else {
                    // timeout is required for animation
                    setTimeout(function() {
                        self.uiEl.$totalParking.addClass('hide');
                    }, 1000);
                }
                if (globals.parking.isAddedToCart === true) {
                    globals.parking.isAddedToCart = false;
                    this.model.set('parkingAdded', false);
                }
            },

            show: function() {
                this.uiEl.$totalParking.removeClass('hide').parent().addClass('animate-open');
            },


            animate: function() {
                var ref = EventHelper.getReferrer(),
                    refParams = ref.params.reduce(function(a, b) {
                        return a.concat(b);
                    }, []),
                    addParkingTop;

                // animate
                if (refParams.indexOf('pA') > -1 ) {
                    if (!EventHelper.isMobile()) {
                        addParkingTop = $('.parking-container').position().top;
                        this.uiEl.$totalParking.parents('#event-byo-container').animate({
                            scrollTop: addParkingTop
                        }, 'fast');
                    }
                } else {
                    if (!EventHelper.isMobile()) {
                        this.uiEl.$totalParking.parents('#event-byo-container').animate({scrollTop: 0},400);
                    }
                }
                this.uiEl.$totalParking.removeClass('animate-exit').addClass('animate-enter').removeClass('hide').parent().addClass('animate-open');
            }
        });

    return ParkingAddedView;
});

define('views/byo_listing_info_view',[
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/singlelisting_model',
    'models/event_model',
    'views/delivery_method_view',
    'views/parking_added_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper'

], function(Foobunny, Hammer, globals, gc, SingleListingModel, EventModel, DeliveryMethodView, ParkingAddedView, i18n, currencyFormatUtil, EventHelper, CartHelper) {
    'use strict';

    var ByoListingInfoView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/byo_listing_info',

        events: {
            'tap .checkout': 'byoCheckout',
            'tap .see-more-container .see-more-byo': 'displayMoreFeatures',
            'change .byo-quantity': 'updateByoQuantity'
        },

        uiEl: {
            $listingInfoContainer: '.listing-info-wrapper',
            $currentListing: '.current-listing',
            $upgradeText: '.upgraded-wrapper',
            $seatNumberText: '.seat-info-text .seatInfo',
            $seatNumbers: '.seat-info-text .seatNumbers',
            $noSeatNumberText: '.seat-info-text .noseatInfo',
            $moreFeatures: '.seat-feature .feature-disclosures .more-features',
            $seeFeaures: '.see-more-container .see-more-text',
            $seeFeauresIcon: '.see-more-container .see-more-icon',
            $deliveryDate: '.delivery-container .delivery-date',
            $qtySelector: '.byo-quantity',
            $byoQtyText: '.qty-box .selected-qty',
            $totalParking: '.total-parking',
            $totalParkingQuantity: '.total-parking-quantity',
            $totalParkingSection: '.total-parking-section',
            $totalParkingAmount: '.total-parking-price',
            $totalParkingCurrency: '.total-parking-info .currency',
            $totalParkingEachText: '.total-parking-info .each',
            $checkoutButton: '.checkout',
            $blurredText: '.blurred-text',
            $byoEventInfo: '.byo-event-info'
        },

        initialize: function(options) {
            this.subViews = {
                deliveryView: new DeliveryMethodView({
                    el: '.current-listing .delivery-date'
                }),
                parkingAddedView: new ParkingAddedView({
                    el: '.listing-info-wrapper .total-parking-container'
                })
            };

            this.subModels = {
                eventModel: options.eventData
            };

            this.subscribeEvent('buildyourorder:displayed', this.displayListingInfo);
            this.subscribeEvent('buildyourorder:checkout', this.byoCheckout);
            this.subscribeEvent('upgradeTicket:add', this.updateByoListing);
            this.subscribeEvent('similarTicket:add', this.updateByoListing);
            this.subscribeEvent('upgradeTicket:remove', this.removeUpgradedTicket);
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.showDisabledInfo);
        },

        context: function() {
            return {
                globals: globals,
                features: this.iconFeatures
            };
        },

        afterRender: function() {
            Hammer(this.el);
        },

        displayListingInfo: function(hideGlobalHeader, ticketModel, onPageLoad) {
            this.model = ticketModel;

            var feature = this.model.get('listingAttributeList') || [],
                iconFeature = [],
                disclosures = [];

            if (!EventHelper.useCart()) {
                if (globals.upgradeTicket.isTicketUpgraded === true) {
                    EventHelper.setUrlParam('ticket_id', this.model.get('listingId'));
                } else {
                    EventHelper.setUrlParams([
                        {
                            name: 'ticket_id',
                            value: this.model.get('listingId')
                        },
                        {
                            name: 'ticketRank',
                            value: this.model.get('ticketRank')
                        }
                    ]);
                }
            }

            // re-arrange listingAttribute to display in BYO page
            for (var index = 0; index < feature.length; index++) {
                if (feature[index].featureIcon) {
                    if (feature[index].featureIcon === 'none') {
                        if (disclosures.length < 1) {
                            feature[index].displayAlertIcon = true;
                        }
                        disclosures.push(feature[index]);
                    } else {
                        iconFeature.push(feature[index]);
                    }
                }
            }

            this.iconFeatures = iconFeature.concat(disclosures);
            this.model.set('deliveryType', this.model.get('deliveryTypeList'));

            this.render();

            // fetch single ticket for EDD
            this.displayDeliveryDate();

            this.setOnloadQty();

            // if Single ticket mode and ticket is Upgraded make single listing api call for old ticket
            if (EventHelper.isSingleTicketMode() && globals.upgradeTicket.isTicketUpgraded && !onPageLoad) {
                this.getOldTicketListing();
            }

            // display parking
            if (globals.parking.isAddedToCart) {
                this.publishEvent('buildyourorder:showParking');
            }
        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$moreFeatures.hasClass('expand')) {
                this.uiEl.$moreFeatures.slideUp(400);
                this.uiEl.$moreFeatures.removeClass('expand');
                this.uiEl.$seeFeaures.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$seeFeauresIcon.text('+');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$moreFeatures.slideDown(400);
                this.uiEl.$moreFeatures.addClass('expand');
                this.uiEl.$seeFeaures.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$seeFeauresIcon.text('-');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        setOnloadQty: function() {
            var splitVector = this.model.get('splitVector'),
                preserveByoQty = parseInt(globals.byo.quantity),
                quantity = preserveByoQty ? preserveByoQty : this.model.get('qty'),
                qtyText = i18n.get('event.common.tickets.text');

            if (splitVector.length > 1) {
                if (quantity > 0) {
                    if (quantity === 1) {
                        qtyText = i18n.get('event.common.ticket.text');
                    }

                    this.uiEl.$byoQtyText.text(quantity + ' ' + qtyText);
                    this.uiEl.$qtySelector.val(quantity);
                    EventHelper.setUrlParam('byo_qty', quantity);
                } else {
                    quantity = splitVector[0];
                    if (quantity === 1) {
                        qtyText = i18n.get('event.common.ticket.text');
                    }

                    this.uiEl.$byoQtyText.text(quantity + ' ' + qtyText);
                    EventHelper.setUrlParam('byo_qty', quantity);
                }
            } else {
                EventHelper.setUrlParam('byo_qty', quantity);
            }
            this.updateSeatText(quantity);
        },

        updateByoQuantity: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var qty = this.uiEl.$qtySelector.val(),
                oldModel = this.model.clone(),
                addPromise,
                deletePromise,
                self = this;

            if (EventHelper.useCart()) {
                this.uiEl.$checkoutButton.addClass('disabled');

                // Delete the existing item from the cart.
                deletePromise = CartHelper.deleteFromCart(this.model);
                deletePromise.done(function() {
                    // Now add the same item with the new quantity.
                    self.model = oldModel.clone();
                    self.model.setSilent('qty', qty);
                    addPromise = CartHelper.addToCart(self.model);
                    addPromise.done(function() {
                        self.updateQtyInCartSuccess();
                    }).fail(function() {
                        self.updateQtyInCartFailed();
                    }).always(function() {
                        self.uiEl.$checkoutButton.removeClass('disabled');
                    });
                }).fail(function() {
                    self.updateQtyInCartFailed();
                    self.uiEl.$checkoutButton.removeClass('disabled');
                });
            } else {
                this.updateQtyInCartSuccess();
            }
        },

        updateQtyInCartSuccess: function() {
            var qty = this.uiEl.$qtySelector.val(),
                splitVector,
                qtyText = i18n.get('event.common.tickets.text');

            if (qty === '1') {
                qtyText = i18n.get('event.common.ticket.text');
            }

            EventHelper.setUrlParam('byo_qty', qty);
            this.model.set('qty', qty);

            if (globals.upgradeTicket.isTicketUpgraded === true) {
                splitVector = this.originalListing.get('splitVector');

                if (splitVector.indexOf(Number(qty)) !== -1) {
                    globals.byo.quantity = qty;
                }
            } else {
                globals.byo.quantity = qty;
            }

            // show quantity selected on the label
            this.uiEl.$byoQtyText.text(qty + ' ' + qtyText);
            // update seat info text
            this.updateSeatText(qty);

            // Update Upgraded Ticket
            if (globals.upgradeTicket.display) {
                this.publishEvent('buildyourorder:displayUpgrade', this.model);
            }

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Selected Quantity', pageload: false, filterType: 'Selected QuantityL: ' + qty, userExperienceSnapshot: {quantityL: 'QuantityL: ' + qty}});
        },

        updateQtyInCartFailed: function() {
            CartHelper.resetCart();
            gc.cart_id = null;
            EventHelper.removeUrlParam('cart_id');

            this.publishEvent('buildyourorder:notickets');
        },

        updateSeatText: function(qtySelected) {
            var seatTextString = '',
                infoTextString = '',
                seatNumbersArray = this.model.get('seatNumbersArray'),
                listingAttributeList = this.model.get('listingAttributeList') || [],
                listingAttributeListLength = listingAttributeList.length,
                seatNumbers,
                isSeatNumberAvailable;

            if (seatNumbersArray[0] === 'General Admission') {
                seatNumbers = seatNumbersArray[0];
            } else {
                seatNumbers = seatNumbersArray ? seatNumbersArray.join(', ') : [];
            }

            isSeatNumberAvailable = (seatNumbers &&
                                    seatNumbers !== '' &&
                                    seatNumbers !== 'General Admission');

            this.model.set('qty', qtySelected);

            // Update the string to be displayed in the ticket details.
            if (parseInt(qtySelected) > 1) {
                infoTextString = i18n.get('event.common.ticketdetails.seats.info', {qty: qtySelected});

                // Check if ticket has piggyback attribute
                if (listingAttributeListLength > 0) {
                    for (var attributeId = 0; attributeId < listingAttributeListLength; attributeId++) {
                        if (listingAttributeList[attributeId].id === 501) {
                            infoTextString = i18n.get('event.common.ticketdetails.seats.piggyback.info', {qty: qtySelected});
                            break;
                        }
                    }
                }

                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$seatNumberText.text(infoTextString);
                    this.uiEl.$seatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$noSeatNumberText.text(i18n.get('event.common.ticketdetails.seatstogether.text'));
                }
            } else {
                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$seatNumberText.text(i18n.get('event.common.ticketdetails.seat.one'));
                    this.uiEl.$seatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$noSeatNumberText.text(i18n.get('event.common.ticketdetails.seatprintedonticket.text'));
                }
            }
        },

        displayDeliveryDate: function() {
            // Make single listing API call only if delivery type is not instant Download
            if (this.model.get('deliveryTypeList') && this.model.get('deliveryTypeList').length > 0 && this.model.get('deliveryTypeList')[0].id === 2) {
                return;
            }

            this.publishEvent('buildyourorder:getDeliveryDate', this.model);
        },

        byoCheckout: function(evt) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            var self = this,
                cartModels;

            if (EventHelper.useCart() && !EventHelper.isBlendedEvent() && !EventHelper.showParkingAddon()) {
                cartModels = CartHelper.getEventListingsFromCart(gc.event_id);
                if (cartModels.length > 1) {
                    // ERROR: We cannot send this transaction to XO since the cart has more than 1 regular listings.
                    console.log('Cart has more than 1 regular listing', cartModels);
                }
            } else {
                setTimeout(function() {
                    self.publishEvent('url:checkout', {
                        tid: self.model.get('listingId'),
                        qty: self.model.get('qty')
                    });
                }, 300);
            }

            if (!gc.ticket_id) {
                EventHelper.setUrlParam('cb', '1');
            }

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout', pageload: false});
        },

        updateByoListing: function(upgradeModel) {
            this.originalListing = this.model;
            this.ticketUpgraded = true;

            this.displayListingInfo('', upgradeModel, true);
        },

        removeUpgradedTicket: function(upgradeModel) {
            var upgradeTag = 'Upgrade-removed',
                upgradeDisplay = 'Remove Upgrade Clicked';

            this.ticketUpgraded = false;
            this.displayListingInfo('', this.originalListing, true);

            if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgrade-removed-Accordion';
                upgradeDisplay = 'Remove Upgrade-Accordion Clicked';
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + upgradeModel.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + upgradeModel.get('usePrice').amount,
                userExperienceSnapshot: {
                    ticketId: 'ListingId Selected: ' + this.originalListing.get('listingId'),
                    upgradeListingId: upgradeTag + ' ListingId: ' + upgradeModel.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + upgradeModel.get('usePrice').amount
                }
            });
        },

        getOldTicketListing: function() {
            var singleTicketPromise,
                singleTicketModel = new SingleListingModel(globals.upgradeTicket.oldTicketListingId),
                self = this;

                // If delivery Date is present for Single ticket mode, do not make another api call
                singleTicketPromise = singleTicketModel.fetch();

                singleTicketPromise.done(function() {
                    self.originalListing = singleTicketModel;
                    self.publishEvent('byoListingInfo:oldTicketInfo', self.originalListing);
                }).fail(function() {
                    self.publishEvent('byoListingInfo:oldTicketInfoError');
                });
        },

        showDisabledInfo: function() {
            this.uiEl.$listingInfoContainer.addClass('hide');
            this.uiEl.$checkoutButton.addClass('disabled');
            $('#event-build-your-order').find('.accordion-checkout').addClass('disabled');
            this.uiEl.$blurredText.removeClass('hide');
        }
    });
    return ByoListingInfoView;
});

define('models/upgrade_ticket_model',[
    'foobunny',
    'global_context',
    'globals',
    'models/singlelisting_model',
    'helpers/event_helper'
], function(Foobunny, gc, globals, SingleListingModel, EventHelper) {
    'use strict';

    var UpgradeTicketModel = SingleListingModel.extend({
        initialize: function() {
            this.url = '';
            this.urlHeaders = gc.url_headers || {};
        },

        prepareUpgradeUrl: function(byoTicketData) {
            var url = '/shape/recommendations/ticket/v2/alternatelistings/upsell?numberOfListings=1&eventId=' + gc.event_id + '&algorithmId=' + globals.upgradeTicket.apiAlgorithmId;

            //filter quantity
            url += '&seatQuantity=' + byoTicketData.qty;
            this.qty = byoTicketData.qty;

            url += '&currentPrice=' + byoTicketData.price;

            url += '&listingId=' + byoTicketData.listingId;

            this.url = url;
        },

        fetchFail: function(error) {
            var logdata;

            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        parse: function(result) {
            var listing = result;
            if (result.listing) {
                listing = SingleListingModel.prototype.parse(result.listing[0].listing);

                listing.quantity = this.qty;
            }

            return listing;
        }
    });
    return UpgradeTicketModel;
});

define('helpers/map_helper',[
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

/* global _ */
define('views/upgrade_ticket_view',[
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/upgrade_ticket_model',
    'views/delivery_method_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'helpers/map_helper'
], function(Foobunny, Hammer, globals, gc, UpgradeTicketModel, DeliveryMethodView, i18n, currencyFormatUtil, EventHelper, CartHelper, MapHelper) {
    'use strict';

    var UpgradeTicketView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/upgrade_ticket',

        events: {
            'click .upgrade-button.add-upgrade': 'addUpgradeTicket',
            'click .upgrade-button.remove-upgrade': 'removeUpgradeTicket',
            'click .upgrade-box ': 'openUpgradeDetails',
            'click .upgrade-see-more-container .upgrade-see-more': 'displayMoreFeatures',
            'click .upgrade-seatmap': 'displayMapOverlay',
            'click .compare-seats-button': 'displayMapOverlay',
            'click .upgrade-pip .upgrade-vfs': 'enlargeUpgradeVfs'
        },

        uiEl: {
            $upgradeContainer: '.upgrade-ticket-container',
            $upgradeBox: '.upgrade-box',
            $upgradedBoxDiff: '.upgrade-box .price-diff',
            $upgradedText: '.upgrade-box .upgraded-text',
            $expandArrow: '.upgrade-box .expand-arrow',
            $collapseArrow: '.upgrade-box .collapse-arrow',
            $upgradeHeader: '.upgrade-header ',
            $upgradeDifference: '.upgrade-ticket-container .price-diff',
            $upgradeVfs: '.upgrade-vfs',
            $noVfsText: '.novfs-text',
            $upgradeSeatMap: '.upgrade-seatmap',
            $compareSeat: '.compare-seats-button',
            $upgradeMap: '.upgrade-seatmap',
            $upgradeSeatNumberText: '.seat-info-text .seatInfo',
            $upgradeSeatNumbers: '.seat-info-text .seatNumbers',
            $upgradeNoSeatNumberText: '.seat-info-text .noseatInfo',
            $upgradeFeatureIcons: '.upgrade-feature-icons-wrapper',
            $upgradeMoreFeatures: '.upgrade-ticket-container .view-more-container',
            $upgradeMoreText: '.upgrade-see-more-container .upgrade-see-more-text',
            $upgradeMoreIcon: '.upgrade-see-more-container .upgrade-see-more-icon',
            $upgradeAmount: '.upgrade-ticket-container .upgrade-amount',
            $checkIcon: '.selected-check',
            $upgrade: '.upgrade-button',
            $upgradeButton: '.upgrade-button .button-text',
            $ticketNotAvailable: '.ticket-notavailable',
            $ticketNotAvailableMessage: '.ticket-notavailable .ticket-msg',
            $spinner: '.upgrade-button .upgrade-spinner'
        },

        initialize: function() {
            this.oldTicketInfoAvailable = true;
            this.originalTicketModel = null;

            this.subscribeEvent('buildyourorder:displayUpgrade', this.fetchUpgradeTicket);
            this.subscribeEvent('byoListingInfo:oldTicketInfo', this.processOldTicketData);
            this.subscribeEvent('byoListingInfo:oldTicketInfoError', this.handleOldTicketError);
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.handleTicketExpired);
            this.subscribeEvent('buildyourorder:hidden', this.byoClosed);

            $(window).resize(_.bind(this.layoutSettings, this));
        },

        context: function() {
            return {
                globals: globals
            };
        },

        afterRender: function() {
            Hammer(this.el);
        },

        hideUpgrade: function() {
            this.$el.addClass('hide');
            this.publishEvent('upgradeTicket:hidden');
        },

        showUpgrade: function() {
            var ticketInfo = {};

            $('#event-byo-container .upsell-header').removeClass('hide');
            this.$el.removeClass('hide');
            this.publishEvent('upgradeTicket:displayed', this.model);
            this.upgradeMapClone();

            if (globals.upgradeTicket.isTicketUpgraded) {
                this.disabledUpgradeMap();
            } else {
                ticketInfo.id = this.originalTicketModel.get('listingId');
                ticketInfo.price = this.originalTicketModel.get('usePrice').amount;
                this.upgradeDisplayOmniture(ticketInfo);

                if (this.isStaticMap()) {
                    this.disabledUpgradeMap();
                }
            }
        },

        displayMapOverlay: function(evt) {
            if (this.isStaticMap()) {
                return;
            }

            var target = $(evt.currentTarget);

            globals.isByoMapOverlayDisplayed = true;
            this.publishEvent('upgradeTicket:displayMapOverlay');

            if (target.hasClass('compare-seats-button')) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Compare Button Clicked', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Map Thumbnail Clicked', pageload: false});
            }
        },

        fetchUpgradeTicket: function(originalTicketModel) {
            var upgradeTicketPromise,
                qty,
                listingData = {},
                self = this;

            this.originalTicketModel = originalTicketModel;

            self.$el.removeClass('ticket-error');

            if (globals.upgradeTicket.isTicketUpgraded) {
                if (this.model && this.model.get('sectionId') === originalTicketModel.get('sectionId')) {
                    this.updateSeatInfo();
                } else {
                    this.model = originalTicketModel;
                    this.updateUpgradeView(originalTicketModel);
                }

            } else {
                this.model = new UpgradeTicketModel();
                qty = parseInt(originalTicketModel.get('qty'));
                listingData.listingId = originalTicketModel.get('listingId');
                listingData.price = originalTicketModel.get('usePrice').amount;
                if (qty < 1) {
                    listingData.qty = globals.byo.quantity ? globals.byo.quantity : originalTicketModel.get('splitVector')[0];
                } else {
                    listingData.qty = globals.byo.quantity ? globals.byo.quantity : qty;
                }

                this.model.setSilent('originalTicketListingId', originalTicketModel.get('listingId'));

                this.model.prepareUpgradeUrl(listingData);

                upgradeTicketPromise = this.model.fetch();

                upgradeTicketPromise.done(function(response) {
                    if (_.isEmpty(response) || response.listingError) {
                        self.hideUpsellHeader();
                        self.hideUpgrade();
                        return;
                    }

                    self.oldTicketInfoAvailable = true;
                    self.updateUpgradeView(originalTicketModel);
                }).fail(function() {
                    self.hideUpsellHeader();
                    self.hideUpgrade();
                });
            }
        },

        updateUpgradeView: function(originalTicketModel) {
            if (this.selectedTicketNotAvailable) {
                return;
            }

            var self = this,
                qty = parseInt(originalTicketModel.get('qty')),
                originalTicketPrice = parseFloat(originalTicketModel.get('usePrice').amount),
                price = parseFloat(this.model.get('usePrice').amount),
                sectionId = this.model.get('sectionId'),
                priceDiff = (price - originalTicketPrice).toFixed(2);

            this.model.setSilent({
                qty: qty,
                quantity: qty,
                priceDiff: priceDiff
            });

            this.render();

            priceDiff = EventHelper.formatPrice(priceDiff, false);
            setTimeout(function() {
                self.updateSeatInfo();
                // Get the VFS
                if (MapHelper.isStaticMap()) {
                    // Override success method with vfsfail()
                    EventHelper.showVfs(self.uiEl.$upgradeVfs.find('img')[0], 'medium', sectionId, self.vfsFailure.bind(self), self.vfsFailure.bind(self));
                } else {
                    EventHelper.showVfs(self.uiEl.$upgradeVfs.find('img')[0], 'medium', sectionId, self.vfsSuccess.bind(self), self.vfsFailure.bind(self));
                }
                self.showUpgrade();
            }, 0);
        },

        vfsSuccess: function() {
        },

        vfsFailure: function() {
            this.uiEl.$upgradeVfs.addClass('upgrade-no-vfs');
            this.uiEl.$noVfsText.removeClass('hide');
            this.uiEl.$upgradeVfs.find('.upgrade-image').attr('src', globals.noVfsImgUrl);
        },

        addUpgradeTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.uiEl.$upgrade.addClass('disabled');

            if (EventHelper.useCart()) {
                this.addToCart();
            } else {
                EventHelper.setUrlParam('oldtktid', this.model.get('originalTicketListingId'));
                //ticket rank is undefined for upgrade ticket so remove it from url params
                EventHelper.removeUrlParam('ticketRank');

                this.addUpgradeSuccess();
            }
        },

        addToCart: function() {
            var self = this,
                addPromise,
                deletePromise;

            this.$el.addClass('adding-to-cart');
            this.uiEl.$spinner.removeClass('hide');

            addPromise = CartHelper.addToCart(this.model);
            addPromise.done(function() {
                self.addUpgradeSuccess();

                // Remove the original listing from the cart. If failed, then retry to remove it.
                deletePromise = CartHelper.deleteFromCart(self.originalTicketModel);
            }).fail(function() {
                self.addUpgradeFailure();
            }).always(function() {
                self.uiEl.$spinner.addClass('hide');
                self.$el.removeClass('adding-to-cart');
            });
        },

        addUpgradeSuccess: function() {
            var self = this,
                upgradeTag = 'Upgraded',
                upgradeDisplay = 'Upgrade Clicked';

            globals.upgradeTicket.isTicketUpgraded = true;
            this.publishEvent('upgradeTicket:add', this.model);

            setTimeout(function() {
                self.$el.addClass('upgrade-selected');
                self.uiEl.$checkIcon.removeClass('hide');
                self.uiEl.$upgradedBoxDiff.addClass('hide');
                self.uiEl.$upgradedText.removeClass('hide');
                self.uiEl.$upgrade.removeClass('add-upgrade disabled').addClass('remove-upgrade');
                self.disabledUpgradeMap();
                if (globals.byo.upsellAccordion && EventHelper.isMobile()) {
                    self.uiEl.$upgradeHeader.addClass('hide');
                } else {
                    self.uiEl.$upgradeHeader.addClass('invisible');
                }
                self.uiEl.$upgradeButton.text(i18n.get('event.common.byo.listing.removeupgrade'));

                if (!EventHelper.isMobile()) {
                    $('#event-build-your-order .byo-event-info').removeClass('hide');
                }
            },10);

            // animate
            if (!EventHelper.isMobile()) {
                $('#event-byo-container').animate({scrollTop: 0}, 400);
            } else if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgraded-Accordion';
                upgradeDisplay = 'Upgrade-Accordion Clicked';
                this.openUpgradeDetails();
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + this.model.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: upgradeTag + ' ListingId: ' + this.model.get('listingId'),
                    ticketId: 'ListingId Selected: ' + this.model.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                    originalListingId: 'Original ListingId:' + this.originalTicketModel.get('listingId'),
                    originalListingPrice: 'Original Listing Price: ' + this.originalTicketModel.get('usePrice').amount
                }
            });

        },

        addUpgradeFailure: function() {
            this.showTicketNotAvailable('event.upgradeticket.upgradenotavailable');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade Ticket Sold Out', pageload: false});
        },

        removeUpgradeTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.uiEl.$upgrade.addClass('disabled');

            if (EventHelper.useCart()) {
                this.removeFromCart();
            } else {
                EventHelper.removeUrlParam('oldtktid');

                this.removeUpgradeSuccess();
            }
        },

        removeFromCart: function() {
            var addPromise,
                deletePromise,
                self = this;

            this.$el.addClass('adding-to-cart');
            this.uiEl.$spinner.removeClass('hide');

            addPromise = CartHelper.addToCart(this.originalTicketModel);
            addPromise.done(function() {
                self.removeUpgradeSuccess();

                // Remove the original listing from the cart.
                deletePromise = CartHelper.deleteFromCart(self.model);
                deletePromise.fail(function() {
                    self.publishEvent('buildyourorder:notickets');
                    CartHelper.resetCart();
                    gc.cart_id = null;
                    EventHelper.removeUrlParam('cart_id');
                });
            }).fail(function() {
                self.removeUpgradeFailure();
            }).always(function() {
                self.uiEl.$spinner.addClass('hide');
                self.$el.removeClass('adding-to-cart');
            });
        },

        removeUpgradeSuccess: function() {
            if (!this.oldTicketInfoAvailable) {
                this.showTicketNotAvailable('event.upgradeticket.originalnotavailable');
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
            } else {
                var self = this;

                globals.upgradeTicket.isTicketUpgraded = false;
                this.publishEvent('upgradeTicket:remove', this.model);

                setTimeout(function() {
                    self.$el.removeClass('upgrade-selected');
                    self.uiEl.$checkIcon.addClass('hide');
                    self.uiEl.$upgradedBoxDiff.removeClass('hide');
                    self.uiEl.$upgradedText.addClass('hide');
                    self.uiEl.$upgrade.removeClass('remove-upgrade disabled').addClass('add-upgrade');
                    self.uiEl.$upgradeHeader.removeClass('invisible');
                    self.uiEl.$upgradeButton.text(i18n.get('event.common.byo.listing.upgrade'));
                    if (!EventHelper.isMobile()) {
                        $('#event-build-your-order .byo-event-info').removeClass('hide');
                    }
                    self.enabledUpgradeMap();
                },10);

                if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                    this.openUpgradeDetails();
                }
            }
        },

        removeUpgradeFailure: function() {
            this.showTicketNotAvailable('event.upgradeticket.originalnotavailable');
            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Ticket Sold Out', pageload: false});
        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$upgradeMoreFeatures.hasClass('expand')) {
                this.uiEl.$upgradeFeatureIcons.removeClass('hide');
                this.uiEl.$upgradeMoreFeatures.addClass('hide');
                this.uiEl.$upgradeMoreFeatures.removeClass('expand');
                this.uiEl.$upgradeMoreText.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$upgradeMoreIcon.text('+');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$upgradeFeatureIcons.addClass('hide');
                this.uiEl.$upgradeMoreFeatures.removeClass('hide');
                this.uiEl.$upgradeMoreFeatures.addClass('expand');
                this.uiEl.$upgradeMoreText.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$upgradeMoreIcon.text('-');

                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        updateSeatInfo: function() {
            var seatTextString = '',
                infoTextString = '',
                qtySelected = this.model.get('qty'),
                seatNumbersArray = this.model.get('seatNumbersArray'),
                seatNumbers = seatNumbersArray ? seatNumbersArray.join(', ') : [],
                isSeatNumberAvailable = (seatNumbers &&
                                        seatNumbers !== '' &&
                                        seatNumbers !== 'General Admission'),
                listingAttributeList = this.model.get('listingAttributeList') || [],
                listingAttributeListLength = listingAttributeList.length;

            // Update the string to be displayed in the ticket details.
            if (parseInt(qtySelected) > 1) {
                infoTextString = i18n.get('event.common.ticketdetails.seats.info', {qty: qtySelected});

                // Check if ticket has piggyback attribute
                if (listingAttributeListLength > 0) {
                    for (var attributeId = 0; attributeId < listingAttributeListLength; attributeId++) {
                        if (listingAttributeList[attributeId].id === 501) {
                            infoTextString = i18n.get('event.common.ticketdetails.seats.piggyback.info', {qty: qtySelected});
                            break;
                        }
                    }
                }

                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$upgradeSeatNumberText.text(infoTextString);
                    this.uiEl.$upgradeSeatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$upgradeNoSeatNumberText.text(i18n.get('event.common.ticketdetails.seatstogether.text'));
                }
            } else {
                if (isSeatNumberAvailable) {
                    seatTextString = seatNumbers;
                    this.uiEl.$upgradeSeatNumberText.text(i18n.get('event.common.ticketdetails.seat.one'));
                    this.uiEl.$upgradeSeatNumbers.text(seatTextString);
                } else {
                    this.uiEl.$upgradeNoSeatNumberText.text(i18n.get('event.common.ticketdetails.seatprintedonticket.text'));
                }
            }
        },

        processOldTicketData: function(oldTicketModel) {
            var originalTicketPrice = parseFloat(oldTicketModel.get('usePrice').amount),
                price = parseFloat(this.model.get('usePrice').amount),
                ticketInfo = {},
                priceDiff = (price - originalTicketPrice).toFixed(2);

            this.model.setSilent({
                priceDiff: priceDiff
            });

            ticketInfo.id = oldTicketModel.get('listingId');
            ticketInfo.price = oldTicketModel.get('usePrice').amount;

            this.uiEl.$upgradedBoxDiff.find('.price_value').text(priceDiff);
            this.uiEl.$upgradeDifference.find('.price_value').text(priceDiff);

            this.upgradeDisplayOmniture(ticketInfo);
        },

        handleOldTicketError: function() {
            this.oldTicketInfoAvailable = false;
        },

        showTicketNotAvailable: function(msgId) {
            var self = this;

            this.uiEl.$ticketNotAvailableMessage.text(i18n.get(msgId));
            this.uiEl.$upgradeContainer.slideUp(500, function() {
                self.uiEl.$ticketNotAvailable.slideDown(500);
                self.$el.removeClass('upgrade-selected').addClass('ticket-error');
            });
        },

        byoClosed: function() {
            this.selectedTicketNotAvailable = false;
            this.hideUpgrade();
        },

        handleTicketExpired: function() {
            this.selectedTicketNotAvailable = true;

            this.hideUpsellHeader();

            this.hideUpgrade();
        },

        hideUpsellHeader: function() {
            if ($('#event-byo-container .parking-component').length < 1) {
                $('#event-byo-container .upsell-header').addClass('hide');
            }
        },

        openUpgradeDetails: function() {
            if (this.uiEl.$upgradeBox.hasClass('expand')) {
                this.uiEl.$upgradeBox.removeClass('expand');
                this.uiEl.$expandArrow.removeClass('hide');
                this.uiEl.$collapseArrow.addClass('hide');
                this.uiEl.$upgradeContainer.slideUp(500);
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Upgrade Accordion Closed', pageload: false});
            } else {
                this.uiEl.$upgradeBox.addClass('expand');
                this.uiEl.$expandArrow.addClass('hide');
                this.uiEl.$collapseArrow.removeClass('hide');
                this.uiEl.$upgradeContainer.slideDown(500);
                this.addMarkersToMap();
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Upgrade Accordion Opened', pageload: false});
            }
        },

        layoutSettings: function() {
            if (!globals.byo.upsellAccordion) {
                return;
            }

            if (!EventHelper.isMobile()) {
                if (globals.upgradeTicket.isTicketUpgraded) {
                    this.uiEl.$upgradeHeader.addClass('invisible').removeClass('hide');
                } else {
                    this.uiEl.$upgradeHeader.removeClass('hide');
                }

                this.uiEl.$upgradeContainer.css('display', '');
                this.uiEl.$upgradeContainer.removeClass('hide');
            } else {
                this.uiEl.$collapseArrow.addClass('hide');
                this.uiEl.$expandArrow.removeClass('hide');
                this.uiEl.$upgradeContainer.addClass('hide');
                this.uiEl.$upgradeBox.removeClass('expand');
            }
        },

        upgradeMapClone: function() {
            var byoSvgMap,
                svgimg,
                svgns = 'http://www.w3.org/2000/svg',
                xlink = 'http://www.w3.org/1999/xlink',
                whiteColor = '#FFFFFF',
                removeMapColors = {
                    'fill': whiteColor,
                    'fill-opacity': 0.2,
                    'stroke': whiteColor,
                    'stroke-width': 0,
                    'stroke-opacity': 0
                };

            this.uiEl.$upgradeSeatMap.children().eq(1).remove();
            this.uiEl.$upgradeSeatMap.append($('#seatmap').find('.svgcontainer').html());

            byoSvgMap = this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon'); //getting the mapSVG

            if (EventHelper.getBrowserName().isSafari()) {
                //Safari does not repaint the image el inside SVG..
                //BYOSeatMap Repainting Fix
                byoSvgMap.find('image').remove(); //removing image el from SVG

                //creating an image element and adding it to the SVG
                svgimg = document.createElementNS(svgns, 'image');
                svgimg.setAttribute('height', '100%');
                svgimg.setAttribute('width', '100%');
                svgimg.setAttributeNS(xlink, 'href', $('#seatmap').blueprint.getmapurl());
                byoSvgMap.prepend(svgimg);
            }

            if (!$('#seatmap').blueprint.isMapStatic()) {
                //for interactive map remove colors using blank map function
                this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon').find('path').css(removeMapColors);
            }

            this.addMarkersToMap();
        },

        addSelectedMarker: function(byoSvgMap) {
            if (!this.originalTicketModel.get('sectionId') || this.isStaticMap()) {
                return;
            }
            var sectionPos;
            // selected marker
            byoSvgMap.append(MapHelper.createMarkerTags('upgrademap-selected-marker', 'selected'));
            // get selectedSectionPosition inside the byo svg map
            sectionPos = this.uiEl.$upgradeSeatMap.find('#' + this.originalTicketModel.get('sectionId'))[0].getBBox();
            // centering the map marker inside the section
            byoSvgMap.find('#upgrademap-selected-marker').attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');
        },


        addUpgradeMarker: function(byoSvgMap) {
            if (!this.model.get('sectionId') || this.isStaticMap()) {
                return;
            }
            var sectionPos;
            // upgrade marker
            byoSvgMap.append(MapHelper.createMarkerTags('upgrademap-upgrade-marker', 'upgrade'));
            // get upgrade Section Coordinates
            sectionPos = this.uiEl.$upgradeSeatMap.find('#' + this.model.get('sectionId'))[0].getBBox();

            // centering the upgrade map marker inside the section
            if (this.model.get('sectionId') === this.originalTicketModel.get('sectionId')) {
                sectionPos.x = sectionPos.x + 100;
                sectionPos.y = sectionPos.y + 100;
            }
            byoSvgMap.find('#upgrademap-upgrade-marker').attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');
        },

        addMarkersToMap: function() {
            var byoSvgMap = this.uiEl.$upgradeSeatMap.find('svg').not('.expand-icon');

            byoSvgMap.find('#upgrademap-selected-marker').remove();
            byoSvgMap.find('#upgrademap-upgrade-marker').remove();
            this.addSelectedMarker(byoSvgMap);
            this.addUpgradeMarker(byoSvgMap);
        },

        isStaticMap: function() {
            return $('#seatmap').blueprint.isMapStatic();
        },

        enlargeUpgradeVfs: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var target = $(evt.currentTarget);

            if (target.hasClass('upgrade-no-vfs')) {
                return;
            }

            this.publishEvent('showWindowVfs', this.model.get('sectionId'));

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: Upgrade VFS Clicked', pageload: false});
        },

        disabledUpgradeMap: function() {
            this.uiEl.$compareSeat.addClass('disabled');
            this.uiEl.$upgradeSeatMap.addClass('disabled');
        },

        enabledUpgradeMap: function() {
            this.uiEl.$compareSeat.removeClass('disabled');
            this.uiEl.$upgradeSeatMap.removeClass('disabled');
        },

        upgradeDisplayOmniture: function(oldTicketInfo) {
            var upgradeTag = 'Upgrade-offered',
                upgradeDisplay = 'Upgrade Displayed';

            if (EventHelper.isMobile() && globals.byo.upsellAccordion) {
                upgradeTag = 'Upgrade-Accordion-offered';
                upgradeDisplay = 'Upgrade-Accordion Displayed';
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: upgradeDisplay,
                pageload: false,
                filterType: upgradeTag + ' ListingId: ' + this.model.get('listingId') + '; ' + upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: upgradeTag + ' ListingId: ' + this.model.get('listingId'),
                    upgradedListingPrice: upgradeTag + ' Listing Price: ' + this.model.get('usePrice').amount,
                    originalListingId: oldTicketInfo ? 'Original ListingId:' + oldTicketInfo.id : '',
                    originalListingPrice: oldTicketInfo ? 'Original Listing Price: ' + oldTicketInfo.price : ''
                }
            });
        }

    });

    return UpgradeTicketView;
});


define('views/byo_listing_map_view',[
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

define('views/parkingpass_view',[
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'url-parser',
    'collections/inventory_collection',
    'event-parkingpass-component'
], function(Foobunny, Hammer, globals, gc, i18n, currencyFormatUtil, EventHelper, CartHelper, urlParser, InventoryCollection, ParkingPass) {
    'use strict';

    var ParkingPassView = Foobunny.BaseView.extend({

        parkingPassDecorator: {},

        uiEl: {
            $parkingDetails: '.parking-container'
        },

        initialize: function() {
            this.subscribeEvent('buildyourorder:displayed', this.setParkingPass);
            this.subscribeEvent('buildyourorder:hidden', this.hide);
            this.subscribeEvent('parkingpass:more', this.displayMoreParkingPasses);
            this.subscribeEvent('parkingpass:displayed', this.displayed);
            this.subscribeEvent('parkingpass:add', this.trackAddParking);
            this.subscribeEvent('parkingpass:remove', this.trackRemoveParking);
        },

        context: function() {
            return {
                globals: globals
            };
        },

        hide: function() {
            this.$el.addClass('hide');
        },

        setParkingPass: function() {
            var parkingAttributes;
            parkingAttributes = this.setParkingAttributes();
            // The following is a hack to get around the problem of creating multiple instances of the
            // parking pass component and also to avoid multiple listeners being added resulting in
            // multiple callbacks happening.
            if (_.isEmpty(this.parkingPassDecorator)) {
                this.createParkingPassComponent(parkingAttributes);
            } else {
                this.parkingPassDecorator.displayParkingPass(parkingAttributes);
            }
        },

        createParkingPassComponent: function(parkingAttributes) {
            this.parkingPassDecorator = new ParkingPass({
                'element': '.parking-container',
                'attributes': parkingAttributes,
                'add': this.add.bind(this),
                'remove': this.remove.bind(this),
                'more': this.more
            });
        },

        add: function(model) {
            var addPromise = CartHelper.addToCart(model),
                self = this;

            addPromise.always(self.cleanUpParamsAfterCart);
            return addPromise;
        },

        remove: function(model) {
            var deletePromise = CartHelper.deleteFromCart(model),
                self = this;

            deletePromise.always(self.cleanUpParamsAfterCart);
            return deletePromise;
        },

        cleanUpParamsAfterCart: function() {
            EventHelper.removeUrlParams(['park_id','park_qty']);
            gc.parkingListingId = null;
            gc.parkingQty = null;
        },

        displayMoreParkingPasses: function() {
            var parkingUrl = globals.parking_event_url.replace('{{parkingEventId}}', globals.event_meta.parkingEventId);

            if (this.$el.find('.parking-component').hasClass('active')) {
                return false;
            }
            // Going to More Parking Options is set to 1 even if subsequent request are for more tickets
            // because if we set higher and event is out of that package order, then they will get a sold out
            // message even if there are other single tickets available.
            parkingUrl += '&qty=1';

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'More Parking Options Clicked',
                pageload: false
            });

            setTimeout(function() {
                urlParser.redirect(parkingUrl);
            }, 250);
        },

        displayed: function(model) {
            var ticketIdLabel = 'Parking-offered ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-offered price: ',
                price = model.get('price');

            // TODO: publish displayed message here?
            EventHelper.track({
                pageView: 'Ticket Listings', appInteraction:
                'Add Parking Displayed',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingOfferedListingId: ticketIdLabel + ticketId,
                    parkingOfferedPrice: priceLabel + price
                }
            });
        },

        trackAddParking: function(model) {
            var ticketIdLabel = 'Parking-added ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-added price: ',
                price = model.get('price');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Add Parking Clicked',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingListingId: ticketIdLabel + ticketId,
                    parkingPrice: priceLabel + price
                }
            });
        },

        trackRemoveParking: function(model) {
            var ticketIdLabel = 'Parking-removed ListingId: ',
                ticketId = model.get('listingId'),
                priceLabel = 'Parking-removed price: ',
                price = model.get('price');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Remove Parking Clicked',
                pageload: false,
                filterType: ticketIdLabel + ticketId + '; ' + priceLabel + price,
                userExperienceSnapshot: {
                    parkingListingId: ticketIdLabel + ticketId,
                    parkingPrice: priceLabel + price
                }
            });
        },

        setParkingAttributes: function() {
            var parkingAttributes = {
                    parkingEventId: globals.event_meta.parkingEventId,
                    parkingSelected: false,
                    parkingInCart: false,
                    qty: 1,
                    priceType: (globals.PDO.withFees ? globals.price_type.CURRENT : globals.price_type.LISTING),
                    status: 'AVAILABLE'
                },
                parkingItems,
                error = {};

            if (gc.parkingListingId) {
                parkingAttributes.parkingListingId = gc.parkingListingId;
                parkingAttributes.qty = gc.parkingQty;
                parkingAttributes.parkingSelected = true;
            } else if (gc.cart_id) {
                parkingItems = CartHelper.getItemsByEvent(parkingAttributes.parkingEventId);
                if (parkingItems.length > 0) {
                    parkingAttributes.status = parkingItems[0].get('status');
                    if (parkingAttributes.status !== 'AVAILABLE') {
                        CartHelper.deleteFromCart(parkingItems[0]);
                        error.xhr = this.setCartError(parkingAttributes.status, parkingItems[0].get('listingId'));
                        this.publishEvent('parkingpass:error', error);
                    } else {
                        parkingAttributes.parkingListingId = parkingItems[0].get('listingId');
                        parkingAttributes.qty = parkingItems[0].get('quantity');
                        parkingAttributes.parkingInCart = true;
                    }
                }
            }
            return parkingAttributes;
        },

        setCartError: function(status, listingId) {
            var error = {};
            if (status === 'UNAVAILABLE') {
                error = {
                            "code": "purchase.cart.quantityUnavailable",
                            "description": "QUANTITY UNAVAILABLE",
                            "requestId": "",
                            "data": {
                                "listingId": listingId
                            }
                        };
            } else if (status === 'UNACCEPTABLE') {
                error = {
                            "code": "purchase.cart.quantityUnacceptable",
                            "description": "QUANTITY UNACCEPTABLE",
                            "requestId": "",
                            "data": {
                                "listingId": listingId
                            }
                        };
            }
            return error;
        }

    });

    return ParkingPassView;

});

define('models/similar_ticket_model',[
    'foobunny',
    'global_context',
    'models/singlelisting_model',
    'helpers/event_helper'
], function(Foobunny, gc, SingleListingModel, EventHelper) {
    'use strict';

    var SimilarTicketModel = SingleListingModel.extend({
        initialize: function() {
            this.url = '';
            this.urlHeaders = gc.url_headers || {};
        },

        prepareUpgradeUrl: function(ticketData) {
            var url = '/shape/recommendations/ticket/v2/alternatelistings/replacement?numberOfListings=1&eventId=' + gc.event_id;

            url += '&seatQuantity=' + ticketData.qty;
            this.qty = ticketData.qty;

            url += '&currentPrice=' + ticketData.price;

            url += '&listingId=' + ticketData.listingId;

            this.url = url;
        },

        fetchFail: function(error) {
            var logdata;

            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        parse: function(result) {
            var listing = result;
            if (result.listing) {
                listing = SingleListingModel.prototype.parse(result.listing[0].listing);
            }

             return listing;
        }
    });
    return SimilarTicketModel;
});

define('views/similar_ticket_view',[
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'models/similar_ticket_model',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper'
], function(Foobunny, Hammer, globals, gc, SimilarTicketModel, i18n, currencyFormatUtil, EventHelper) {
    'use strict';

    var SimilarTicketView = Foobunny.BaseView.extend({

        template: gc.appFolder + '/similar_ticket',

        model: new SimilarTicketModel(),

        events: {
            'tap .similar-button': 'selectSimilarTicket',
            'tap .similar-find-ticket': 'goBackToEventPage',
            'tap .find-ticket-button' : 'goBackToEventPage',
            'tap .upgrade-see-more-container .upgrade-see-more': 'displayMoreFeatures'
        },

        uiEl: {
            $similarTicketWrapper: '.similar-ticket-wrapper',
            $similarTicketVfs: '.similar-vfs',
            $noVfsText: '.novfs-text',
            $similarSeatNumberText: '.seatInfoText .seatInfo',
            $similarSeatNumbers: '.seatInfoText .seatNumbers',
            $similarNoSeatNumberText: '.seatInfoText .noseatInfo',
            $similarFeatureIcons: '.upgrade-feature-icons-wrapper',
            $similarMoreFeatures: '.similar-listing-info .view-more-container',
            $similarMoreText: '.upgrade-see-more-container .upgrade-see-more-text',
            $similarMoreIcon: '.upgrade-see-more-container .upgrade-see-more-icon',
            $similarAmount: '.similar-listing-info .upgrade-amount',
            $similar: '.similar-button',
            $similarButton: '.similar-button button',
            $similarFindTicket: '.similar-find-ticket',
            $findTicketContainer: '.find-ticket-container'
        },

        initialize: function() {
            this.subscribeEvent('deliveryMethodView:byoTicketExpired', this.fetchSimilarTicket);
            this.subscribeEvent('buildyourorder:notickets', this.showFindTicketInfo);
        },

        context: function() {
        },

        afterRender: function() {
            Hammer(this.el);
        },

        showSimilarTicket: function() {
            this.uiEl.$similarTicketWrapper.removeClass('hide');
            this.$el.removeClass('hide');

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Similar Ticket Offered',
                pageload: false,
                filterType: 'Similar-offered ListingId: ' + this.model.get('listingId') + '; Similar-offered Listing Price: ' + this.model.get('usePrice').amount,
                userExperienceSnapshot: {
                    upgradeListingId: 'Similar-offered ListingId: ' + this.model.get('listingId'),
                    upgradedListingPrice: 'Similar-offered Listing Price: ' + this.model.get('usePrice').amount
                }
            });
        },

        fetchSimilarTicket: function(SelectedTicketModel) {
            var similarTicketPromise,
                qty = parseInt(SelectedTicketModel.get('qty')),
                resp,
                listingData = {},
                self = this;

            listingData.listingId = SelectedTicketModel.get('listingId');
            listingData.price = SelectedTicketModel.get('usePrice').amount;
            if (qty === -1) {
                listingData.qty = SelectedTicketModel.get('splitVector')[0];
            } else {
                listingData.qty = qty;
            }

            this.model.prepareUpgradeUrl(listingData);
            similarTicketPromise = this.model.fetch();

            similarTicketPromise.done(function(response) {
                    self.render();
                    setTimeout(function() {
                        if (_.isEmpty(response) || response.listingError) {
                            self.showFindTicketInfo();
                            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: No Similar Ticket Found', pageload: false});
                        } else {
                            resp = response.listing[0].listing;
                            self.showSimilarTicket();
                            // Get the VFS
                            EventHelper.showVfs(self.uiEl.$similarTicketVfs.find('img')[0], 'medium', resp.venueConfigSectionId, self.vfsSuccess.bind(self), self.vfsFailure.bind(self));
                        }
                    }, 0);
            }).fail(function() {
                self.render();
                setTimeout(function() {
                    self.showFindTicketInfo();
                    EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: No Similar Ticket Found', pageload: false});
                });
            });
        },

        vfsSuccess: function() {
        },

        vfsFailure: function() {
            this.uiEl.$similarTicketVfs.addClass('similar-no-vfs');
            this.uiEl.$noVfsText.removeClass('hide');
        },

        selectSimilarTicket: function(evt) {
            var listingId = this.model.get('listingId');

            evt.preventDefault();
            evt.stopPropagation();

            this.$el.addClass('hide');
            EventHelper.setUrlParam('sim_tkt', 1);
            this.publishEvent('similarTicket:add', this.model);

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Similar ticket Clicked',
                pageload: false,
                filterType: 'Similar-selected ListingId: ' + listingId,
                userExperienceSnapshot: {
                    ticketId: 'ListingId Selected: ' + listingId,
                    upgradeListingId: 'Similar-selected ListingId: ' + listingId,
                    upgradedListingPrice: 'Similar-selected Listing Price: ' + this.model.get('usePrice').amount
                }
            });
        },

        goBackToEventPage: function(evt) {
            this.publishEvent('similarTicket:remove');
            if ($(evt.currentTarget).hasClass('similar-find-ticket')) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Similartix: See All Listings', pageload: false});
            } else {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'BYOView: See All Listings', pageload: false});
            }
        },

        displayMoreFeatures: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            if (this.uiEl.$similarMoreFeatures.hasClass('expand')) {
                this.uiEl.$similarFeatureIcons.removeClass('hide');
                this.uiEl.$similarMoreFeatures.slideUp(400);
                this.uiEl.$similarMoreFeatures.removeClass('expand');
                this.uiEl.$similarMoreText.text(i18n.get('event.common.byo.seemore'));
                this.uiEl.$similarMoreIcon.text('+');

                EventHelper.track({pageView: 'Similar Listings', appInteraction: 'See less features', pageload: false});
            } else {
                this.uiEl.$similarFeatureIcons.addClass('hide');
                this.uiEl.$similarMoreFeatures.slideDown(400);
                this.uiEl.$similarMoreFeatures.addClass('expand');
                this.uiEl.$similarMoreText.text(i18n.get('event.common.byo.seeless'));
                this.uiEl.$similarMoreIcon.text('-');

                EventHelper.track({pageView: 'Similar Listings', appInteraction: 'See More features', pageload: false});
            }
        },

        showFindTicketInfo: function() {
            this.uiEl.$similarTicketWrapper.addClass('hide');
            this.uiEl.$similarFindTicket.addClass('hide');
            this.uiEl.$findTicketContainer.removeClass('hide');
            this.$el.removeClass('hide');
        }
    });

    return SimilarTicketView;
});


/* global _ */
define('views/buildyourorder_view',[
    'foobunny',
    'hammer',
    'globals',
    'global_context',
    'views/byomap_tooltip_view',
    'views/byo_listing_info_view',
    'views/byo_listing_map_view',
    'views/upgrade_ticket_view',
    'views/parkingpass_view',
    'views/similar_ticket_view',
    'i18n',
    'sh_currency_format',
    'helpers/event_helper',
    'helpers/cart_helper',
    'helpers/map_helper'
], function(Foobunny, Hammer, globals, gc, ByomapTooltipView, ByoListingInfoView, ByoListingMapView, UpgradeTicketView, ParkingPassView, SimilarTicketView, i18n, currencyFormatUtil, EventHelper, CartHelper, MapHelper) {
    'use strict';

    var byoSvgMap,
        isBlankMap = false,
        upgradeSectionId,
        selectedSectionId;

    var BuildYourOrderView = Foobunny.BaseView.extend({

        el: '#event-byo-container',

        template: gc.appFolder + '/build_your_order',

        events: {
            'tap .close-icon .sh-iconset-close': 'hide',
            'tap #event-build-your-order': 'hideByoMapTooltip',
            'click .accordion-checkout': 'goToCheckout',
            'scroll': 'stickyCheckout',
            'tap .byo-black-overlay-screen': 'hideMapOverlay',
            'tap .byo-upgrade-map-wrapper': 'hideMapOverlay',
            'click .byo-upgrade-map-wrapper .upgrade': 'displayTooltip',
            'click .byo-upgrade-map-wrapper .selected': 'displayTooltip'
        },

        uiEl: {
            $upgradeTooltip: '.upgradeTooltip',
            $selectedTooltip: '.selectedTooltip',
            $byoupgrademapwrapper: '.byo-upgrade-map-wrapper',
            $byoblackoverlayscreen: '.byo-black-overlay-screen',
            $byoupgradeseatmap: '.byo-upgrade-seatmap',
            $buildyourorder: '#event-build-your-order',
            $currentListing: '.current-listing',
            $parkingDetails: '.parking-container',
            $upSellContainer: '.upsell-info',
            $upgradeTicket: '.upgrade-listing',
            $checkout: '.checkout',
            $similarTicketContainer: '.similar-ticket-container'
        },

        initialize: function(options) {
            this.parkingComponentSelected = false;

            this.subModels = {};
            this.subViews = {};

            this.subViews.listingView = new ByoListingInfoView({
                el: '#event-build-your-order .listing-info',
                eventData: options.eventData
            });

            this.subViews.listingMapView = new ByoListingMapView({
                el: '#event-build-your-order .seat-info'
            });

            this.subViews.similarTicketView = new SimilarTicketView({
                el: '#event-build-your-order .similar-ticket-container'
            });

            if (globals.upgradeTicket.display) {
                this.subViews.upgradeView = new UpgradeTicketView({
                    el: '#event-build-your-order .upgrade-listing'
                });
            }

            // Subscribe to an event to build and show the view.
            this.subscribeEvent('buildyourorder:listing', this.updateView);
            this.subscribeEvent('similarTicket:remove', this.hide);
            this.subscribeEvent('buildyourorder:hide', this.hide);
            this.subscribeEvent('upgradeTicket:displayMapOverlay', this.constructUpgradeMap);

            $(window).resize(_.bind(this.layoutSettings, this));
        },

        context: function() {
            return {
                globals: globals
            };
        },

        afterRender: function() {
            Hammer(this.el);
        },

        hideMapOverlay: function() {
            globals.isByoMapOverlayDisplayed = false;
            this.$el.removeClass('zIndex');
            $('body').removeClass('overlay-active');

            this.uiEl.$selectedTooltip.removeClass('below');
            this.uiEl.$upgradeTooltip.removeClass('below');

            this.uiEl.$byoblackoverlayscreen.addClass('hide');
            this.uiEl.$byoupgrademapwrapper.addClass('hide');
            this.$el.removeClass('byo-hide-scroll');
        },

        mapClone: function() {
            var svgns = 'http://www.w3.org/2000/svg',
                xlink = 'http://www.w3.org/1999/xlink',
                svgimg;

            this.uiEl.$byoupgradeseatmap.append($('#seatmap').find('.svgcontainer').html());

            byoSvgMap = this.uiEl.$byoupgradeseatmap.find('svg'); // getting the mapSVG

            if (EventHelper.getBrowserName().isSafari()) {
                // Safari does not repaint the image el inside SVG..
                // BYOSeatMap Repainting Fix
                byoSvgMap.find('image').remove(); // removing image el from SVG

                // creating an image element and adding it to the SVG
                svgimg = document.createElementNS(svgns, 'image');
                svgimg.setAttribute('height', '100%');
                svgimg.setAttribute('width', '100%');
                svgimg.setAttributeNS(xlink, 'href', $('#seatmap').blueprint.getmapurl());
                byoSvgMap.prepend(svgimg);
            }
        },

        displayTooltip: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var target = $(evt.currentTarget);

            if (target.hasClass('selectedTooltip')) {
                this.uiEl.$upgradeTooltip.removeClass('tooltip-selected');
                this.uiEl.$selectedTooltip.addClass('tooltip-selected');
            } else {
                this.uiEl.$selectedTooltip.removeClass('tooltip-selected');
                this.uiEl.$upgradeTooltip.addClass('tooltip-selected');
            }
        },

        constructUpgradeMap: function() {
            this.$el.addClass('zIndex');
            if (this.uiEl.$byoupgradeseatmap.find('svg').length === 0) {
                this.mapClone();
            }

            if (MapHelper.isStaticMap()) {
                return;
            }

            if (!isBlankMap) {
                this.blankMap();
            }

            selectedSectionId = this.subViews.listingMapView.model.get('sectionId');
            upgradeSectionId = this.subViews.listingMapView.upgradeModel.get('sectionId');

            this.uiEl.$byoupgrademapwrapper.removeClass('hide');
            this.uiEl.$byoupgradeseatmap.find('#selected-marker').remove();
            this.uiEl.$byoupgradeseatmap.find('#upgrade-marker').remove();

            this.addMarkers(selectedSectionId, 'selected-marker', 'selected');
            this.addMarkers(upgradeSectionId, 'upgrade-marker', 'upgrade');

            this.displayOverlayScreen();
            this.$el.addClass('byo-hide-scroll');

            this.openTooltips();
        },

        addMarkers: function(sectionId, id, type) {
            // sectionId for the markers to be positioned
            // div id for the markers and type is 'upgrade' or 'selected'

            if (!sectionId) {
                return;
            }
            var sectionPos;

            byoSvgMap.append(MapHelper.createMarkerTags(id, type));
            // get selectedSectionPosition inside the byo svg map
            sectionPos = this.uiEl.$byoupgradeseatmap.find('#' + sectionId)[0].getBBox();

            if (type === 'upgrade' && selectedSectionId === upgradeSectionId) {
                sectionPos.x = sectionPos.x + 100;
                sectionPos.y = sectionPos.y + 100;
            }

            // centering the map marker inside the section
            byoSvgMap.find('#' + id).attr('transform', 'matrix(1, 0, 0, 1, ' + (sectionPos.x + sectionPos.width / 2) + ', ' + (sectionPos.y + sectionPos.height / 2) + ')');

        },

        openTooltips: function() {
            // check if sectionId is present before rendering the tooltips
            if (selectedSectionId) {
                this.subViews.selectedTooltip = new ByomapTooltipView({
                    el: '.byo-upgrade-map-wrapper .selectedTooltip',
                    model: this.subViews.listingMapView.model
                });
                this.subViews.selectedTooltip.render();
                this.uiEl.$selectedTooltip.removeClass('hide');
            }

            if (upgradeSectionId) {
                this.subViews.upgradeTooltip = new ByomapTooltipView({
                    el: '.byo-upgrade-map-wrapper .upgradeTooltip',
                    model: this.subViews.listingMapView.upgradeModel
                });
                this.subViews.upgradeTooltip.render();
                this.uiEl.$upgradeTooltip.removeClass('hide');
            }

            this.repositionTooltips();
        },

        repositionTooltips: function() {
            var tooltipWidth = this.uiEl.$upgradeTooltip.width(),
                selectedMarker = this.uiEl.$byoupgradeseatmap.find('#selected-marker'),
                upgradeMarker = this.uiEl.$byoupgradeseatmap.find('#upgrade-marker'),
                windowWidth = $('html').width(),
                customOffsetAbove = 85,
                customOffsetBelow = 25,
                sMarkerPosition,
                uMarkerPosition,
                mapWrapperTop = parseFloat(this.uiEl.$byoupgrademapwrapper.css('top'));

            if (selectedMarker.length) {
                sMarkerPosition = selectedMarker.find('.seat-filled').offset();
            }

            if (upgradeMarker.length) {
                uMarkerPosition = upgradeMarker.find('.seat-filled').offset();

                // Preventing the tooltips overlap
                if (sMarkerPosition.top < uMarkerPosition.top) {
                    this.uiEl.$selectedTooltip.addClass('below');
                    this.uiEl.$upgradeTooltip.removeClass('below');
                    this.uiEl.$selectedTooltip.css({'top': sMarkerPosition.top - mapWrapperTop - customOffsetAbove}); // positioning the tooltip above the marker
                    this.uiEl.$upgradeTooltip.css({'top': uMarkerPosition.top - mapWrapperTop + customOffsetBelow}); // positioning the tooltip below the marker
                } else {
                    this.uiEl.$upgradeTooltip.addClass('below');
                    this.uiEl.$selectedTooltip.removeClass('below');
                    this.uiEl.$upgradeTooltip.css({'top': uMarkerPosition.top - mapWrapperTop - customOffsetAbove});
                    this.uiEl.$selectedTooltip.css({'top': sMarkerPosition.top - mapWrapperTop + customOffsetBelow});
                }

                // Preventing the tooltips go outside the viewport
                if (sMarkerPosition.left + (tooltipWidth / 2) > windowWidth) {
                    this.uiEl.$selectedTooltip.css({'right': '0px'});
                } else if (sMarkerPosition.left - (tooltipWidth / 2) < 0) {
                    this.uiEl.$selectedTooltip.css({'left': '0px'});
                } else {
                    this.uiEl.$selectedTooltip.css({'left': sMarkerPosition.left - (tooltipWidth / 2)});
                }

                if (uMarkerPosition.left + (tooltipWidth / 2) > windowWidth) {
                    this.uiEl.$upgradeTooltip.css({'right': '0px'});
                } else if (uMarkerPosition.left - (tooltipWidth / 2) < 0) {
                    this.uiEl.$upgradeTooltip.css({'left': '0px'});
                } else {
                    this.uiEl.$upgradeTooltip.css({'left': uMarkerPosition.left - (tooltipWidth / 2)});
                }
            }
        },

        displayOverlayScreen: function() {
            $('body').addClass('overlay-active');
            this.uiEl.$byoblackoverlayscreen.removeClass('hide');
        },

        blankMap: function() {
            var whiteColor = '#FFFFFF',
                removeMapColors = {
                    'fill': whiteColor,
                    'fill-opacity': 0.2,
                    'stroke': whiteColor,
                    'stroke-width': 0,
                    'stroke-opacity': 0
                };
            this.uiEl.$byoupgradeseatmap.find('path').css(removeMapColors);
            isBlankMap = true;
        },

        isStaticMap: function() {
            return $('#seatmap').blueprint.isMapStatic();
        },

        show: function() {
            var ticketIdLabel = 'ListingId Selected: ',
                ticketIds = this.subModels.ticketListing.get('listingId') || '',
                ticketRank = this.subModels.ticketListing.get('ticketRank') || '',
                self = this;

            if (!EventHelper.isMobile()) {
                $('#eventInfo').hide('fast');
                $('#event-byo-container').addClass('upgrade-height');
                this.$el.removeClass('byo-close-animation').addClass('no-scroll-bar').removeClass('hide');
                setTimeout(function() {
                    self.$el.removeClass('no-scroll-bar');
                }, 700);
            } else {
                this.$el.removeClass('hide');
                this.$el.animate({top: 0}, 'slow');
            }

            if (globals.upgradeTicket.display) {
                this.uiEl.$upSellContainer.removeClass('hide');
                this.publishEvent('buildyourorder:displayUpgrade', this.subModels.ticketListing);
            }

            // Create and show upsell container if add parking pass component
            if (EventHelper.showParkingAddon()) {
                if (!this.subViews.parkingpassView) {
                    this.subViews.parkingpassView = new ParkingPassView({
                        el: '#event-build-your-order .parking-container'
                    });
                }
                this.uiEl.$upSellContainer.removeClass('hide');
            }

            this.publishEvent('buildyourorder:displayed', true, this.subModels.ticketListing);

            // Add the seat ids to the omniture only for blended event since the seats will
            // only be available in case of blendings.
            if (EventHelper.isBlendedEvent()) {
                if (EventHelper.isBlendedLogicApplied() === true) {
                    ticketIds = _.map(this.subModels.ticketListing.get('seats'), function(element) {
                        return element.ticketSeatId;
                    }).join();
                    ticketIdLabel = 'SeatId Selected: ';
                } else {
                    // We are getting the listingId from the 1st element of the seats in non-blended mode.
                    // Since we are defining the variable ticketIds with a value we do not have to
                    // to check for existings of the seats[0] element for assigning it. However, if there is
                    // an occurrence where the listing does not have the seats array we still want the page
                    // to handle this gracefully. Hence the try/catch block.
                    try {
                        ticketIds = this.subModels.ticketListing.get('seats')[0].listingId;
                    } catch(e) {}
                }
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Viewed Ticket Details',
                pageload: false,
                filterType: ticketIdLabel + ticketIds + '; Ticket Rank: ' + ticketRank,
                userExperienceSnapshot: {
                    blendedListing: 'Blended Listing: ' + this.subModels.ticketListing.get('multipleListing'),
                    ticketId: ticketIdLabel + ticketIds,
                    ticketRank: 'Ticket Rank: ' + ticketRank,
                    originalListingId: 'Original ListingId:' + ticketIds,
                    originalListingPrice: 'Original Listing Price: ' + this.subModels.ticketListing.get('usePrice').amount
                }
            });
        },

        hide: function(evt) {
            var self = this,
                deletePromise,
                cartModels = [];

            if (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }

            if (globals.isByoMapOverlayDisplayed) {
                // on backButton action by the user, hide mapoverlay if it is active
                $('body').removeClass('overlay-active');
                this.uiEl.$byoupgrademapwrapper.addClass('hide');
                this.uiEl.$byoblackoverlayscreen.addClass('hide');
                this.$el.removeClass('byo-hide-scroll');
                globals.isByoMapOverlayDisplayed = false;
            }

            globals.byo.quantity = '';
            globals.upgradeTicket.isTicketUpgraded = false;

            EventHelper.removeUrlParams(['byo', 'byo_qty', 'oldtktid']);

            this.uiEl.$similarTicketContainer.addClass('hide');
            this.uiEl. $checkout.removeClass('disabled');
            $('#event-build-your-order .listing-checkout').removeClass('disabled');

            if (!gc.ticket_id) {
                // EventHelper.removeUrlParam('tktbkt');
                EventHelper.removeUrlParams(['ticket_id', 'ticketRank']);
            }

            if (gc.cart_id && !gc.ticket_id) {
                if (EventHelper.isBlendedEvent()) {
                    if (globals.event_meta.parkingEventId) {
                        cartModels = CartHelper.getItemsByEvent(globals.event_meta.parkingEventId);
                    }
                    if (cartModels.length <= 0) {
                        EventHelper.removeUrlParam('cart_id');
                        gc.cart_id = null;
                        CartHelper.resetCart();
                    }
                } else {
                    // Remove ALL the TICKETS for this event.
                    // TODO: Use the deleteByType for deleting all tickets in one call.
                    //       This is especially needed for BLENDED.
                    deletePromise = CartHelper.deleteFromCart(this.subModels.ticketListing);
                }
            }

            this.publishEvent('buildyourorder:hidden');

            if (!EventHelper.isMobile()) {
                $('#eventInfo').slideDown('fast');
                $('#event-byo-container').removeClass('upgrade-height');

                this.$el.animate({
                    height: '0'
                }, 400, function() {
                    // We should always be at the top of parking details when we 'show' the content again
                    self.$el.scrollTop(0);
                    self.$el.addClass('hide');
                    self.$el.css('height', '');
                });
            } else {
                this.$el.animate({top: '101%'}, 'slow', function() {
                    self.$el.addClass('hide');
                });
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Closed Ticket Details',
                pageload: false,
                userExperienceSnapshot: {
                    ticketId: '',
                    ticketRank: '',
                    quantityL: '',
                    SimilarSelectedListingId: '',
                    upgradeListingId: '',
                    upgradedListingPrice: '',
                    originalListingId: '',
                    originalListingPrice: '',
                    blendedListing: '',
                    parkingListingId: '',
                    parkingPrice: ''
                }
            });
        },

        hideByoMapTooltip: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            this.$el.find('.byomap-tooltip').addClass('hide');
        },

        updateView: function(listing) {
            // Add BYO to the URL.
            EventHelper.setUrlParam('byo', 1);
            if (listing.get('valueBucket')) {
                EventHelper.setUrlParam('tktbkt', listing.get('valueBucket'));
            }

            // Re-assign the model to the "new" incoming model.
            this.subModels.ticketListing = listing;

            if (!globals.upgradeTicket.isTicketUpgraded) {
                this.uiEl.$upgradeTicket.removeClass('upgrade-selected');
            }

            this.layoutSettings();
            this.show();

            // Publish Event to pushState for BYO as open
            if (window.history.state === null) {
                this.publishEvent('event:pushState', {
                    eventName: 'buildyourorder:toggle',
                    eventData: null
                });
            }
        },

        layoutSettings: function() {
            if (!this.$el.is(':visible')) {
                return;
            }

            // If the BYO is visible then we need to keep it visible for responsiveness.
            this.$el.css({top: 0});

            if (EventHelper.isMobile()) {
                this.publishEvent('globalHeader:hide');
            }

            // if byo upgrade map overlay is visible reposition the tooltips wrt the markers
            if (this.uiEl.$byoupgrademapwrapper.is(':visible')) {
                this.repositionTooltips();
            }
        },

        goToCheckout: function() {
            this.publishEvent('buildyourorder:checkout');
        },

        stickyCheckout: function() {
            if (!EventHelper.isMobile() || globals.byo.upsellAccordion) {
                return;
            }

            var $checkoutButton = $('#event-build-your-order .listing-checkout'),
                eventHeaderHeight = $('#event-details').outerHeight(),
                upSellTop = this.uiEl.$upSellContainer.offset().top,
                elTop = $checkoutButton.offset().top;

            if (elTop <= eventHeaderHeight && !$checkoutButton.hasClass('sticky')) {
                $checkoutButton.addClass('sticky');
            } else if (upSellTop >= ($checkoutButton.outerHeight() + eventHeaderHeight + 10)) {
                $checkoutButton.removeClass('sticky');
            }

        }
    });

    return BuildYourOrderView;

});

/* global SH,_ */
define('layouts/event_layout',[
    'foobunny',
    'hammer',
    'models/filter_model',
    'views/quantity_filter_view',
    'views/filter_view',
    'views/seller_view',
    'views/event_details_view',
    'views/enlarge_vfs_view',
    'views/seatmap_view',
    'views/seatmap_tooltip_view',
    'views/singleticket_view',
    'views/sortfilter_header_view',
    'views/ticketlist_view',
    'views/ticketlist_footer_view',
    'views/event_disclosure_view',
    'views/primarypartner_view',
    'views/buildyourorder_view',
    'collections/inventory_collection',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, Hammer, FilterModel, QuantityFilterView, FilterView, SellerView, EventDetailsView, EnlargeVfsView, SeatmapView, SeatmapTooltipView, SingleTicketView, SortFilterHeaderView, TicketlistView, TicketlistFooterView, EventDisclosureView, PrimaryPartnerView, BuildYourOrderView, InventoryCollection, EventHelper, gc, globals) {
    'use strict';

    var EventLayout = Foobunny.Layout.extend({

        initialize: function(options) {

            console.log('--EventLayout-- in initialize()', this);
            var self = this,
                p0,
                experience = {abValue: {}},
                deliveryMethodsStr = 'Delivery Methods: ',
                seatFeaturesStr = 'Seat Features: ',
                sidzid = '',
                seatsStr = '',
                primaryPerformerId,
                mboxKeys = ['showWithFees', 'quantityQuestion', 'priceSliderPositionOutside', 'displayBYO', 'displayUpgrade', 'upsellAccordion', 'blendedLogicApplied'];
            
            this.mapType = options.mapType;

            SH.mbox = SH.mbox || {};

            EventHelper.setStaticImageDetails();

            this.views = {
                // filter: new FilterView(),
                eventDetails: new EventDetailsView(),
                eventDisclosure: new EventDisclosureView(),
                enlargeVfs: new EnlargeVfsView(),
                seatmap: new SeatmapView({
                    nodeId: options.nodeId,
                    configId: options.configId,
                    mapType: options.mapType,
                    version: options.version,
                    viewFromSection: options.viewFromSection,
                    staticImageUrl: options.staticImageUrl
                }),
                seatmapTooltipView: new SeatmapTooltipView(),
                ticketlist: new TicketlistView(),
                // sortFilterHeader: new SortFilterHeaderView(),
                // TODO: Make primaryPartnerView as SubView of EventInfoView
                primarypartner: new PrimaryPartnerView(),
                ticketlistFooter: new TicketlistFooterView()
            };

            if (EventHelper.hasBsfFeature()) {
                this.views.bsf = new SellerView();
            }
            // RITESH: Un-comment when the ticket recommendations related AB tests are
            // completed and we have a clear winner.
            // if (EventHelper.isSingleTicketMode()) {
            //     this.views.singleTicket = new SingleTicketView();
            // }

            sidzid = globals.OMN.sid || globals.OMN.zid;

            if (sidzid) {
                seatsStr = (globals.OMN.zonesEnabled === true) ? 'Zones: ' + sidzid : 'Sections: ' + sidzid;
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.dt) {
                if (globals.OMN.dt.search('1') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Electronic, ';
                }
                if (globals.OMN.dt.search('2') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Instant Download, ';
                }
                if (globals.OMN.dt.search('5') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'UPS, ';
                }
                if (globals.OMN.dt.search('4') !== -1) {
                    deliveryMethodsStr = deliveryMethodsStr + 'Pickup, ';
                }
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.categ) {
                if (globals.OMN.categ.search('6') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Aisle, ';
                }
                if (globals.OMN.categ.search('2') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Wheelchair accessible, ';
                }
                if (globals.OMN.categ.search('4') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Parking pass included, ';
                }
            }

            // TODO: Create a map in the globals.js instead of this block of code.
            if (globals.OMN.excl) {
                if (globals.OMN.excl.search('1') !== -1) {
                    seatFeaturesStr = seatFeaturesStr + 'Exclude obstructed view, ';
                }
            }

            seatFeaturesStr = seatFeaturesStr.trim().replace(/(^,)|(,$)/g, '');
            deliveryMethodsStr = deliveryMethodsStr.trim().replace(/(^,)|(,$)/g, '');

            if (globals.OMN.urlSortOption) {
                globals.OMN.urlSortOption = globals.OMN.urlSortOption.split('+');
            }

            this.preserveFiltersObject = {
                userExperienceSnapshot: {
                    quantity: parseInt(globals.OMN.qty) > 0 ? 'Quantity: ' + globals.OMN.qty : '',
                    quantityL: parseInt(globals.OMN.byoqty) > 0 ? 'QuantityL: ' + globals.OMN.byoqty : '',
                    ticketId: globals.OMN.listingId ? 'ListingId Selected: ' + globals.OMN.listingId : '',
                    PDO: globals.OMN.withFees === true ? 'Price With Fees' : '',
                    zoneOrSection: globals.OMN.zonesEnabled === true ? 'Zone Selection' : '',
                    priceSliderMin: globals.OMN.minPrice > -1 ? 'Min Price: ' + globals.OMN.minPrice : '',
                    priceSliderMax: globals.OMN.maxPrice > -1 ? 'Max Price: ' + globals.OMN.maxPrice : '',
                    seats: (sidzid !== undefined) ? seatsStr : '',
                    deliveryMethods: (globals.OMN.dt) ? deliveryMethodsStr : '',
                    seatFeatures: (globals.OMN.excl || globals.OMN.categ) ? seatFeaturesStr : '',
                    sortTab: (globals.OMN.urlSortOption) ? (globals.OMN.urlSortOption[0] + ' sorting ' + globals.OMN.urlSortOption[1]) : ''
                }
            };

            // four api calls are made from this app, promise p2 contains both search inventory and meta data promise
            p0 = $.Deferred();
            this.p1 = this.views.seatmap.fetchDataPromise;
            this.p2 = this.views.ticketlist.fetchDataPromise || $.Deferred();
            this.p3 = this.views.eventDetails.fetchDataPromise;

            // Add the key TicketRecommendation only if the event has reco enabled.
            if (globals.TicketReco.hasTicketReco) {
                mboxKeys.push('TicketRecommendation');
            }

            // Call Mbox if ABTesting is going on.
            // We are supposed to call the MboxUtil only after the event details is available.
            // Which PDO Experience to show will come from the Mbox call. Right now we are getting
            // the PDO Experience from the EventHelper -> Global Registry.
            $.when(this.p3).done(function eventDetailsDone() {
                if (self.views.eventDetails.model.get('expiredInd') === true) {
                    p0.resolve();
                    return;
                }

                primaryPerformerId = self.views.eventDetails.model.getPrimaryPerformerId();

                if (EventHelper.isABTestActive()) {
                    if (gc.mboxCalled) {
                        // Needs to be adjusted once price slider AB is completed.
                        if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                            experience.abValue.priceSliderPositionOutside = false;
                        } else {
                            experience.abValue.priceSliderPositionOutside = globals.priceSlider.displayOutside;
                        }

                        experience.abValue.quantityQuestion = (globals.quantityOverlay.quantityQuestion === 'true');

                        // Needs to be adjusted once the AB for MLB is completed. This will be done in the viewSelectorController.js
                        experience.abValue.TicketRecommendation = globals.TicketReco.showTicketReco;

                        // Is the user in the BYO test
                        experience.abValue.ABdisplay = globals.byo.ABdisplay;

                        // Display upgrades
                        experience.abValue.displayUpgrade = globals.upgradeTicket.display;
                        experience.abValue.upsellAccordion = globals.byo.upsellAccordion;

                        experience.abValue.blendedLogicApplied = globals.inventoryCollection.blendedLogicApplied;
                        // Display/hide feesToggle
                        // experience.abValue.displayWithFeesToggle = globals.displayWithFeesToggle;

                        self.mboxPromise = $.Deferred().resolve(experience);
                    } else {
                        self.mboxPromise = EventHelper.makeMboxCall(
                            self,
                            EventHelper.constructMboxData(self.views.eventDetails.model),
                            SH.mbox,
                            mboxKeys);
                    }
                    self.mboxPromise.always(function mboxAlways(params) {
                        EventHelper.setUrlParam('mbox', '1');

                        // IMPORTANT: Since the code contains setup for multiple campaigns we will need the TNT to
                        // return ALL the values until such time the code is adjusted.
                        // MLB Campaign setup -
                        // 1. Event page sends the ancestors data to MBOX.
                        // 2. MBOX determines whether to test or not based on parameters.
                        // 3a. If we are testing then send the appropriate response back - VALUEBARLOWEST or DEFAULT.
                        // 3b. If we are not testing then do not send TicketRecommendation. We will show VALUEBARLOWEST.

                        // We want to show the ticket reco experience only if the event has
                        // ticket reco enabled otherwise we are going to show the default.
                        if (globals.TicketReco.hasTicketReco) {
                            // If we have received something back from the MBOX then validate the value and use it.
                            if (params.abValue.TicketRecommendation &&
                                globals.TicketReco.experience[params.abValue.TicketRecommendation]) {
                                globals.TicketReco.showTicketReco = params.abValue.TicketRecommendation;
                            } else {
                                globals.TicketReco.showTicketReco = globals.TicketReco.experience.VALUEBARLOWEST;
                            }
                        } else {
                            globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                        }
                        // Set the recoState in the URL Params
                        EventHelper.setUrlParam('rS', globals.TicketReco.setRecoExperience[globals.TicketReco.showTicketReco]);

                        // Display/hide feesToggle ABTest
                        // if (_.isBoolean(params.abValue.displayWithFeesToggle)) {
                        //     globals.displayWithFeesToggle = params.abValue.displayWithFeesToggle;
                        // } else {
                        //     globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();
                        // }
                        // EventHelper.setUrlParam('dwft', globals.displayWithFeesToggle); //dwft - displayWithFeesToggle

                        if (_.isBoolean(params.abValue.ABdisplay)) {
                            globals.byo.ABdisplay = params.abValue.ABdisplay;
                        } else {
                            globals.byo.ABdisplay = EventHelper.isBYOEnabled();
                        }
                        EventHelper.setUrlParam('abbyo', globals.byo.ABdisplay);

                        // Needs to be adjusted once price slider AB is completed.
                        if (EventHelper.isMobile() || globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                            globals.priceSlider.displayOutside = false;
                        } else {
                            if (_.isBoolean(params.abValue.priceSliderPositionOutside)) {
                                globals.priceSlider.displayOutside = params.abValue.priceSliderPositionOutside;
                            } else {
                                globals.priceSlider.displayOutside = EventHelper.getSliderPosition();
                            }
                        }
                        EventHelper.setUrlParam('sliderpos', globals.priceSlider.displayOutside);

                        if (_.isBoolean(params.abValue.quantityQuestion)) {
                            globals.quantityOverlay.quantityQuestion = params.abValue.quantityQuestion;
                        } else {
                            globals.quantityOverlay.quantityQuestion = EventHelper.isQuantityOverlayEnabled();
                        }
                        EventHelper.setUrlParam('qtyq', globals.quantityOverlay.quantityQuestion);


                        // if mbox responds and contains a value of blendedLogicApplied
                        if (params.abValue.blendedLogicApplied !== undefined) {
                            globals.inventoryCollection.blendedLogicApplied = params.abValue.blendedLogicApplied;
                            EventHelper.setUrlParam('bla', params.abValue.blendedLogicApplied);
                        }

                        if (globals.inventoryCollection.blendedEvent === true) {
                            globals.upgradeTicket.display = false;
                        } else {
                            if (_.isBoolean(params.abValue.displayUpgrade)) {
                                globals.upgradeTicket.display = params.abValue.displayUpgrade;
                            } else {
                                globals.upgradeTicket.display = EventHelper.isUpgradeEnabled();
                            }
                            EventHelper.setUrlParam('dUpg', globals.upgradeTicket.display);
                        }

                        if (!EventHelper.isMobile()) {
                            globals.byo.upsellAccordion = false;
                        } else {
                            if (_.isBoolean(params.abValue.upsellAccordion)) {
                                globals.byo.upsellAccordion = params.abValue.upsellAccordion;
                            }
                            EventHelper.setUrlParam('dUAccr', globals.byo.upsellAccordion);
                        }

                        // The following is rule specific to 76ers launch. This will be changed 
                        // in future impl's.
                        // 
                        //  If Parking Pass is not enabled in the global registry no one gets it 
                        // If Parking Pass enabled AND performer is on alwaysOn global registry, enable parkingPass
                        if (_.contains(EventHelper.getParkingPerformers(), primaryPerformerId.toString())) {
                            globals.parkingPass.enabled = true;
                        } else {
                            // Performers not on the "list" go through the AB
                            if (_.isBoolean(params.abValue.parkingPass)) {
                                globals.parkingPass.enabled = params.abValue.parkingPass;
                            } else {
                                globals.parkingPass.enabled = EventHelper.getParkingFeatureState();
                            }
                        }

                        self.setDefaultSort();

                        self.views.sortFilterHeader = new SortFilterHeaderView();
                        self.views.sortFilterHeader.render();
                        // TO DO: revisit after price slider A/B test
                        self.views.filter = new FilterView();
                        self.views.filter.setSeatTraits(self.views.eventDetails.model);
                        self.views.filter.render();
                        self.views.sortFilterHeader.bindUIElements(); // filter view replaces the drop down filter dom elements of SortFilterHeaderView

                        self.views.buildyourorder = new BuildYourOrderView({
                            eventData: self.views.eventDetails.model
                        });
                        self.views.buildyourorder.render();

                        // RITESH: Remove this when the ticket recommendations AB tests are completed.
                        if (EventHelper.isSingleTicketMode()) {
                            self.views.singleTicket = new SingleTicketView();
                            self.views.singleTicket.render();
                        }

                        self.updateBottomContainer({});

                        self.p2a = self.views.ticketlist.fetchData();
                        self.p2a.done(function() {
                            self.p2.resolve();
                        }).fail(function(error) {
                            self.p2.reject(error);
                        });
                    });
                } else {
                    // Display the parking pass for the alwaysOn (76ers) and for non-76ers get the value from the global registry.
                    // If you have to entirely disable the feature then remove all the values from alwaysOn and set the 
                    // feature to false in global registry.
                    // If parking pass enabled (default: false), performers not on the "list" go through the AB. If no AB, then fall back to global registry.
                    globals.parkingPass.enabled = _.contains(EventHelper.getParkingPerformers(), primaryPerformerId.toString()) || EventHelper.getParkingFeatureState();
                    
                    // TODO: tech debt cleanup after 76ers blended testing is completed
                    if((globals.inventoryCollection.blendedLogicApplied === 'true' || globals.inventoryCollection.blendedLogicApplied === true) && globals.inventoryCollection.blendedPerformers[primaryPerformerId] === true) {
                        globals.inventoryCollection.blendedLogicApplied = true;
                    } else {
                        globals.inventoryCollection.blendedLogicApplied = false;
                    }
                    // RITESH: Remove this when the ticket recommendations AB tests are completed.
                    if (globals.TicketReco.hasTicketReco) {
                        globals.TicketReco.showTicketReco = EventHelper.showRecoExperience();
                    } else {
                        globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                    }

                    globals.byo.ABdisplay = EventHelper.isBYOEnabled();
                    globals.quantityOverlay.quantityQuestion = EventHelper.isQuantityOverlayEnabled();

                    if (globals.inventoryCollection.blendedEvent === true) {
                        globals.upgradeTicket.display = false;
                    } else {
                        globals.upgradeTicket.display = EventHelper.isUpgradeEnabled();
                    }

                    self.setDefaultSort();

                    self.views.sortFilterHeader = new SortFilterHeaderView();
                    self.views.sortFilterHeader.render();
                    // TO DO: revisit after price slider A/B test
                    self.views.filter = new FilterView();
                    self.views.filter.setSeatTraits(self.views.eventDetails.model);
                    self.views.filter.render();

                    self.views.buildyourorder = new BuildYourOrderView({
                        eventData: self.views.eventDetails.model
                    });
                    self.views.buildyourorder.render();

                    // RITESH: Remove this when the ticket recommendations AB tests are completed.
                    if (EventHelper.isSingleTicketMode()) {
                        self.views.singleTicket = new SingleTicketView();
                        self.views.singleTicket.render();
                    }

                    self.updateBottomContainer({});

                    // The un-hiding of the footer takes place in hideSeatmapZoneOrSectionToggle
                    // self.uiEl.$ticketListFooter.removeClass('hide');
                    self.p2a = self.views.ticketlist.fetchData();
                    self.p2a.done(function() {
                        self.p2.resolve();
                    }).fail(function(error) {
                        self.p2.reject(error);
                    });
                }

                p0.resolve();
            });

            // publish the app:render-ready event - all api's fetched at this point
            $.when(p0, this.p1, this.p2, this.p3).then(function() {
                // finally fire the app:render-ready event
                self.publishEvent('app:render-ready');
                self.setOnLoadTracking(self.views.eventDetails.model);

//                if (!gc.quantityDirty && !globals.event_meta.isParking && globals.quantityOverlay.quantityQuestion && !gc.userComingBack && self.model.get('qty') === '-1' && !EventHelper.isSingleTicketMode() && self.views.ticketlist.subCollections.ticketlist.length > 0) {
                var layoutType = (EventHelper.isBlendedEvent())? 'blended' : 'non-blended';
                var eventType = (globals.event_meta.isParking)? 'parking-pass' : 'default';
                if (EventHelper.quantityQuestionEnabled({eventType: eventType}) === true) {

                    // Quantity filter theme switch for blended and non blended non-ga
                    var urlParamQtyBtnCount = EventHelper.getUrlQuery('qtyBtnCount');


                    var qtyFilterArgs = {};

                    if(EventHelper.isBlendedEvent()) {

                        qtyFilterArgs = {
                            filterId: "qty_container",
                            filterClass: 'qty_content',
                            type: 'overlay',
                            qtySelected:  self.model.get('qty'),
                            quantityVector: self.model.get('quantityVector'),
                            maxButtonCount: urlParamQtyBtnCount || EventHelper.getFeatureFn('event.qqBlendedMaxQty', 'string')() || globals.quantityOverlay.quantityBtnMaxCount,
                            minButtonCount: globals.quantityOverlay.quantityBtnInitialCount,
                            disableUnavailableQuantities: false,
                            navigation: true
                        };
                    } else {

                        // this is going to go away, only to support the default / current selector buttons 12345+
                        qtyFilterArgs = {
                            filterId: 'qty_container',
                            filterClass: 'qty_content flex-center',
                            type: 'overlay',
                            maxButtonCount: 5,
                            minButtonCount: 4,
                            navigation: false,
                            qtySelected:  self.model.get('qty'),
                            quantityVector: self.model.get('quantityVector'),
                            extraButtons: [
                                {"label":'5+', "value":'5+', buttonClass: 'qty-button qty_index'}
                            ]
                        };
                    }

                    // end Quantity filter theme switch
                    // check if there are tickets available before displaying quantity question
                    if(self.views.ticketlist.subCollections.ticketlist.length > 0) {
                        $('#eventInfo').addClass('quantityQuestionHeader');
                        self.views.qtyfilter = new QuantityFilterView(qtyFilterArgs);
                        self.views.qtyfilter.render();
                    }

                    self.$html.addClass('noscroll');
                    self.uiEl.$ticketList.addClass('noscroll');
                    self.$eventDetails.addClass('noclick');


                    // dispose quantity filter after a selection is made
                    self.model.on('change', function() {
                        if(self.views.qtyfilter.disposed === false && self.views.qtyfilter.renderCounter >= 1) {
                            self.views.qtyfilter.closeQtyOverlay();
                            $('#eventInfo').removeClass('quantityQuestionHeader');
                        }
                    })
                }

            }).fail(function(error) {
                self.uiEl.$eventParkingHeader.addClass('hide');
                self.uiEl.$eventMapContainer.addClass('hide');
                self.uiEl.$eventContainer.addClass('hide');
                // wait for all promises
                self.promiseInterval = setInterval(self.checkPromises.bind(self, error), 300);
                self.setOnLoadTracking();
            });

            this.isStaticMap = null;
            this.numberOfListings = null;

            this.subscribeEvent('eventmodel:expiredEvent', this.handleExpiredEvent);
            this.subscribeEvent('seatmap:sectionSelected', this.toggleReset);
            this.subscribeEvent('seatmap:sectionDeselected', this.toggleReset);
            this.subscribeEvent('ticketlist:numberOfListings', this.hideSeatmapZoneOrSectionToggle);
            this.subscribeEvent('ticketlist:numberOfListings', this.showTicketListFooter);
            this.subscribeEvent('seatmap:mapDisplayed', this.showSeatmapZoneToggle);
            this.subscribeEvent('showWindowVfs', this.showWindowVfs);
            this.subscribeEvent('filterView:hidden', this.updateBottomContainer);
            this.subscribeEvent('filterView:displayed', this.updateBottomContainer);

            // Listen for orientation changes
            $(window).resize(_.bind(this.layoutSettings, this));
        },

        el: '#content_container',

        uiEl: {
            '$eventParkingHeader': '#eventParkingHeader',
            '$eventMapContainer': '#eventMapContainer',
            '$eventContainer': '#eventContainer',
            '$seatmap_zone_section': '#seatmap-zone-section',
            '$event_error': '#event_error',
            '$findmorelink': '.findmorelink',
            '$eventInfo': '#eventInfo',
            '$windowVfs': '#window-vfs',
            '$arrowButton': '#arrowButton',
            '$ticketList': '#ticketlist',
            '$sortFilterHeader': '#sortfilter_header',
            '$smallVfs': '#small-vfs',
            '$ticketListFooter': '#ticketlist_footer',
            '$bottomContainer': '.bottom-container',
            '$filter': '#filter',
            '$backButton': '.back-button',
            '$closeIcon': '.close-icon .sh-iconset-close',
            '$serviceFeeInfo': '.serviceFeeInfo'
        },

        template: gc.appFolder + '/event_layout',

        events: {
            'tap #arrowButton' : 'arrowButtonAction',
            'change #section-zone-checkbox': 'enableSectionOrZone',
            'tap .reset-map': 'resetMap',
            'tap .close-button': 'hideWindowVfs',
            'tap #window-vfs img': 'hideWindowVfs',
            'tap #small-vfs': 'switchVfs',
            'tap .back-button': 'backButtonClicked',
            'tap .sh-iconset-close': 'backButtonClicked',
            'tap .qty-close': 'disposeQtyOverlay'
        },

        afterRender: function() {
            Hammer(this.el);
            this.$body = $('body');
            this.$html = $('html');
            this.$headerView = $('#header');
            this.$eventDetails = $('#event-details');

            this.publishEvent('eventlayout:renderdone');

            // Calculate the heights of the various components and set it up for displaying it properly.
            this.layoutSettings();
        },

        handleExpiredEvent: function(upcomingEventsLink) {
            this.uiEl.$findmorelink.attr('href', upcomingEventsLink);
            this.uiEl.$eventInfo.addClass('bottom-line');
            this.uiEl.$eventParkingHeader.addClass('hide');
            this.uiEl.$eventMapContainer.addClass('hide');
            this.uiEl.$eventContainer.addClass('hide');
            this.uiEl.$seatmap_zone_section.addClass('hide');
            this.uiEl.$event_error.removeClass('hide');
        },

        disposeQtyOverlay: function() {
            if (this.views.qtyFilter !== undefined) {
                this.views.qtyfilter.el.remove();
                this.views.qtyfilter.dispose();
            }
        },

        checkPromises: function(errorResp) {
            var self = this,
                p1State = this.p1.state(),
                p2State = this.p2.state(),
                p3State = this.p3.state(),
                eventExpiredInd;

            if (p1State === 'pending' || p2State === 'pending' || p3State === 'pending') {
                return;
            }

            clearInterval(this.promiseInterval);

            eventExpiredInd = self.views.eventDetails.model.get('expiredInd');

            if (eventExpiredInd === false) {
                self.publishEvent('app:render-error');
            }

            if (p3State === 'rejected') {
                self.p3.fail(function(p3ErrorResp) {
                    self.publishEvent('dataready:error', p3ErrorResp);
                    // log failures in Splunk
                    EventHelper.logAppState('fetch', p3ErrorResp);
                });
            } else if (p2State === 'rejected') {
                self.p2.fail(function(p2ErrorResp) {
                    // event expired handeled in events/v3, this check is for EVENTS-510
                    if (p2ErrorResp.responseJSON && p2ErrorResp.responseJSON.code === 'INS04' && eventExpiredInd === false) {
                        self.handleExpiredEvent(self.views.eventDetails.model.getUpcomingEventsLink());
                    } else if (eventExpiredInd === false) {
                        self.publishEvent('dataready:error', p2ErrorResp);
                    }

                    // log failures in Splunk
                    EventHelper.logAppState('fetch', p2ErrorResp);
                });
            } else {
                self.publishEvent('dataready:error', errorResp);
                EventHelper.logAppState('fetch', errorResp);
            }
        },

        layoutSettings: function() {
            var winHeight = $(window).height(),
                headerHeight = this.$headerView.is(':visible') ? this.$headerView.outerHeight() : 0,
                eventInfoHeight = $('#eventInfo').outerHeight(),
                eventDetailsHeight = this.$eventDetails.outerHeight(),
                parkingHeaderHeight = 0;

            if ($('#arrowButton').hasClass('arrowFlipDown')) {
                var sortfilterHeaderHeight = this.uiEl.$sortFilterHeader.outerHeight(),
                    twoRowHeight = (winHeight - headerHeight - eventDetailsHeight) / 2,
                    arrowHeight = 33;

                this.uiEl.$eventMapContainer.height(twoRowHeight);
                this.uiEl.$eventContainer.height(twoRowHeight + arrowHeight);
                this.uiEl.$eventContainer.removeClass('top-zero');
                this.uiEl.$ticketList.height(twoRowHeight - sortfilterHeaderHeight + arrowHeight);
            }

            if (window.innerWidth >= globals.screen_breakpoints.tablet) {
                this.uiEl.$smallVfs.addClass('hide');

                if (gc.isAddParking) {
                    this.uiEl.$eventParkingHeader.removeClass('hide');
                    parkingHeaderHeight = this.uiEl.$eventParkingHeader.is(':visible') ? this.uiEl.$eventParkingHeader.outerHeight() : 0;
                    this.publishEvent('eventdetails:showbackbutton');
                }
                this.$el.height(winHeight - headerHeight - eventInfoHeight);
            } else {
                this.uiEl.$eventParkingHeader.addClass('hide');
                this.$el.height(winHeight - headerHeight - eventDetailsHeight);
            }

            this.updateBottomContainer({});
        },

        arrowButtonAction: function(evt) {
            var windowHeight,
                headerHeight,
                eventDetailsHeight,
                sortfilterHeaderHeight,
                self = this;

            evt.preventDefault();
            evt.stopPropagation();

            // Scroll the event bar to the top or middle
            var $this = $(evt.currentTarget);
            if (!$this.hasClass('down')) {
                windowHeight = $(window).height();
                headerHeight = this.$headerView.is(':visible') ? this.$headerView.outerHeight() : 0;
                eventDetailsHeight = this.$eventDetails.outerHeight();
                sortfilterHeaderHeight = this.uiEl.$sortFilterHeader.outerHeight();
                this.uiEl.$eventContainer.addClass('top-zero');
                this.uiEl.$eventContainer.height(windowHeight - headerHeight - eventDetailsHeight);
                $('#ticketlist').height(windowHeight - headerHeight - eventDetailsHeight - sortfilterHeaderHeight);
                this.uiEl.$arrowButton.addClass('down arrowFlipDown').removeClass('arrowFlipUp');
                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Hide Map', pageload: false});
            } else {
                self.layoutSettings();
                self.uiEl.$arrowButton.removeClass('down arrowFlipDown').addClass('arrowFlipUp');

                EventHelper.track({pageView: 'EventInfo', appInteraction: 'Show Map', pageload: false});
            }
        },

        enableSectionOrZone: function() {
            var $switch = this.uiEl.$seatmap_zone_section;
                $switch.addClass('toggled');

            if (this.$el.find('#section-zone-checkbox').is(':checked')) {
                $switch.removeClass('section').addClass('zone');
                EventHelper.setUrlParam('mapState', 'zone');
                EventHelper.removeUrlParam('sid');
                this.publishEvent('seatmap:zoneOrSectionToggle', {'isSelectByZone' : true});
            }else {
                $switch.removeClass('zone').addClass('section');
                EventHelper.removeUrlParams(['mapState', 'zid']);
                this.publishEvent('seatmap:zoneOrSectionToggle', {'isSelectByZone' : false});
            }
            this.publishEvent('tooltip:hide');

            // Remove the toggled class to remove styling after toggling
            setTimeout(function() {
                $switch.removeClass('toggled');
            }, 800);
        },

        /*
            Hide the zone/section toggle if we have static map or if there are 0 listings available.
            The search inventory or the seatmap can complete independent of one another.
        */
        hideSeatmapZoneOrSectionToggle: function(numberOfListings) {
            this.numberOfListings = numberOfListings;
            if (this.numberOfListings === 0 || this.isStaticMap) {
                this.hideSeatmapZoneToggle();
            } else {
                if (!this.isStaticMap) {
                    this.showSeatmapZoneToggle(this.isStaticMap);
                }
            }

            if (this.numberOfListings > 0) {
                this.updateBottomContainer({});
                this.publishEvent('ticketlist:resize');
            }
        },

        showTicketListFooter: function(nbr) {
            if (nbr === 0 && !this.uiEl.$filter.is(':visible')) {
                if (this.model.isFiltersApplied() && globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                    this.uiEl.$ticketListFooter.removeClass('hide');
                }
            }
        },

        showSeatmapZoneToggle: function(isStaticMap) {
            this.isStaticMap = isStaticMap;

            // EVENTS-586, hiding the zone/section toggle if the map is hybrid
            if (this.isStaticMap === false && this.numberOfListings > 0 && (this.mapType + '') !== '2' && !globals.event_meta.isParking) {
                this.uiEl.$seatmap_zone_section.removeClass('hide');
            } else {
                this.hideSeatmapZoneToggle();
            }
        },

        hideSeatmapZoneToggle: function() {
            this.uiEl.$seatmap_zone_section.addClass('hide');
        },

        resetMap: function() {
            this.$el.find('.reset-map').addClass('hide');
            // Reset map and fetch tickets
            this.$el.find('#seatmap').blueprint.resetMap();

            // removing preserved sid & zid from the url
            EventHelper.removeUrlParams(['sid', 'zid']);

            this.publishEvent('tooltip:hide');
            this.views.ticketlist.model.resetSections();

            EventHelper.track({pageView: 'Seatmap', appInteraction: 'Reset Map', pageload: false, userExperienceSnapshot: {seats: ''}});
        },

        toggleReset: function() {
            var selectedSections = this.$el.find('#seatmap').blueprint.getSelectedSections();
            if (selectedSections.length > 0) {
                this.$el.find('.reset-map').removeClass('hide');
            }else {
                this.$el.find('.reset-map').addClass('hide');
            }
        },

        setOnLoadTracking: function(eventDetails) {
            var pdoExperience = globals.PDO.showPdoExperience,
                pdoStr = (pdoExperience !== '' && pdoExperience !== globals.PDO.experience.DEFAULT ?
                            ': ' + globals.PDO.omnitureString[pdoExperience] : ':'),
                pageName = pdoStr + ' Splitscreen',
                opts = EventHelper.createTrackingOpts(pageName, {}, eventDetails, this.views.singleTicket);

            EventHelper.track({pageView: opts, appInteraction: null, pageload: true, userExperienceSnapshot: this.preserveFiltersObject.userExperienceSnapshot});

            // Now that onload tracking has fired, we can fire the click tracking for disclosure load if applicable
            this.publishEvent('eventdisclosure:setClickTracking');
        },

        context: function() {
            return {
                hasBsfFeature: !!this.views.bsf,
                sidzidApplied: (this.model.get('sections').length > 0 || this.model.get('zones').length > 0),
                isBYOEnabled: EventHelper.isBYOEnabled(),
                showServiceFeeInfo: EventHelper.showServiceFeeInfo(),
                singleTicketMode: EventHelper.isSingleTicketMode()
            };
        },

        showWindowVfs: function(sectionId) {
            if (! globals.vfs_available || !sectionId) {
                return;
            }
            this.vfsSectionId = sectionId;

            EventHelper.showVfs(this.uiEl.$windowVfs.find('img')[0], 'large', sectionId, this.vfsSuccess.bind(this), null);
        },

        vfsSuccess: function() {
            this.$body.addClass('overlay-active');
            this.uiEl.$windowVfs.removeClass('hide');
        },

        switchVfs: function(evt) {
            this.publishEvent('enlargevfs:switchVfs', evt);
        },

        hideWindowVfs: function() {
            this.uiEl.$windowVfs.addClass('hide');
            this.$body.removeClass('overlay-active');
            // When the user closes the window-vfs, show where on the map that window-vfs was referring to.
            this.publishEvent('seatmap:highlightSection', this.vfsSectionId);
        },

        backButtonClicked: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if (gc.isAddParking) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Close Parking Clicked', pageload: false});
                setTimeout(function() {
                    EventHelper.urlParser.redirect(EventHelper.getReferrer());
                }, 250);
            }
        },

        getDefaultSort: function(eventModel) {
            var sortObject = globals.defaultSorting.DEFAULT,
                performers;

            try {
                performers = eventModel.get('performers');
                if (performers.length > 0) {
                    sortObject = globals.defaultSorting.PERFORMER[performers[0].id] || globals.defaultSorting.DEFAULT;
                }
            } catch (e) {}

            return sortObject;
        },

        setDefaultSort: function() {
            var sortObject = globals.defaultSorting.DEFAULT;
            // Set the default sorting.
            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                sortObject = this.getDefaultSort(this.views.eventDetails.model);
                this.model.setSilent({
                    primarySort: sortObject.sort,
                    sortElement: sortObject.element
                });
            }
        },

        updateBottomContainer: function(params) {
            var showServiceFeeInfo = EventHelper.showServiceFeeInfo(),
                displayed = params.displayed || this.uiEl.$filter.is(':visible') || false;

            // Default layout
            if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.DEFAULT) {
                // Show/Hide the Filter header in the ticket list footer.
                if (EventHelper.isMobile()) {
                    this.uiEl.$ticketListFooter.addClass('hide');
                } else {
                    if (!displayed) {
                        this.uiEl.$ticketListFooter.removeClass('hide');
                    }
                }

                if (showServiceFeeInfo) {
                    this.uiEl.$bottomContainer.removeClass('hide');
                }
            } else if (globals.TicketReco.showTicketReco === globals.TicketReco.experience.VALUEBARLOWEST) {
                this.uiEl.$ticketListFooter.addClass('hide');

                if (displayed) {
                    this.uiEl.$bottomContainer.addClass('recoExpSlider');
                    this.uiEl.$serviceFeeInfo.addClass('hide');
                } else {
                    this.uiEl.$bottomContainer.removeClass('recoExpSlider');
                    this.uiEl.$serviceFeeInfo.removeClass('hide');
                }
            }
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: EventLayout,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return EventLayout;
});

define('views/ticketdetails_ga_view',[
    'foobunny',
    'hammer',
    'global_context',
    'helpers/event_helper',
    'models/filter_model',
    'globals'
    ], function(Foobunny, Hammer, gc, EventHelper, FilterModel, globals) {
    'use strict';

    var TicketDetailsGAView = Foobunny.BaseView.extend({

        initialize: function(options) {
            console.log('--TicketDetailsGAView--  in initialize()', this);
            var self = this;
            options.model.set('totalCost', (options.model.get('usePrice').amount * options.qty).toFixed(2));
            options.model.set('qty', options.qty);

            this.initialRender = true;

            this.singleTicket = options.model.get('singleTicket');
            if (this.singleTicket) {
                this.subscribeEvent('quantityFilter:qtyUpdated', function(qty) {
                    self.updateQuantity(qty);
                    self.reRender(qty);
                    // Add the active class to the ticket details if the quantity is available
                    if (self.qtyAvailable) {
                        // Enable the Buy button.
                        self.$el.find('.buy_tickets button').addClass('active');
                    }
                });
            }
        },

        template: gc.appFolder + '/ticketdetails_ga',

        events: {
            'tap .buy_tickets': 'buyTickets',
            'change .quantity' : 'displayQuantitySelector',
            'tap .sellerInfo': 'viewUserInfo'
        },

        afterRender: function() {
            Hammer(this.el);

            var qtySelected;
            if (this.singleTicket && this.initialRender) {
                this.initialRender = false;
                qtySelected = this.model.get('qty');
                this.updateQuantity({
                    qtySelected: qtySelected
                });
                this.publishEvent('ticketdetails:qtyUpdated', {
                    qtySelected: qtySelected,
                    qtyAvailable: this.model.isQtyAvailableOnThisTicket(qtySelected)
                });
            }
        },

        buySingleTicket: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            // Check the qty and then add the shaker if qty is not selected.
            var $currTgt = $(evt.currentTarget),
                $parent = $currTgt.parents('.ticket_details'),
                self = this;

            if (!$parent.find('.buy_tickets button').hasClass('active')) {
                $parent.find('.quantity').addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('shake');
                });
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout: Inactive', pageload: false});
                return;
            }

            EventHelper.setUrlParam('ticket_id', $parent.attr('data-tid'));

            setTimeout(function() {
                self.publishEvent('url:checkout', {
                    tid: $parent.attr('data-tid'),
                    qty: $parent.attr('data-qty')
                });
            }, 300);

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Checkout', pageload: false});

        },

        buyTickets: function(evt) {
            var $currTgt = $(evt.currentTarget),
                currentTargetId = evt.currentTarget.id.split('_'),
                ticketId = currentTargetId[1];

            if ($currTgt.parents('.single_ticket').length > 0) {
                this.buySingleTicket(evt);
                return;
            }

            EventHelper.setUrlParam('ticket_id', ticketId);
            if (!gc.ticket_id) {
                EventHelper.setUrlParam('cb', '1');
            }

            EventHelper.track({
                pageView: 'Ticket Listings',
                appInteraction: 'Checkout',
                pageload: false,
                filterType: 'ListingId Selected: ' + ticketId + '; Ticket Rank: ' + this.model.get('ticketRank'),
                userExperienceSnapshot: {
                    ticketId: 'ListingId: ' + ticketId,
                    ticketRank: 'Ticket Rank: ' + this.model.get('ticketRank')
                }
            });

            // Navigate to checkout page
            this.publishEvent('url:checkout', {
                tid: currentTargetId.pop(),
                qty: this.model.get('qty')
            });
        },

        displayQuantitySelector: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var $currTgt = $(evt.currentTarget),
                $parent = $currTgt.parents('.ticket_details'),
                qty = parseInt(evt.target.value),
                price = $parent.attr('data-price'),
                amount = (qty * price).toFixed(2).split('.');

            EventHelper.setUrlParam('qty', qty);
            this.globalFilterModel.set('qty', qty);
            this.updateQuantity(qty);
            
            // Update the DOM with the information.
            $parent.attr('data-qty', qty);
            $parent.find('.price_dollars').html(amount[0]);
            $parent.find('.price_cents').html('.' + amount[1]);
            $parent.find('.selectedQty').html(qty);

            // Enable the Buy button.
            $parent.find('.buy_tickets button').addClass('active');

            // Update the qty in the qty selector.
            this.publishEvent('ticketdetails:qtyUpdated', {
                qtySelected: qty,
                qtyAvailable: this.model.isQtyAvailableOnThisTicket(qty)
            });

            this.qtyAvailable = true;
            this.reRender({qtySelected: qty});
        },

        updateQuantity: function(qty) {
            var qtySelected = qty.qtySelected;
            this.qtyAvailable = true;

            if (!this.initialRender && !this.model.isQtyAvailableOnThisTicket(qtySelected)) {
                qtySelected = this.model.get('splitVector')[0];
                this.qtyAvailable = false;
            }
            this.model.set('qty', qtySelected);
            this.$el.find('.quantity select').val((this.qtyAvailable ? qtySelected : 0));

            // Add the active class to the ticket details if the quantity is available
            if (this.qtyAvailable) {
                // Enable the Buy button.
                this.$el.find('.buy_tickets button').addClass('active');
            }
        },

        reRender: function(qty) {
            this.render();
            this.$el.find('.quantity select').val((this.qtyAvailable ? qty.qtySelected : 0));
            if (this.qtyAvailable) {
                this.$el.find('.buy_tickets button').addClass('active');
            }
        },

        viewUserInfo: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.publishEvent('sellerInfo:show', {
                businessGuid: this.model.get('businessGuid')
            });
        },

        context: function() {
            return {
                qty: this.model.get('qty'), // may have a different value than filter model
                hasBsfFeature: EventHelper.hasBsfFeature(),
                hasFaceValueFeature: EventHelper.hasFaceValueFeature()
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketDetailsGAView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel',
        targetPropName: 'globalFilterModel'
    });

    return TicketDetailsGAView;
});

/* global SH,_ */
define('views/ticketlist_ga_view',[
    'foobunny',
    'hammer',
    'global_context',
    'models/filter_model',
    'models/fulfillment_window_model',
    'models/buyer_cost_model',
    'collections/inventory_collection',
    'views/ticketdetails_ga_view',
    'helpers/event_helper',
    'helpers/delivery_helper',
    'globals'
    ], function(Foobunny, Hammer, gc, FilterModel, FulfillmentWindowModel, BuyerCostModel, InventoryCollection, TicketDetailsGAView, EventHelper, DeliveryHelper, globals) {
    'use strict';

    var TicketlistGAView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--TicketlistGAView--  in initialize()', this);

            this.collection = new InventoryCollection(gc.event_id);
            this.subCollections = {
                ticketlist: new Foobunny.BaseCollection()
            };

            this.subModels = {
                metadata: new FulfillmentWindowModel(),
                BuyerCostModel: new BuyerCostModel()
            };

            //delivery type and listing attribute mappings
            this.deliveryMappings = [];
            this.attributeMappings = [];
            this.deliveryTypeList = [];
            this.listingAttributeList = [];

            this.eventDeferred = Foobunny.utils.deferred();
            this.eventPromise = this.eventDeferred.promise();

            // This is required in the single ticket GA mode when the user
            // clicks on "View more tickets"
            this.subscribeEvent('fetchTickets', this.getTickets);

            this.subscribeEvent('singleticket:updated', this.updateTicketList);
            this.subscribeEvent('ticketlist:resize', this.setTicketlistHeight);
            this.subscribeEvent('eventmodel:dataready', this.setEventModel);

            // Listen for orientation changes
            $(window).resize(_.bind(this.setTicketlistHeight, this));
            this.upcomingEventsLink = '/'; // by default set upcoming events link to homepage

            this.eventPromise.always(
                function(){
                    this.upcomingEventsLink = this.subModels.eventModel.getUpcomingEventsLink();
                }.bind(this)
            );

            this.viewingAllTickets = false;
        },

        template: gc.appFolder + '/ticketslist_ga',

        el: '#tickets_view',

        modelEvents: {
            'change': 'processFilterModelChanged'
        },

        events: {
            'tap #view_more': 'showAllTickets'
        },

        uiEl: {
            $ticketsWrapper: '.tickets_wrapper',
            $listingsNotFound: '#listings_not_found',
            $viewMoreContent: '#view_more_content',
            $viewMoreLink: '#view_more',
            $viewTicket: '#view_ticket',
            $noTickets: '.no-tickets',
            $throbber: '.throbber',
            $zero_listings_found: '#zero_listings_found'
        },

        context: function() {
            return _.extend(
                {upcomingEventsLink: this.upcomingEventsLink}, this.model
            );
        },

        setEventModel: function(eModel) {
            this.subModels.eventModel = eModel;
            this.eventDeferred.resolve();
        },

        processFilterModelChanged: function(model) {
            // If this was part of the reset from filter then nullify the value of the reset attribute.
            model.unset('reset', {silent: true});

            // We are going to show only the 1st ticket if the user has changed
            // the quantity from the quantity picker.
            if (model.hasChanged('qty')) {
                // Whenever the qty is changed then we will only show the 1st ticket.
                this.viewingAllTickets = false;
            }

            // In single ticket mode we are not fetching the tickets when
            // the model is changed.
            if (gc.ticket_id && this.viewingAllTickets === false) {
                this.uiEl.$viewTicket.addClass('hide');
                return;
            }

            this.getTickets();
        },

        getTickets: function() {
            this.publishEvent('singleticket:hideSeeMore');

            // make sure the throbber is on
            this.uiEl.$throbber.removeClass('hide').show();

            this.$el.removeClass('hide');
            this.uiEl.$ticketsWrapper.removeClass('hide');

            // any error messages are hidden
            this.$el.find('#listings_not_found, #view_more_content, #view_more').addClass('hide');

            // and make sure the div is empty
            this.uiEl.$viewTicket.empty();

            // call fetch data
            this.fetchTicketInventory();
        },

        fetchTicketInventory: function() {
            var self = this,
                fulfillmentFetchPromise,
                buyerCostPromise;

            // fetch inventory data, but before that construct the url based on the filter model
            // pass the filter model data to prepare the url
            this.collection.prepareAPIUrl(this.model.toJSON());

            // now finally fetch
            fulfillmentFetchPromise = this.collection.fetch();

            fulfillmentFetchPromise
                .done(function(data) {
                    if (EventHelper.showBuyerCost() && data.listing && data.listing[0] !== undefined) {
                        var listingId = data.listing[0].listingId,
                            qty = qty,
                            buyercost = {
                                'buyerCostRequest': {
                                    'listingId': listingId,
                                    'quantity': self.model.get('qty'),
                                    'deliveryMethodId' : data.listing[0].deliveryMethodList[0]
                                }
                            };
                        buyerCostPromise = self.subModels.BuyerCostModel.fetch({
                            data: JSON.stringify(buyercost),
                            type: 'POST'
                        });

                        buyerCostPromise.done(function(data) {
                            var totalBuyFee = data.buyerCostResponse.totalBuyFee.amount;
                            var listing = _.clone(self.collection.models[0].get('listing'));
                            _.each(listing, function(key) {
                                key.totalBuyFee = totalBuyFee;
                            });
                            self.collection.models[0].set('listing', listing);
                            self.fetchSucessCallBack();
                        }).fail(function(error) {
                            // log in splunk
                            self.errorOnFetchedData(error);
                        });
                    } else {
                        self.fetchSucessCallBack();
                    }

                })
                .fail(function(error) {
                    // log in splunk
                    self.errorOnFetchedData(error);
                });
        },

        fetchSucessCallBack: function() {
            this.successfulInventoryDataFetch();

            // map this data onto each ticket
            this.prepareMetaDataMappings();

            // add tickets for each listing
            this.addTickets();

            // handle the cases when there could be no tickets found etc
            this.handleErrors();
        },

        fetchData: function() {
            console.log('--TicketlistGAView--  in fetchData()', this);

            var self = this,
                fetchDataPromise = this.subModels.metadata.fetch();

            fetchDataPromise
                .fail(function(error) {
                    // log in splunk
                    self.errorOnFetchedData(error);
                });

            $.when(fetchDataPromise, self.eventPromise).done(function() {
                // prepare attribute dictionary, this needs to be done only once and then cached
                self.setupAttributeDictionary();
            });

            return fetchDataPromise;
        },

        afterRender: function() {
            Hammer(this.el);

            if (this.model.get('qty') !== '-1') {
                this.processFilterModelChanged(this.model);
            }
        },

        addTickets: function() {
            var self = this;

            self.ticketRank = self.model.get('rowStart');
            // For each ticket in the collection:
            // 1- Map the disclosures from the dictionary we constructed above
            // 2- Add a view to the list of all ticket views
            this.subCollections.ticketlist.each(function(ticket, viewIndex) {
                ticket.set('ticketRank', ++self.ticketRank);

                var ticketView = new TicketDetailsGAView({
                    model: ticket,
                    qty: self.model.get('qty')
                });
                ticketView.render();
                if (viewIndex >= 1 || gc.ticket_id) {
                    ticketView.$el.addClass('more_ga_tickets');
                }
                ticketView.$el.appendTo(self.uiEl.$viewTicket);
            });
            // show the tickets finally
            this.displayTickets();
        },

        displayTickets: function() {
            if (gc.ticket_id) {
                this.showAllTickets();
            } else {

                if (this.subCollections.ticketlist.length > 1) {
                    this.uiEl.$viewMoreLink.removeClass('hide');
                }

                if (this.viewingAllTickets) {
                    this.showAllTickets();
                }
            }

            this.uiEl.$viewTicket.removeClass('hide');
            this.uiEl.$viewMoreContent.removeClass('hide');
            this.uiEl.$throbber.hide();
            this.setTicketlistHeight();
        },

        setTicketlistHeight: function() {
            var windowHeight = $(window).height(),
                headerHeight = $('#header').outerHeight(),
                eventInfoHeight = $('#eventInfo').outerHeight(),
                qtyFilterHeight = $('#quantityfilter').outerHeight(),
                $ticketListFooter = $('#ticketlist_footer'),
                ticketListFooterHeight = ($ticketListFooter.is(':visible') ? $ticketListFooter.outerHeight() : 0),
                $filter = $('#filter'),
                filterHeight = ($filter.is(':visible') ? $filter.outerHeight() : 0),
                singleTicketHeight = 0;

            if (gc.ticket_id) {
                singleTicketHeight = $('#single-ticket').outerHeight();
            }

            if (window.innerWidth < globals.screen_breakpoints.tablet) {
                filterHeight = 0;
            }

            this.$el.height(windowHeight - headerHeight - eventInfoHeight -
                qtyFilterHeight - singleTicketHeight - ticketListFooterHeight - filterHeight);
        },

        handleErrors: function() {
            if (this.subCollections.ticketlist.length === 0 && this.model.get('qty') !== 0) {
                this.uiEl.$viewTicket.addClass('hide');
                this.uiEl.$viewMoreContent.addClass('hide');
                this.uiEl.$throbber.addClass('hide').hide();
                this.uiEl.$zero_listings_found.hide();
                this.uiEl.$listingsNotFound.removeClass('hide');
            }

            if (this.collection.hasOwnProperty('quantityVector') && this.collection.quantityVector.length < 1) {
                this.uiEl.$listingsNotFound.removeClass('hide');
            }
        },

        handleAPIErrors: function() {
            this.uiEl.$throbber.addClass('hide').hide();
            this.uiEl.$viewTicket.addClass('hide');
            this.uiEl.$noTickets.removeClass('hide');
        },

        handleZeroInventory: function() {
            this.uiEl.$throbber.addClass('hide').hide();
            this.uiEl.$viewTicket.addClass('hide');
            this.uiEl.$zero_listings_found.find('a').first().attr('href',this.upcomingEventsLink); // TODO: this should really be a subtemplate or subview to re-render errors as needed but since we are getting rid of GA, i'm doing it this way
            this.uiEl.$zero_listings_found.show();
        },

        showAllTickets: function() {
            this.viewingAllTickets = true;

            this.uiEl.$viewTicket.removeClass('hide');
            this.$el.find('#view_ticket .more_ga_tickets').show();

            // reset the height to allow scroll
            this.setTicketlistHeight();

            // keep this hidden - all tickets are showing up now
            this.uiEl.$viewMoreLink.addClass('hide');

            EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'See All Listings', pageload: false});
        },

        successfulInventoryDataFetch: function() {
            this.subCollections.ticketlist.reset(this.collection.models[0].get('listing'));

            // If the totalListings is 0 then send the tracking call.
            if (this.collection.models[0].get('totalListings') === 0) {
                EventHelper.track({pageView: 'Ticket Listings', appInteraction: 'Zero tickets returned', pageload: false});
                this.handleZeroInventory();
            }

            // we can now empty the main collection - no need to keep it!
            this.collection.reset();
        },

        prepareMetaDataMappings: function() {
            var self = this;
            this.subCollections.ticketlist.each(_.bind(function(ticket) {

                if (ticket.attributes.deliveryTypeList === null || ticket.attributes.deliveryTypeList === undefined || (ticket.attributes.deliveryTypeList && ticket.attributes.deliveryTypeList.length === 0)) {
                    return;
                }
                // TODO: dust template should handle this
                // update the mappings if not already done
                if (ticket.attributes.deliveryTypeList !== null && !ticket.attributes.deliveryTypeList[0].deliveryAttribute) {
                    // for all the delivery attributes
                    ticket.attributes.deliveryTypeList = (ticket.attributes.deliveryTypeList || []).map(function(deliveryAttribute) {
                        return {
                            id: deliveryAttribute,
                            deliveryAttribute: self.deliveryMappings[deliveryAttribute]
                        };
                    });
                }
                // TODO: dust template should handle this
                if (ticket.attributes.deliveryTypeList !== null && !ticket.attributes.deliveryTypeList[0].listingAttribute) {
                    // for all the listing attributes
                    ticket.attributes.listingAttributeList = (ticket.attributes.listingAttributeList || []).map(function(listingAttribute) {
                        return {
                            listingAttribute: self.attributeMappings[listingAttribute]
                        };
                    });
                }
            }));
        },

        setupAttributeDictionary: function() {
            var self = this,
                deliveryTypeList = this.subModels.metadata.get('InventoryEventMetaData').deliveryTypeList,
                listingAttributeList = this.subModels.eventModel.get('seatTraits');

            if (deliveryTypeList) {
                this.deliveryTypeList = deliveryTypeList;
                this.deliveryTypeList.forEach(function(deliveryAttribute) {
                    var desc = deliveryAttribute.description;
                    self.deliveryMappings[deliveryAttribute.id] = desc;
                });
            }

            if (listingAttributeList) {
                this.listingAttributeList = listingAttributeList;
                this.listingAttributeList.forEach(function(listingAttribute) {
                    self.attributeMappings[listingAttribute.id] = listingAttribute.name;
                });
            }
        },

        errorOnFetchedData: function(error) {
            // also handle failure; cannot proceed with the app
            // Since the user is already being shown the single ticket,
            // show an alternate message to the user instead of something went wrong page.
            if (gc.ticket_id) {
                this.handleAPIErrors();
            } else {
                this.publishEvent('dataready:error', error);
            }

            // log failures in Splunk
            EventHelper.logAppState('fetch', error);
        },

        updateTicketList: function() {
            if (!gc.ticket_id) {
                return;
            }

            // any error messages are hidden
            this.uiEl.$listingsNotFound.addClass('hide');
            this.uiEl.$viewMoreContent.addClass('hide');
            this.uiEl.$viewMoreLink.addClass('hide');
            this.uiEl.$noTickets.addClass('hide');

            // and make sure the div is empty
            this.uiEl.$viewTicket.empty();

            this.uiEl.$throbber.addClass('hide').hide();
        },

        showViewMoreLink: function() {
            this.uiEl.$viewMoreContent.removeClass('hide');
            this.uiEl.$viewMoreLink.removeClass('hide');
            this.$el.removeClass('hide');
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: TicketlistGAView,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return TicketlistGAView;
});

define('views/singleticket_ga_view',[
    'foobunny',
    'hammer',
    'models/filter_model',
    'models/singlelisting_model',
    'views/ticketdetails_ga_view',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, Hammer, FilterModel, SingleListingModel, TicketdetailsGAView, EventHelper, gc, globals) {
    'use strict';

    var SingleticketGAView = Foobunny.BaseView.extend({

        initialize: function() {
            console.log('--SingleTicketGAView-- in initialize', this);

            this.model = new SingleListingModel(gc.ticket_id);
            // GA View only: We are not doing anything if the single ticket is not available/valid.
            // Hence we are not listening to the invalid event of the model like in the NON-GA view.

            this.subscribeEvent('singleticket:hideSeeMore', this.hideSeeMore);
            this.subscribeEvent('ticketdetails:qtyUpdated', this.updateSingleTicket);

            this.model.on('invalid', this.errorOnFetchedData, this);
        },

        el: '#single-ticket',

        template: gc.appFolder + '/single_ticket_ga',

        events: {
            'tap .view_more': 'showMoreTickets',
            'tap .find-another-ticket' : 'showAllTickets'
        },

        modelEvents: {
            'change:singleTicketError': 'displayErrorMesage',

            FilterModel: {
                'change:withFees': 'updatePrice',
                'change:qty': 'updateSingleTicketQty'
            }
        },

        unSubscribeFilterModelEvents: function() {
            this.subModels.FilterModel.off('change:withFees', this.updatePrice);
            this.subModels.FilterModel.off('change:qty', this.updateSingleTicketQty);
        },

        afterRender: function() {
            Hammer(this.el);
        },

        fetchData: function() {
            var self = this,
                singleTicketFetchPromise;

            singleTicketFetchPromise = this.model.fetch({validate: true});

            singleTicketFetchPromise.done(function() {
                if (!self.model.validationError) {
                    // FOR NOW, GA is treating the tickets without splits as if it has
                    // splits. Hence, massaging the data here. Once we move the same to
                    // NON-GA view then this should be done in the MODEL and removed
                    // from here.
                    self.model.convertIntoVector();
                    self.addSingleTicket();
                }
                // TBD: If there is a validation error then should we stop listening to events?
                // The model is still available it's just that it is not valid and most probably
                // the single ticket view is not visible either.
            })
            .fail(function(error) {
                self.errorOnFetchedData(self.model, error);
            });
            return singleTicketFetchPromise;
        },

        errorOnFetchedData: function(model, error, options) {
            var logdata;

            // hide advanced settings
            $('#ticketlist_footer').addClass('hide');

            // Remove the single_ticket class from the event_ga_layout
            $('#event_ga_layout').removeClass('single_ticket');

            // Stop listening to the event since the model is not there.
            this.unsubscribeEvent('quantityFilter:qtyUpdated');
            this.unsubscribeEvent('ticketdetails:qtyUpdated');
            this.unSubscribeFilterModelEvents();

            if (model.validationError) {
                this.publishEvent('dataready:error', error);
                EventHelper.track({pageView: '', appInteraction: model.validationError, pageload: false});
            } else if (error.status === 400 || error.status === 404) {
                this.model.set('singleTicketError', true);
                error = EventHelper.singleTicketErrorObject(error);
                EventHelper.track({pageView: error.responseJSON.code, appInteraction: error.responseJSON.description, pageload: false});
            } else {
                // Handle failure; cannot proceed with the app
                this.publishEvent('dataready:error', error);
            }

            //log failures in Splunk
            if (typeof error === 'object') {
                EventHelper.logAppState('fetch', error);
            } else {
                if (typeof error === 'string') {
                    logdata = {'general_error' : error};
                } else {
                    // Catch all error so that something is logged in splunk in case
                    // the error is not an object and not a string.
                    logdata = {'general_error' : 'Invalid Error'};
                }
                EventHelper.logAppState('fetch', null, logdata);
            }
        },

        displayErrorMesage: function() {
            if (!this.model.get('singleTicketError')) {
                return;
            }

            var self = this;

            $('#quantityfilter').addClass('hide');
            this.render();

            this.showTicketTimer = setTimeout(function() {
                // Hide ticket view if listing is not available but event is active
                self.showAllTickets();
            }, 5000);
        },

        showAllTickets: function(evt) {
            clearTimeout(this.showTicketTimer);
            this.$el.addClass('hide');

            // omniture tracking only when user clicked on find another ticket button
            if (evt && $(evt.currentTarget).hasClass('find-another-ticket')) {
                EventHelper.track({pageView: 'GA ticket id expired', appInteraction: 'Find another ticket', pageload: false});
            }
            $('#quantityfilter').removeClass('hide');

            // display tickets for quantity one
            $('#qty_container .qty_index').first().trigger('click');
            EventHelper.removeUrlParam('ticket_id');
        },

        addSingleTicket: function() {
            var self = this,
                filterModelQty = this.subModels.FilterModel.get('qty'),
                isFilterModelQtyAvailable = this.model.isQtyAvailableOnThisTicket(Number(filterModelQty));
            this.singleTicketView = new TicketdetailsGAView({
                model: this.model,
                qty: filterModelQty > 0 && isFilterModelQtyAvailable ? Number(filterModelQty) : this.getQuantity()
            });

            var renderPromise = this.singleTicketView.render();
            renderPromise.done(function() {
                self.$el.find('.single-ticket-wrapper').empty().append(self.singleTicketView.el);
                // Sometimes if the single ticket API takes longer and then the user
                // clicks on a filter the ticket list is displayed and then when the
                // ticket api returns with a response see more is displayed in between
                // the single ticket and the ticket list. Show the see more if the ticket list is hidden.
                if ($('#tickets_view').hasClass('hide')) {
                    self.displaySeeMore();
                    globals.ticketIdActive = true;
                }
            });
        },

        updateSingleTicketQty: function(model, qty) {
            this.updateSingleTicket({qtySelected: qty});
        },

        updateSingleTicket: function(qty) {
            var qtySelected = qty.qtySelected,
                qtyAvailable = true;

            // If the model is not available then bail.
            if (!this.model.fetched) {
                return;
            }

            // If the quantity picked from the qty picker is not available then
            // set the qty to the minimum qty in the view.
            // IMPORTANT: The select drop down may be disabled.
            if (!this.model.isQtyAvailableOnThisTicket(qtySelected)) {
                qtyAvailable = false;
            }
            this.model.set('qty', qtySelected);

            if (qtyAvailable) {
                // Show the View more link
                this.displaySeeMore();
            } else {
                this.showMoreTickets();
            }

            this.publishEvent('singleticket:updated');
        },

        updatePrice: function(filterModel, withFees) {
            if (withFees) {
                this.model.set('usePrice', this.model.get('buyerSeesPerProduct'));
            } else {
                this.model.set('usePrice', this.model.get('pricePerProduct'));
            }

            this.singleTicketView.render();
        },

        getQuantity: function() {
            return this.model.get('qty');
        },

        showMoreTickets: function() {
            this.publishEvent('fetchTickets');
            this.hideSeeMore();
        },

        hideSeeMore: function() {
            this.$el.find('.single-ticket-see-more').addClass('hide');
        },

        displaySeeMore: function() {
            this.$el.find('.single-ticket-see-more').removeClass('hide');
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: SingleticketGAView,
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });
    return SingleticketGAView;
});

/* global SH,_ */
define('layouts/event_ga_layout',[
    'foobunny',
    'models/filter_model',
    'views/quantity_filter_view',
    'views/event_details_view',
    'views/event_disclosure_view',
    'views/ticketlist_ga_view',
    'views/singleticket_ga_view',
    'views/filter_view',
    'views/ticketlist_footer_view',
    'views/seller_view',
    'collections/inventory_collection',
    'helpers/event_helper',
    'global_context',
    'globals'
], function(Foobunny, FilterModel, QuantityFilterView, EventDetailsView, EventDisclosureView, TicketlistGAView, SingleTicketGAView, FilterView, TicketlistFooterView, SellerView, InventoryCollection, EventHelper, gc, globals) {
    'use strict';

    var EventGALayout = Foobunny.Layout.extend({

        initialize: function() {
            console.log('--EventLayoutGA-- in initialize()', this);

            var self = this,
                p0,
                experience = {abValue: {}},
                mboxKeys = ['showWithFees', 'quantityQuestion'];

            SH.mbox = SH.mbox || {};

            this.views = {
                eventDetails: new EventDetailsView(),
                eventDisclosure: new EventDisclosureView(),
                //filter: new FilterView(),
                ticketlist: new TicketlistGAView(),
                ticketlistFooter: new TicketlistFooterView()
            };

            this.preserveFiltersObject = {
                userExperienceSnapshot: {
                    quantity: globals.OMN.qty > 0 ? 'Quantity: ' + globals.OMN.qty : '',
                    ticketId: globals.OMN.listingId ? 'ListingId: ' + globals.OMN.listingId : '',
                    PDO: globals.OMN.withFees === true ? 'Price With Fees' : '',
                    priceSliderMax: globals.OMN.maxPrice > -1 ? 'Max Price: ' + globals.OMN.maxPrice : ''
                }
            };

            this.subscribeEvent('module:globalcontextvars:apiresponseready', this.updateMaxQuantity);
            this.subscribeEvent('eventmodel:expiredEvent', this.handleExpiredEvent);
            this.subscribeEvent('quantityFilter:qtyUpdated', this.updateLayout);
            this.subscribeEvent('ticketdetails:qtyUpdated', this.updateLayout);

            if (EventHelper.hasBsfFeature()) {
                this.views.bsf = new SellerView();
            }

            //initialize the collection
            this.collection = new InventoryCollection(gc.event_id);

            //three api calls are made from this app, promise p1 is only the metadata fetch promise
            p0 = $.Deferred();
            this.p2 = this.views.ticketlist.fetchDataPromise;
            this.p3 = this.views.eventDetails.fetchDataPromise;

            $.when(this.p3).done(function eventDetailsDone() {
                if (self.views.eventDetails.model.get('expiredInd') === true) {
                    self.$el.find('.ga.spinner').addClass('hide');
                    return;
                }

                if (EventHelper.isABTestActive()) {
                    if (gc.mboxCalled) {
                        // experience.abValue.displayWithFeesToggle = globals.displayWithFeesToggle;
                        self.mboxPromise = $.Deferred().resolve(experience);
                    } else {
                        self.mboxPromise = EventHelper.makeMboxCall(
                            self,
                            EventHelper.constructMboxData(self.views.eventDetails.model),
                            SH.mbox,
                            mboxKeys);
                    }
                    self.mboxPromise.always(function mboxAlways(params) {
                        EventHelper.setUrlParam('mbox', '1');

                        //ABTest for priceWithFeesToggle show/hide
                        // if (_.isBoolean(params.abValue.displayWithFeesToggle)) {
                        //     globals.displayWithFeesToggle = params.abValue.displayWithFeesToggle;
                        // } else {
                        //     globals.displayWithFeesToggle = EventHelper.isDisplayWithFeesToggle();
                        // }
                        // EventHelper.setUrlParam('dwft', globals.displayWithFeesToggle); //dwft - displayWithFeesToggle
                        p0.resolve();
                    });
                } else {
                    p0.resolve();
                }
            });

            $.when(p0, this.p2, this.p3).then(function() {

                self.views.filter = new FilterView();
                self.views.filter.render();

                if (EventHelper.isSingleTicketMode()) {
                    self.views.singleTicket = new SingleTicketGAView();
                    self.views.singleTicket.render();
                }
                var urlParamQtyBtnCount = EventHelper.getUrlQuery('qtyBtnCount'),
                    qtyFilterArgs;



                if (!gc.quantityDirty && !globals.event_meta.isParking && globals.quantityOverlay.quantityQuestion && !gc.userComingBack && self.model.get('qty') === '-1' && !EventHelper.isSingleTicketMode()){
                    qtyFilterArgs = {
                        filterId: "qty_container",
                        filterClass: 'qty_content flex-container',
                        type: 'carousel',
                        dispose: false,
                        maxButtonCount: urlParamQtyBtnCount || globals.quantityOverlay.quantityBtnMaxCountGA,
                        minButtonCount: globals.quantityOverlay.quantityBtnInitialCountGA,
                        quantityVector: self.model.get('quantityVector'),
                        qtySelected:  self.model.get('qty'),
                        navigation: true
                    };
                } else {
                    qtyFilterArgs = {
                        filterId: "qty_container",
                        filterClass: 'qty_content',
                        type: 'overlay',
                        dispose: false,
                        maxButtonCount: urlParamQtyBtnCount || globals.quantityOverlay.quantityBtnMaxCountGA,
                        minButtonCount: globals.quantityOverlay.quantityBtnInitialCountGA,
                        quantityVector: self.model.get('quantityVector'),
                        qtySelected:  self.model.get('qty'),
                        navigation: true
                    };
                }

                // create the quantity filter view only after event data model is available
                self.views.qtyfilter = new QuantityFilterView(qtyFilterArgs);
                self.views.qtyfilter.render();

                self.subscribeEvent('ticketdetails:qtyUpdated',function(evt){
                    self.views.qtyfilter.displaySelectedQty(evt.qtySelected);
                });

                self.$el.find('.ga.spinner').addClass('hide');

                // finally fire the app:render-ready event
                self.publishEvent('app:render-ready');

                self.collection.prepareAPIUrl(self.model.toJSON());
                self.collection.fetch()
                    .done(function(response) {
                        var quantityVector = self.collection.getQtyAvailableVector(response);
                        // end Quantity filter theme switch
                        // check if there are tickets available before displaying quantity question
                        if(response.qtyVectorMinimumQuantity > 0) {
                            self.views.qtyfilter.options.maxButtonCount = response.qtyVectorMaximumQuantity;
                            self.views.qtyfilter.initialize({startCount: response.qtyVectorMinimumQuantity, maxButtonCount: response.qtyVectorMaximumQuantity, qtySelected:  EventHelper.getUrlQuery('qty')});
                            self.views.qtyfilter.render();
                            if (response.minQuantity < 1) {
                                self.views.ticketlist.handleAPIErrors();
                            }
                        } else {
                            self.views.qtyfilter.closeQtyOverlay();
                            self.views.ticketlist.handleZeroInventory();
                        }
                    });

                self.setOnLoadTracking(self.views.eventDetails.model);
            }).fail(function(error) {
                self.setOnLoadTracking();
                self.publishEvent('app:render-error');
            });
        },

        uiEl: {
            '$quantityfilter': '#quantityfilter',
            '$tickets_view': '#tickets_view',
            '$ga_image': '#ga_image',
            '$findmorelink': '.findmorelink',
            '$event_error': '#event_error',
            '$ticketlistfooter': '#ticketlist_footer',
            '$ga_spinner': '.ga.spinner'
        },

        el: '#content_container',

        template: gc.appFolder + '/event_ga_layout',

        modelEvents: {
            'change:qty change:qtyMax change:qtyMin': 'closeOverlay'
        },

        closeOverlay: function() {
            if(this.overlayClosed !== 1) {
                this.uiEl.$quantityfilter.addClass('selectQty');
                this.overlayClosed = 1;
            }
        },

        afterRender: function() {
            // Set the class to single_ticket for all modes.
            if (EventHelper.isSingleTicketMode()) {
                this.$el.find('#event_ga_layout').addClass('single_ticket');
            }

            if (this.model.get('qty') !== '-1') {
                this.updateLayout();
                this.uiEl.$quantityfilter.addClass('selectQty');
                this.uiEl.$ticketlistfooter.removeClass('hide'); //as qty is updated remove .hide for the footer
                this.uiEl.$ga_spinner.hide();
            }

            //Ads specific code
            /*var eventpageAds = 'eventpage';
             //if gc has current geo id, use this info to make ad call
            var geoId = gc.geolocationCollection.getSelectedGeoId();
            // Initialize the cache
            var geolocationCache = new Foobunny.Cache({
                type: 'local',
                namespace: 'app'
            });

            //Get last selected location ID from cache
            var lastSelectedLocationId = geolocationCache.get('lastSelectedLocationId');

            var config = {
                            pageType: eventpageAds,
                            categoryId: '',
                            genreId: '',
                            genreParentId: '',
                            genreGrandParentId: '',
                            pageUrl: window.location.href,
                            userGeoDetected: lastSelectedLocationId || geoId || '',
                            venueId: '',
                            userStatus: 'guestuser',
                            artistPrimaryStyle: ''
            };

            Ads.initialize(function() {
                Ads.setTargetingConfig(config);
                Ads.loadAdConfig(eventpageAds);
            });*/
        },

        handleExpiredEvent: function(upcomingEventsLink) {
            this.uiEl.$findmorelink.attr('href', upcomingEventsLink);
            this.uiEl.$quantityfilter.addClass('hide');
            this.uiEl.$tickets_view.addClass('hide');
            this.uiEl.$event_error.removeClass('hide');
        },

        setOnLoadTracking: function(eventDetails) {
            var pdoExperience = globals.PDO.showPdoExperience,
                pdoStr = (pdoExperience !== '' && pdoExperience !== globals.PDO.experience.DEFAULT ?
                            ': ' + globals.PDO.omnitureString[pdoExperience] : ':'),
                pageName = pdoStr + ' Quantity Picker',
                opts = EventHelper.createTrackingOpts(pageName, {}, eventDetails, this.views.singleTicket);

            EventHelper.track({pageView: opts, appInteraction: null, pageload: true, userExperienceSnapshot: this.preserveFiltersObject.userExperienceSnapshot});

            //Now that onload tracking has fired, we can fire the click tracking for disclosure load if applicable
            this.publishEvent('eventdisclosure:setClickTracking');
        },

       updateLayout: function() {
            this.uiEl.$ga_image.addClass('hide');
        },

        updateMaxQuantity: function(response) {
            if(response.APIName === 'inventory') {
                if(this.views.qtyfilter === undefined) {
                    globals.quantityBtnMaxCountGA = response.data.maxQuantity;
                } else {
                    this.views.qtyfilter.maxButtonCount = response.data.maxQuantity;
                }
            }
        },

        context: function() {
            return {
                hasBsfFeature: !!this.views.bsf,
                pdoExperience: globals.PDO.experience,
                showPdoExperience: globals.PDO.showPdoExperience
            };
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: EventGALayout,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return EventGALayout;
});

/* global SH,_ */
define('controllers/viewselector_controller',[
    'foobunny',
    'layouts/event_layout',
    'layouts/event_ga_layout',
    'models/filter_model',
    'helpers/event_helper',
    'globals',
    'global_context'
], function(Foobunny, EventLayout, EventGALayout, FilterModel, EventHelper, globals, gc) {
    'use strict';

    var ViewSelectorController = Foobunny.Controller.extend({
        initialize: function() {
            console.log('--ViewSelectorController-- in initialize()', this);
            _.bindAll(this, 'start');

            // TODO: Remove this once the 76ers is launched.
            // Inject the 76ers CSS file if the url contains brand_performer=76ers.
            if (this.req.urlParams.brand_performer &&
                this.req.urlParams.brand_performer === '76ers') {
                var CSSUrl_76ers = gc.staticUrl + '/resources/shape/styles/' + gc.appFolder + '/app.override.76ers.min.css';
                SH.skinName = '76ers';
                $('body').addClass('skin-76ers');
                $('head').append('<link rel="stylesheet" href="' + CSSUrl_76ers + '">');
            }

            var sortField = 'value',
                secondarySortValue = 'listingPrice+asc',
                preserveData = {};

            // save query params in global context
            gc.event_id = this.req.urlParams.eventId || this.req.urlParams.event_id;

            // sets the ticket id in global context object if it exists
            gc.ticket_id = this.req.urlParams.ticket_id;
            gc.cart_id = this.req.urlParams.cart_id;

            gc.userComingBack = this.req.urlParams.cb;
            gc.mboxCalled = (this.req.urlParams.mbox === '1');
            gc.showBYO = (this.req.urlParams.byo === '1');
            gc.isAddParking = (this.req.urlParams.pA === '1');
            gc.parkingListingId = this.req.urlParams.park_id;
            gc.parkingQty = this.req.urlParams.park_qty;
            gc.quantityDirty = (this.req.urlParams.qqd === '1');

            // preserving filter data
            preserveData.qty = this.req.urlParams.qty ? this.req.urlParams.qty : '-1';
            preserveData.zonesEnabled = (this.req.urlParams.mapState === 'zone') ? true : false;
            preserveData.maxPrice = this.req.urlParams.sliderMax ? parseInt(this.req.urlParams.sliderMax.split(',')[1]) : -1;
            preserveData.minPrice = this.req.urlParams.sliderMin ? parseInt(this.req.urlParams.sliderMin.split(',')[1]) : -1;
            preserveData.withFees = (this.req.urlParams.priceWithFees === 'true');

            globals.zones_enabled = preserveData.zonesEnabled;
            // globals.displayWithFeesToggle = (this.req.urlParams.dwft === 'true');

            if (this.req.urlParams.sid) {
                preserveData.sections = this.req.urlParams.sid.split(',');
                globals.OMN.sid = this.req.urlParams.sid;
            }

            if (this.req.urlParams.zid) {
                preserveData.zones = this.req.urlParams.zid.split(',');
                globals.OMN.zid = this.req.urlParams.zid;
            }

            if (this.req.urlParams.dt) {
                preserveData.deliveryTypeList = this.req.urlParams.dt.split(',');
                globals.OMN.dt = this.req.urlParams.dt;
            }

            if (this.req.urlParams.categ) {
                preserveData.listingAttributeCategoryList = this.req.urlParams.categ.split(',');
                globals.OMN.categ = this.req.urlParams.categ;
            }

            if (this.req.urlParams.excl) {
                preserveData.excludeListingAttributeCategoryList = this.req.urlParams.excl.split(',');
                globals.OMN.excl = this.req.urlParams.excl;
            }

            gc.urlSortOption = this.req.urlParams.sort;

            globals.sliderPrice.sliderMinPrice = parseInt(preserveData.minPrice);
            globals.sliderPrice.sliderMaxPrice = parseInt(preserveData.maxPrice);
            globals.sliderPrice.sliderMinPercent = this.req.urlParams.sliderMin ? parseFloat(this.req.urlParams.sliderMin.split(',')[0]) : '';
            globals.sliderPrice.sliderMaxPercent = this.req.urlParams.sliderMax ? parseFloat(this.req.urlParams.sliderMax.split(',')[0]) : '';
            globals.sliderPrice.eventMinPrice = parseInt(this.req.urlParams.minPrice);
            globals.sliderPrice.eventMaxPrice = parseInt(this.req.urlParams.maxPrice);
            globals.priceSlider.displayOutside = this.req.urlParams.sliderpos === 'true';

            globals.byo.ABdisplay = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.abbyo, EventHelper.isBYOEnabled());
            globals.byo.quantity = this.req.urlParams.byo_qty || '';

            globals.upgradeTicket.display = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.dUpg, EventHelper.isUpgradeEnabled());
            globals.upgradeTicket.isTicketUpgraded = this.req.urlParams.oldtktid ? true : false;
            globals.upgradeTicket.oldTicketListingId = this.req.urlParams.oldtktid;
            globals.byo.upsellAccordion = EventHelper.determineValueToPreserve('boolean', this.req.urlParams.dUAccr, EventHelper.isUpsellAccordionEnabled());

            globals.TicketReco.showTicketReco = globals.TicketReco.recoExperience[this.req.urlParams.rS] || globals.TicketReco.showTicketReco;
            globals.quantityOverlay.quantityQuestion = this.req.urlParams.qtyq || globals.quantityOverlay.quantityQuestion;
            globals.inventoryCollection.blendedLogicApplied = this.req.urlParams.bla || EventHelper.determineValueToPreserve('boolean', this.req.urlParams.bla, EventHelper.blendedEnabledSwitch());

            globals.OMN.qty = preserveData.qty;
            globals.OMN.byoqty = globals.byo.quantity;
            globals.OMN.zonesEnabled = preserveData.zonesEnabled;
            globals.OMN.maxPrice = preserveData.maxPrice;
            globals.OMN.minPrice = preserveData.minPrice;
            globals.OMN.withFees = preserveData.withFees;
            globals.OMN.urlSortOption = gc.urlSortOption;
            globals.OMN.listingId = this.req.urlParams.ticket_id;
            globals.OMN.ticketRank = this.req.urlParams.ticketRank;

            // set sortField in model to send secondary sort to search inventory api
            if (gc.urlSortOption) {
                var splitUrlSort = gc.urlSortOption.split('+');
                // sortFiled internal model value, no need of i18n
                switch (splitUrlSort[0]) {
                    case 'sectionname':
                        sortField = 'section';
                        break;
                    case 'row':
                        sortField = 'row';
                        break;
                    case 'currentPrice':
                        sortField = 'price';
                        secondarySortValue = 'currentPrice+asc';
                        break;
                    case 'listingPrice':
                        sortField = 'price';
                        break;
                    case 'quality':
                        sortField = 'seats';
                        break;
                }
            }

            // Set the PDO experience for the APP since the AB has concluded.
            globals.PDO.showPdoExperience = EventHelper.showPdoExperience();
            EventHelper.setPdoState();
            this.model.updateDefaultsForWithFees(globals.PDO.withFees);

            globals.PDO.withFees = preserveData.withFees ? preserveData.withFees : globals.PDO.withFees;

            preserveData.sortField = sortField;
            preserveData.secondarySort = secondarySortValue;
            preserveData.ticketRecommendation = gc.urlSortOption ? false : true;

            if (preserveData.withFees) {
                preserveData.priceType = globals.price_type.CURRENT;
            }

            this.model.setSilent(preserveData);

            gc.tktbkt = this.req.urlParams.tktbkt;

            // url params won't be store in session storage
            var eventFilters = Foobunny.storage.getSessionItem('eventFilters');
            if (eventFilters) {
                for (var key in eventFilters) {
                    this.model.set(key, eventFilters[key]);
                }
            }

            // get the venue config information to check if GA or no-GA layout
            this.viewAvailablePromise = $.Deferred();
            this.fetchVenueConfigData();

            // not everything is right, hide the event container and show error message instead
            this.subscribeEvent('dataready:error', this.showErrorMsg);

            // In safari, When the user gets redirected to checkout after successfully logging in Login component from eventpage
            // and clicks browser back button, reload the page if it's forward/back cache - EVENTS-226
            $(window).bind('pageshow', function(event) {
                // jquery doesn't expose the 'persisted' directly in event, so using orinalEvent
                if (event.originalEvent.persisted) {
                    window.location.reload();
                }
            });

            return this.view;
        },

        fetchVenueConfigData: function() {
            var self = this,
                customErrorStack = {    // Used only for tracking when event id is missing
                    responseJSON: {
                        'code': 'NA',
                        'description': 'Event id is missing in the URL'
                    }
                };

            console.log('--ViewSelectorController-- in fetchVenueConfigData()');

            // If event id doesn't exist publish a failure and return
            if (!gc.event_id) {
                this.showErrorMsg(customErrorStack);
                return;
            }

            return $.ajax({
                dataType: 'json',
                url: '/shape/catalog/venues/v3/venueconfigurations?eventId=' + gc.event_id,
                beforeSend: function(xhr) {
                    if (gc.app_token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + gc.app_token);
                    }
                    xhr.setRequestHeader('Accept-Language', gc.shlocale);
                }
            }).done(function(data) {
                if (_.isEmpty(data)) {
                    self.viewAvailablePromise.reject(new Error());
                    return;
                }
                // check now which layout to initialize, based on if the event is general admission or not
                var venueConfig = data.venueConfiguration[0],
                    gaOnly = venueConfig.generalAdmissionOnly,
                    mapType = venueConfig.map.mapType,
                    version = venueConfig.venueConfigurationVersion,
                    viewFromSection = venueConfig.map.viewFromSection ? true : false,
                    staticImageUrl = venueConfig.staticImageUrl,
                    nodeId = venueConfig.venueId,
                    configId = venueConfig.id;

                globals.TicketReco.hasTicketReco = venueConfig.attributes.reco.showTicketRecoInd || false;

                EventHelper.setBlendedEvent(venueConfig.blendedIndicator);

                // RITESH: Leaving this in the code for now since after the AB for MLB we will have to
                // un-comment this code to adjust the UI.
                // Set the ticket recommendation experience for the APP since the AB has concluded.
                // if (globals.TicketReco.hasTicketReco) {
                //     globals.TicketReco.showTicketReco = EventHelper.showRecoExperience();
                // } else {
                //     globals.TicketReco.showTicketReco = globals.TicketReco.experience.DEFAULT;
                // }
                if (gaOnly) {
                    // save view type in global context
                    gc.view = 'GA';
                    // genral admission event
                    self.view = new EventGALayout();
                    // add a global class to body tag
                    $('html, body').addClass('view_ga');
                } else {
                    gc.view = 'NON-GA';
                    // map layout
                    self.view = new EventLayout({
                        nodeId: nodeId,
                        configId: configId,
                        mapType: mapType,
                        version: version,
                        viewFromSection: viewFromSection,
                        staticImageUrl: staticImageUrl
                    });
                    // add a global class to body tag
                    $('body').addClass('view_non_ga');
                    // add a global flag to determine whether we can display vfs images
                    globals.vfs_available = venueConfig.map.viewFromSection;
                }
                self.viewAvailablePromise.resolve();

                try {
                    Foobunny.storage.setItem('event:' + gc.event_id + ':venue', data, 'local', 1000 * 60 * 60);
                } catch (e) {
                    // no op
                }

            }).fail(function(error) {
                self.viewAvailablePromise.reject(error);
            });
        },

        showErrorMsg: function(error) {
            var opts;
            $('#content_container').addClass('hide');
            $('#data_ready_error').removeClass('hide');

            opts = EventHelper.createTrackingOpts(': Error View', {}, null, false);
            EventHelper.track({pageView: opts, pageload: true, pageError: true});
        },

        start: function() {
            console.log('--ViewSelectorController-- in start()', this);
            // start when view is available which in turn is determined after an api call
            var self = this;
            $.when(self.viewAvailablePromise).done(function() {
                self.show();
            }).fail(function(error) {
                // also show app error message
                self.showErrorMsg(error);

                // log failures in Splunk
                EventHelper.logAppState('fetch', error);
            });
            // set the optout url
            SH.app.setOptoutUrl('http://www.' + SH.targetHost + '.com/?event_id=' + gc.event_id + '&ucOptOut=true');

        },

        show: function() {
            console.log('--ViewSelectorController-- in show()', this);
            this.view.render();
        }
    });

    Foobunny.mediator.bindGlobalModel({
        targetObj: ViewSelectorController,
        targetPropName: 'model',
        boundObj: FilterModel,
        boundObjName: 'FilterModel'
    });

    return ViewSelectorController;
});

