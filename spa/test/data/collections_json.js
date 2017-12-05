define("filterModelData", function() {
    var filterModelData = null;

    filterModelData = {
        lastchanged : "initial",
        qty : "-1",
        minPrice : -1,
        maxPrice : -1,
        sections : [],
        zones : [],
        sectionStats : true,
        zoneStats : true,
        rowStart : 0,
        ticketRecommendation : true,
        seeMoreLink : true,
        startInterval : 20,
        filterApplied : false,
        zonesEnabled : false,
        sortField : "price",
        secondarySort : "value+desc",
        listingAttributeCategoryList : [],
        excludeListingAttributeCategoryList : [],
        deliveryTypeList : [],
        allSectionZoneStats : true,
        eventLevelStats : true,
        withFees : false,
        priceType : "listingPrice",
        priceSort : "listingPrice",
        primarySort : "listingPrice+asc",
        sortDirection : "asc"
    };

    return filterModelData;
});

define("invResponse", function() {
    var invResponse = null;

    invResponse = {
        "eventId" : 9390045,
        "totalListings" : 604,
        "totalTickets" : 3217,
        "minQuantity" : 1,
        "maxQuantity" : 26,
        "listing" : [{
            "listingId" : 1175174568,
            "currentPrice" : {
                "amount" : 80.31,
                "currency" : "USD"
            },
            "listingPrice" : {
                "amount" : 66.50,
                "currency" : "USD"
            },
            "sectionId" : 39296,
            "row" : "14",
            "quantity" : 2,
            "sellerSectionName" : "318",
            "sectionName" : "Balcony Goal 318",
            "seatNumbers" : "18,19",
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "deliveryTypeList" : [1],
            "deliveryMethodList" : [1],
            "dirtyTicketInd" : false,
            "splitOption" : "2",
            "ticketSplit" : "1",
            "splitVector" : [2],
            "sellerOwnInd" : 0,
            "score" : 0.0,
            "valuePercentage" : 98.0
        }, {
            "listingId" : 1169956007,
            "currentPrice" : {
                "amount" : 80.31,
                "currency" : "USD"
            },
            "listingPrice" : {
                "amount" : 66.50,
                "currency" : "USD"
            },
            "sectionId" : 39292,
            "row" : "15",
            "quantity" : 12,
            "sellerSectionName" : "306",
            "sectionName" : "Balcony Goal 306",
            "seatNumbers" : "3,4,5,6,7,8,9,10,11,12,13,14",
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "deliveryTypeList" : [1],
            "deliveryMethodList" : [1],
            "dirtyTicketInd" : false,
            "splitOption" : "2",
            "ticketSplit" : "1",
            "splitVector" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
            "sellerOwnInd" : 0,
            "score" : 0.0,
            "valuePercentage" : 98.0
        }, {
            "listingId" : 1175174542,
            "currentPrice" : {
                "amount" : 80.31,
                "currency" : "USD"
            },
            "listingPrice" : {
                "amount" : 66.50,
                "currency" : "USD"
            },
            "sectionId" : 39293,
            "row" : "14",
            "quantity" : 4,
            "sellerSectionName" : "312",
            "sectionName" : "Balcony Goal 312",
            "seatNumbers" : "23,24,25,26",
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "deliveryTypeList" : [1],
            "deliveryMethodList" : [1],
            "dirtyTicketInd" : false,
            "splitOption" : "2",
            "ticketSplit" : "1",
            "splitVector" : [1, 2, 4],
            "sellerOwnInd" : 0,
            "score" : 0.0,
            "valuePercentage" : 95.0
        }, {
            "listingId" : 1171919935,
            "currentPrice" : {
                "amount" : 80.50,
                "currency" : "USD"
            },
            "listingPrice" : {
                "amount" : 66.67,
                "currency" : "USD"
            },
            "sectionId" : 39291,
            "row" : "16",
            "quantity" : 2,
            "sellerSectionName" : "305",
            "sectionName" : "Balcony Goal 305",
            "seatNumbers" : "21,22",
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "deliveryTypeList" : [1],
            "deliveryMethodList" : [1],
            "dirtyTicketInd" : false,
            "splitOption" : "2",
            "ticketSplit" : "1",
            "splitVector" : [2],
            "sellerOwnInd" : 0,
            "score" : 0.0,
            "valuePercentage" : 97.0
        }, {
            "listingId" : 1171920101,
            "currentPrice" : {
                "amount" : 80.50,
                "currency" : "USD"
            },
            "listingPrice" : {
                "amount" : 66.67,
                "currency" : "USD"
            },
            "sectionId" : 39293,
            "row" : "18",
            "quantity" : 3,
            "sellerSectionName" : "312",
            "sectionName" : "Balcony Goal 312",
            "seatNumbers" : "10,11,12",
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "deliveryTypeList" : [1],
            "deliveryMethodList" : [1],
            "dirtyTicketInd" : false,
            "splitOption" : "2",
            "ticketSplit" : "1",
            "splitVector" : [1, 3],
            "sellerOwnInd" : 0,
            "score" : 0.0,
            "valuePercentage" : 92.0
        }],
        "section_stats" : [{
            "sectionId" : 39286,
            "sectionName" : "Balcony Center 320",
            "minTicketPrice" : 74.0,
            "maxTicketPrice" : 500.0,
            "averageTicketPrice" : 137.3844,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 21,
            "totalTickets" : 194,
            "totalListings" : 25
        }, {
            "sectionId" : 39247,
            "sectionName" : "Lower Goal 114",
            "minTicketPrice" : 159.0,
            "maxTicketPrice" : 424.0,
            "averageTicketPrice" : 231.87222222222226,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 12,
            "totalTickets" : 77,
            "totalListings" : 18
        }, {
            "sectionId" : 39290,
            "sectionName" : "Balcony Goal 301",
            "minTicketPrice" : 77.0,
            "maxTicketPrice" : 199.0,
            "averageTicketPrice" : 113.85666666666668,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 6,
            "totalTickets" : 26,
            "totalListings" : 6
        }, {
            "sectionId" : 39276,
            "sectionName" : "Balcony Goal 314",
            "minTicketPrice" : 111.7,
            "maxTicketPrice" : 111.7,
            "averageTicketPrice" : 111.7,
            "minTicketQuantity" : 6,
            "maxTicketQuantity" : 6,
            "totalTickets" : 12,
            "totalListings" : 2
        }, {
            "sectionId" : 39289,
            "sectionName" : "Balcony Center 323",
            "minTicketPrice" : 79.79,
            "maxTicketPrice" : 151.01,
            "averageTicketPrice" : 105.28260869565217,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 18,
            "totalTickets" : 122,
            "totalListings" : 23
        }],
        "zone_stats" : [{
            "zoneId" : 9055,
            "zoneName" : "Balcony Goal",
            "minTicketPrice" : 66.5,
            "maxTicketPrice" : 999.0,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 24,
            "totalTickets" : 471,
            "totalListings" : 90,
            "averageTicketPrice" : 138.64477777777776
        }, {
            "zoneId" : 9054,
            "zoneName" : "Balcony Center",
            "minTicketPrice" : 69.0,
            "maxTicketPrice" : 9999.0,
            "minTicketQuantity" : 2,
            "maxTicketQuantity" : 26,
            "totalTickets" : 1355,
            "totalListings" : 243,
            "averageTicketPrice" : 173.6288477366255
        }],
        "pricingSummary" : {
            "name" : "listingPrice",
            "minTicketPrice" : 66.5,
            "averageTicketPrice" : 220.96370860927146,
            "maxTicketPrice" : 9999.0,
            "totalListings" : 604,
            "percentiles" : [{
                "name" : 95.0,
                "value" : 499.0
            }]
        },
        "eventPricingSummary" : {
            "name" : "listingPrice",
            "minTicketPrice" : 66.5,
            "averageTicketPrice" : 220.96370860927146,
            "maxTicketPrice" : 9999.0,
            "totalListings" : 604,
            "percentiles" : [{
                "name" : 95.0,
                "value" : 499.0
            }]
        },
        "listingAttributeCategorySummary" : [],
        "deliveryTypeSummary" : [],
        "start" : 0,
        "rows" : 20
    };

    return invResponse;
});
