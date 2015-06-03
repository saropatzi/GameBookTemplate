define([
    'jquery',
    'underscore',
    'backbone',
    'view/transitionView'
], function($, _, Backbone, TransitionView){

    var ContainerView = TransitionView.extend({
        el: '#container',

        goto: function (view) {

            var previous = this.currentPage || null;
            var next = view;

            if (previous) {
                previous.transitionOut(function () {
                    previous.remove();
                });
            }

            next.render({ page: true });
            this.$el.append( next.$el );
            next.transitionIn();
            this.currentPage = next;

        }
    });

    return ContainerView;

});