module.exports = function(app, httpServer) {
	var loc = require('./location.js');

	// open io
	var io = require('socket.io').listen(httpServer);

	app.get('/chat', function(req, res){
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) {
			res.render('chatroom', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm});
		}
	});
	
	app.get('/chat/:room', function(req, res) {
		if (require('../exports/loginCheck')(loc.strRouterLogin, req, res)) {
			res.render('chat', {userid:req.signedCookies.log_id, usernm:req.signedCookies.log_nm,room:req.params.room});
		}
	});
	
	var roomClients; // clients in room
	
	io.on('connection', function(socket){
		socket.on('joinroom', function(data){ // it's called from client
			socket.join(data.room);
			socket.room = data.room;
			if (roomClients===undefined) {
				console.log('roomClients is created.');
				roomClients = [];
			}
			try {
				roomClients.push({'room':data.room,'id':socket.id,'usr':data.usr});
				socket.broadcast.to(data.room).emit('msg', {'usr':null, 'msg':data.usr+' is connected.'});
				broadcastUserList();
			} catch (e) {
				console.log(e);
			}
		});
		
		socket.on('disconnect', function() { // disconnected event
			try {
				if (socket.room!==undefined && roomClients!==undefined) {
					var usr = '';
					for (var i=0; i<roomClients.length; i++) {
						if(roomClients[i].room===socket.room && roomClients[i].id===socket.id) {
							usr = roomClients[i].usr;
							roomClients.splice(i);
							break;
						}
					}
					if (usr.length>1) {
						socket.broadcast.to(socket.room).emit('msg', {'usr':null, 'msg':usr+' is leaved.'});
						broadcastUserList();
					}
				}
			} catch (e) {
				console.log(e);
			}
		});
		
		socket.on('msg', function(message){ // it's called from client
			// console.log(message);
			io.sockets.in(message.room).emit('msg', {'usr':message.usr,'msg':message.msg});
			broadcastUserList();
		});

		socket.on('user', function(){ // it's called from client
			broadcastUserList();
		});
		
		broadcastUserList = function() { // broadcast user list to clients
			if (socket.room!==undefined && roomClients!==undefined) {
				var strClients = '';
				for (var i=0; i<roomClients.length; i++) {
					if (roomClients[i].room === socket.room) { strClients += ' | ' + roomClients[i].usr; }
				}
				io.sockets.in(socket.room).emit('user', strClients);
			}
		};
		
		
	});
};
