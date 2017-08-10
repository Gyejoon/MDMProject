// 퇴근 버튼 클릭시
var device_off = function(req, res){
	console.log('퇴근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	var paramId = req.body.Device_info_Id;
	
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query("call device_history(?,?,?);",[
			paramId, "퇴근", "사용자가 퇴근 하였습니다."
		], function(err){
			if(err){
				throw err;
			}
		});
	});
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write("{code : '200', 'message' : '퇴근'}");
	res.end();
};

module.exports.device_off = device_off;