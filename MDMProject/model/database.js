var mysql = require('mysql');
var database = {};

database.init = function(app, config){
	const pool = mysql.createPool(config);
	
	app.set('database', pool);
};


module.exports = database;