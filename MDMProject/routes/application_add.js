var application_add = function(req, res){
	console.log('application_add 모듈 호출됨.');
	
	var database = req.app.get('databases');
	
	if(database){
		database.getConnection(function(err, connection){
			for (var i=0; i < req.body.length; i++){
				var paramId = req.body[i].Device_info_Id;
				var paramname = req.body[i].name;
				var parampackagename = req.body[i].packagename;
				var paramsize = req.body[i].size;	
					
				connection.query("call application_add(?,?,?,?)",[
					paramId, paramname, parampackagename, paramsize
				],function(err){
					if(err){
						res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
						res.write("{code : '400', 'message' : '어플리케이션 데이터 추가 실패'}");
						res.end();
						console.log(err);
						return;
					}
				});
				res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
				res.write("{code : '200', 'message' : '어플리케이션 데이터 추가 성공'}");
				res.end();
			}
		});
	}
};
module.exports.application_add = application_add;