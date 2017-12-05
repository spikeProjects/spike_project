/* global SH */
define(['global_context'
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
