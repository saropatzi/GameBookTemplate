define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var WebSql = {
        createDB : function(options) {
            var data = {
                dbname:'gb_db',
                dbversion : '1.0',
                dbdescription : 'gamebook',
                dbdimension : 5 * 1024 * 1024
            };
            if (typeof options != 'undefined'){
                data.dbname = options.dbname!=null? options.dbname:data.dbname;
                data.dbversion = options.dbversion!=null? options.dbversion:data.dbversion;
                data.dbdescription = options.dbdescription!=null? options.dbdescription:data.dbdescription;
                data.dbdimension = options.dbdimension!=null? options.dbdimension:data.dbdimension;
            }

            db = openDatabase(data.dbname, data.dbversion, data.dbdescription, data.dimension);
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, username, email, save1, save2, save3, autosave, currentdata)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS SavedData (id INTEGER PRIMARY KEY, username, userid, lastUpdate, actualData, lastPage)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS StoryEvents (id INTEGER PRIMARY KEY, saveid, eventname, value)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS Character (id INTEGER PRIMARY KEY, saveId, CharName, CharDesc, CharImage, CharType, Status)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS Places (id INTEGER PRIMARY KEY, saveId, PlaceName, RelatedMap, Visited )');
                tx.executeSql('CREATE TABLE IF NOT EXISTS Story (id INTEGER PRIMARY KEY, saveId, CharList, VisitedPlaces, VisitedParagraphs, lastPage, previousPage, lastChapter)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS ChoicesStat (id INTEGER PRIMARY KEY, saveId, ChoiceName, ChoiceType, ChoiceValue, ChoiceVisited)');
         /*       tx.executeSql('DROP TABLE User');
                 tx.executeSql('DROP TABLE Character');
               tx.executeSql('DROP TABLE StoryEvents');
                 tx.executeSql('DROP TABLE SavedData');
                 tx.executeSql('DROP TABLE Story');
                tx.executeSql('DROP TABLE Places');
                 tx.executeSql('DROP TABLE ChoicesStat');*/
            });
            return db;
        },
        //Crea un utente se non esiste già
        //E chiama createUserData per popolare il db con i dati di default
        createUser : function(db, user, callback){
            var that = this;

            db.transaction(function(tx){
                tx.executeSql('INSERT INTO User (username, email) VALUES (?,?)',[user.username,user.email], function(tx,rs) {
                       var insertedUser = {
                           username : user.username,
                           id: rs.insertId
                       };
                       that.createUserData(db,insertedUser, callback);
                    },
                    function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    }
                );
           });
        },

        //Crea i dati dell'utente, andando a riempire tutte le tabelle con dei dati iniziali
        createUserData: function(db, user, callback){

            db.transaction(function(tx){
                tx.executeSql('INSERT INTO SavedData (userid,username,actualData,lastPage) VALUES (?,?,?,?)',[user.id,user.username,'true','#/paragraph/1'], function(tx,rs) {
                        console.log('Saved data Inserted');
                        //ID del salvataggio
                        var saveid = rs.insertId,
                            charType = 'mainchar';
                        //Aggiorno la tabella utente con i dati del primo salvataggio e setto currentData
                        // TODO: Gestire salvataggi oltre al primo

                        tx.executeSql('UPDATE User SET save1 = ?, currentData = ? WHERE id  =?',[saveid, saveid, user.id], function(tx,rs) {
                                console.log('Updated save1');
                                tx.executeSql('INSERT INTO Character (saveId,CharType) VALUES (?,?)',[saveid,charType], function(tx,rs) {
                                        console.log('Character data Inserted');
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Character error: ' + error.message);
                                    }
                                );
                                //Todo:sostituire la pagina di partenza default con una variabile. Meglio ancora creare un oggetto di impostazione globale.
                                tx.executeSql('INSERT INTO SavedData (userid,username,lastPage) VALUES (?,?,?)',[user.id,user.username,'#/paragraph/1'], function(tx,rs) {
                                        console.log('Save data 2 Inserted');
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Character error: ' + error.message);
                                    }
                                );
                                tx.executeSql('INSERT INTO SavedData (userid,username,lastPage) VALUES (?,?,?)',[user.id,user.username,'#/paragraph/1'], function(tx,rs) {
                                        console.log('Save data 3 Inserted');
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Character error: ' + error.message);
                                    }
                                );

                                tx.executeSql('INSERT INTO Story (saveId) VALUES (?)',[saveid], function(tx,rs) {
                                        console.log('Story data Inserted')
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Story error: ' + error.message);
                                    }
                                );
                                tx.executeSql('INSERT INTO ChoicesStat (saveId) VALUES (?)',[saveid], function(tx,rs) {
                                        console.log('Choices data Inserted')
                                        //CALLBACK
                                        if (callback){callback()}
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Choices error: ' + error.message);
                                    }
                                );
                                tx.executeSql('INSERT INTO Places (saveId) VALUES (?)',[saveid], function(tx,rs) {
                                        console.log('Places data Inserted')
                                        //TODO: inserire i dati di default della mappa prendendoli dal primo json
                                        if (callback){callback()}
                                    },
                                    function(tx, error) {
                                        console.log('INSERT Choices error: ' + error.message);
                                    }
                                );
                            },
                            function(tx, error) {
                                console.log('UPDATE error: ' + error.message);
                            }
                        );

                    },
                    function(tx, error) {
                        console.log('INSERT error: ' + error.message);
                    }
                );
            });
        },

        checkUser: function (db,callback){
            var username = 'player',
                result = [];
            db.transaction(function(tx) {
                tx.executeSql(('SELECT * FROM User'), function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                         var row = rs.rows.item(i);
                         result[i] = {
                             id: row['id'],
                             username: row['username'],
                             email: row['email'],
                             save1: row['save1'],
                             save2: row['save2'],
                             save3: row['save3'],
                             autosave: row['autosave'],
                             currentdata: row['currentdata']
                        }
                    }
                    if (callback){callback(result)}
                    $('body').trigger('userChecked',[result]);
                });
            });

        },
        getAllSavedData: function (db, callback){
            var username = 'player',
                result = [];
            db.transaction(function(tx) {
                tx.executeSql(('SELECT * FROM SavedData WHERE username=?'),[username], function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);
                        result[i] = {
                            saveid: row['id'],
                            username: row['username'],
                            userid: row['userid'],
                            lastUpdate : row['lastUpdate'],
                            actualData : row['actualData'],
                            lastPage: row['lastPage']
                        }
                    }
                    if (callback){callback(result)}
                    console.log('gotAllSavedData');

                    $('body').trigger('gotAllSavedData', [result]);
                });
            });

        },
        getCurrentData : function(db,callback){
            var result = [],
                that = this;
            db.transaction(function(tx) {
                tx.executeSql(('SELECT * FROM SavedData WHERE actualData=?'),['true'], function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);
                        result[i] = {
                            saveid: row['id'],
                            username: row['username'],
                            userid: row['userid'],
                            lastUpdate : row['lastUpdate'],
                            lastPage: row['lastPage']
                        }
                    }
                    if (callback){callback(result)}
                    console.log('gotCurrentData');
                    $('body').trigger('gotCurrentData', [result]);
                });
            });

        },
        getChars: function(db,save,char,callback){
            var saveid = save.id,
                result = [],
                query='SELECT * FROM Characters WHERE username=?',
                parameters = [saveid];
            if (char && char!='' && typeof char!=undefined ) {
                query='SELECT * FROM Characters WHERE username=? AND CharName',
                parameters = [saveid, char.name];
            }

            db.transaction(function(tx) {
                tx.executeSql((query),parameters, function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);
                        result[i] = {
                            charList: row['CharList'],
                            charDesc: row['CharDesc'],
                            charImage: row['CharImage'],
                            charStory: row['CharStory'],
                            charPower: row['CharPower'],
                            charItem: row['CharItem'],
                            charType: row['CharType'],
                            charLife: row['CharLife'],
                            charStrength: row['CharStrength'],
                            charMagic: row['CharMagic'],
                            charAgility: row['CharAgility'],
                            charInt: row['CharInt'],
                            charWisd: row['CharWisd'],
                            met: row['Met'],
                            inGroup: row['InGroup'],
                            dead: row['Dead'],
                            friendly: row['Friendly']
                        }
                    }
                    if (callback){callback(result)}
                    console.log('gotChars');
                    $('body').trigger('gotChars', [result]);
                });
            });

        },
        getStoryData : function(db,saveid, callback){
            var result = [],
                query='SELECT * FROM Story WHERE saveid=?';
            db.transaction(function(tx) {

                tx.executeSql((query),[saveid], function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);

                        result[i] = {
                            charList: row['CharList'],
                            visitedPlaces: row['VisitedPlaces'],
                            visitedParagraphs: row['VisitedParagraphs'],
                            lastPage: row['lastPage'],
                            previousPage: row['previousPage'],
                            lastChapter: row['lastChapter']
                        }
                    }
                    if (callback){callback(result)}
                    console.log('gotStoryData');
                    $('body').trigger('gotStoryData', [result]);
                });
            });

        },
        checkEvent : function(db, eventname, saveid, callback){
            var result = [],
                data,
                query='SELECT * FROM StoryEvents WHERE saveid=? and eventname=?';
            db.transaction(function(tx) {
                tx.executeSql((query),[saveid, eventname], function(tx,rs) {
                    result = (rs.rows.length>0);
                    if (callback){callback(data)}
                    console.log('isEventOn');
                    $('body').trigger('isEventOn', [result]);
                });
            });

        },
        getEvents : function(db, eventname, saveid, callback){
            var result = [],
                data,
                query='SELECT * FROM StoryEvents WHERE saveid=?';
            db.transaction(function(tx) {
                tx.executeSql((query),[saveid, eventname], function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);

                        result[i] = {
                            id:row['id'],
                            saveid: row['saveid'],
                            eventname: row['eventname'],
                            value: row['value']
                        }
                    }
                    if (callback){callback(data)}
                    console.log('gotEvents');
                    $('body').trigger('gotEvents', [result]);
                });
            });

        },
        addEvent : function(db, eventname, saveid, callback){
            var result = [],
                data,
                query='INSERT INTO StoryEvents WHERE saveid=? and eventname=?';
            db.transaction(function(tx) {
                tx.executeSql((query),[saveid, eventname], function(tx,rs) {
                    result = (rs.rows.length>0);
                    if (callback){callback(data)}
                    console.log('addedEvent');
                    $('body').trigger('addedEvent', [result]);
                });
            });

        },
        setActualSave : function(db, lastpage, saveid, callback){
            var result = [],
                date = new Date,
                day = date.getDate(),
                month = date.getMonth()+1,
                year = date.getFullYear(),
                fullDate = day+'/'+month+'/'+year,
                query = 'UPDATE SavedData SET actualData =?, lastUpdate =?, lastPage =? WHERE id = ?',
                queryReset='UPDATE SavedData SET actualData =?';
            db.transaction(function(tx) {

                tx.executeSql((queryReset),[''], function(tx,rs) {
                    console.log('reset actualData');

                    tx.executeSql((query),['true',fullDate,lastpage, saveid], function(tx,rs) {
                        if (callback){callback(rs)}
                        console.log('currentDataSet');
                        $('body').trigger('currentDataSet', [fullDate]);
                    },
                    function(tx,error){

                        console.log(error);
                    });
                });
            });

        },
        setStoryData: function(db, saveid, story, callback){
           var result = [],
               parameters = [],
               tableProp = '',
               index = 0,
               query = '';

            for (var property in story) {
                if (story.hasOwnProperty(property)) {
                    if (index==0) {
                        tableProp = property+' = ?';
                    }
                    else {
                        tableProp = tableProp+','+property+' = ?';
                    }
                    parameters.push(story[property]);
                    index++;
                }
            }
            parameters.push(saveid);
            query = 'UPDATE Story SET '+tableProp+' WHERE id  =?';
            db.transaction(function(tx) {
                tx.executeSql((query),parameters, function(tx,rs) {
                    if (callback){

                        callback(rs)
                    }
                    console.log('storyDataSet');
                    $('body').trigger('storyDataSet', [rs]);
                },
                function(tx,error){
                    console.log(error);
                });
            });


            /*tx.executeSql('CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, username, email, save1, save2, save3, autosave, currentdata)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SavedData (id INTEGER PRIMARY KEY, username, userid, actualData, lastPage)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS StoryEvents (id INTEGER PRIMARY KEY, saveid, eventname, value)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Character (id INTEGER PRIMARY KEY, saveId, CharName, CharDesc, CharImage, CharPower, CharItem, CharType, CharLife, CharStrength, CharMagic, CharAgility, CharInt, CharWisd)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Story (id INTEGER PRIMARY KEY, saveId, CharList, VisitedPlaces, VisitedParagraphs, lastPage, previousPage, lastChapter)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS ChoicesStat (id INTEGER PRIMARY KEY, saveId, ChoiceName, ChoiceType, ChoiceValue, ChoiceVisited)');*/
        },
        setCharData: function(db, saveid, char, callback){
            var result = [],
                parameters = [],
                tableProp = '',
                index = 0,
                query = 'UPDATE Story SET '+tableProp+' WHERE id  =?';

            for (var property in character) {
                if (character.hasOwnProperty(property)) {
                    if (index==0) {
                        tableProp = property+' = ?';
                    }
                    else {
                        tableProp = ','+property+' = ?';
                    }
                    parameters.push(character[property]);
                    index++;
                }
            }
            db.transaction(function(tx) {
                tx.executeSql((query),parameters, function(tx,rs) {
                    console.log('Data updated');
                    if (callback){callback()}
                    console.log('charDataSet');
                    $('body').trigger('charDataSet');
                });
            });


            /*tx.executeSql('CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, username, email, save1, save2, save3, autosave, currentdata)');
             tx.executeSql('CREATE TABLE IF NOT EXISTS SavedData (id INTEGER PRIMARY KEY, username, userid, actualData)');
             tx.executeSql('CREATE TABLE IF NOT EXISTS StoryEvents (id INTEGER PRIMARY KEY, saveid, eventname, value)');
             tx.executeSql('CREATE TABLE IF NOT EXISTS Character (id INTEGER PRIMARY KEY, saveId, CharName, CharDesc, CharImage, CharPower, CharItem, CharType, CharLife, CharStrength, CharMagic, CharAgility, CharInt, CharWisd)');
             tx.executeSql('CREATE TABLE IF NOT EXISTS Story (id INTEGER PRIMARY KEY, saveId, CharList, VisitedPlaces, VisitedParagraphs, lastPage, previousPage, lastChapter)');
             tx.executeSql('CREATE TABLE IF NOT EXISTS ChoicesStat (id INTEGER PRIMARY KEY, saveId, ChoiceName, ChoiceType, ChoiceValue, ChoiceVisited)');*/
        },
        updateAppStatus : function(db, data){

        }
    };

    return WebSql;

});