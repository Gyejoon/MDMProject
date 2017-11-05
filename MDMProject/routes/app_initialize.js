const app_dao = require('../model/app_dao');

var app_initialize = function(req, res){
	console.log('앱 정보 초기화 API 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramId = req.body.Id;
	var paramapp = req.body.app;
	
	console.log("요청 디바이스 -> " + paramId);
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		
		for(var i=0; i<req.body.app.length; i++){
			(function(x){
				app_dao.app_search(connection, paramId, paramapp[x].packagename, function(err, result) {
					if(err){
						throw err;
					}
					if(result[0] === undefined){ // 중복이 아니면 추가
						app_dao.app_insert(connection, paramId, paramapp[x].name, 
								paramapp[x].packagename, paramapp[x].size, 
								paramapp[x].version, paramapp[x].signature, function(err) {
							if(err){
								throw err;
							}
						});
					}else{ // 중복이면 갱신
						app_dao.app_getUpdate(connection, paramId, paramapp[x].version, paramapp[x].size, function(err, result) {
							if(err){
								throw err;
							}
							if(result === undefined){ // 사이즈나 버전이 바뀐 경우 undefined 출력. 그런 경우에 갱신 로그 남김
								app_dao.app_history(connection, paramId, "갱신", paramapp[x].name);
								app_dao.app_update(connection, paramId, paramapp[x].name, paramapp[x].packagename, 
										paramapp[x].size, paramapp[x].version);
							}
						});
					}
				});
			})(i);
		}
		connection.release();
	});
	
	res.json({message : "앱 정보 초기화 성공"});
};

module.exports.app_initialize = app_initialize;