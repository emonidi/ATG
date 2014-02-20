define('displayPrepareView',function(){
    var view = Backbone.View.extend({
        el:".main",
        events:{
            "click #playersNumberBtn":"onPlayersNumberChanged",

        },
        initialize:function(){
            //Super is to have global access to the the View (like self or that);
            var Super = this;
            //get the template
            $.get('javascripts/app/templates/display_prepare_game.html',function(t){
                Super.template = $(t);
                //require the model and players collection
                require(['displayPrepareModel','players'],function(model,players){
                    //hook up the players collection to the model
                    model.players = players;
                    //assign the model to be property of the view (no idea if its a good practice but its convenient)
                    Super.model = model;
                    //open the socket
                    Super.openSocket();
                    //render the template
                    Super.render();
                    //set the listeners
                    Super.setListeners();
                });

            });

        },
        render:function(){
            var temp = _.template($(this.template).html(),{playersToConnect:this.model.get('playersToConnect'),players:this.model.get('players')});
            this.$el.html(temp);
            $("#playersNumber").val(this.model.get('playersNumber'))
        },
        onPlayersNumberChanged:function(ev){
            ev.preventDefault();
            this.model.set('playersNumber',$("#playersNumber").val());
            $('.form-horizontal').addClass('hidden');
        },
        update:function(){

            $("#playersToConnect").text(this.model.get('playersToConnect'));
            var players = this.model.get('players');
            var playersUl= $("#connectedPlayers");
            playersUl.empty();
            _.each(players,function(player,i){

                playersUl.append("<li>"+player.name+" joined the game</li>");
            });
        },
        openSocket:function(){
            this.socket = io.connect(Config.socketUrl,function(socket){
            });

        },
        setListeners:function(){
            var Super = this;
            //when model changes
            this.model.on('change:playersNumber',function(){
                //send message to the back end
                Super.socket.emit('prepare_game',this);
            });

            Super.socket.on('prepare_game',function(data){
                //when recieving a message
                Super.model.set(data);
                console.log(data);
                //trigger the update function to update the view
                //I am sure there should be a better way
                Super.update();
            });

            Super.socket.on('playerJoined',function(data){
               console.log(data);
               Super.model.set(data);
               Super.update();
            });

            Super.socket.on('begin_game',function(){
                setTimeout(function(){
                    window.location.hash = "game/display"
                },1000)
            })
        }
    });

    return new view();
})