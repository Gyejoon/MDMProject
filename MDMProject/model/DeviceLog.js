function DeviceLog(database, Id, type, history){
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query("call device_history(?,?,?);",[
			Id, type, history
		],function(err){
			if(err){
				throw err;
			}
			console.log(Id + "의 출근 기록이 성공적으로 로깅 되었습니다.");
		});
	});
}

module.exports = DeviceLog;