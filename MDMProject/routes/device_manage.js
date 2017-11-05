const device_dao = require('../model/device_dao');
const request_web = require('../web/request_web');

var device_manage = function(req, res){
	console.log('디바이스 관리 모듈 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	const database = req.app.get('database');
	const paramId = req.body.Id;
	const paramflag = req.body.flag;
	
	console.log("요청 디바이스 -> " + paramId);
	
	database.getConnection(function(err, connection) {
		if(err){
			connection.release();
			throw err;
		}
		connection.query("call device_history(?, ?, ?);",[
			paramId, "경고", paramflag 
		], function(err){
			if(err){
				connection.release();
				throw err;
			}
		});
	});
	
	res.json({message : "디바이스 관리 성공"});
};

module.exports.device_manage = device_manage;