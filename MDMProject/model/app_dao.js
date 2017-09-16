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
			callback(null, result);
	});
};

app_dao.app_modulation = function(connection, Id, names, packagenames, signature){
	return function(callback){
		connection.query("select size from application_info where " +
				"Device_info_Id = ? and signature = ?",[
					Id, signature
				], function(err, result){
					if(err){
						callback(err);
					}
					if(result[0] === undefined){ // 변조가 되었으면
						var mod = {
							name : names,
							packagename : packagenames						
						};
						callback(null, mod);
					}else { // 변조가 되지 않은 경우
						callback(null, null); 
					}
					
			});
	};
};

module.exports = app_dao;