var fcm = require('node-gcm');
var config = require('../config/config');

var device_push_one = function(req, res) {
	console.log('device 모듈 안에 있는 push_one 호출됨.');
	
	var database = req.app.get('databases');
	 
    var paramData = req.body.data || req.query.data;
    var paramOne = req.body.data || req.query.data;
	
    console.log('요청 파라미터 : ' + paramData);
    console.log('요청 푸시대상 : ' + paramOne);
    
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		// 1. 모든 단말 검색
		var query = 'select Fcm_token from device_info';
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query(query, function(err, regIds){
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
				
				// node-gcm을 이용해 전송
				var message = new fcm.Message({
					priority: 'high',
					timeToLive: 3
				});
				
				message.addData('command', 'show');
				message.addData('type', 'text/plain');
				message.addData('data', paramData);

				var sender = new fcm.Sender(config.fcm_api_key);

				sender.send(message, regIds, function (err, result) {
					if (err) {
		                console.error('푸시 전송 시도 중 에러 발생 : ' + err.stack);
		                
		                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		                res.write('<h2>푸시 전송 시도 중 에러 발생</h2>');
		                res.write('<p>' + err.stack + '</p>');
		                res.end();

		                return;
		            }
					
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

module.exports.device_push_one = device_push_one;