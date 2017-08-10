var app_dao = {};

app_dao.search = function(connection, Id, names, packagename){
	connection.query("select name from application_info where Device_info_Id = ?" +
			"and packagename = ?;",[
			Id, packagename
	], function(err, result){
		if(err){
			throw err;
		}
		
	});
	return 1;
};

app_dao.insert = function(connection, Id, name, packagename, size, version, signature){
	connection.query("call application_add(?,?,?,?,?,?);",[
		Id, name, packagename, size, version, signature
	],function(err){
		if(err){
			throw err;
		}
	});
};

app_dao.modulation = function(connection, Id, sizes, signature){
	connection.query("select size from application_info where " +
			"Device_info_Id = ? and signature = ?",[
		Id, signature
	], function(err, result){
		if(err){
			throw err;
		}
		
		if(result){
			return 0;
		}else{
			return 1;
		}
		
	});
};

module.exports = app_dao;