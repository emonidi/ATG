exports.prepare = function(data,socket){
 	var Super = this;
	
	function processData(data){
		data.playersToConnect = data.playersNumber - data.connectedPlayers;
		return data;
	}
	
	function sendData(){
		socket.emit('prepare_game',processData(data));
	}

	sendData();
}