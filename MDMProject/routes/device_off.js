const device_dao = require('../model/device_dao');
const func_push = require('../push/func_push');

// 퇴근 버튼 클릭시
var device_off = function(req, res){
	console.log('퇴근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
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
			if(result.Active === "on"){
				func_push.device_on_push(database, paramId, "MC:ON");
				func_push.device_on_push(database, paramId, "MR:ON");
				// 현황 갱신
				device_dao.device_Management(connection, paramId, "Active", "off");
				device_dao.device_Management(connection, paramId, "VoiceRecord", "on");
				device_dao.device_Management(connection, paramId, "Camera", "on");
				
				device_dao.setActive(connection, paramId, "퇴근", "사용자가 퇴근 하였습니다.", function(err) {
					if(err){
						connection.release();
						throw err;
					}
					connection.release();
				});
			}
		});
	});
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write(JSON.stringify("{code : '200', 'message' : '퇴근'}"));
	res.end();
};

module.exports.device_off = device_off;