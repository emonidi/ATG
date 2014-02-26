/**
 * Created by emonidi on 14-2-18.
 */
define('clientJoinView',['player'],function(player){

    var view  = Backbone.View.extend({
           el:".main",
           events:{
             "click #joinButton":"onJoinButtonClicked"
           },
           initialize:function(){
               var Super = this;
               this.openSocket(function(){
                   Super.getGame();
               });
               this.model = new player();
               this.setListeners();
               this.render();
           },
           render:function(){
               var Super = this;
               $.get('javascripts/app/templates/client_join.html',function(t){
                    Super.template = _.template($(t).html(),{});
                    Super.$el.html(Super.template);
               });
           },
           openSocket:function(callback){
               this.socket = io.connect(Config.socketUrl);
               callback();
           },
           setListeners:function(){
               var Super = this;
               this.model.on('change:name',function(){
                    Super.socket.emit('prepare_game',Super.model);

               });

               Super.socket.on('prepare_game',function(data){
                   console.log(data);
               });

               Super.socket.on('begin_game',function(data){
                    window.location.hash="#game_client/"+Super.model.get('id');
               });

               Super.socket.on('joinedConfirmation',function(data){
                   Super.model.set('id',data.id);
               });
           },
           getGame:function(){
               var Super = this;
                this.socket.emit('prepare_game',{display:false});
                this.socket.on('prepare_game',function(data){
                    Super.showNameInput();
                });
           },
           showNameInput:function(){
               $(".notification").addClass('hidden');
               $(".nameHolder").removeClass('hidden');
           },
           onJoinButtonClicked:function(ev){
               var Super = this;
               ev.preventDefault();
               var clientName = $("#clientName").val();
               if(clientName === ''){
                   $(".nameValidation").show();
                   return false;
               }else{
                   $('.nameValidation').hide();
                   Super.model.set('name',clientName);
                   Super.showWaitingMessage();
               }
           },
           showWaitingMessage:function(){
               $(".nameForm").addClass('hidden');
               $(".waitingForPlayers").show().removeClass('hidden');
           }
    });

    return new view();

});