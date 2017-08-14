var FCM = require('fcm-push');
var config = require('../config/config');
var mdm_dao = require('../model/mdm_dao');
var func = require('../func/func');

var device_push = function(req, res) {
	console.log('device 모듈 안에 있는 push_all 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
    var paramData = req.body.data || req.query.data;
	
    console.log('요청 파라미터 : ' + paramData);    
    
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var token = "";
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query('select Fcm_token from device_info;', function(err, regIds){
				if(err){
					throw err;
				}
				
				console.log('전송 대상 단말 수 : ' + regIds.length);
				if(regIds.length < 1){
					console.log('푸시 전송 대상 없음 : ' + regIds.length);
					
		            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		            res.write('<h2>푸시 전송 대상 없음</h2>');
		            res.write('<p>대상 단말을 선택하고 다시 시도하십시오.</p>');
		            res.end();
		            
		            return;
				}

				var fcm = new FCM(config.fcm_api_key);
				
				for(var i=0; i<regIds.length; i++){
					var message = {
							to: regIds[i].Fcm_token,
							notification: {
								title: "hello",
								body: paramData
							}
						};
					token = regIds[i].Fcm_token;
					
					fcm.send(message, function (err, results) {
						if (err) {
							console.log(err);
							console.log(message);
			                console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);
			                
			                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			                res.write('<h2>푸시 전송 시도 중 에러 발생</h2>');
			                res.write('<p>' + err.stack + '</p>');
			                res.end();

			                return;
			            }
					});
					// DB 로깅
					
					var type = paramData.split(":");
					
					connection.query("select Id from device_info where Fcm_token = ?;", [
						token
					], function(err, result){
						if(err){
							console.log(err);
							throw err;
						}
						mdm_dao.PushLog(result[0].Id, type[0], type[1], database);
					});
					
				}
				connection.release();
				
			});

		});

	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결  실패</h2>');
		res.end();
	}
	
};

var device_push_one = function(req, res){
	console.log('device_push_one 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
	var paramOne = req.body.people;
    var paramData = req.body.data || req.query.data;
	
    console.log('요청 사원번호 : ' + paramOne);
    console.log('요청 파라미터 : ' + paramData);
    
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var token = "";
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select Fcm_token from device_info where User_info_employee_num = ?;",[
				paramOne
			], function(err, regIds){
				if(err){
					throw err;
				}
				
				console.log('전송 대상 단말 수 : ' + regIds.length);
				if(regIds.length < 1){
					console.log('푸시 전송 대상 없음 : ' + regIds.length);
					
		            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		            res.write('<h2>푸시 전송 대상 없음</h2>');
		            res.write('<p>대상 단말을 선택하고 다시 시도하십시오.</p>');
		            res.end();
		            
		            return;
				}

				var fcm = new FCM(config.fcm_api_key);
				
				var message = {
					to: regIds[0].Fcm_token,
					data: {
						title : "Control",
						body : paramData
					}
				};
				
				token = regIds[0].Fcm_token;
					
				fcm.send(message, function (err, results) {
					if (err) {
						console.log(message);
						console.log(err);
			            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);
			               
			            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			            res.write('<h2>푸시 전송 시도 중 에러 발생</h2>');
			            res.write('<p>' + err.stack + '</p>');
			            res.end();

			            return;
			       }
					
					// DB 로깅
					
					var type = paramData.split(":");
						
					connection.query("select Id from device_info where Fcm_token = ?;", [
						token
					], function(err, result){
						if(err){
							console.log(err);
							throw err;
						}
						mdm_dao.PushLog(result[0].Id, type[0], type[1], database);
					});
				
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>푸시 메시지 전송 성공</h2>');
					res.end();
				});
				connection.release();
			});
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결  실패</h2>');
		res.end();
	}
};

module.exports.device_push = device_push;
module.exports.device_push_one = device_push_one;