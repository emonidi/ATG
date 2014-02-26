
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var game = require('./routes/game');
var user = require('./routes/user');
var http = require('http');
var path = require('path');



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/prepare_game',game.prepare);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
		socket.on('prepare_game',function(data){
			game.prepare(data,socket);
		});

		socket.on('getPlayers',function(data){
			game.getPlayers(data,socket);
		})

		socket.on('getPlayer',function(data){
			game.getPlayer(data,socket);
		})

		socket.on('activePlayer',function(data){
			game.changePlayer(data,socket);
		})

		socket.on('playerChanged',function(data){
			game.playerChanged(data,socket);
		})

		socket.on('playerTurn',function(data){
			game.playerTurn(data,socket);
		})
});
