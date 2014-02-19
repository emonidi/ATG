/**
 * Created by emonidi on 14-2-18.
 */
define('players',['player'],function(player){
    var collection = Backbone.Collection.extend({
        model:player
    });
    return new collection();
});