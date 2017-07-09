var socket = io();
const __roomId = location.pathname.split('/')[2];
var msgInput = $('#message');
var sendBtn = $('#submit_btn');
var messageList = $('#message_list');
var generateBtn = $('#generate_link');
var linkField = $('#link_field');
var onlineUsersList = $('#onlineUsersList');

generateBtn.on('click', () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    $.ajax({
        url: '/rooms/' + __roomId,
        type: 'put',
        data: {
            token: text,
            _csrf: document.cookie.split('_csrf=')[1]
        }

    });
    linkField.attr('href', location.host + "/invite_room/" + text);
    linkField.text(location.host + "/invite_room/" + text);
});

sendBtn.on('click', () => {
    const message = msgInput.val();
    if (message.trim() === '') {
        // mi hat alert
    } else {
        sendMessage(message);
    }
});
initialize();
attachMessageListener();

function initialize() {
    socket.emit('room:join', __roomId);
    socket.on('room:new_user', handleUserConnect);
    socket.on('room:user_disconnect', handleUserDisconnect);
}

function handleUserConnect(socketId) {
    onlineUsersList.append(
        '<p data-id="' + socket + '">' + socketId + '</p>'
    );
}
function handleUserDisconnect(socketId) {
    // TODO
}

function handleMessage(message) {
    messageList.append(
        '<p>' + message + '</p>'
    );
    $('#message').val('');
}
function attachMessageListener() {
    socket.on('message', handleMessage);
}


function sendMessage(message) {
    socket.emit('room:message', {roomId: __roomId, message: message});
}