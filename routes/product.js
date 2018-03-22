/* router : item management */
module.exports = function(app) {

	var loc = require('./location.js'); // load major location information
	var Products = require('../models/Products'); // load products collection model
	
	/* list */
	app.get(loc.strRouterProduct, function(req,res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			Products.find({'REG_ID':req.signedCookies.log_id}).sort({'PRICE':-1}).exec(function(err, data) {
				if (!throwError(err, req, res, data)) {
					res.render('product/productList', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm, list:data});
				}
			});
		} 
	});

	/* detail & registration form */ 
	app.get(loc.strRouterProduct + '/:prd_id', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login? 
			if (req.params.prd_id === 'registration') { // is registration parameter? go to item registration page
				res.render('product/productReg', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
			} else { // go to item detail page
				Products.findOne({_id:req.params.prd_id}, function(err, data) {
					if (!throwError(err, req, res, data)) {
						var files = data.FILES;
						res.render('product/productDetail', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm, prd_id:req.params.prd_id, n:data, flist:files});
					}
				});
			}
		} 
	});

	/* insert action */
	app.post(loc.strRouterProduct, function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res) && checkReferrer(req, res)) { // is login? is wrong approach?
			var p = new Products();
			p.PRD_NM = req.body.prd_nm;
			p.PRICE = req.body.price;
			p.REG_ID = req.signedCookies.log_id;
			p.FILES = [];
			if (req.body.file) {
				if(Array.isArray(req.body.file)) {
					for (var i=0; i<req.body.file.length; i++) {
						p.FILES.push(getFileData(req.body.file[i]));
					}
				} else {
					p.FILES.push(getFileData(req.body.file));
				}
			}
			
			p.save(function(err, d){
				if (err) { 
					console.log('/exports/productRegistProc.js', err);
					res.redirect(loc.strRouterProduct+'/registration');
					return; 
				}
				res.redirect(loc.strRouterProduct);
			});
		} 
	});

	/* update action */
	app.put(loc.strRouterProduct + '/:prd_id', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res) && checkReferrer(req, res)) { // is login? is wrong approach?
			Products.findById(req.params.prd_id, function(err, data) {
				if (!throwError(err, req, res, data)) {
					data.PRD_NM = req.body.prd_nm;
					data.PRICE = req.body.price;
					data.REG_ID = req.signedCookies.log_id;
					data.FILES = [];
					if (req.body.file) {
						if(Array.isArray(req.body.file)) {
							for (var i=0; i<req.body.file.length; i++) {
								data.FILES.push(getFileData(req.body.file[i]));
							}
						} else {
							data.FILES.push(getFileData(req.body.file));
						}
					}
					data.save(function(err) {
						if (err) { res.render('500', {page:req.url}); return; }
						res.redirect(loc.strRouterProduct);
					});
				}
			});
		} 
	});

	/* delete action */
	app.delete(loc.strRouterProduct + '/:prd_id', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			Products.remove({_id:req.params.prd_id}, function(err, data){
				if (err) { 
					res.render('500', {page:req.url}); 
					console.log(req.url, err);
					return; 
				}
				res.redirect(loc.strRouterProduct);
			});
		}
	});
	
	function checkReferrer(req, res) {
		if (req.get('referrer').indexOf(req.get('host'))<0) {
			res.redirect('/login/d');
			return false;
		}
		return true;
	}
	
	function throwError(err, req, res, data) {
		if (err) { 
			res.render('500', {page:req.url}); 
			console.log(req.url, err);
			return true; 
		}
		if (!data) { 
			res.render('204', {page:req.url}); 
			return true; 
		}
		return false;
	};
	
	function getFileData(str) {
		var v = str.split(global.strSeparator);
		return {'FILE_PATH':v[0], 'FILE_NM':v[3],'FILE_SIZE':v[2],'FILE_MIMETYPE':v[1]};		
	}
	
}; // end of index.js