/**
 * Created by emonidi on 14-2-17.
 */
define('displayPrepareModel',function(){
    var model  = Backbone.Model.extend({
        defaults:{
            playersNumber:0,
            playersToConnect :0,
            connectedPlayers:0
        },
        initialize:function(){
            var Super = this;
            this.set(this.defaults);
        },

    });

    return new model();
})