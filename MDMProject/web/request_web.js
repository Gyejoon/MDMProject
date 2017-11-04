var request = require('request');
var request_web = {};

var option = {
	uri : 'http://www.terrier.co19.kr/send/location',
	method : 'POST',
	headers : {
		'Content-Type' : 'application/json'
	},
	json : {
		employee_num : "",
		Latitude : "",
		Longitude : ""
	}
};

var option2 = {
	uri : 'http://192.168.0.15:8080/mdmservice/device_onoff',
	method : 'POST',
	form : {
		title : "title",
		body : ""
	}
};

request_web.deviceonoff = function(emp, body){
	option2.form.body = emp + ":";	
	option2.form.body += body;
	
	request(option2, function(err, res, body){
		if(err){
			console.log("웹서버와의 연결 실패");
			return;
		}
		console.log("Success");
	});
};

request_web.deviceloc = function(emp, lat, long){
	option.json.employee_num = emp;
	option.json.Latitude = lat;
	option.json.Longitude = long;
	
	request(option, function(err, res, body) {
		if (!err && res.statusCode === 200) {
		    console.log(res.body);
		}
	});
};

request_web.pushonoff = function(emp, type, history){
	option2.form.body = emp + ":";
	option2.form.body += type;
	option2.form.body += ":";
	option2.form.body += history;
	
	request(option2, function(err, res, body){
		if(!err && res.statuscode === 200){
			console.log(res.body);
		}
	});
};

module.exports = request_web;