/**
 * Created by emonidi on 14-2-16.
 */

var Config = {
    socketUrl:"http://192.168.0.101:3000/",
}

require.config({
    baseUrl:"javascripts",
    paths:{
        'homeView':'app/views/home',
        'displayPrepareView':'app/views/display_prepare_game',
        'displayPrepareModel':'app/models/displayPrepareModel',
        'player':'app/models/player',
        'players':'app/collections/players',
        'clientJoinView':'app/views/client_join',
        'gameDisplay':'app/views/game_display',
        'gameClient':'app/views/game_client',
        'io':"/socket.io/socket.io.js",
        'Game':'app/Game'
    },
    shim:{
        'displayPrepareView':['displayPrepareModel'],
        'gameDisplay':['Game']
    }
})

require(['jquery','underscore','backbone','io'],function($,_,Backbone,io){

      var Router = Backbone.Router.extend({
            routes:{
                '':'home',
                'display':'display',
                'client':'client',
                'game/display':'gameDisplay',
                'game_client/:playerName':'gameClient',
            },

            home:function(){
                console.log("I am home");
                require(['homeView'],function(view){
                    view.initialize();
                });
            },
            display:function(){
                require(['displayPrepareView'],function(view){
                    view.initialize();
                });
            },
            client:function(){
                require(['clientJoinView'],function(view){

                });
            },
            gameDisplay:function(){
                require(['gameDisplay'],function(view){
                    view.render();
                });
            },
            gameClient:function(){
                require(['gameClient'],function(view){
                view.render();
            })
            }
      });

      var appRouter = new Router();
      Backbone.history.start();

});