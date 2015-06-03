define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    //Funzione apposita per parsare i json annidati
// ritorna un oggetto contenente modelli e collezioni
// utili a inizializzare le view e le regioni

    var BgImage = Backbone.Model.extend({
        defaults: {
            url:'',
            pageid:'',
            title:'',
            background:'',
            image:'',
            htmlText:'Era un tranquillo pomeriggio di primavera e Cappuccetto Rosso aveva deciso che lo avrebbe passato giocando con i suoi amici giù in città.',
            cssClass:''
        },

        initialize: function(){
            console.log('MainText nuovo');
        }
    });

    return BgImage;

});

