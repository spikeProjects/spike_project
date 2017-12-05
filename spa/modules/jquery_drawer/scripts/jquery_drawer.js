define(
    'jquery-drawer-component',
    [],
    function() {
        $.fn.drawer = function(args) {

            $(this).addClass('drawer-container');
            var component = this;
            component.upButton = $(this).find('.drawer-nav-up');
            component.downButton = $(this).find('.drawer-nav-down');
            component.drawer = $(this).find('.drawer-object');
            component.states = {
                'open': 1,
                'split': 0,
                'close': 0
            };

            component.open_callback = function() {};
            component.close_callback = function() {};
            component.split_callback = function() {};

            $.extend(component, args);

            component.set = function(state) {
                for (var key in component.states) {

                    if (key === state) {
                        component.states[key] = 1;
                        component.state = key;
                        $(component.drawer).addClass(key);
                    } else {
                        component.states[key] = 0;
                        $(component.drawer).removeClass(key);
                    }
                }
            };

            component.open = function() {
                console.log('open drawer');
                component.set('open');
                component.state = 'open';
                component.open_callback();
            };

            component.close = function() {
                console.log('close drawer');
                component.set('close');
                component.state = 'close';
                component.close_callback();
            };

            component.split = function() {
                console.log('split drawer');
                component.set('split');
                component.state = 'split';
                component.split_callback();
            };

            component.state = 'open';
            component.actionMap = {
                open: {
                    up: component.split,
                    down: function () {
                        return false;
                    }
                },

                close: {
                    up: function () {
                        return false;
                    },
                    down: component.split
                },

                split: {
                    up: component.close,
                    down: component.open
                }
            };


            $(component.downButton).click(function() {
                component.actionMap[component.state].down();
            });

            $(component.upButton).click(function() {
                component.actionMap[component.state].up();
            });


            return this;
        };
    });
