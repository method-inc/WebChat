;(function(exports) {

  var RootView = new (NavigationView.extend({}))({
    el: $('#app')
  });

  var ChatList = BaseView.extend({
    collection: new MessageCollection(),

    title: 'Chat',
    rightBarButtons: [
      { html: '<button class="barButton">Settings</button>', click: 'settings' }
    ],

    events: {
      //"click .message": 'goToMessage'
    },

    initialize: function() {
    	this.render();
    	this.listenTo(this.collection, 'reset', this.render);
    	this.listenTo(this.collection, 'add', this.addMessage);
    },

    render: function() {
      this.$el.empty();
      this.$el.html(Templates['messages-list']({
        has_messages: this.collection.length > 0,
        messages: this.collection.map(this.renderMessage, this).join('')
      }));
      var last_message = this.$('.chat-message:last-child');
      if(last_message && last_message.length > 0) {
        _.defer(function() { last_message[0].scrollIntoView(); });
      }
    },
    renderMessage: function(message) {
      return Templates.message(message.toJSON());
    },

    addMessage: function(message) {
      var $message = $(this.renderMessage(message)),
          scrollParent = this.$el.parent(),
          isAtBottom = (scrollParent.scrollTop() + scrollParent.height() >= scrollParent[0].scrollHeight - 10);
      this.$('.chat-messages').append($message);
      // scroll to message if they are already scrolled to the bottom
      if(isAtBottom) {
        $message[0].scrollIntoView();
      }
    },

    settings: function() {}
  });

  RootView.pushView( new ChatList() );

  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);

})(this);
