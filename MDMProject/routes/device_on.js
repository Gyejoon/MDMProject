const device_dao = require('../model/device_dao');
const func_push = require('../push/func_push');

// 출근 버튼 클릭시
var device_on = function(req, res){
	console.log('출근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramId = req.body.Id;
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		device_dao.getActive(connection, paramId, function(err, result) {
			if(err){
				connection.release();
				throw err;
			}
			if(result.Active === "off"){
				func_push.device_on_push(database, paramId, "MC:OFF");
				func_push.device_on_push(database, paramId, "MR:OFF");
			}
		});
		// 현황 갱신
		
		device_dao.device_Management(connection, paramId, "Active", "on");
		device_dao.device_Management(connection, paramId, "VoiceRecord", "off");
		device_dao.device_Management(connection, paramId, "Camera", "off");
		
		device_dao.setActive(connection, paramId, "출근", "사용자가 출근 하였습니다.", function(err) {
			if(err){
				connection.release();
				throw err;
			}
		});
	});
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write(JSON.stringify("{code : '200', 'message' : '출근'}"));
	res.end();
	
};

module.exports.device_on = device_on;