/**
 * Created by emonidi on 14-2-18.
 */
define('player',function(){
    var model = Backbone.Model.extend({
          defaults:{
              id:"",
              name:""
          }
    });

    return model;
});