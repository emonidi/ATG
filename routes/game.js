var players = [];
var playersNumber = 0;
var connectedPlayers = 0;
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

	}

	function broadcastBeginGame(){
		socket.broadcast.emit('begin_game');
	}

	sendData();
}