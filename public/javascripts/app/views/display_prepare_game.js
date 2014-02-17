define('displayPrepareView',function(){
    var view = Backbone.View.extend({
        el:".main",
        initialize:function(){
            var Super = this;
            $.get('javascripts/app/templates/display_prepare_game.html',function(t){
                Super.template = $(t);
                Super.render();
            });
        },
        render:function(){
            var temp = _.template($(this.template).html());
            $(".main").html(temp);
        }
    });

    return new view();
})