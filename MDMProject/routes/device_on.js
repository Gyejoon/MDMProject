const mdm_dao = require('../model/mdm_dao');
const mdm_web = require('../func/mdm_web');
const func = require('../func/func');
const async = require('async');

// 출근 버튼 클릭시
var device_on = function(req, res){
	console.log('출근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
	var mod_array = []; // 변조탐지 함수를 담는 배열(async 모듈 task)
	
	var paramId = req.body.Id;
	var paramtype = req.body.type;
	var paramhistory = req.body.history;
	var paramapp = req.body.app;
	
	if(database){
		// 디바이스가 출근 시 카메라 차단을 한다.
		func.device_on_push(database, paramId, "MC:OFF");
		// 관리 현황 테이블에 갱신한다.
		mdm_dao.device_Management(database, paramId, "Camera", "off");
		mdm_dao.device_Management(database, paramId, "Active", "on");
		// 웹 서버에 접속 사실을 알린다.
		mdm_web.deviceon();
		// 디바이스의 출근 기록을 저장한다.
		mdm_dao.devicelog(database, paramId, "출근", "사용자가 출근하였습니다.");
		// 루팅 탐지 결과를 저장한다.
		mdm_dao.terminal_insert(database, paramId, paramtype, paramhistory);
		
		// mobile application management
		database.getConnection(function(err, connection){
			for(var i=0; i<req.body.app.length; i++){
				(function(x){
					mdm_dao.app_search(connection, paramId, paramapp[x].packagename, function(err, result) {
						if(err){
							throw err;
						}
						if(result[0] === undefined){ // 중복이 아니면
							mdm_dao.app_insert(connection, paramId, paramapp[x].name, 
									paramapp[x].packagename, paramapp[x].size, 
									paramapp[x].version, paramapp[x].signature, function(err) {
								if(err){
									throw err;
								}
							});
						}else{
							// mod_array에 mdm_dao의 결과를 저장
							mod_array.push(mdm_dao.app_modulation(connection, paramId, paramapp[x].name,
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
					res.write("{code : '200', 'message' : '변조탐지 결과 없음'}");
					res.end();
				}else {
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write("{code : '200', 'message' : "+ JSON.stringify(res_array) +"}");
					res.end();
				}
			});
		}, 500);
	} else {
		console.log("DB 연결 실패" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	}
	
};

module.exports.device_on = device_on;