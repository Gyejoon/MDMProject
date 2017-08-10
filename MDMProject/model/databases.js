var mysql = require('mysql');

var connection = mysql.createPool({
	connectionLimit: 500,
	host: '192.168.0.13',
	user: 'root',
	database: 'terriordb',
	password: 'kit2017'
});

function init(app){
	console.log('mysql 초기화 시작');
	
	app.set('databases', connection);
}

function initialize(app){
	connection.getConnection(function(err, connections){
		if(err) {
			throw err;
		}
		// 모든 디바이스의 Id 값 추출
		connections.query("select Id from device_info;", function(err, result){
			if(err){
				throw err;
			}
			// 서버 재부팅을 했을 시에 모든 디바이스는 퇴근상태가 된다.
			// 반복으로 쿼리문을 보내서 기록을 저장한다.
			for(var i=0; i<result.length;i++){
				connections.query("call device_history(?,?,?);", [
					result[i].Id, "퇴근", "서버 재부팅으로 인한 퇴근처리"
				], function(err){
					if(err){
						throw err;
					}
				});
			}
		});
	});
}


module.exports.init = init;
module.exports.initialize = initialize;