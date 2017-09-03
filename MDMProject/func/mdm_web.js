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

mdm_web.deviceon = function(){
	request(option, function(err, res, body){
		
	});
};

module.exports = mdm_web;