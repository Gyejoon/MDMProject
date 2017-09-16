const device_dao = require('../model/device_dao');

var device_location = function(req, res){
	console.log('위치정보 추가 모듈 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	const database = req.app.get('database');
	const paramId = req.body.Device_info_Id;
	const paramLatitude = req.body.Latitude;
	const paramLongitude = req.body.Longitude;
	
	database.getConnection(function(err, connection){
		device_dao.locationadd(connection, paramId, paramLatitude, paramLongitude, function(err, result){
			if(err){
				connection.release();
				throw err;
			}
			res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
			res.write(JSON.stringify("{code : '200', 'message' : '위치 정보 추가 성공'}"));
			res.end();
			connection.release();
		});
	});
	
};

module.exports.device_location = device_location;