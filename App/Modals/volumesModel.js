const mongoose = require('mongoose');

// Define the schema with timestamps option
const volumeSchema = new mongoose.Schema({
    title: String,
    body: String,
    volumeID: String,
    journalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    }
}, { timestamps: true });

// Define the model with the specified collection name
const Volume = mongoose.model('Volume', volumeSchema, 'volumes');

module.exports = Volume;
