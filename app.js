global.strDomainName  = '<your.domain>';
global.strDomainUser  = 'VALHALLA';
global.strDomainEmail = '<your.email.addr>';
global.strCryptoKey   = '<your.crypto.key>';
global.strSeparator   = '__________';
global.comjs = require('./exports/common.js');

var intPort = 5000;

var express        = require('express');
var http           = require('http');
var https          = require('https');
var app            = express();
// var cookie         = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var db             = mongoose.connection;

var fs             = require('fs');
var options = {key:fs.readFileSync('key.pem').toString(),cert:fs.readFileSync('cert.pem').toString()};


/* open database */
db.on('error', console.error);
db.once('open', function() { console.log("Open MongoDB"); });
// mongoose.Promise = global.Promise; // global.Promise.ES6 doesn't exist using node 6.
mongoose.connect('mongodb://127.0.0.1:27017/node', {useMongoClient: true});

/* pug view engine */
app.set('view engine', 'pug');
app.set('views',       './pugs');

/* if page is large, use compress mode */
var compression = require('compression');
app.use(compression()); 

/* set for static files */
app.use(express.static('public'));
app.use('/uploadfiles', express.static('uploads'));

/* set for cookie */
var cookieParser = require('cookie-parser');
app.use(cookieParser(global.strCryptoKey));

/* method override */
// app.use(bodyParser()); // deprecated
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}));
app.use(bodyParser.json({limit:'10mb'}));
app.use(methodOverride('_method')); // method override for 'put'/'delete' method. use get-parameter. ex) ?_method=put

/* start server */
var httpServer = http.createServer(app).listen(intPort, function() {
        console.log('Express Server is running');
});

var httpsServer = https.createServer(options, app).listen(443, function(){
	console.log('Https Server is running at 443 port');
});

/* set router */
require('./routes')(app);
require('./routes/membership')(app);
require('./routes/product')(app);
require('./routes/upload')(app);
require('./routes/board')(app);
require('./routes/chat')(app, httpServer);

/* If someone is requesting a page that is not defined in the router, go to page 404.  */
app.use(function(req,res){
	console.log('404', req.protocol + '://' + req.get('host'), req.url);
	res.render('404', {page:req.url});
});

