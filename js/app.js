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
      "click .chat-message": 'goToMessage'
    },

    initialize: function() {
      // store the last date header we rendered so we know when to show another one
      this.lastDate = null;
    	this.listenTo(this.collection, 'reset', this.render);
    	this.listenTo(this.collection, 'add', this.addMessage);
    	if(!this.collection.hasUsername()) this.settings();
    },

    // navigation view calls render
    render: function() {
      this.cleanupDom();
      this.$el.empty();

      this.$el.html(Templates['messages-list']({
        has_messages: this.collection.length > 0,
        messages: this.collection.map(this.renderMessage, this).join('')
      }));

      this.$textField = this.$('#new-message-text');
      this.$button = this.$('#new-message-button');
      this.$messages = this.$('#chat-messages');

      // scroll event doesn't bubble, so we can't delegate it
      //this.$messages.on('scroll', this.hideKeyboard);

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
      var dateString;
      if(!this.lastDate || message.get('timestamp') - this.lastDate > 300000) {
        this.lastDate = message.get('timestamp');
        dateString = formatDate(message.get('timestamp'));
      }
      return Templates.message(_.extend(message.toJSON(), {
        cid: message.cid,
        date: dateString
      }));
    },

    addMessage: function(message) {
      var $message = $(this.renderMessage(message)),
          scrollParent = this.$messages,
          isAtBottom = scrollParent.length && (scrollParent.scrollTop() + scrollParent.height() >= scrollParent[0].scrollHeight - 10);
      this.$messages.append($message);
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

    cleanupDom: function() {
      //if(this.$messages) this.$messages.off('scroll');
      delete this.$textField, this.$button, this.$messages, this.$noMessages;
    },
    cleanup: function() {
      this.cleanupDom();
      this._cleanup();
    }
  });


  var MessageDetail = BaseView.extend({

    title: 'Message Detail',
    leftBarButtons: [
      { html: '<button class="barButton backBarButton">Chat</button>', click: 'done' }
    ],

    render: function() {
      this.$el.html(Templates['message-detail'](_.extend(this.model.toJSON(), {
        cid: this.model.cid,
        date: formatDate(this.model.get('timestamp'))
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


  function formatDate(ts) {
    dateString = '';
    var date = new Date(ts);
    var now = new Date();
    if(date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
      dateString = 'Today';
    } else {
      dateString = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    dateString += ' ' + (date.getHours() > 12 ? (date.getHours()-12) : date.getHours());
    dateString += ':' + (date.getMinutes() < 10 ? ('0'+date.getMinutes()) : date.getMinutes());
    dateString += date.getHours() > 12 ? ' PM' : ' AM';
    return dateString;
  }

  // detect if css mask images are supported
  var mask_images = ('WebkitMask' in document.body.style
     || 'MozMask' in document.body.style
     || 'OMask' in document.body.style
     || 'mask' in document.body.style);
  // normally you shouldn't UA sniff but there is a bug in Android that prevents
  // them from working with CSS transforms
  if(navigator.userAgent.toLowerCase().indexOf("android") > -1) {
    mask_images = false;
  }
  if(mask_images) $(document.body).addClass('css-maskimages');

})(this);
