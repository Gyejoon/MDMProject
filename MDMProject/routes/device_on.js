const app_dao = require('../model/app_dao');
const terminal_insert = require('../model/terminal_insert');
const DeviceLog = require('../model/DeviceLog');

// 출근 버튼 클릭시
var device_on = function(req, res){
	console.log('출근 모듈 호출됨.'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	
	var database = req.app.get('databases');
	
	var mod_result = {}; // 변조탐지 결과 json
	var mod_array = []; // 변조탐지 결과 배열
	
	var paramId = req.body.Device_info_Id;
	var paramtype = req.body.type;
	var paramhistory = req.body.history;
	
	if(database){
		// 디바이스의 출근 기록을 저장한다.
		DeviceLog(database, paramId, "출근", "사용자가 출근하였습니다.");
		// 루팅 탐지 결과를 저장한다.
		terminal_insert(database, paramId, paramtype, paramhistory);
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			
			for(var i=0; i<req.body.app.length; i++){
				var paramname = req.body.app[i].name;
				var parampackagename = req.body.app[i].packagename;
				var paramsize = req.body.app[i].size;
				var paramversion = req.body.app[i].version;
				var paramsignature = req.body.app[i].signature;
				
				// 현재 출근버튼을 요청한 디바이스의 Id와 어플명, 어플패키지명을 통하여 어플이 중복인지 아닌지 검색한다.
				// 이때, 요청받은 어플정보의 배열 수만큼 반복을 한다.
				// 예를들어, 29개의 어플정보가 있으면 29번 검색하고, insert하고, 반복한다.
				// 커넥션을 넘김으로써 DB 커넥션 상태를 유지해야 한다는 것을 알 수있다.
				
				console.log(app_dao.search(connection, paramId, paramname, parampackagename));
				if(app_dao.search(connection, paramId, paramname, parampackagename) === 0){ // 중복이아니면
					// 어플정보 하나씩 검색하여 중복이 아닐때만 삽입한다. (새로운 어플정보일시만 데이터 삽입)	
					app_dao.insert(connection, paramId, paramname, parampackagename, paramsize, paramversion, paramsignature);
				} else { // 중복이면 변조탐지 시작
					if(app_dao.modulation(connection, paramId, paramsize, paramsignature) === 1){ // 변조되었으면
						// 변조 어플 정보를 배열에 저장
						mod_result.name = paramname;
						mod_result.packagename = parampackagename;
						mod_array.push(mod_result);
					}
				}	
			}
			connection.release();
		});
		
		// 모든 일을 수행한 후 에이전트에게 응답한다.
		res.writeHead('200', {'Content-Type' : 'application/json;charset=utf8'});
		res.write("{code : '200', 'message' : " + JSON.stringify(mod_array) + "}");
		res.end();
	}else{
		console.log('DB 연결 실패'+ new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	}

};
module.exports.device_on = device_on;