;(function(exports) {

  var Base = Backbone.View.extend({
    // undelegate events from a view and remove all nodes from the DOM
    _cleanup: function() {
      this.remove();
    },
    // When subclassing cleanup(), do any custom cleanup code, then call
    // this._cleanup() LAST
    cleanup: function() { return this._cleanup(); }
  });

  exports.BaseView = Base;

})(this);