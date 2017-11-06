var request = require('request');
var request_web = {};

var option = {
	uri : 'http://192.168.0.8:8181/send/location',
	method : 'POST',
	headers : {
		'Content-Type' : 'x-www-form-urlencoded'
	},
	form : {
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

var option3 = {
	uri : 'http://192.168.0.15:8080/mdmservice/controller_onoff',
	method : 'POST',
	form : {
		body : ""
	}	
};

// 사용자 웹서버에 실시간으로 위치 전송
request_web.deviceloc = function(emp, lat, long){
	option.form.employee_num = emp;
	option.form.Latitude = lat;
	option.form.Longitude = long;
	
	request(option, function(err, res, body) {
		if(err){
			console.log("사용자 웹서버와의 연결 실패");
		}
		console.log(body);
	});
};

// 관리자 웹서버에 실시간으로 출퇴근 정보 전송
request_web.deviceonoff = function(emp, body){
	option2.form.body = emp + ":";	
	option2.form.body += body;
	
	request(option2, function(err, res, body){
		if(err){
			console.log("관리자 웹서버와의 연결 실패");
			return;
		}
		console.log("관리자 웹에 출퇴근 정보 전송");
	});
};

// 관리자 웹서버에 실시간으로 푸시 정보 전송
request_web.pushonoff = function(emp, type, history){
	option3.form.body = emp + ":";
	option3.form.body += type;
	option3.form.body += ":";
	option3.form.body += history;
	
	request(option3, function(err, res, body){
		if(err){
			console.log("관리자 웹서버와의 연결 실패");
			return;
		}
		console.log("관리자 웹에 푸시 정보 전송");
	});
};

module.exports = request_web;