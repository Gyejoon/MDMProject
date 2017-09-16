const async = require('async');
const app_dao = require('../model/app_dao');
const device_dao = require('../model/device_dao');

var app_manage = function(req, res){
	console.log('어플 관리 API 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramId = req.body.Id;
	var paramtype = req.body.type;
	var paramhistory = req.body.history;
	var paramapp = req.body.app;
	
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		
		device_dao.terminal_insert(connection, paramId, paramtype, paramhistory);
		
		for(var i=0; i<req.body.app.length; i++){
			(function(x){
				app_dao.app_search(connection, paramId, paramapp[x].packagename, function(err, result) {
					if(err){
						connection.release();
						throw err;
					}
					if(result[0] === undefined){ // 중복이 아니면
						app_dao.app_insert(connection, paramId, paramapp[x].name, 
								paramapp[x].packagename, paramapp[x].size, 
								paramapp[x].version, paramapp[x].signature, function(err) {
							if(err){
								connection.release();
								throw err;
							}
						});
					}else{
						app_dao.app_modulation(connection, paramId, paramapp[x].name,
								 paramapp[x].size, function(err){
							if(err){
								connection.release();
								throw err;
							}
						});
					}
				});
			})(i);
		}
		connection.release();
	});
	
	res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
	res.write(JSON.stringify("{code : '200', 'message' : '앱 관리 모듈 성공적으로 호출'}"));
	res.end();
};

module.exports.app_manage = app_manage;