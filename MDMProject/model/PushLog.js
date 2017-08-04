function PushLog(Id, type, history, database){
	var query = "";
	if(type === "CW"){
		query = "call wireless_history('" + Id + "', 'Wifi', '" + history +"');";
	}else if(type === "CB"){
		query = "call wireless_history('"+ Id +"', 'Bluetooth', '" + history +"');";
	}else if(type === "CT"){
		query = "call wireless_history('"+ Id +"', 'Tethering', '" + history +"');";
	}else if(type === "MC"){
		query = "call media_history('"+ Id +"', 'Camera', '" + history +"');";
	}else if(type === "MR"){
		query = "call media_history('"+ Id +"', 'VoiceRecord', '" + history +"');";
	}else if(type === "MCA"){
		query = "call media_history('" + Id +"', 'Capture', '" + history +"');";
	}
	
	database.getConnection(function(err, connection){
		connection.query(query, function(err){
			if(err){
				console.log(query);
				console.log(err);
				throw err;
			}
			console.log(Id + "에 성공적으로 로깅 되었습니다.");
		});
	});
}

module.exports = PushLog;