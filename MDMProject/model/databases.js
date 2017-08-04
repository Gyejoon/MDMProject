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
	
	connection.getConnection(function(err, connections) {
		connections.beginTransaction(function(err){
			if(err){
				throw err;
			}
			connections.query("update device_info set Active='off'", function(err){
						if(err){
							console.log(err);
							console.log(query);
							connections.rollback(function(){ // insert 실패시 insert 하지않고 rollback한다.
								console.log('rollback error');
								throw err;
							});
						}
						connections.commit(function(err){
							if(err){
								console.log(err);
								connections.rollback(function(err){
									if(err){
										console.log(err);
										throw err;
									}
								});
							}
						});
					});
		});
	});
	
	app.set('databases', connection);
}


module.exports.init = init;