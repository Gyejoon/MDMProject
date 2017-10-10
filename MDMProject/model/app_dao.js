var app_dao = {};

app_dao.app_insert = function(connection, Id, name, packagename, size, version, signature, callback){
	connection.query("call application_add(?,?,?,?,?,?);",[
		Id, name, packagename, size, version, signature
	],function(err){
		if(err){
			return callback(err);
		}
		app_dao.app_history(connection, Id, "추가", name);
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

app_dao.app_modulation = function(connection, Id, name, size){
	return function(callback){
		connection.query("select size from application_info where " +
			"Device_info_Id = ? and size = ?",[
				Id, size
			], function(err, result){
				if(err){
					callback(err);
				}
				if(result[0] === undefined){ // 변조가 되었으면
					app_dao.app_history(connection, Id, "변조", name, function(err){
						if(err){
							callback(err);
						}
					});
					callback(null, {names : name});
				} else {
					callback(null, null);
			}
		});
	};
		
};

app_dao.app_update = function(connection, Id, name, packagename, size, version){
	connection.query("update application_info set size = ? , version = ? " +
			"where Device_info_Id = ? and name = ? and packagename = ?",[
				size, version, Id, name, packagename
			], function(err){
		if(err){
			throw err;
		}
	});
};

app_dao.app_delete = function(connection, Id, packagename){
	connection.query("delete from application_info where packagename = ? and " +
			"Device_info_Id = ?",[
				packagename, Id
			], function(err){
		if(err){
			throw err;
		}
	});
};

app_dao.app_history = function(connection, Id, type, history){
	connection.query("insert into application_history(Device_info_Id," +
			"type, history) values (?, ?, ?)",[
		Id, type, history
	],function(err){
		if(err){
			throw err;
		}
	});
};

app_dao.app_getName = function(connection, Id, packagename, callback){
	connection.query("select name from application_info where packagename = ? " +
			"and Device_info_Id = ?",[
				packagename, Id
			],function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, result[0]);
	});
};

app_dao.app_getUpdate = function(connection, Id, version, size, callback){
	connection.query("select name from application_info where Device_info_Id = ? " +
			"and version = ? and size = ?",[
				Id, version, size
			], function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, result[0]);
	});
};

module.exports = app_dao;