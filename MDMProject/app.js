//===== 모듈 불러들이기 =====//
const express = require('express')
  , http = require('http')
  , path = require('path')
  , logger = require('morgan')
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , date = require('date-utils')
  , net = require('net');
cluster.schedulingPolicy = cluster.SCHED_RR;

const config = require('./config/config');
const database = require('./model/databases');
const route_loader = require('./routes/route_loader');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');

//===== Passport 사용 =====//
const passport = require('passport');
const flash = require('connect-flash');

//===== Express 서버 객체 만들기 =====//
const app = express();

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', config.server_port);
app.set('https', config.https_port);
app.use('/public', express.static(path.join(__dirname, 'public')));

var redirectHttps = function () {
    return function (req, res, next) {
        if (!req.secure) {
            console.log('redirect secure http server');
            return res.redirect('https://' + req.host + ':3443' + req.url);
        }
        next();
    };
};

//===== body-parser, cookie-parser, express-session 사용 설정 =====//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(logger('dev'));
//app.all('*', redirectHttps());
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//===== Passport 사용 설정 =====//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//===== 라우터 미들웨어 사용 =====//
app.use(app.router);

// 라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app);

// url rotuing 함수
var urlroute = require('./routes/urlroute');
urlroute(app);

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});


//start backend with functionalities of both of API server and OAuth2 Server)
var https = require('https');
var fs = require('fs');
var debug = require('debug')('backend');

// This is just selfsigned certificate. 
// for product, you can replace this to own certificates  
var privateKey = './ssl/key.pem';
var publicCert = './ssl/public.cert';
var publicCertPassword = '12345';
var httpsConfig = {
    key: fs.readFileSync(privateKey),
    cert: fs.readFileSync(publicCert),
    passphrase: publicCertPassword
};

if(cluster.isMaster){
	console.log(`Master ${process.pid} is running`);
	
	// Fork workers.
	for (let i=0; i < numCPUs; i++){
		cluster.fork();
	}
	
	// 디바이스 정보 초기화
	database.initialize(app);
	
	cluster.on('exit', function(worker, code, signal){
		console.log(`worker ${worker.process.pid} died` + ", " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
		cluster.fork();
	});
	
} else {
	//시작된 서버 객체를 리턴받도록 합니다. 
	var server = http.createServer(app).listen(app.get('port'), function(){
		console.log('서버가 시작되었습니다. 포트 : ' + app.get('port') + ", " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
		console.log(`worker ${process.pid}`);
		
		// 데이터베이스 초기화
		// 커넥션 express에 등록
		database.init(app);
	});

	//https protocol
	var sslServer = https.createServer(httpsConfig, app).listen(app.get('https'), function(){
		console.log('Express SSL server listening on port ' + app.get('https') + ", " + new Date().toFormat("YYYY-MM-DD HH24:MI:SS"));
	});
}