const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
    sex: String,
    firstName: String,
    lastName: String,
    email: String,
    bio: String
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
