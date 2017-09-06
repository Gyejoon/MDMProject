var func = require('../func/func');
var mdm_dao = require('../model/mdm_dao');
var mdm_web = require('../func/mdm_web');

// 퇴근 버튼 클릭시
var device_off = function(req, res){
	console.log('퇴근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	var paramId = req.body.Device_info_Id;
	
	// 퇴근 시 카메라 허용
	func.device_off_push(database, paramId, "MC:ON");
	mdm_dao.device_Management(database, paramId, "Camera", "on");
	mdm_dao.device_Management(database, paramId, "Active", "off");
	// 웹 서버에 접속해제 사실을 알린다.
	mdm_web.deviceoff(paramId);
	
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