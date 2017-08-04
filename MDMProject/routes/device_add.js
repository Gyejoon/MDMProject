var device_add = function(req, res){
	console.log('device 모듈 안에 있는 adddevice 호출됨.');
	
	var database = req.app.get('databases');
	var paramId = req.body.Id;
	var paramUser_info_employee_num = req.body.User_info_employee_num;
	var paramFcm_token = req.body.Fcm_token;
	var paramPassword = req.body.Password;
	var paramMacAddress = req.body.Macaddress;
	var paramOs = req.body.Os;
	var paramManufactuer = req.body.Manufacturer;
	var paramTelnum = req.body.Telnum;
	
	if(database){
		database.getConnection(function(err, connection) {
			connection.query("call device_add(?,?,?,?,?,?,?,?)",[
				paramId, paramUser_info_employee_num, paramFcm_token,
				paramPassword, paramMacAddress, paramOs, paramManufactuer,paramTelnum
			],function(err){
				if(err){
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write("{code : '400', 'message' : '단말 데이터 추가 실패'}");
					res.end();
					console.log(err);
					throw err;	
				}
				res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
				res.write("{code : '200', 'message' : '단말 데이터 추가 성공'}");
				res.end();
			});
		});
	} else {
		console.log('데이터베이스 연결 실패');
	}
};

module.exports.device_add = device_add;