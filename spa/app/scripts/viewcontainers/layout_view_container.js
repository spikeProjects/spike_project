define([
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
