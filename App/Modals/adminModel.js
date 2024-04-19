const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    collection: 'admin' // Set the collection name to 'admin'
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
