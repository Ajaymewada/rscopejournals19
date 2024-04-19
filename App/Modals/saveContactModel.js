const mongoose = require('mongoose');

// Define the schema for the "aimsandscope" collection
const savecontactSchema = new mongoose.Schema({
    contactDetails: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String], // An array of strings
        required: true,
    },
    metatitle: {
        type: String,
        required: true,
    },
    journalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    }
});

// Create the AimAndScope model
const Editorialoffice = mongoose.model('Editorialoffice', savecontactSchema);

module.exports = Editorialoffice;