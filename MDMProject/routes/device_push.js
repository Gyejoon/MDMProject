var push = require('../push/func_push');
var user_dao = require('../model/user_dao');
var request_web = require('../web/request_web');

var device_push = function(req, res) {
	console.log('device 모듈 안에 있는 push 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramData = req.query.controller + ":";
	paramData += req.query.onoff;
	
    console.log('요청 파라미터 : ' + paramData);
    
    push.device_push(database, req.query.emp, paramData);
    
    request_web.pushonoff(req.query.emp, req.query.controller, req.query.onoff);
    
    var success = {
    	check : "true"
    };
    
	res.write(req.query.callback + "(" + JSON.stringify(success) + ")");
	res.end();
};

var device_push_group = function(req, res){
	console.log('device 모듈 안에 있는 push_group 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('database');
	
	var paramGroupName = req.query.group_name;
	var paramGroupOwner = req.query.group_owner;
	var paramGroupCon = req.query.group_con;
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		
		user_dao.getEmployeeNumber_Group(connection, paramGroupName, paramGroupOwner, function(err, result){
			if(err){
				connection.release();
				throw err;
			}
			for(var i=0; i<result.length; i++){
				push.device_push_group(connection, result[i].User_info_employee_num, paramGroupCon);
			}
			
		});
		connection.release();
	});
	
    var success = {
       	check : "true"
    };
        
    res.write(req.query.callback + "(" + JSON.stringify(success) + ")");
    res.end();
};

module.exports.device_push = device_push;
module.exports.device_push_group = device_push_group;