/**
 * Created by emonidi on 14-2-22.
 */
define('gameClient',['player'],function(player){
    var playerModel = new player();
    var view = Backbone.View.extend({
        el:".main",
        events:{
            "click .pin":"processPlayerTurn"
        },
        render:function(){
            var Super = this;
            $.get('javascripts/app/templates/client_game.html',function(t){
                var template = _.template($(t).html(),{player:playerModel});
                Super.$el.html(template);
            })
        },
        initialize:function(){
            var Super = this;
            //get player id
            var playerId = window.location.hash.split('/')[1];

            this.openSocket(function(){
                Super.getPlayer(playerId);
                Super.setListeners();
            });

        },
        openSocket:function(callback){
            this.socket = io.connect(Config.socketUrl);
            callback();
        },
        setListeners:function(){
            var Super=  this;

                this.socket.on('changePlayer',function(data){
                console.log(playerModel.get('id'));
                alert("changePlayer");
                if(playerModel.get('id') === data.activePlayer){
                    playerModel.set('active',true);
                }else{
                    playerModel.set('active',false);
                }

                console.log(playerModel.get('active'));
                
            })

             this.socket.on('pc',function(data){
                console.log(playerModel.get('id'));
                alert("changePlayer");
                if(playerModel.get('id') === data.activePlayer){
                    playerModel.set('active',true);
                }else{
                    playerModel.set('active',false);
                }
                Super.render();
            })

            playerModel.on('change',function(){
                Super.render();
                
            })
        },
        getPlayer:function(playerId){
            this.socket.emit('getPlayer',{"playerId":playerId});
            this.setPlayer();
        },
        setPlayer:function(){
            var Super = this;
            this.socket.on('playerRecieved',function(data){

                !data.player ? window.location.hash="/": null;
                playerModel.set(data.player);
                console.log(data);
                Super.render();
            });
        },
        processPlayerTurn:function(ev){
            console.log(ev);
            ev.preventDefault();
            var target = $(ev.target);
            console.log(target.data('pins'));
            this.socket.emit('playerTurn',{playerId:playerModel.get('id'),pins:target.data('pins')});

        }
    })

    return new view();
})