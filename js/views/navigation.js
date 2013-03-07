;(function(exports) {

  /**
   * Navigation views hold a stack of Backbone views. One view is presented at
   * a time, and the navigation view handles animating between the views and
   * displaying a title and bar buttons for the currently visible view. This is
   * designed to be subclassed (i.e. as a Popover view); it will not work as-is.
   * Views pushed onto a Navigation view can have the following properties:
   *
   *  - (NavigationView) navigation automatically set whenever a view is pushed
   *                     onto a navigation view
   *  - (String) title the title of the view do be displayed in the Navigation
   *             view.
   *  - (Function) onVisible called whenever the view is about to be animated
   *               into view.
   *  - (Array) rightBarButtons, leftBarButtons array of buttons to be placed
   *            on the right and left side of the title. All views but the root
   *            should usually contain a back button (button.backBarButton) that
   *            calls this.navigation.popView(). Each element should be an
   *            object with the following properties:
   *              - (String) html the html of the button element
   *              - (String) click name of the method on the view to be called
   *                         when the button is clicked.
   */
  var NavigationView = BaseView.extend({
    attributes: {
      "class": 'navigation-view'
    },
    $content: null,
    $title: null,
    $header: null,
    $rightBarButtons: null,
    $leftBarButtons: null,

    // All views in the navigation stack
    views: null,
    // currently visible view
    currentView: null,

    events: {},
    _buttonListeners: [],

    initialize: function(options) {
      this.views = [];
      this.$el.html( Templates.navigation() );
      this.$content = this.$el.find('.navigation-content');
      this.$header = this.$el.find('.navigation-title');
      this.$title = this.$el.find('.navigation-title h1');
      this.$rightBarButtons = this.$el.find('.navigation-title .barButtons.right');
      this.$leftBarButtons = this.$el.find('.navigation-title .barButtons.left');
    },

    /**
     * Push a new view onto the navigation stack, animating away the old one
     * (if applicable).
     *
     * @param {Backbone.View} view the new view to show
     */
    pushView: function(view) {
      this.views.push(view);
      this.renderCurrent();
    },

    /**
     * Pop the topmost view off the stack, animating it away and animating the
     * new one in.
     */
    popView: function() {
      var old = this.views.pop();
      this.renderCurrent(true, function() {
        if(_.isFunction(old.cleanup)) old.cleanup();
        delete old;
      });
    },

    /**
     * Renders the topmost view, animating in/out if necessary.
     *
     * @param {Boolean} back true if the view is going backwards (i.e from popView)
     * @param {Function} cb the callback to call when all animations are done
     *                   and the view is visible.
     */
    renderCurrent: function(back, cb) {
      var $animatable = $();
      if(this.views.length === 0) return this.$el.empty();
      if(this.currentView) {
        this.currentView.off('all', this._onViewEvent, this);
      }
      this._clearButtonListeners();
      var view = this.currentView = this.views[this.views.length-1];

      var oldTitle = this.$header.clone().addClass('old-header').appendTo(this.el);

      // add title and bar buttons
      this.$title.html(view.title || "");
      this.$rightBarButtons.empty();
      this.$leftBarButtons.empty();

      this._addButtons((view.rightBarButtons || []), this.$rightBarButtons, view);
      this._addButtons((view.leftBarButtons || []), this.$leftBarButtons, view);

      view.navigation = this;
      view.render();
      this.currentView.on('all', this._onViewEvent, this);

      // don't do animation if there was no previous view
      var doAnimation = (this.$content.html() !== '') ? true : false;
      var oldView = this.$content;

      if(doAnimation) {
        this.$content.addClass('old-content');
      }
      // put the new view.$el into this.$content
      this.$content = this.$content.clone().html(view.el).removeClass('old-content');
      this.$el.append(this.$content);

      if(doAnimation) {
        this.$content.addClass('new-content');
        $animatable.push(oldView[0], this.$content[0]);
      }
      else {
        oldView.remove();
      }

      if(doAnimation) {
        this.$header.addClass('new-header');
        $animatable.push(oldTitle[0], this.$header[0]);
      }
      else {
        oldTitle.remove();
      }

      // setup navigation property on view and call onVisible
      if(_.isFunction(view.onVisible)) {
        view.onVisible();
      }

      if(doAnimation) {
        // perform the animation
        _.delay(_.bind(function() {
          oldView.remove();
          this.$content.removeClass('new-content animate go back');
          oldTitle.remove();
          this.$header.removeClass('new-header animate go back');
          if(_.isFunction(cb)) cb();
          delete oldTitle, oldView;
        }, this), 500);

        if(back) {
          $animatable.addClass('back');
        }

        _.delay(_.bind(function() {
          $animatable.addClass('go');
        }, this), 50);

        _.defer(_.bind(function() {
          $animatable.addClass('animate');
        }, this));
      }
      else if(_.isFunction(cb)) cb();
      this.trigger('rendered');
    },

    _addClick: function(b, method, ctx) {
      this._buttonListeners.push(b);
      b.on('click', function() { return method.apply(ctx, arguments) });
    },
    _addButtons: function(buttons, to, view) {
      var button, b;
      for ( var i=0; i < buttons.length; i++ ) {
      	button = buttons[i];
      	b = $(button.html);
        to.append(b);
        if(button.click) this._addClick(b, view[button.click], view);
      }
    },

    _onViewEvent: function() {
      this.trigger.apply(this, arguments);
    },

    _clearButtonListeners: function() {
      for(var i=0; i<this._buttonListeners.length; i++) {
        this._buttonListeners[i].off('click');
      }
      this._buttonListeners = [];
    },

    cleanup: function() {
      delete this.$content, this.$title, this.$header, this.$rightBarButtons, this.$leftBarButtons;
      this._clearButtonListeners();
      if(this.currentView) {
        this.currentView.off('all', this._onViewEvent, this);
        delete this.currentView;
      }
      _.each(this.views, function(view, i) {
        if(view.navigation) delete view.navigation;
        view.cleanup();
        delete this.views[i];
      }, this);
      this._cleanup();
    }

  });

  exports.NavigationView = NavigationView;

})(this);
