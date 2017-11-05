const device_dao = require('../model/device_dao');
const func_push = require('../push/func_push');

// 디바이스 출퇴근 모듈
var device_onoff = function(req, res){
	console.log('디바이스 출퇴근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramId = req.body.Id;

	console.log("요청 디바이스 -> " + paramId);
	
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
				func_push.device_active_push(database, paramId, "출근:OFF");
				device_dao.device_Management(connection, paramId, "Active", "on");
				device_dao.device_Management(connection, paramId, "Camera", "off");
				
				device_dao.setActive(connection, paramId, "출근", "사용자가 출근 하였습니다.", function(err) {
					if(err){
						connection.release();
						throw err;
					}
					connection.release();
				});
			}else{
				func_push.device_active_push(database, paramId, "퇴근:ON");
				// 현황 갱신
				device_dao.device_Management(connection, paramId, "Active", "off");
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
	
	res.json({message : "디바이스 출퇴근"});
	
};

var arduino_onoff = function(req, res){
	console.log('아두이노 출퇴근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramRfid = req.body.Rfid;
	
	console.log("요청 아두이노 -> " + paramRfid);
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		//수정 (Rfid 값으로 Active 가져오도록)
		device_dao.getActiveId(connection, paramRfid, function(err, result) {
			if(err){
				connection.release();
				throw err;
			}
			if(result.Active === "off"){
				func_push.device_active_push(database, result.Device_info_Id, "출근:OFF");
				device_dao.device_Management(connection, result.Device_info_Id, "Active", "on");
				device_dao.device_Management(connection, result.Device_info_Id, "Camera", "off");
				device_dao.setActive(connection, result.Device_info_Id, "출근", "사용자가 출근 하였습니다.", function(err) {
					if(err){
						connection.release();
						throw err;
					}
					connection.release();
				});
			}else {
				func_push.device_active_push(database, result.Device_info_Id, "퇴근:ON");
				// 현황 갱신
				device_dao.device_Management(connection, result.Device_info_Id, "Active", "off");
				device_dao.device_Management(connection, result.Device_info_Id, "Camera", "on");
				
				device_dao.setActive(connection, result.Device_info_Id, "퇴근", "사용자가 퇴근 하였습니다.", function(err) {
					if(err){
						connection.release();
						throw err;
					}
					connection.release();
				});
			}
			
		});
	});
	
	res.json({message : "아두이노 출퇴근"});
};

module.exports.device_onoff = device_onoff;
module.exports.arduino_onoff = arduino_onoff;