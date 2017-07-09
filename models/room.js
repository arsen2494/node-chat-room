const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomShema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true,
        default: 'defaultLogo.png'
    },
    type: {
        type: String,
        required: true,
        enum: ['public', 'private']
    },
    canSee: {
        type: Boolean,
        required: true
    },
    invite_token:{
        type: String
    }
});

module.exports = mongoose.model('Room', roomShema);