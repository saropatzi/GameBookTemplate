// Database è globale che deve essere possibile accederci da ovunque
var db;

define([
    'jquery',
    'mousewheel',
    'easing',
    'hammer',
    'mapplic',
    'underscore',
    'backbone',
    'websql',
    'router' // Request router.js
], function($, Mousewheel, Easing, Hammer, Mapplic, _, Backbone, WebSql, Router){
    var initialize = function(){
        // Pass in our Router module and call it's initialize function
        Router.initialize();
        Backbone.history.start();
        db = WebSql.createDB();
    };

    return {
        initialize: initialize
    };
});