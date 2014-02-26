var players = [];
var playersNumber = 0;
var connectedPlayers = 0;
var game = 0;
exports.prepare = function(data,socket){
 	var Super = this;
 	data.playersNumber ? playersNumber = data.playersNumber : null;
	data.connectedPlayers ? connectedPlayers = data.connectedPlayers : null;
	data.name ? setPlayer() :null;
	function processData(data){
		data.playersToConnect = playersNumber - connectedPlayers;
		data.players = players;
		data.playersNumber = playersNumber;
		if(data.playersToConnect === 0){
			broadcastBeginGame();
			//return false;
		}
		return data;
	}
	
	function sendData(){
		socket.emit('prepare_game',processData(data));
	}

	function setPlayer(){
		connectedPlayers++;
		players.push({name:data.name,id:players.length+1});
		socket.broadcast.emit('playerJoined',processData(data));
		socket.emit('joinedConfirmation',players[players.length-1]);
	}

	function broadcastBeginGame(){
		socket.broadcast.emit('begin_game');
	}



	sendData();
}

exports.getPlayers =  function(data,socket){
	socket.emit('players',players);
	socket.broadcast.emit('begin_game');
}

exports.getPlayer = function(data,socket){
	d = {};
	socket.emit('playerRecieved',{player:players[data.playerId-1]});	
}

exports.changePlayer = function(data,socket){
	socket.broadcast.emit('changePlayer',data);
}
exports.playerChanged = function(data,socket){
    console.log(data);
    console.log('changePlayer');

    socket.broadcast.emit('pc',data);
}

exports.playerTurn = function(data,socket){
	socket.broadcast.emit('playerShot',data);

}

