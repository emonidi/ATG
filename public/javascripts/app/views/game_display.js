/**
 * Created by emonidi on 14-2-20.
 */
define('gameDisplay',['player','players'],function(player,players){

    var Game = function(playersNumber){

        this.playersNumber = playersNumber;
        //game round
        this.gameRound = 0;
        //whic player id is active now
        this.activePlayer= 0;
        //player turn within the round
        this.playerTurn = 0;
    }


    Game.prototype.beginNewRound = function(){

        this.gameRound++;
        this.setPlayerTurn();
        this.changeActivePlayer();
    }

    Game.prototype.activePlayerId=function(){
        return this.activePlayer;
    }

    Game.prototype.changeActivePlayer = function(){
        console.log("changing active player")
        if(this.activePlayer >= this.playersNumber){
            this.activePlayer = 1;
        }else{
            this.activePlayer++
        }
        console.log(this.activePlayer+ " activePlayer")
    }

    Game.prototype.setPlayersNumber = function(playersNumber){
        this.playersNumber = playersNumber;
    }

    Game.prototype.setPlayerTurn = function(){
        this.playerTurn++
        console.log("Player turn "+this.playerTurn)
        if(this.playerTurn >= 2){
            console.log("Player turn "+this.playerTurn)
            this.playerTurn --;
            this.changeActivePlayer();
            return false;
        }
        console.log("Player turn "+this.playerTurn)


    }

    Game.prototype.analizeScore = function(score){

    }


    var score = Backbone.Model.extend({

        defaults:{
            player_id:null,
            round:null,
            shot_1:0,
            shot_2:0,
            score:this.shot_1,
        },
        initialize:function(){
          var Super = this;
          this.set(this.defaults);
        }
    });

    var scores = {};
    var scoresColl =  Backbone.Collection.extend({
        model:score
    });




    var game = new Game();






    var playerModel  = new player();

    var pColl = players;

    var view = Backbone.View.extend({
           el:".main",
           render:function(){
               var Super = this;
               $.get('javascripts/app/templates/game_display.html',function(t){
                   Super.template = _.template($(t).html(),{});
                   Super.$el.html(Super.template);
               });
               
           },
           initialize:function(){
              var Super = this;

              this.openSocket(function(){
              Super.setListeners();
                Super.getPlayers();
                Super.socket.on('players',function(players){
                      //if no playes
                      if(players.length === 0){
                          //return to display window;
                          window.location.hash="#display";
                          return false;
                      }
                      //add players to collection
                      else{
                          pColl.add(players);
                          Super.setScoreBoard();
                      }

                  });
              });

           },
           openSocket:function(callback){
               this.socket = io.connect(Config.socketUrl);
               callback();
           },
           getPlayers:function(){
              this.socket.emit('getPlayers');

           },
           setListeners:function(){
              var Super = this;
              //get players
              this.socket.on('playerShot',function(data){

                  if(game.activePlayer !== data.playerId){
                      console.log("emiitin")
                      Super.socket.emit('playerChanged',{activePlayer:game.activePlayer,gameRound:game.gameRound,playerTurn:game.playerTurn});
                  }
                  game.setPlayerTurn();
                  console.log(data);
                  if(game.playerTurn = 1){
                        var model = new score();
                       //TO DO functionality has to be moved in game.analize score;
                        model.set({
                            "player_id":data.playerId,
                            "round":game.gameRound,
                            "shot_1":data.pins,
                            "strike":false
                        });

                        scores[data.playerId].add(model);
                      Super.setResult(data.playerId);

                  }


              });

           },
           setResult:function(playerId){
                var scoreModel = scores[playerId].where({round:game.gameRound,player_id:playerId})[0];
                var score;
                score = scoreModel.get('shot_1') + scoreModel.get('shot_2');
                $(".result.player-"+playerId+".round-"+game.gameRound).text(score);
           },
           setScoreBoard:function(){
               var Super = this;

               $.get("javascripts/app/templates/playerScoreBoard.html",function(t){
                    Super.scoreBoardTemplate = $(t).html();
                   _.each(pColl.models,function(model,i){
                       var template = _.template($(t).html(),{player:model.toJSON()});
                       $('.scores').append(template);
                       //send signal to clients;
                   });
                   Super.startGame();

               });
           },
           startGame:function(){
                game.setPlayersNumber(pColl.length);

                for(var i = 0; i < pColl.length; i++){
                    scores[i+1] = new scoresColl();
                }
                game.beginNewRound();
                this.socket.emit('activePlayer',{activePlayer:game.activePlayer,gameRound:game.gameRound,playerTurn:game.playerTurn});
           }

    })

    return new view();
})