var user_add = function(req, res){
	console.log('useradd 모듈 호출됨.');
	
	var database = req.app.get('databases');
	var paramemployee_num = req.body.employee_num;
	var paramname = req.body.Name;
	var paramrank = req.body.Rank;
	var paramdepartment = req.body.Department;
	var paramdateofbirth = req.body.Date_of_birth;
	var parampostcode = req.body.postcode;
	var paramaddress1 = req.body.address1;
	var paramaddress2 = req.body.address2;
	var paramecnnum1 = req.body.Ecn_num1;
	var paramecnnum2 = req.body.Ecn_num2;
	var paramecnnum3 = req.body.Ecn_num3;
	
	if(database){
		var query = "call user_add";
		query = query.concat("('" + paramemployee_num + "',");
		query = query.concat("'" + paramname + "',"); query = query.concat("'" + paramrank + "',");
		query = query.concat("'" + paramdepartment + "',"); query = query.concat("'" + paramdateofbirth + "',");
		var address = parampostcode + "," + paramaddress1 + " " + paramaddress2;
		var ecnnum = paramecnnum1 + "-" + paramecnnum2 + "-" + paramecnnum3;
		query = query.concat("'" + address + "',"); query = query.concat("'" + ecnnum + "');");
			
		database.getConnection(function(err, connection) {
			connection.beginTransaction(function(err){
				if(err){
					throw err;
				}
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
										if(err){
											console.log(err);
											throw err;
										}
									});
								}
								res.redirect('/');
							});
						});
			});
		});
	} else {
		console.log("db 연결실패");
	}
};

module.exports.user_add = user_add;