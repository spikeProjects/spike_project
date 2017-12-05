define([
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
                   'element': this.$el.find('.gh-container')
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
