/**
 * Created by emonidi on 14-2-16.
 */
require.config({
    baseUrl:"javascripts",
    paths:{
        'homeView':'app/views/home',
        'displayPrepareView':'app/views/display_prepare_game',
        'displayPrepareModel':'app/models/displayPrepareModel',
        'io':"/socket.io/socket.io.js"
    },
    shim:{
        'displayPrepareView':['displayPrepareModel']
    }
})

require(['jquery','underscore','backbone','io'],function($,_,Backbone,io){

      var Router = Backbone.Router.extend({
            routes:{
                '':'home',
                'display':'display',
                'client':'client'
            },

            home:function(){
                require(['homeView']);
            },
            display:function(){
                require(['displayPrepareModel','displayPrepareView']);
            }
      });

      var appRouter = new Router();
      Backbone.history.start();

});