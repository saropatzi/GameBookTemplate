define([
    'jquery',
    'underscore',
    'backbone',
    'magnificpopup',
    'jqueryforms'
], function($, _, Backbone, MagnificPopup, JqueryForms){

    var mergeOptions = function(defaultOptions, customOptions){
        if (typeof customOptions != 'undefined' && customOptions) {
            for (var attributeName in defaultOptions) {
                if (typeof customOptions[attributeName]!='undefined' && customOptions[attributeName]){
                    if (typeof defaultOptions[attributeName] === 'object' && typeof customOptions[attributeName] === 'object'){
                        mergeOptions(defaultOptions[attributeName], customOptions[attributeName]);
                    } else if (typeof defaultOptions[attributeName] === typeof customOptions[attributeName]){
                        defaultOptions[attributeName] = customOptions[attributeName];
                    }
                }
            }
        }
        return defaultOptions;
    };


    var MediaLibrary = {
        setupJqueryForms : function(selector,successCallback){
            var successFunction = function() {
                /*REFRESH POPUP CONTENT*/
                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.updateItemHTML();
                console.log('FILE CARICATO CORRETTAMENTE');
            };
            if (typeof successCallback !=='undefined' && typeof successCallback === 'function'){
                successFunction = successCallback;
            }
            $(selector).ajaxForm({
                delegation: true,
                type: 'POST',
                success: successFunction
            });
        },
        setImage : function(selector,imgToSet){
            var imgSrc = selector.attr('src');
            imgToSet.attr('src',imgSrc);
        },
        openMediaLibrary : function(e, imageToBeSet, customOptions){
            var that = this;

            $(e.currentTarget).addClass(imageToBeSet);
            var $imageToBeSet = $('.'+imageToBeSet);
            var options = {
                type:'ajax',
                /*Senza items magnificPopup si rompe*/
                items: {},
                ajax: {
                    settings: {
                        url: "/imageViewer",
                        type: 'GET',
                        dataType: "html"
                    }
                },
                alignTop:true,
                callbacks: {
                    ajaxContentAdded: function() {
                        var imageSelector = $imageToBeSet;
                        var $mediaImage = $('.mediaImg');
                        $mediaImage.on('click', function(e){
                            /*Nessuna idea migliore che chiamare that*/
                            that.setImage($(this),imageSelector);
                        });
                    },
                    close: function(){
                        $imageToBeSet.removeClass(imageToBeSet);
                    }
                }
            };
            options = mergeOptions(options, customOptions);

            $.magnificPopup.open(options);
        }
    };

    return MediaLibrary;
});