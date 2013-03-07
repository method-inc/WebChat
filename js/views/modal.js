;(function(exports) {

  var superInit = NavigationView.prototype.initialize;

  var ModalView = NavigationView.extend({
    attributes: {
      class: 'navigation-view modal-view animate'
    },

    /**
     * Show the modal at the given element.
     */
    show: function(options) {
      options = options || {};
      this.trigger('show');

      this.$el.show().addClass('modal-view-show');

      this.trigger('rendered');
      this.visible = true;
    },

    // Animate modal away.
    hide: function(cb) {
      var self = this;
      this.$el.removeClass('modal-view-show');

      _.delay(function() {
        self.$el.hide();
        self.trigger('hide');
        if(_.isFunction(cb)) cb.call(self);
      }, 250);
    }
  });

  exports.ModalView = ModalView;

})(this);
