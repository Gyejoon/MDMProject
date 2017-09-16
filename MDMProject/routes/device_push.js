var push = require('../push/func_push');

var device_push = function(req, res) {
	console.log('device 모듈 안에 있는 push_all 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
	var paramData = req.query.controller + ":";
	paramData += req.query.onoff;
	
    console.log('요청 파라미터 : ' + paramData);
    
    func.device_push_one(database, req.query.emp, paramData);
    
    var success = {
    	check : "true"
    };
    
	res.write(req.query.callback + "(" + JSON.stringify(success) + ")");
	res.end();
};

var device_push_one = function(req, res){
	console.log('device_push_one 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
	var paramOne = req.body.people;
    var paramData = req.body.data || req.query.data;
	
    console.log('요청 사원번호 : ' + paramOne);
    console.log('요청 파라미터 : ' + paramData);
    
    func.device_push_one(database, paramOne, paramData);
};

module.exports.device_push = device_push;
module.exports.device_push_one = device_push_one;