;(function(exports) {

  var RootView = new (NavigationView.extend({}))({
    el: $('#app')
  });

  var ChatList = BaseView.extend({
    title: 'Chat',
    rightBarButtons: [
      { html: '<button class="barButton">Settings</button>', click: 'settings' }
    ],

    initialize: function() {
    	this.render();
    },

    render: function() {
    	this.$el.html('<h1>Chat!</h1>');
    },

    settings: function() {

    }
  });

  RootView.pushView( new ChatList() );

  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);

})(this);
