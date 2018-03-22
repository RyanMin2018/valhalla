module.exports = function(app) {
	var loc = require('./location.js'); // load major location information
	var BoardGroups = require('../models/BoardGroups');
	var Boards = require('../models/Boards');
	var intLimitSize = 10;
	
	/**
	 * 1. pages definition - REST style
	 * 
	 * - /boardgroup : category related. method 'get' for list, 'post' for registration 
	 * - /board : method 'get' for list, 'post' for registration, 'put' for update, 'delete' for delete
	 * - /board/:article : article
	 * - /board/form/:article : if ':article' is 'new', registration form. else modification form. it uses only 'get' method.
	 * - /board/:article/comment : for comment. method 'post' for registration, 'delete' for delete.
	 * 
	 * 2. parameters
	 * 
	 * - s : keyword to search
	 * - c : category
	 * - page : current page
	 * - _method : for 'method-override'
	 *  
	 */
	
	/* get categories */
	app.get('/boardgroup', function(req, res){
		BoardGroups.find({'DEL_YN':false}).sort({ORD:1}).exec(function(err,rs){
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type':'application/json'})
				throw err;
				return;
			}
			res.json(rs);
		});
	});
	
	/* add category */
	app.post('/boardgroup', function(req, res){
		var BG = new BoardGroups();
		BG.GRP_CD = req.body.grpcd;
		BG.GRP_NM = req.body.grpnm;
		BG.ORD    = req.body.ord;
		BG.save(function(err){
			if (err) {
				res.json({'result':'0'});
				throw err;
			}
			res.json({'result':'1'});
		});
	});
	
	/* list */
	app.get('/board', function(req, res){

		// search keyword
		var searchword = req.query.s;
		if (!searchword) searchword = '';
		var searchQuery = {$regex:searchword};
		var strCategory = req.query.c; // category
		var arrWhere = {'DEL_YN':false, $or:[{TITLE:searchQuery},{USER_NM:searchQuery},{CONTENT:searchQuery}]};
		if (strCategory!=null && strCategory.length>1) {
			arrWhere = {'DEL_YN':false, $and:[{GRP_CD:strCategory},{$or:[{TITLE:searchQuery},{USER_NM:searchQuery},{CONTENT:searchQuery}]}]};
		} else {
			strCategory = 0;
		}
		
		// count of posted articles
		Boards.count(arrWhere, function(err, intTotalCount){
			if (err) {
				res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
				console.log(req.url, err);
				throw err;
			}

			// page
			var page = req.query.page;
			if (page==null) { page = 1; }

			var intSkipSize = (page-1) * intLimitSize;
			var intTotalPage = Math.ceil(intTotalCount/intLimitSize);

			Boards.find(arrWhere, {'FILES':false,'COMMENTS':false,'CONTENT':false,'__v':false})
				  .sort({REG_DT:-1})
				  .skip(intSkipSize)
				  .limit(intLimitSize)
				  .exec(function(err, rs) {
				if (err) { 
					res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
					console.log(req.url, err);
					return; 
				}
				if (!rs) { 
					res.render('204', {page:req.url}); 
					return; 
				}
				res.render('board/boardList', {
						  userid:req.signedCookies.log_id
						, usernm:req.signedCookies.log_nm
						, category:strCategory
						, cnt:intTotalCount
						, total:intTotalPage
						, current:page
						, searchword:searchword
						, limit:intLimitSize
						, list:rs}
				);
			});
		});
	});
	
	
	/* article */
	app.get('/board/:article', function(req, res){
		
		// page
		var page = req.query.page;
		if (page==null) { page = 1; }
		
		// search keyword
		var searchword = req.query.s;
		if (!searchword) searchword = '';
		
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			Boards.findOne({_id:req.params.article, 'DEL_YN':false}, function(err, data){
				if (err) { 
					res.render('404', {page:req.url}); 
					console.log(req.url, err);
					return; 
				}
				if (!data || data.length===0) { 
					res.render('204', {page:req.url}); 
					return; 
				}
				if (data.USER_ID!==req.signedCookies.log_id) { // Increase the number of views. However, the article I wrote is an exception.
					data.READ_CNT++;
					data.save(function(err){ // increase read count
						if (err) { throw err; }
					});
				}
				res.render('board/boardDetail', {
						  userid:req.signedCookies.log_id
						, usernm:req.signedCookies.log_nm
						, page:page
						, searchword:searchword
						, n:data
					}
				);
			});
		}
	});
	
	app.get('/board/:article/link/:direction', function(req, res){
		
		var searchword = req.query.s;
		if (!searchword) searchword = '';
		var searchQuery = {$regex:searchword};
		
		Boards.findOne({_id:req.params.article}, function(err, data){
			if (err) { 
				return; 
			}
			var arrWhere;
			var arrDirection;
			if (req.params.direction == 'next') {
				arrWhere = {'DEL_YN':false,'GRP_CD':data.GRP_CD,REG_DT:{$lt:data.REG_DT},$or:[{'TITLE':searchQuery},{'USER_NM':searchQuery},{'CONTENT':searchQuery}]};
				arrDirection ={'REG_DT':-1};
			} else { // prev
				arrWhere = {'DEL_YN':false,'GRP_CD':data.GRP_CD,REG_DT:{$gt:data.REG_DT},$or:[{'TITLE':searchQuery},{'USER_NM':searchQuery},{'CONTENT':searchQuery}]};
				arrDirection ={'REG_DT':1};
			}
			Boards.find(arrWhere, {'FILES':false,'COMMENTS':false,'CONTENT':false,'__v':false})
			  .sort(arrDirection)
			  .limit(1)
			  .exec(function(err, rs) {
				if (err) { 
					throw err;
					return;
				}
				res.json(rs);
			});
		});
	});

	/* add form */
	app.get('/board/form/:article', function(req, res){

		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			if (req.params.article=='new') { // registration
				res.render('board/boardReg', {userid:req.signedCookies.log_id
						, usernm:req.signedCookies.log_nm
						, category:req.query.c}
				);
			} else { // modification
				Boards.findOne({_id:req.params.article, 'DEL_YN':false}, function(err, data){
					if (err) { 
						res.render('404', {page:req.url,nm:err.name,msg:err.message}); 
						console.log(req.url, err);
						return; 
					}
					if (!data || data.length===0) { 
						res.render('204', {page:req.url}); 
						return; 
					}
					res.render('board/boardMod', {
							  userid:req.signedCookies.log_id
							, usernm:req.signedCookies.log_nm
							, n:data
							, page:req.query.page
							, searchword:req.query.s
						}
					);
				});
			}
		}
	});
	
	/* add */
	app.post('/board', function(req, res) {
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			var B = new Boards();
			B.USER_ID = global.comjs.trim(req.signedCookies.log_id);
			B.USER_NM = global.comjs.trim(req.signedCookies.log_nm);
			B.GRP_CD  = global.comjs.trim(req.body.grpcd);
			B.TITLE   = global.comjs.trim(req.body.title);
			B.CONTENT = req.body.content;
			
			if (B.USER_ID.length<1 || B.USER_NM.length<1 || B.GRP_CD.length<1 || B.TITLE.length<1) {
				res.redirect('/board/form/new');
				return;
			}
			
			B.FILES   = [];
			if (req.body.file) {
				if(Array.isArray(req.body.file)) {
					for (var i=0; i<req.body.file.length; i++) {
						B.FILES.push(getFileData(req.body.file[i]));
					}
				} else {
					B.FILES.push(getFileData(req.body.file));
				}
			}
			B.FILES_CNT = B.FILES.length;
			B.COMMENTS = [];
			if (B.USER_ID) {
				B.save(function (err) {
					if (err) {
						res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
						console.log(req.url, err);
						throw err;
					}
					// increment article count
					BoardGroups.updateOne({GRP_CD:req.body.grpcd},{$inc:{ARTICLE_CNT:1}}, function(err, data){
						if (err) { throw err; }
						res.redirect('/board/?c='+req.body.grpcd);
					});
				});
			} else {
				res.render('500', {page:req.url,nm:'다시 로그인하십시오.'});
			}
		}
	});
	
	/* edit action */
	app.put('/board/:article', function(req, res){
		var strOldGrpCd = '';
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			Boards.findOne({_id:req.params.article, 'USER_ID':req.signedCookies.log_id, 'DEL_YN':false}, function(err, data){
				if (err) { 
					res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
					console.log(req.url, err);
					return; 
				}
				if (!data || data.length===0) { 
					res.render('204', {page:req.url}); 
					return; 
				}
				strOldGrpCd  = data.GRP_CD;
				data.GRP_CD  = global.comjs.trim(req.body.grpcd);
				data.TITLE   = global.comjs.trim(req.body.title);
				data.CONTENT = req.body.content;

				if (data.GRP_CD.length<1 || data.TITLE.length<1) {
					res.redirect('/board/form/'+req.params.article);
					return;
				}
				
				data.FILES   = [];
				data.EDIT_DT = Date();
				if (req.body.file) {
					if(Array.isArray(req.body.file)) {
						for (var i=0; i<req.body.file.length; i++) {
							data.FILES.push(getFileData(req.body.file[i]));
						}
					} else {
						data.FILES.push(getFileData(req.body.file));
					}
				}
				data.FILES_CNT = data.FILES.length;
				data.COMMENTS_CNT = data.COMMENTS.length;
				data.save(function(err){ // update 
					if (err) { throw err; }
					
					// increment article count
					BoardGroups.updateOne({GRP_CD:strOldGrpCd},{$inc:{ARTICLE_CNT:-1}}, function(err, data){
						if (err) { throw err; }
						BoardGroups.updateOne({GRP_CD:req.body.grpcd},{$inc:{ARTICLE_CNT:1}}, function(err, data){
							if (err) { throw err; }
							res.redirect('/board/'+req.params.article);
						});
					});
					// res.redirect('/board/?c='+req.body.grpcd);
				});
			});
		}		
	});
	
	/* delete */
	app.delete('/board/:article', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) { // is login?
			Boards.update({_id:req.params.article, 'USER_ID':req.signedCookies.log_id}, {$set:{'DEL_YN':true, 'EDIT_DT':Date()}}, function(err){
				if (err) { 
					res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
					console.log(req.url, err);
					throw err; 
				}
				BoardGroups.updateOne({GRP_CD:req.body.grpcd},{$inc:{ARTICLE_CNT:-1}}, function(err, data){
					if (err) { throw err; }
					res.redirect('/board/?c='+req.body.grpcd);
				});
			});
		}		
	});
	
	/* add comment */
	app.post('/board/:article/comment', function(req, res){
		var article = req.params.article;
		var content = global.comjs.trim(req.body.comment);
		
		if (content.length<1) {
			res.send({status:'fail'});
			return
		}
		
		Boards.findOne({_id:article, 'DEL_YN':false}, function(err, data){
			if (err) { 
				res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
				console.log(req.url, err);
				return; 
			}
			if (!data || data.length===0) { 
				res.render('204', {page:req.url}); 
				return; 
			}
			var comment = {C_USER_ID:req.signedCookies.log_id, C_USER_NM:req.signedCookies.log_nm,COMMENT:content};
			if (!data.COMMENTS || data.COMMENTS.length===0) { data.COMMENTS.push(comment); }
			else { data.COMMENTS.unshift(comment); }
			data.COMMENTS_CNT = data.COMMENTS.length;
			data.save(function(err, r){ // update 
				if (err) { throw err; }
				var result = {status:'success', bid:article, cid:r.COMMENTS[0]._id, usernm:req.signedCookies.log_nm, regdt:global.comjs.getFormatDate(r.REG_DT), comment:content};
				res.send(result);
			});
		});		
		
	});
	
	/* drop comment */
	app.delete('/board/:article/comment', function(req, res){
		var article = req.params.article;
		var commentid = req.body.commentid;
		Boards.findOne({_id:article, 'DEL_YN':false}, function(err, data){
			if (err) { 
				res.render('500', {page:req.url,nm:err.name,msg:err.message}); 
				console.log(req.url, err);
				return; 
			}
			if (!data || data.length===0) { 
				res.render('204', {page:req.url}); 
				return; 
			}
			
			if (!data.COMMENTS || data.COMMENTS.length===0) { res.send({status:'success'}); }
			else {
				var i = 0;
				for (i=0; i<data.COMMENTS.length; i++) {
					// console.log(data.COMMENTS[i]._id, commentid, data.COMMENTS[i].C_USER_ID, req.signedCookies.log_id);
					if (data.COMMENTS[i]._id.toString() === commentid && data.COMMENTS[i].C_USER_ID===req.signedCookies.log_id) {
						break;
					}
				}
				data.COMMENTS.splice(i, 1);
				data.COMMENTS_CNT = data.COMMENTS.length;
			}
			data.save(function(err){ // update 
				if (err) { throw err; }
				res.send({status:'success'});
			});
		});	
	});

	function getFileData(str) {
		var v = str.split(global.strSeparator);
		return {'FILE_PATH':v[0], 'FILE_NM':v[3],'FILE_SIZE':v[2],'FILE_MIMETYPE':v[1]};		
	}

}; // end of board.js
