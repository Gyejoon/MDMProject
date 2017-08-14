var FCM = require('fcm-push');
var config = require('../config/config');
var mdm_dao = require('../model/mdm_dao');

var func = {};

func.device_push_all = function(database, paramData){
	
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
							console.log(message);
			                console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);
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
		console.log('데이터베이스 연결 실패');
	}
};

func.device_push_one = function(database, One, Data){
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var token = "";
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select Fcm_token from device_info where User_info_employee_num = ?;",[
				One
			], function(err, regIds){
				if(err){
					throw err;
				}
				
				console.log('전송 대상 단말 수 : ' + regIds.length);
				if(regIds.length < 1){
					console.log('푸시 전송 대상 없음 : ' + regIds.length);  
		            return;
				}

				var fcm = new FCM(config.fcm_api_key);
				
				var message = {
					to: regIds[0].Fcm_token,
					notification: {
						title: "hello",
						body: Data
					}
				};
				
				token = regIds[0].Fcm_token;
					
				fcm.send(message, function (err, results) {
					if (err) {
						console.log(message);
						console.log(err);
			            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);

			            return;
			       }
					
					// DB 로깅
					
					var type = Data.split(":");
						
					connection.query("select Id from device_info where Fcm_token = ?;", [
						token
					], function(err, result){
						if(err){
							console.log(err);
							throw err;
						}
						mdm_dao.PushLog(result[0].Id, type[0], type[1], database);
					});
					connection.release();
				});
				

			});
		});
	} else {
		console.log('DB 연결 실패');
	}
};

func.device_on_push = function(database, Id, Data){
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var token = "";
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select Fcm_token from device_info where Id = ?;",[
				Id
			], function(err, regIds){
				if(err){
					throw err;
				}
				console.log('전송 대상 단말 수 : ' + regIds.length);
				if(regIds.length < 1){
					console.log('푸시 전송 대상 없음 : ' + regIds.length);  
		            return;
				}

				var fcm = new FCM(config.fcm_api_key);
				
				var message = {
					to: regIds[0].Fcm_token,
					notification: {
						title: "hello",
						body: Data
					}
				};
				
				token = regIds[0].Fcm_token;
					
				fcm.send(message, function (err, results) {
					if (err) {
						console.log(message);
						console.log(err);
			            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);

			            return;
			       }
					
					// DB 로깅
					
					var type = Data.split(":");
						
					connection.query("select Id from device_info where Fcm_token = ?;", [
						token
					], function(err, result){
						if(err){
							console.log(err);
							throw err;
						}
						mdm_dao.PushLog(result[0].Id, type[0], type[1], database);
					});
				});
			});
			connection.release();
		});
	} else {
		console.log('DB 연결 실패');
	}
};

func.device_off_push = function(database, Id, Data){
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var token = "";
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select Fcm_token from device_info where Id = ?;",[
				Id
			], function(err, regIds){
				if(err){
					throw err;
				}
				
				console.log(regIds);
				
				console.log('전송 대상 단말 수 : ' + regIds.length);
				if(regIds.length < 1){
					console.log('푸시 전송 대상 없음 : ' + regIds.length);  
		            return;
				}

				var fcm = new FCM(config.fcm_api_key);
				
				var message = {
					to: regIds[0].Fcm_token,
					notification: {
						title: "hello",
						body: Data
					}
				};
				
				token = regIds[0].Fcm_token;
					
				fcm.send(message, function (err, results) {
					if (err) {
						console.log(message);
						console.log(err);
			            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);

			            return;
			       }
					
					// DB 로깅
					
					var type = Data.split(":");
						
					connection.query("select Id from device_info where Fcm_token = ?;", [
						token
					], function(err, result){
						if(err){
							console.log(err);
							throw err;
						}
						mdm_dao.PushLog(result[0].Id, type[0], type[1], database);
					});
				});
			});
			connection.release();
		});
	} else {
		console.log('DB 연결 실패');
	}
};

module.exports = func;