const async = require('async');
const app_dao = require('../model/app_dao');
const device_dao = require('../model/device_dao');

var app_manage = {};

var app_manage = function(req, res){
	console.log('어플 관리 API 호출됨.' + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));

	var database = req.app.get('database');

	var mod_array = [];	

	var paramId = req.body.Id;
	var paramtype = req.body.type;
	var paramhistory = req.body.history;
	var paramapp = req.body.app;
	
	console.log("요청 디바이스 -> " + paramId);
	
	database.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		
		device_dao.terminal_insert(connection, paramId, paramtype, paramhistory);
		
		for(var i=0; i<req.body.app.length; i++){
			(function(x){
				app_dao.app_search(connection, paramId, paramapp[x].packagename, function(err, result) {
					if(err){
						throw err;
					}
					if(result[0] === undefined){ // 중복이 아니면
						app_dao.app_insert(connection, paramId, paramapp[x].name, 
								paramapp[x].packagename, paramapp[x].size, 
								paramapp[x].version, paramapp[x].signature, function(err) {
							if(err){
								throw err;
							}
						});
					}else{
						mod_array.push(app_dao.app_modulation(connection, paramId, paramapp[x].name,
								 paramapp[x].size, paramapp[x].version, paramapp[x].signature,
								 paramapp[x].packagename));
					}
				});
			})(i);
		}
		connection.release();
	});

	setTimeout(function(){
		async.series(mod_array, function(err, result){
			if(err){
				throw err;
			}
			if(!result[0]){
				res.json({message : "변조탐지 어플 없음"});
			}else {
				res.json({message : "변조탐지 어플 있음"});
			}
		});
	}, 300);
};

module.exports.app_manage = app_manage;