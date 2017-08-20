function socket(io) {
  // start listen with socket.io
  var userList=[];
  io.on('connection', function(socket){
	console.log('a user connected dhbdhdhhdh');	
	var userProfile=function(uid,username,status,socketId){
        this.uid=uid;
		this.username=username;
        this.status=status;
        this.socketId=socketId;
      };
    
    socket.on('broadCastMessage', function(msg){
      var data = {
        message: msg.message,
        username:msg.username,
        date: Date.now()
      };
      io.emit('recieveBroadCast', data);
    });
	
	socket.on('registerMe',function(data){        
		userList.push(new userProfile(data.userId,data.userName,'online',socket.id));
        console.log('user:'+data.username+' registered');
        
      });
		
	socket.on('privateMessage',function(msg){        
		var data = {
			message: msg.message,
			username:msg.username,
			date: Date.now(),
			sent:'undelivered'
		};
		for(var i=0;i<userList.length;i++)
        {             
              if(userList[i].userId==msg.toUserId)
              {
                console.log("in"+userList[i].socketId);
				if (io.sockets.connected[userList[i].socketId]) {
					data.userId = userList[i].uid;
					io.sockets.connected[userList[i].socketId].emit("recievePrivateMessage",data);
					console.log('private message sent successfully to TOUSER.');
					data.sent = 'delivered';
				}                       
              }
        }
		
		io.sockets.connected[socket.id].emit('ack',data);
			
        
      });
	
	
	
  });
}

module.exports = socket;
