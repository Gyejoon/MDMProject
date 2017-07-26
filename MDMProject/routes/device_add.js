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
		var query = "call device_add";
		query = query.concat("('" + paramId + "',"); query = query.concat("'" + paramUser_info_employee_num + "',");
		query = query.concat("'" + paramFcm_token + "',"); query = query.concat("'" + paramPassword + "',");
		query = query.concat("'" + paramMacAddress + "',"); query = query.concat("'" + paramOs + "',");
		query = query.concat("'" + paramManufactuer + "',"); query = query.concat("'" + paramTelnum + "');");
		
		database.getConnection(function(err, connection) {
			connection.beginTransaction(function(err){
				if(err){
					throw err;
				}
				connection.query(query, function(err){
							if(err){
								console.log(err);
								console.log(query);
								connection.rollback(function(){ // insert 실패시 insert 하지않고 rollback한다.
									console.log('rollback error');
									throw err;
								});
							}
							connection.commit(function(err){
								if(err){
									console.log(err);
									connection.rollback(function(){
										if(err){
											console.log(err);
											throw err;
										}
									});
								}
								res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
								res.write("{code : '200', 'message' : '단말 데이터 추가 성공'}");
								res.end();
							});
						});
			});
		});
	} else {
		console.log('데이터베이스 연결 실패');
	}
};


module.exports.device_add = device_add;