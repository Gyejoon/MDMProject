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
	
	var address = parampostcode + "," + paramaddress1 + " " + paramaddress2;
	var ecnnum = paramecnnum1 + "-" + paramecnnum2 + "-" + paramecnnum3;
	
	if(database){
		var fail;
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select * from user_info where employee_num = ?;", [
				paramemployee_num
			], function(err, result){
				if(err){
					console.log(err);
					return;
				}
				fail = "join fail";
			});
			
			if(!fail){
				connection.query("call user_add(?,?,?,?,?,?,?)",[
					paramemployee_num, paramname, paramrank, paramdepartment,
					paramdateofbirth, address, ecnnum
				], function(err){
					if(err){
						console.log(err);
						return;
					}
				});
				res.redirect("/");
			}
		});
	} else {
		console.log("db 연결실패");
	}
};

module.exports.user_add = user_add;