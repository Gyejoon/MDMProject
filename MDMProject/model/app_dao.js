var app_dao = {};

app_dao.app_insert = function(connection, Id, name, packagename, size, version, signature, callback){
	connection.query("call application_add(?,?,?,?,?,?);",[
		Id, name, packagename, size, version, signature
	],function(err){
		if(err){
			return callback(err);
		}
	});
};

app_dao.app_search = function(connection, Id, packagename, callback){
	connection.query("select name from application_info where Device_info_Id = ?" +
			"and packagename = ?;",[
				Id, packagename
		], function(err, result){
			if(err){
				return callback(err);
			}
			return callback(null, result);
	});
};

app_dao.app_modulation = function(connection, Id, name, size, callback){
	connection.query("select size from application_info where " +
		"Device_info_Id = ? and size = ?",[
			Id, size
		], function(err, result){
			if(err){
				return callback(err);
			}
			if(result[0] === undefined){ // 변조가 되었으면
				app_dao.app_history(connection, Id, "변조", name);
			}
	});		
};

app_dao.app_history = function(connection, Id, type, history, callback){
	connection.query("call application_history(?,?,?)",[
		Id, type, history
	],function(err){
		if(err){
			return callback(err);
		}
	});
};

module.exports = app_dao;