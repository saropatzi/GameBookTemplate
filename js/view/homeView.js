define([
    'jquery',
    'underscore',
    'backbone',
    'websql',
    'view/transitionView',
    'text!templates/homeTemplate.html'
], function($, _, Backbone, WebSql, TransitionView, homeTemplate){

    var HomeView = TransitionView.extend({
        className: 'home',
        template: _.template(homeTemplate),
        events: {
            "click .start":"checkUser",
            "click .save": "setData",
            "click #continue": "saveAndGo"
        },
        initialize: function(){
            var result = [];
            var username = 'player';

            db.transaction(function(tx) {

                tx.executeSql(('SELECT * FROM User WHERE username = ?'),[username], function(tx,rs) {
                    for(var i=0; i<rs.rows.length; i++) {
                        var row = rs.rows.item(i);
                        result[i] = {
                            id: row['id'],
                            username: row['username'],
                            email: row['email']
                        }
                    }

                    if (rs.rows.length>0){
                        console.log('Username already exists');
                        WebSql.getAllSavedData(db);
                    } else {
                        var user={
                            username:username,
                            email: ""
                        };
                        WebSql.createUser(db,user,function(){
                            var firstPage = $('#continue').data('first-page');
                            WebSql.getAllSavedData(db);
                        });
                    }

                });
            });
        },
        saveAndGo : function(event){
            var lastpage =$('#continue').data('lastpage'),
                saveid = $('#continue').data('saveid');

            if ($('#continue').hasClass('active')){

                WebSql.setActualSave(db,lastpage, saveid, function(){
                    window.location.hash = lastpage;
                });
            }
        },
        setData : function(event){
            var $save = $(event.currentTarget),
                lastpage=$save.data('lastpage'),
                saveid = $save.data('saveid'),
                $continue = $('#continue');
                $save.addClass('active');
                $continue.addClass('active');
                $continue.attr('data-lastpage',lastpage);
                $continue.attr('data-saveid',saveid);
        },
        checkUser : function(e){
            $('.insertData').addClass('active');
        },

        render: function () {
            var result = [];
            var that = this;
            var saveData = that.model.attributes.saveData;
            var username = 'player';

            $('body').on('gotAllSavedData', function(event,result){
                for (i=0;i<result.length;i++){
                    that.model.attributes.savedData[i] = result[i];
                }
                that.$el.html(that.template(that.model.toJSON()));
            });

            return TransitionView.prototype.render.apply(this, arguments);
        }
    });

    return HomeView;

});