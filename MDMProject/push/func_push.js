var FCM = require('fcm-push');
const config = require('../config/config');
const device_dao = require('../model/device_dao');
var request_web = require('../web/request_web');


var func_push = {};

func_push.device_push = function(database, emp, paramData){
	
	database.getConnection(function(err, connection){
		device_dao.getFcmtoken_emp(connection, emp, function(err, regIds) {
			if(err){
				throw err;
			}
			
			console.log('전송 대상 단말 수 : ' + regIds.length);
			if(regIds.length < 1){
				console.log('푸시 전송 대상 없음 : ' + regIds.length);  
	            throw err;
			}

			var fcm = new FCM(config.fcm_api_key);
					
			var type = paramData.split(":");
			
			var message = {
				to: regIds[0].Fcm_token,
				data: {
					title: type[0],
					body: type[1]
				}
			};
					
			var token = regIds[0].Fcm_token;
						
			fcm.send(message, function (err, results) {
				if (err) {
					connection.release();
					console.log(message);
					console.log(err);
		            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);

		            return;
				}				
				device_dao.getId_emp(connection, emp, function(err, resultId) {
					if(err){
						connection.release();
						throw err;
					}
					management(type[0], function(resultType){
						device_dao.PushLog(connection, resultId[0].Id, type[0], type[1]);
						device_dao.device_Management(connection, resultId[0].Id, resultType, type[1].toLowerCase());
						console.log("DB 현황 기록됨");
					});
				});
				
			});
		});
	});
};

func_push.device_push_group = function(connection, emp, Data){
	
	device_dao.getFcmtoken_emp(connection, emp, function(err, regIds) {
		if(err){
			throw err;
		}
		
		if(regIds.length < 1){
			console.log('푸시 전송 대상 없음 : ' + regIds.length);  
            return;
		}
		
		var fcm = new FCM(config.fcm_api_key);
		
		for(var i=0; i<Data.length; i++){
			(function(x){
				var type = Data[x].split(":");
				
				var message = {
					to: regIds[0].Fcm_token,
					data: {
						title: type[0],
						body: type[1]
					}
				};
				
				var token = regIds[0].Fcm_token;
				
				fcm.send(message, function (err, results) {
//					if (err) {
//						console.log(message);
//						console.log(err);
//			            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);
//
//			            return;
//					}		
					device_dao.getId_emp(connection, emp, function(err, resultId) {
						if(err){
							throw err;
						}
						management(type[0], function(resultType){
							device_dao.PushLog(connection, resultId[0].Id, type[0], type[1]);
							device_dao.device_Management(connection, resultId[0].Id, resultType, type[1].toLowerCase());
							request_web.pushonoff(emp, type[0], type[1]);
						});
					});
					
				});
			})(i);

		}
		
	});

};

func_push.device_active_push = function(database, Id, Data){
	
	database.getConnection(function(err, connection){
		device_dao.getFcmtoken_Id(connection, Id, function(err, regIds) {
			if(err){
				throw err;
			}
			
			console.log('전송 대상 단말 수 : ' + regIds.length);
			if(regIds.length < 1){
				console.log('푸시 전송 대상 없음 : ' + regIds.length);  
	            throw err;
			}

			var fcm = new FCM(config.fcm_api_key);
					
			var type = Data.split(":");
			
			var message = {
				to: regIds[0].Fcm_token,
				data: {
					title: type[0],
					body: type[1]
				}
			};
					
			var token = regIds[0].Fcm_token;
						
			fcm.send(message, function (err, results) {
				if (err) {
					console.log(message);
					console.log(err);
		            console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);

		            return;
				}
				device_dao.PushLog(connection, Id, type[0], type[1]);
			});
		});
	});

};

function management(type, callback){

	var query = "";
	
	switch(type){
	case "CW":
		query = 'Wifi';
		break;
	case "CB":
		query = 'Bluetooth';
		break;
	case "CT":
		query = 'Tethering';
		break;
	case "MC":
		query = 'Camera';
		break;
	case "MR":
		query = 'VoiceRecord';
		break;
	}
	
	return callback(query);
}

module.exports = func_push;