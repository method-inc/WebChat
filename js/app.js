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
      if(this.collection.length === 0) {
        return this.$el.html('<h2 class="no-messages">No Messages</h2>');
      }
      var ul = $('<ul class="chat-messages"></ul>');
      this.collection.each(function(message) {
        ul.append('<li class="chat-message"><p class="chat-message-text">' + message.get('message') + '</p><h3 class="chat-message-name">' + message.get('user') + '</h3></li>');
      }, this);

      this.$el.append(ul);
    },

    addMessage: function(message) {
      this.$('.chat-messages').append('<li class="chat-message"><p class="chat-message-text">' + message.get('message') + '</p><h3 class="chat-message-name">' + message.get('user') + '</h3></li>')
    },

    settings: function() {}
  });

  RootView.pushView( new ChatList() );

  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);

})(this);
