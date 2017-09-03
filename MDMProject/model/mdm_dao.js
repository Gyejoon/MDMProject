var async = require('async');
var mdm_dao = {};

mdm_dao.app_insert = function(connection, Id, name, packagename, size, version, signature, callback){
		connection.query("call application_add(?,?,?,?,?,?);",[
			Id, name, packagename, size, version, signature
		],function(err){
			if(err){
				return callback(err);
			}
		});
};

mdm_dao.app_search = function(connection, Id, packagename, callback){
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

mdm_dao.app_modulation = function(connection, Id, names, packagenames, signature){
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

mdm_dao.devicelog = function (database, Id, type, history){
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query("call device_history(?,?,?);",[
			Id, type, history
		],function(err){
			if(err){
				throw err;
			}
			console.log(Id + "의 출근 기록이 성공적으로 로깅 되었습니다.");
		});
	});
};

mdm_dao.terminal_insert = function (database, Id, type, history){
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		
		connection.query("call terminal_history(?,?,?);", [
			Id, type, history
		], function(err){
			if(err){
				throw err;
			}
		});
	});
};

mdm_dao.PushLog = function (Id, type, history, database){
	var query = "";
	var query2 = "";
	if(type === "CW"){
		query = "call wireless_history('" + Id + "', 'Wifi', '" + history +"');";
		if(history === "ON"){
			query2 = "update device_management set Wifi='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set Wifi='off' where Device_info_Id = '" + Id + "';";
		}
	}else if(type === "CB"){
		query = "call wireless_history('"+ Id +"', 'Bluetooth', '" + history +"');";
		if(history === "ON"){
			query2 = "update device_management set Bluetooth='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set Bluetooth='off' where Device_info_Id = '" + Id + "';";
		}
	}else if(type === "CT"){
		query = "call wireless_history('"+ Id +"', 'Tethering', '" + history +"');";
		if(history === "ON"){
			query2 = "update device_management set Tethering='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set Tethering='off' where Device_info_Id = '" + Id + "';";
		}
	}else if(type === "MC"){
		query = "call media_history('"+ Id +"', 'Camera', '" + history +"');";
		if(history === "ON"){
			query2 = "update device_management set Camera='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set Camera='off' where Device_info_Id = '" + Id + "';";
		}
	}else if(type === "MR"){
		query = "call media_history('"+ Id +"', 'VoiceRecord', '" + history +"');";		
		if(history === "ON"){
			query2 = "update device_management set VoiceRecord='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set VoiceRecord='off' where Device_info_Id = '" + Id + "';";
		}
	}else if(type === "MCA"){
		query = "call media_history('" + Id +"', 'Capture', '" + history +"');";
		if(history === "ON"){
			query2 = "update device_management set Capture='on' where Device_info_Id = '" + Id + "';";
		}else{
			query2 = "update device_management set Capture='off' where Device_info_Id = '" + Id + "';";
		}
	}
	
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query(query, function(err){
			if(err){
				console.log(query);
				throw err;
			}
			console.log(Id + "에 성공적으로 로깅 되었습니다.");
		});
		connection.query(query2, function(err){
			if(err){
				console.log(query);
				throw err;
			}
		});
		connection.release();
	});
};

mdm_dao.device_Management = function(database, Id, col, his){
	database.getConnection(function(err, connection){
		if(err){
			throw err;
		}
		connection.query("update device_management set " + col + "=? where Device_info_Id = ?",[
			his, Id
		],function(err){
			if(err){
				throw err;
			}
		});
	});
};

module.exports = mdm_dao;