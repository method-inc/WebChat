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
      "keyup #new-message-text": 'toggleSendButton',
      "submit #new-message-form": 'send'
    },

    initialize: function() {
    	this.listenTo(this.collection, 'reset', this.render);
    	this.listenTo(this.collection, 'add', this.addMessage);
    	if(!this.collection.hasUsername()) this.settings();
    },

    // navigation view calls render
    render: function() {
      delete this.$textField, this.$button;
      this.$el.empty();

      this.$el.html(Templates['messages-list']({
        has_messages: this.collection.length > 0,
        messages: this.collection.map(this.renderMessage, this).join('')
      }));

      this.$textField = this.$('#new-message-text');
      this.$button = this.$('#new-message-button');

      // scroll to last message if there is one
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
          scrollParent = this.$('#chat-messages'),
          isAtBottom = (scrollParent.scrollTop() + scrollParent.height() >= scrollParent[0].scrollHeight - 10);
      this.$('#chat-messages').append($message);
      // scroll to message if they are already scrolled to the bottom
      if(isAtBottom) {
        $message[0].scrollIntoView();
      }
    },

    toggleSendButton: function() {
      if(this.$textField.val() !== '') this.$button.removeAttr('disabled');
      else this.$button.attr('disabled', 'disabled');
    },

    send: function() {
      if(this.$textField.val() === '') return false;
      this.collection.send(this.$textField.val());
      this.$textField.val('');
      this.toggleSendButton();
      return false;
    },

    settings: function() {
      var modal = new ModalView();
      modal.pushView(new ChatSettings({ collection: this.collection }));
      $(document.body).append(modal.el);
      modal.show();
      return false;
    },

    cleanup: function() {
      delete this.$textField, this.$button;
      this._cleanup();
    }
  });


  var ChatSettings = BaseView.extend({
    title: 'Chat Settings',
    rightBarButtons: [
      { html: '<button class="barButton saveBarButton" disabled>Save</button>', click: 'done' }
    ],

    events: {
      "keyup #settings-username": 'updateSaveButton'
    },

    initialize: function() {},

    render: function() {
      this.$el.html(Templates.settings());
      this.$textField = this.$('#settings-username');
      this.$saveButton = this.navigation.$rightBarButtons.find('.saveBarButton');
      this.$textField.val(!this.collection.hasUsername() ? '' : this.collection.getUsername());
      this.updateSaveButton();
    },

    updateSaveButton: function() {
      if(this.$textField.val() !== '') this.$saveButton.removeAttr('disabled');
      else this.$saveButton.attr('disabled', 'disabled');
    },

    done: function() {
      this.collection.setUsername(this.$('#settings-username').val());
      this.navigation.hide(function() {
        this.cleanup();
      });
    },

    cleanup: function() {
      delete this.$textField, this.$saveButton;
      this._cleanup();
    }
  });


  RootView.pushView( new ChatList() );

  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);

})(this);
