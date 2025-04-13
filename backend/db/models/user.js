const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
    },
    password: {
        type: String,
    },
    sex: {
        type: String,
    },
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;