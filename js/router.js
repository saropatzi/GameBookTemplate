// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'utilities',
    'mousewheel',
    'easing',
    'hammer',
    'mapplic',
    'view/transitionView',
    'view/containerView',
    'view/homeView',
    'view/mapView',
    'view/paragraphView',
    'view/noChoiceView'
], function($, _, Backbone, Utilities, Mousewheel, Easing, Hammer, Mapplic, TransitionView, ContainerView, HomeView, MapView, ParagraphView, NoChoiceView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "paragraph/:ident":"changePage",
            "map/:ident":"showMap",
            '': 'home'
        }
    });

    var initialize = function(){

        var app_router = new AppRouter;
        var containerView = new ContainerView;

        app_router.on('route:home', function (actions) {
            var data= $.ajax({
                url:'data/home.json',
                dataType:'json',
                success: function(){
                    console.log('home');
                    console.log(data);

                    var view,
                    parsedData =  Utilities.parseNested(data);
                    view = new HomeView({model:parsedData.paragrafo});

                    containerView.goto(view);
                },
                error: function(){
                    console.log('error');
                }
            });
        });

        app_router.on('route:changePage', function (ident) {
            var data= $.ajax({
                url:'data/'+ident+'.json',
                dataType:'json',

                success: function(){
                    var view,
                    parsedData =  Utilities.parseNested(data);
                    if (typeof parsedData.paragrafo.attributes != 'undefined'){
                        var type = parsedData.paragrafo.attributes.tipo;
                    }
                    //Gestisco qui il tipo di view da mostrare a seconda del tipo di paragrafo
                    //indicato nel json
                    switch(type) {
                        case "paragrafo":
                            view = new ParagraphView({model:parsedData.paragrafo});
                            break;
                        case "noChoice":
                            view = new NoChoiceView({model:parsedData.paragrafo});
                            break;
                        case "map":
                            view = new ParagraphView({model:parsedData.paragrafo});
                            break;
                        default:
                            view = new ParagraphView({model:parsedData.paragrafo});
                    }

                    containerView.goto(view);
                },
                error: function(){
                    $('body').trigger('emptyPage',[ident]);
                }
            });

        });

        app_router.on('route:showMap', function (ident) {
            var data= $.ajax({
                url:'data/map'+ident+'.json',
                dataType:'json',
                success: function(){
                    console.log('data retrieved');
                    console.log(data);

                    var view,
                        parsedData =  Utilities.parseMap(data);

                    view = new MapView({model:parsedData});
                    containerView.goto(view);
                    $('#map').mapplic({
                        source: 'data/map1.json',
                        height: 680,
                        sidebar: false,
                        minimap: false,
                        deeplinking: true,
                        fullscreen: true,
                        hovertip: false,
                        developer: false,
                        maxscale: 2
                    });
                },
                error: function(){
                    console.log('error');
                }
            });


        });
    };
    return {
        initialize: initialize
    };
});