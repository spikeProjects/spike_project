define([
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
