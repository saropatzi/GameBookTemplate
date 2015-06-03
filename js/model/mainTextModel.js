define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    //Funzione apposita per parsare i json annidati
// ritorna un oggetto contenente modelli e collezioni
// utili a inizializzare le view e le regioni

    var MainText = Backbone.Model.extend({
        defaults: {

        },

        initialize: function(){
            console.log('MainText nuovo');
        }
    });

    return MainText;

});

