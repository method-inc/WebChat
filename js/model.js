;(function(exports) {

  var MessageModel = Backbone.Model.extend({});

  var MessageCollection = Backbone.Collection.extend({
    model: MessageModel,
    username: 'Anonymous',

    initialize: function() {
      // initialize chat streaming here
      var self = this;
      chatter.connect('http://chatterjs.herokuapp.com', function(data) {
        self.onMessage(data);
      }, 1000);
      this.fetchFromLocalStorage();
      chatter.getRecentHistory();
    },

    getUsername: function() {
      return this.username;
    },
    setUsername: function(name) {
      this.username = name;
      localStorage.setItem('chatUsername', this.username);
    },
    hasUsername: function() {
      return this.getUsername() !== 'Anonymous';
    },

    onMessage: function(message) {
      // filter out duplicates (i.e. if getRecentHistory gives us some we already
      // had in localStorage)
      if(this.any(function(old_message) {
        return old_message.get('timestamp') === message.timestamp
            && old_message.get('user') === message.user
            && old_message.get('body') === message.body;
      })) return;
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
      this.username = localStorage.getItem('chatUsername') || 'Anonymous';
    },

    send: function(message) {
      var self = this;
      chatter.send(message, this.username, function(message) {
        self.onMessage( _.extend(JSON.parse(message), { mine: true }) );
      });
    }

  });

  exports.MessageCollection = MessageCollection;

})(this);
