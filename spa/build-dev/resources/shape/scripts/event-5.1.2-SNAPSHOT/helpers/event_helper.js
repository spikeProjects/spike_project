/* global SH,Backbone,_ */
define([
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
