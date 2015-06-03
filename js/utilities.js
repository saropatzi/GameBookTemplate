/*MOdulo Utilities per gestire operazioni trasversali*/

define([
    'jquery',
    'underscore',
    'backbone',
    'model/mainTextModel',
    'model/bgImageModel'
], function($, _, Backbone, MainText, BgImage){
    //Funzione apposita per parsare i json annidati
// ritorna un oggetto contenente modelli e collezioni
// utili a inizializzare le view e le regioni
    var utilities = {
        parseNested : function(data){    console.log('access to parseNested');
            //Utilizzo parseJSON e trim per avere un json valido
            var datanew= $.parseJSON(data.responseText.trim());
            var allData = _.clone(datanew);

            //Il json è impostato in modo tale da risultare un array con un solo elemento,
            // che  è difatto l'oggetto che costruisce il modello
            var singleData=allData[0];
            var paragrafo= new MainText(singleData);
            /*Verificare se serve rimuovere*/
            var bgImage =  new BgImage(singleData);

            var parsedData = {
                paragrafo:paragrafo,
                bgImage:bgImage
            };
            return parsedData;
        },
        parseMap: function(data){
            var datanew= $.parseJSON(data.responseText.trim());
            var allData = _.clone(datanew);
        }
    };

    return utilities;

});