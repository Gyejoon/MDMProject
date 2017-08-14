var device_refresh = function(req, res){
	console.log('토큰 갱신 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	var paramId = req.body.Device_info_Id;
	var paramtoken = req.body.Fcm_token;
	
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query("update device_info set Fcm_token = ? where Id = ?;",[
			paramtoken, paramId
		], function(err){
			if(err){
				throw err;
			}
		});
	});
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write("{code : '200', 'message' : '토큰 갱신 완료'}");
	res.end();
};

module.exports.device_refresh = device_refresh;