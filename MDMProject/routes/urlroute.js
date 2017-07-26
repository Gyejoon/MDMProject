module.exports = function(app){
	app.get('/', function(req, res, next){
		res.render('index');
	});
	app.get('/useradd', function(req, res, next){
		res.render('useradd');
	});
	app.get('/test_send', function(req, res, next){
		res.render('test_send');
	});
};