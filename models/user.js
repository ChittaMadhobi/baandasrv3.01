const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    baandaId: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    confirmCode: {
        type: Number,
        default: 0
    },
    confirmBy: {
        type:  Date,
        default: null
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('users', userSchema);