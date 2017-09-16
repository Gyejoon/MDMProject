const user_dao = require('./user_dao');
var device_dao = {};


device_dao.locationadd = function(connection, Id, Latitude, Longitude, callback){
	connection.query("call location_history(?,?,?)", [
		Id, Latitude, Longitude
	], function(err){
		if(err){
			return callback(err);
		}
		return callback(null, "success");
	});
};

device_dao.setActive = function(connection, Id, type, history, callback){
	user_dao.getEmployeeNumber(connection, Id, function(err, result) {
		if(err){
			return callback(err);
		}
		connection.query("call user_history(?, ?, ?)", [
			result, type, history
		], function(err){
			if(err){
				return callback(err);
			}
		});
	});
};

device_dao.device_Management = function(connection, Id, col, his){
	connection.query("update device_management set " + col + "= ? where Device_info_Id = ?",[
		his, Id
	],function(err){
		if(err){
			throw err;
		}
	});
};

device_dao.terminal_insert = function (connection, Id, type, history){
	connection.query("call terminal_history(?,?,?)", [
		Id, type, history
	], function(err){
		if(err){
			throw err;
		}
	});
};

device_dao.getFcmtoken_emp = function(connection, employee_num, callback){
	connection.query("select Fcm_token from device_info where User_info_employee_num = ?",[
		employee_num
	], function(err, regIds){
		if(err){
			return callback(err);
		}
		return callback(null, regIds);
	});
};

device_dao.getFcmtoken_Id = function(connection, Id, callback){
	connection.query("select Fcm_token from device_info where Id = ?",[
		Id
	], function(err, regIds){
		if(err){
			return callback(err);
		}
		return callback(null, regIds);
	});
};

device_dao.getActive = function(connection, Id, callback){
	connection.query("select Active from device_management where Device_info_Id = ?",[
		Id
	],function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, result[0]);
	});
};

device_dao.PushLog = function (connection, Id, type, history){
	var query = "";
	
	switch(type){
	case "CW":
		query = "call control_history('" + Id + "', 'Wifi', '" + history +"')";
		break;
	case "CB":
		query = "call control_history('" + Id + "', 'Bluetooth', '" + history +"')";
		break;
	case "CT":
		query = "call control_history('" + Id + "', 'Tethering', '" + history +"')";
		break;
	case "MC":
		query = "call control_history('" + Id + "', 'MC', '" + history +"')";
		break;
	case "MR":
		query = "call control_history('" + Id + "', 'MR', '" + history +"')";
		break;
	}
	connection.query(query, function(err){
		if(err){
			throw err;
		}
		console.log(Id+"에 성공적으로 로깅되었습니다.");
	});
};

module.exports = device_dao;