/**
 * Created by emonidi on 14-2-20.
 */
define('gameDisplay',function(){
    var view = Backbone.View.extend({
           el:".main",
           render:function(){
               var Super = this;
               $.get('javascripts/app/templates/game_display.html',function(t){
                   Super.template = _.template($(t).html(),{});
                   Super.$el.html(Super.template);
               })
           }
    })

    return new view();
})