const request = require('request');
const mdm_web = {};

const option = {
	uri : 'http://192.168.0.31:8080/test/test',
	method : 'POST',
	form : {
		name : "gg",
		active : "on"
	}
};

mdm_web.deviceon = function(Id){
	request(option, function(err, res, body){
		
	});
};

mdm_web.deviceoff = function(Id){
	request(option, function(err, res, body){
		
	});
};

mdm_web.deviceloc = function(Id, Latitude, Longitude){
	request(option, function(err, res, body){
		
	});
};

module.exports = mdm_web;