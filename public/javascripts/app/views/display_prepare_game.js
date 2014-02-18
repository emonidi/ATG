define('displayPrepareView',function(){
    var view = Backbone.View.extend({
        el:".main",
        events:{
            "change #playersNumber":"onPlayersNumberChanged"
        },
        initialize:function(){
            var Super = this;




            $.get('javascripts/app/templates/display_prepare_game.html',function(t){
                Super.template = $(t);
                require(['displayPrepareModel'],function(model){
                    Super.model = model;
                    Super.openSocket();
                    Super.render();
                    Super.setListeners();
                })

            });

        },
        render:function(){
            var temp = _.template($(this.template).html(),{playersToConnect:this.model.get('playersToConnect')});
            this.$el.html(temp);
            $("#playersNumber").val(this.model.get('playersNumber'))
        },
        onPlayersNumberChanged:function(){
            this.model.set('playersNumber',$("#playersNumber").val());
            console.log(this.model.toJSON());
        },
        update:function(){
            $("#playersToConnect").text(this.model.get('playersToConnect'));
        },
        openSocket:function(){
            this.socket = io.connect('http://localhost/',function(socket){

            });

        },
        setListeners:function(){
            var Super = this;
            this.model.on('change',function(){
                Super.socket.emit('prepare_game',this);
            });

            Super.socket.on('prepare_game',function(data){
                Super.model.set(data);
                Super.update();
            });
        }
    });

    return new view();
})