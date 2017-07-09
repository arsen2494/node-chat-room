/**
 * Created by arsen on 7/9/17.
 */
function attachSocketListeners(io, app) {
    io.on('connection', function(socket) {
        console.log('connected', socket.id);

        socket.on('room:join', (roomId) => {
            console.log('got room id', roomId);
            socket.join(roomId);
            // socket.set('rooms', )
            socket.__rooms = socket.__rooms || [];
            socket.__rooms.push(roomId);
            io.sockets.in(roomId).emit('room:new_user', socket.id);
        });
        socket.on('room:message', ({ roomId, message }) => {
           io.sockets.in(roomId).emit('message', message);
        });
        socket.on('disconnect', () => {
            if (socket.__rooms) {
                socket.__rooms.forEach((roomId) => {
                    socket.leave(roomId);
                    io.sockets.in(roomId).emit('room:user_disconnect', socket.id);
                });
            }
        });

    });
    app.io = io;
}

module.exports = attachSocketListeners;