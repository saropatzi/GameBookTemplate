define([
    'jquery',
    'underscore',
    'backbone',
    'websql',
    'view/transitionView',
    'text!templates/noChoiceTemplate.html'
], function($, _, Backbone, WebSql, TransitionView, noChoiceTemplate){

    var HomeView = TransitionView.extend({
        saveData : {},
        eventData : {},
        charactersData : {},
        storyData : {},
        className: 'noChoice',
        template: _.template(noChoiceTemplate),
        events: {
            "click #continue": "saveAndGo"
        },
        initialize: function(){
            //Setto un elemento esterno per ascoltare
            //gli eventi che vengono sparati da WebSql
            var that = this;

            //Gestire un po' tutto ciò che è possibile ad eventi
            $('body').on('gotCurrentData',function(event,result){
                that.saveData = result[0];
                if(typeof that.saveData!='undefined' && that.saveData.saveid!='undefined'){
                    that.loadStoryData(that.saveData.saveid);
                }

            });
            /*$('body').on('gotEvents', function(event,result){
             that.eventData = result;
             });*/
            $('body').on('gotChars', function(event,result){
                that.charactersData = result;
            });
            $('body').on('gotStoryData', function(event,result){
                that.storyData = result[0];
            });


            //Ascoltare le callback delle altre query
            this.loadSaveData();
        },
        loadSaveData : function(){
            WebSql.getCurrentData(db, function(){

            });
            /*WebSql.getEvents(db);*/


            //Dopo aver confrontato i dati
            //Preparo i dati da inserire o cambiare
            // Non dimenticare che è importante salvare i dati al click su continue
            // e permettere il cambiamento di pagina solo dopo
        },
        loadStoryData : function(saveid){
            //Popola l'oggetto saveData con i dati del DB savedData
            var that = this;
            //TODO: cambiare l'hardcodata in un avariabile in base al dato salvato
            var saveid = '1';

            if (typeof that.saveData != 'undefined' && that.saveData.saveid){
                saveid = that.saveData.saveid;
            }

            //TODO: Controllare se nel json ci sono dati relativi a luoghi, eventi o personaggi e solo in quel caso fare le query
            WebSql.getChars(db, saveid);
            WebSql.getStoryData(db, saveid);
        },
        saveAndGo : function(event){
            var that = this,
                lastpage = that.saveData.lastPage,
                saveid = that.saveData.saveid;

            if ($('#continue').hasClass('active')){
                WebSql.setActualSave(db,lastpage, saveid, function(){
                    window.location.hash = lastpage;
                });
            }
        },
        render: function () {
            var result = [];
            var that = this;
            var saveData = that.model.attributes.saveData;
            var username = 'player';
            that.$el.html(that.template(that.model.toJSON()));
            return TransitionView.prototype.render.apply(this, arguments);
        }
    });

    return HomeView;

});