define([
    'jquery',
    'underscore',
    'backbone',
    'view/transitionView',
    'text!templates/mapTemplate.html'
], function($, _, Backbone, TransitionView, mapTemplate){

    var MapView = TransitionView.extend({
        className: 'mapContainer',

        render: function () {
            var template = _.template(mapTemplate);
            this.$el.html(template());
            return TransitionView.prototype.render.apply(this, arguments);
        }
    });

    return MapView;

});