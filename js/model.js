;(function(exports) {

  var MessageModel = Backbone.Model.extend({});

  var MessageCollection = Backbone.Collection.extend({
    model: MessageModel,
    username: 'Anonymous',

    initialize: function() {
      // initialize chat streaming here
      var self = this;
      window.setInterval(function() {
        //self.onMessage({ user: 'David', message: 'Another One!' });
      }, 5000);
      this.fetchFromLocalStorage();
      if(this.length == 0) {
        _.each([
          { user: 'David', message: 'Hello' },
          { user: 'Jim', message: 'Hi there' }
        ], this.onMessage, this);
      }
    },

    onMessage: function(message) {
      this.push(message);
      this.updateLocalStorage();
    },

    // update local chat history with at most the last 100 messages
    updateLocalStorage: function() {
      window.localStorage.setItem(
        'chatHistory',
        JSON.stringify( _.last( this.toJSON(), 100 ) )
      );
    },
    // fetch chat history from localstorage
    fetchFromLocalStorage: function() {
      var messages = JSON.parse(window.localStorage.getItem('chatHistory'));
      if(messages && messages.length) this.reset(messages);
    },

    send: function(message) {
      this.onMessage({
        user: this.username,
        message: message,
        mine: true
      });
    }

  });

  exports.MessageCollection = MessageCollection;

})(this);
