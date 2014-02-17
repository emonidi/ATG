/**
 * Created by emonidi on 14-2-17.
 */
define('homeView',function(){
    var homeView = Backbone.View.extend({

        initialize:function(){
            var Super = this;
            $.get('javascripts/app/templates/home.html',function(t){
                Super.template = $(t);
                Super.render();
            });
        },
        render:function(){
            var temp = _.template($(this.template).html());
            $(".main").html(temp);
        }
    });

    return new homeView();
})