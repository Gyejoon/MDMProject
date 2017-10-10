const user_dao = {};

user_dao.getEmployeeNumber = function(connection, Id, callback){
	connection.query("select User_info_employee_num from device_info where Id = ?;",[
		Id
	], function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, result[0].User_info_employee_num);
	});
};

user_dao.getEmployeeNumber_Group = function(connection, GroupName, GroupOwner, callback){
	connection.query("select employee_num as User_info_employee_num from device_group " +
			"where group_name = ? and group_owner = ?",[
				GroupName, GroupOwner
			], function(err, result){
		if(err){
			return callback(err);
		}
		return callback(null, result);
	});
	
};


module.exports = user_dao;