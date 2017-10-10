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


request_web.deviceon = function(Id){
	request(option, function(err, res, body){
		if (!err && res.statusCode === 200) {
		    console.log("Success");
		}
	});
};

request_web.deviceoff = function(Id){
	request(option, function(err, res, body){
		
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

module.exports = request_web;