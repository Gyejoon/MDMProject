const async = require('async');
const app_dao = require('../model/app_dao');

var app_manage = function(req, res){
	console.log('어플 관리 API 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var mod_array = []; // 변조탐지 함수를 담는 배열(async 모듈 task)
	
	var paramId = req.body.Id;
	var paramtype = req.body.type;
	var paramhistory = req.body.history;
	var paramapp = req.body.app;
	
	if(database){
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			
			device_dao.terminal_insert(database, paramId, paramtype, paramhistory);
			
			
			for(var i=0; i<req.body.app.length; i++){
				(function(x){
					app_dao.app_search(connection, paramId, paramapp[x].packagename, function(err, result) {
						if(err){
							throw err;
						}
						if(result[0] === undefined){ // 중복이 아니면
							app_dao.app_insert(connection, paramId, paramapp[x].name, 
									paramapp[x].packagename, paramapp[x].size, 
									paramapp[x].version, paramapp[x].signature, function(err) {
								if(err){
									throw err;
								}
							});
						}else{
							// mod_array에 mdm_dao의 결과를 저장
							mod_array.push(app_dao.app_modulation(connection, paramId, paramapp[x].name,
									paramapp[x].packagename, paramapp[x].signature));
						}
					});
				})(i);
			}
			connection.release();
		});
		
		setTimeout(function(){
			async.series(mod_array, function(err, result){
				if(err){
					throw err;
				}
				var res_array = [];
				
				for(var i=0; i < result.length; i++){
					if(result[i]){ // 변조가 된 어플이 하나라도 있는 경우
						res_array.push(result[i]);
					}
				}
				if(!res_array[0]){ // 변조 결과가 존재 하지 않는 경우
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write(JSON.stringify("{code : '200', 'message' : '변조탐지 결과 없음'}"));
					res.end();
				}else {
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write(JSON.stringify("{code : '200', 'message' : " + JSON.stringify(res_array) +"}"));
					res.end();
				}
			});
		}, 1000);
	} else {
		console.log("DB 연결 실패" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	}
	
};

module.exports.app_manage = app_manage;