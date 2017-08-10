module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index');
		console.log("/ 경로로 호출됨. " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	});
	app.get('/useradd', function(req, res){
		res.render('useradd');
		console.log("/useradd 경로로 호출됨. " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	});
	app.get('/test_send', function(req, res){
		console.log("/test_send 경로로 호출됨. " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
		
		var database = req.app.get('databases');
		
		database.getConnection(function(err, connection){
			if(err){
				throw err;
			}
			connection.query("select * from userdevice_temp;", function(err, result){
				if(err){
					throw err;
				}
				res.render('test_send', {rows : result});
				connection.release();
			});
		});
		
	});
};