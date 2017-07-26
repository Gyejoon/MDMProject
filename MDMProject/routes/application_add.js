var application_add = function(req, res){
	
	console.log('application_add 모듈 호출됨.');
	
	var database = req.app.get('databases');
	var paramId = req.body.Device_info_Id;
	var paramname = req.body.name;
	var parampackagename = req.body.packagename;
	var paramsize = req.body.size;
	
	if(database){
		var query = "call application_add";
		query = query.concat("('" + paramId + "',"); query = query.concat("'" + paramname + "',");
		query = query.concat("'" + parampackagename + "',"); query = query.concat("'" + paramsize + "')");
		
		database.getConnection(function(err, connection){
			connection.beginTransaction(function(err){
				if(err){
					throw err;
				}
			});
			connection.query(query, function(err){
				if(err){
					console.log(err);
					console.log(query);
					connection.rollback(function(){ // insert 실패시 insert 하지않고 rollback한다.
						console.log('rollback error');
						throw err;
					});
				}
				connection.commit(function(err){
					if(err){
						console.log(err);
						connection.rollback(function(){
							console.log(err);
							throw err;
						});
					}
					res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
					res.write("{code : '200', 'message' : '단말 데이터 추가 성공'}");
					res.end();
				});
			});
		});
	} else {
		console.log('데이터베이스 연결 실패');
	}
	
};

module.exports.application_add = application_add;