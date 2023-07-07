const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let activeUsers = [];

io.on('connection', (socket) => {
    
    // Add user to activeUsers array
    socket.on('add-user', (newUserId) => {
        // Check if user is not added previously
        if(!activeUsers.some(user => user.userId === newUserId)) {
            activeUsers.push({
                socketId: socket.id,
                userId: newUserId
            });
    }
    // Send activeUsers array to all clients
    console.log("Users connected",activeUsers);
    io.emit('get-users', activeUsers);
    });

    socket.on('send-message', (data) => {
        const {receiverId} = data;
        const user = activeUsers.find(user => user.userId === receiverId);
        console.log("Sending from socket to : ",receiverId);
        console.log("Data : ",data);
        if(user) {
            io.to(user.socketId).emit('receive-message', data)
        }
    });

    // Send message to specific user
    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        console.log("User disconnected",activeUsers);
        io.emit('get-users', activeUsers);
    });
})