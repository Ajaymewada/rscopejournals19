const mongoose = require('mongoose');

// Define the schema for the "addjournal" collection
const addJournalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    issn: {
        type: String,
        required: true,
        unique: true, // Assuming ISSN should be unique
    },
    about: {
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
    coverbanner: {
        type: String, // You can store the cover banner image URL as a string
        required: true,
    },
});

// Create the AddJournal model
const AddJournal = mongoose.model('AddJournal', addJournalSchema);

module.exports = AddJournal;
