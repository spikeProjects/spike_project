define(['models/listing_model', 'global_context', 'globals'], function(EventModel, gc, globals) {
    describe('Listing Model', function() {
        'use strict';

        var eventModel = null,
            inventoryResponse;

        beforeEach(function() {
            inventoryResponse = {
                "eventId" : 9390088,
                "totalListings" : 550,
                "totalTickets" : 2794,
                "minQuantity" : 1,
                "maxQuantity" : 25,
                "listing" : [{
                    "listingId" : 1171920283,
                    "currentPrice" : {
                        "amount" : 41.50,
                        "currency" : "USD"
                    },
                    "listingPrice" : {
                        "amount" : 33.33,
                        "currency" : "USD"
                    },
                    "sectionId" : 39293,
                    "row" : "18",
                    "quantity" : 2,
                    "sellerSectionName" : "312",
                    "sectionName" : "Balcony Goal 312",
                    "seatNumbers" : "11,12",
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
                    "valuePercentage" : 100.0
                }, {
                    "listingId" : 1170672361,
                    "currentPrice" : {
                        "amount" : 44.11,
                        "currency" : "USD"
                    },
                    "listingPrice" : {
                        "amount" : 35.56,
                        "currency" : "USD"
                    },
                    "sectionId" : 39297,
                    "row" : "13",
                    "quantity" : 2,
                    "sellerSectionName" : "324",
                    "sectionName" : "Balcony Goal 324",
                    "seatNumbers" : "11,12",
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
                    "valuePercentage" : 100.0
                }, {
                    "listingId" : 1170672364,
                    "currentPrice" : {
                        "amount" : 44.11,
                        "currency" : "USD"
                    },
                    "listingPrice" : {
                        "amount" : 35.56,
                        "currency" : "USD"
                    },
                    "sectionId" : 39297,
                    "row" : "13",
                    "quantity" : 2,
                    "sellerSectionName" : "324",
                    "sectionName" : "Balcony Goal 324",
                    "seatNumbers" : "19,20",
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
                    "valuePercentage" : 100.0
                }, {
                    "listingId" : 1175174574,
                    "currentPrice" : {
                        "amount" : 44.74,
                        "currency" : "USD"
                    },
                    "listingPrice" : {
                        "amount" : 36.10,
                        "currency" : "USD"
                    },
                    "sectionId" : 39296,
                    "row" : "14",
                    "quantity" : 4,
                    "sellerSectionName" : "318",
                    "sectionName" : "Balcony Goal 318",
                    "seatNumbers" : "16,17,18,19",
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
                    "valuePercentage" : 100.0
                }, {
                    "listingId" : 1169956021,
                    "currentPrice" : {
                        "amount" : 44.74,
                        "currency" : "USD"
                    },
                    "listingPrice" : {
                        "amount" : 36.10,
                        "currency" : "USD"
                    },
                    "sectionId" : 39292,
                    "row" : "15",
                    "quantity" : 5,
                    "sellerSectionName" : "306",
                    "sectionName" : "Balcony Goal 306",
                    "seatNumbers" : "8,9,10,11,12",
                    "zoneId" : 9055,
                    "zoneName" : "Balcony Goal",
                    "deliveryTypeList" : [1],
                    "deliveryMethodList" : [1],
                    "dirtyTicketInd" : false,
                    "splitOption" : "2",
                    "ticketSplit" : "1",
                    "splitVector" : [1, 2, 3, 5],
                    "sellerOwnInd" : 0,
                    "score" : 0.0,
                    "valuePercentage" : 100.0
                }],
                "section_stats" : [{
                    "sectionId" : 39286,
                    "sectionName" : "Balcony Center 320",
                    "minTicketPrice" : 49.15,
                    "maxTicketPrice" : 500.0,
                    "averageTicketPrice" : 124.98666666666668,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 21,
                    "totalTickets" : 128,
                    "totalListings" : 21
                }, {
                    "sectionId" : 39247,
                    "sectionName" : "Lower Goal 114",
                    "minTicketPrice" : 119.0,
                    "maxTicketPrice" : 634.0,
                    "averageTicketPrice" : 215.4375,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 10,
                    "totalTickets" : 58,
                    "totalListings" : 16
                }, {
                    "sectionId" : 39290,
                    "sectionName" : "Balcony Goal 301",
                    "minTicketPrice" : 49.0,
                    "maxTicketPrice" : 199.0,
                    "averageTicketPrice" : 89.04,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 6,
                    "totalTickets" : 26,
                    "totalListings" : 6
                }, {
                    "sectionId" : 39276,
                    "sectionName" : "Balcony Goal 314",
                    "minTicketPrice" : 127.66,
                    "maxTicketPrice" : 127.66,
                    "averageTicketPrice" : 127.66,
                    "minTicketQuantity" : 3,
                    "maxTicketQuantity" : 3,
                    "totalTickets" : 3,
                    "totalListings" : 1
                }, {
                    "sectionId" : 39289,
                    "sectionName" : "Balcony Center 323",
                    "minTicketPrice" : 50.0,
                    "maxTicketPrice" : 147.01,
                    "averageTicketPrice" : 87.4015,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 18,
                    "totalTickets" : 114,
                    "totalListings" : 20
                }],
                "zone_stats" : [{
                    "zoneId" : 9055,
                    "zoneName" : "Balcony Goal",
                    "minTicketPrice" : 33.33,
                    "maxTicketPrice" : 999.0,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 20,
                    "totalTickets" : 414,
                    "totalListings" : 80,
                    "averageTicketPrice" : 95.23825
                }, {
                    "zoneId" : 9054,
                    "zoneName" : "Balcony Center",
                    "minTicketPrice" : 38.0,
                    "maxTicketPrice" : 1650.0,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 25,
                    "totalTickets" : 1217,
                    "totalListings" : 226,
                    "averageTicketPrice" : 111.83867256637167
                }, {
                    "zoneId" : 43452,
                    "zoneName" : "Lower Goal",
                    "minTicketPrice" : 108.0,
                    "maxTicketPrice" : 800.0,
                    "minTicketQuantity" : 1,
                    "maxTicketQuantity" : 19,
                    "totalTickets" : 556,
                    "totalListings" : 106,
                    "averageTicketPrice" : 175.83716981132073
                }, {
                    "zoneId" : 43451,
                    "zoneName" : "Lower Center",
                    "minTicketPrice" : 129.0,
                    "maxTicketPrice" : 2750.0,
                    "minTicketQuantity" : 2,
                    "maxTicketQuantity" : 18,
                    "totalTickets" : 607,
                    "totalListings" : 138,
                    "averageTicketPrice" : 309.3963043478262
                }],
                "pricingSummary" : {
                    "name" : "listingPrice",
                    "minTicketPrice" : 33.33,
                    "averageTicketPrice" : 171.3273272727273,
                    "maxTicketPrice" : 2750.0,
                    "totalListings" : 550,
                    "percentiles" : [{
                        "name" : 95.0,
                        "value" : 423.8515
                    }]
                },
                "eventPricingSummary" : {
                    "name" : "listingPrice",
                    "minTicketPrice" : 33.33,
                    "averageTicketPrice" : 171.3273272727273,
                    "maxTicketPrice" : 2750.0,
                    "totalListings" : 550,
                    "percentiles" : [{
                        "name" : 95.0,
                        "value" : 423.8515
                    }]
                },
                "listingAttributeCategorySummary" : [],
                "deliveryTypeSummary" : [],
                "start" : 0,
                "rows" : 20
            };
            eventModel = new EventModel;
        });

        it('should define EventModel', function() {
            expect(eventModel).not.toBe(null);
        });
    });
});