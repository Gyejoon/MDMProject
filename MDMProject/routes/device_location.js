var device_location = function(req, res){
	console.log('위치정보 추가 모듈 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	var paramId = req.body.Device_info_Id;
	var paramLatitude = req.body.Latitude;
	var paramLongitude = req.body.Longitude;
	
	if(database){
		database.getConnection(function(err, connection){
			connection.query("call location_history(?,?,?);", [
				paramId, paramLatitude, paramLongitude
			], function(err){
				if(err){
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write("{code : '400', 'message' : '위치 정보 추가 실패'}");
					res.end();
					console.log(err);
					throw err;
				}
				res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
				res.write("{code : '200', 'message' : '위치 정보 추가 성공'}");
				res.end();
			});
		});
	} else {
		console.log("데이터베이스 연결 실패");
	}
	
};

module.exports.device_location = device_location;