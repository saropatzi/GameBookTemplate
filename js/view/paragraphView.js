define([
    'jquery',
    'underscore',
    'backbone',
    'websql',
    'view/transitionView',
    'text!templates/paragraphTemplate.html'
], function($, _, Backbone, WebSql, TransitionView, paragraphTemplate){

    var ParagraphView = TransitionView.extend({
        saveData : {},
        eventData : {},
        charactersData : {},
        storyData : {},
        initialize:function(){
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
            var that = this;
            var saveid = '1';

            if (typeof that.saveData != 'undefined' && that.saveData.saveid){
                saveid = that.saveData.saveid;
            }

            //TODO: Controllare se nel json ci sono dati relativi a luoghi, eventi o personaggi e solo in quel caso fare le query
            WebSql.getChars(db, saveid);
            WebSql.getStoryData(db, saveid);
        },
        className: 'paragraphView',
        template: _.template(paragraphTemplate),
        events : {
            "click .choice" : "choiceFeedback",
            "click #continue" : "saveAndGo"
        },
        choiceFeedback : function(e) {
            var $choice = $(e.currentTarget),
                that = this,
                choiceClass = '.'+$choice.data('choice-id'),
                $choiceClass = $(choiceClass),
                $continue = $('#continue'),
                choiceActivate = $continue.data('activate'),
                $feedback = $('.feedback'),
                $choiceTitle = $('.choice_title_container'),
                choiceUrl = $choice.data('href'),
                $allIcons = $('.choice_ico'),
                $ico = $choice.find('.choice_ico');

            //Attivazione feedback sulla scelta
            $allIcons.removeClass('active');
            $choiceTitle.removeClass('active');
            $ico.addClass('active');
            $feedback.removeClass('active');
            $choiceClass.addClass('active');
            $continue.addClass('active');
            $continue.attr('data-next',choiceUrl);
            $continue.attr('data-activate',choiceActivate);
            that.saveData.next = $(e.currentTarget).data('href');
            //
        },
        saveAndGo: function(e){
            var nextPage = $(e.currentTarget).data('next');
            var choiceDom =  $(e.currentTarget);
            var choiceActivate = choiceDom.data('activate');
            var storyData = {};
            var that = this;
            that.saveData.thisPage = window.location.hash;

            $.each(choiceDom.data(), function(key, value){
                 if (value!='' && value){
                     storyData[key] = value;
                 }
            });

            //Salvataggio dei dati relativi alla storia
            //TODO: settare correttamente i data attribute e modificare SetStoryData di conseguenza
            //Al momento la query non funzia
            WebSql.setActualSave(db,that.saveData.thisPage,that.saveData.saveid, function(){
                WebSql.setStoryData(db,that.saveData.saveid,that.storyData, function(){
                    window.location.hash = that.saveData.next;
                });
            });
        },
        render: function () {
            //Gestire gli eventi e le callback, possibilmente con trigger e listen
            var that = this;



            if (typeof this.model.attributes.choices != undefined && this.model.attributes.choices){
                var choices = this.model.attributes.choices;

                /*Controllo se le scelte sono attive di default
                o necessitano di un evento nel qual caso controllo
                se l'evento è stato attivato*/

                for (i=0;i<choices.length;i++){
                     if (choices[i].required_event!="" && choices[i].required_event){
                      // Query sulla tabella degli eventi con parametro del valore
                      // Se il risultato è zero la scelta non è attiva
                      var activeChoice = WebSql.checkEvent(db, choices[i].required_event);
                        if (activeChoice) {
                            this.model.attributes.choices[i].active = 1;
                        } else {
                            this.model.attributes.choices[i].active = 0;
                        }
                     }
                }
            }
            this.$el.html(this.template(this.model.toJSON()));
            return TransitionView.prototype.render.apply(this, arguments);
        }
    });

    return ParagraphView;

});