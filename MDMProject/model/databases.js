var mysql = require('mysql');

var connection = mysql.createPool({
	connectionLimit: 10,
	host: '192.168.0.13',
	user: 'root',
	database: 'terriordb',
	password: 'kit2017'
});

function init(app){
	console.log('mysql 커넥션 생성.');
	app.set('databases', connection);
}


module.exports.init = init;