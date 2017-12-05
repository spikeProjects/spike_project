/* global _ */
define([
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
