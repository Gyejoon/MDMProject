const device_dao = require('../model/device_dao');
const request_web = require('../web/request_web');

var device_manage = function(req, res){
	console.log('디바이스 관리 모듈 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	const database = req.app.get('database');
	const paramId = req.body.Id;
	const paramflag = req.body.flag;
	
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
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write(JSON.stringify("{code : '200', 'message' : '디바이스 관리 성공'}"));
	res.end();
};

module.exports.device_manage = device_manage;