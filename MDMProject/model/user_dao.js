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

module.exports = user_dao;