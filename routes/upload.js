/* router : upload file */
module.exports = function(app) {

	/* download file */
	app.get('/upload/:f', function(req, res){
		console.log(req.params.f);
		var fp = req.params.f.split(global.strSeparator);
		var fs = require('fs');
		res.contentType(fp[1]);
		// if (fp[1].indexOf('image')>-1) fs.createReadStream('./uploads/'+fp[0]).pipe(res);
		// else 
		res.download('./uploads/'+fp[0]);
	});
	
	
	/* upload file */
	var multer = require('multer');
	var path = require('path');
	var mime = require('mime');
	var crypto = require('crypto');
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/');
		},
		filename: function (req, file, cb) {
			crypto.pseudoRandomBytes(16, function (err, raw) {
				cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname)); // req.file.originalname.splite('.')[1]); // mime.extension(file.mimetype));
			});
//			cb(null, file.originalname.split('.')[0] + '_' + Date.now() + '.' + mime.extension(file.mimetype));
		}
	});
	var upload = multer({ storage: storage });
	app.post('/upload', upload.single('upfile'), function(req, res){
		console.log('/upload', req.file.filename, req.file.size);
		// call callback-function in web page's javascript
		var out = "callbackAddedFile('" + req.file.filename + "', '" + req.file.originalname + "', '" + req.file.size + "', '"+req.file.mimetype+"');";
		res.setHeader('content-type', 'text/javascript');	
		res.write(out);
	    res.end();
	});
	
};
