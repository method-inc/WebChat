/**
 * Chatter library
 */

(function(root) {

  var last_received_message = {
        timestamp: Date.now(),
        body: '',
        user: ''
      };

  var last_sent_message = {
        timestamp: 0,
        body: '',
        user: ''
      };

  function Client(host) {}

  Client.prototype.connect = function(host, fn, interval) {
    this.host = host;
    this.message_handler = fn;
    this.interval = interval || 500;
    this.listenForMessages();
  };

  Client.prototype.getRecentHistory = function() {
    // get initial transcript
    var self = this;
    $.get(self.host, function(data) {
      if (data) self.broadcast(data);
    });
  };

  Client.prototype.send = function(message, user, callback) {
    last_sent_message.body = message;
    last_sent_message.user = user || "";
    $.post(this.host+'/message', {message:message, user:user}, function(data) {
      if (callback) callback(data);
    });
  };

  Client.prototype.broadcast = function(messages) {

    var lastOne = messages[messages.length - 1];
    if (lastOne && lastOne.timestamp) last_received_message = lastOne;

    for(var i = 0, m; i < messages.length; i++) {
      m = messages[i];
      // make sure new message isn't reflection of own message
      if (m.body != last_sent_message.body && m.user != last_sent_message.user) {
        this.message_handler(m);
      }
    }

  };

  Client.prototype.listenForMessages = function() {
    var self = this;

    setTimeout(function() {
      $.get(self.host + "/since/" + last_received_message.timestamp, function(data) {
        if (data) self.broadcast(data);
        self.listenForMessages.call(self);
      });
    }, self.interval);
  };

  root.chatter = new Client();

})(window);