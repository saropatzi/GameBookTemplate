requirejs.config({
    enforceDefine: false,
    paths: {
        "jquery": "../libs/jquery-2.1.1",
        "underscore": "../libs/underscore",
        "backbone": "../libs/backbone",
        "text":"../libs/text",
        "mousewheel":"../libs/jquery.mousewheel",
        "easing":"../libs/jquery.easing",
        "hammer":"../libs/hammer",
        "mapplic":"../libs/mapplic",
        "magnificpopup": "../libs/jquery.magnific-popup",
        "jqueryforms": "../libs/jquery.form",
        templates: '../templates'
    },
    shim: {
        "underscore": {
            deps: [],
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "mousewheel": ["jquery"],
        "easing":["jquery"],
        "mapplic": ["jquery","mousewheel","easing","hammer"],
        "magnificpopup" : ["jquery"],
        "jqueryforms" : ["jquery"]
    }
});

define([
    // Load our app module and pass it to our definition function
    'app'

], function(App){
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});