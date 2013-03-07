;(function(exports) {

  var RootView = new (NavigationView.extend({}))();
  $(document.body).append(RootView.el);

  var ChatList = BaseView.extend({
    collection: new MessageCollection(),

    title: 'Chatter',
    rightBarButtons: [
      { html: '<button class="barButton">Settings</button>', click: 'settings' }
    ],

    events: {
      "keyup #new-message-text": 'toggleSendButton',
      "submit #new-message-form": 'send',
      "click .chat-message": 'goToMessage',
      "scroll #chat-messages": 'hideKeyboard'
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

      if(this.collection.length === 0) {
        this.$noMessages = this.$('#chat-messages-empty');
      }
    },
    renderMessage: function(message) {
      return Templates.message(_.extend(message.toJSON(), {
        cid: message.cid,
        date: new Date(message.get('timestamp'))
      }));
    },

    addMessage: function(message) {
      var $message = $(this.renderMessage(message)),
          scrollParent = this.$('#chat-messages'),
          isAtBottom = scrollParent.length && (scrollParent.scrollTop() + scrollParent.height() >= scrollParent[0].scrollHeight - 10);
      this.$('#chat-messages').append($message);
      if(this.$noMessages) {
        this.$noMessages.remove();
        delete this.$noMessages;
      }
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

    goToMessage: function(e) {
      var $e = $(e.currentTarget);
      var model = this.collection.get($e.attr('data-message-id'));
      if(!model) return false;
      this.navigation.pushView( new MessageDetail({ model: model }) );
      return false;
    },

    hideKeyboard: function() {
      if(document.activeElement) document.activeElement.blur();
    },

    cleanup: function() {
      delete this.$textField, this.$button;
      this._cleanup();
    }
  });


  var MessageDetail = BaseView.extend({

    title: 'Message Detail',
    leftBarButtons: [
      { html: '<button class="barButton backBarButton">Chat</button>', click: 'done' }
    ],

    render: function() {
      this.$el.html(Templates.message(_.extend(this.model.toJSON(), {
        cid: this.model.cid,
        date: new Date(this.model.get('timestamp'))
      })));
    },

    done: function() {
      this.navigation.popView();
    }

  });


  var ChatSettings = BaseView.extend({
    title: 'Chat Settings',
    rightBarButtons: [
      { html: '<button class="barButton saveBarButton" disabled>Save</button>', click: 'done' }
    ],

    events: {
      "keyup #settings-username": 'updateSaveButton',
      "submit #settings-form": 'done'
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
      return false;
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
