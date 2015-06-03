define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    //Funzione apposita per parsare i json annidati
// ritorna un oggetto contenente modelli e collezioni
// utili a inizializzare le view e le regioni

    var ParagraphModel = Backbone.Model.extend({
        defaults: {
            "id":"",
            "tipo": "paragrafo",
            "title":"Default title",
            "text":"Default text",
            "choices":[{
                activate_event: "",
                active_choice: "1",
                choice_id: "choice01",
                feedback_image: false,
                feedback_text1: "",
                feedback_text2: "",
                icon: "",
                page_id: "temporary",
                required_event: "",
                text: "Testo di default",
                title: "Titolo di default"
            }]
        },

        initialize: function(){
            console.log('MainText nuovo');
        }
    });

    return ParagraphModel;

});