module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index');
	});
	app.get('/useradd', function(req, res){
		res.render('useradd');
	});
	app.get('/test_send', function(req, res){
		res.render('test_send');
	});
};