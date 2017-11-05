const device_dao = require('../model/device_dao');
const user_dao = require('../model/user_dao');
const request_web = require('../web/request_web');

var device_location = function(req, res){
	console.log('위치정보 추가 모듈 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	const database = req.app.get('database');
	const paramId = req.body.Device_info_Id;
	const paramLatitude = req.body.Latitude;
	const paramLongitude = req.body.Longitude;
	
	console.log("요청 디바이스 -> " + paramId);
	
	database.getConnection(function(err, connection){
		device_dao.locationadd(connection, paramId, paramLatitude, paramLongitude, function(err, result){
			if(err){
				connection.release();
				throw err;
			}
			connection.release();
		});
		
		user_dao.getEmployeeNumber(connection, paramId, function(err, result) {
			if(err){
				connection.release();
				throw err;
			}
			request_web.deviceloc(result, paramLatitude, paramLongitude);
		});
	});
	
	res.json({message : "위치 정보 추가 성공"});
	
};

module.exports.device_location = device_location;