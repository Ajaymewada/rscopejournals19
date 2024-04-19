const mongoose = require('mongoose');

// Define the schema for the "editorialboard" collection
const editorialBoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // You can store the image URL as a string
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    intrest: {
        type: [String],
        required: true,
    },
    affiliation: {
        type: String,
        required: true,
    },
    biography: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String], // An array of strings
        required: true,
    },
    journalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    }
});

// Create the EditorialBoard model
const EditorialBoard = mongoose.model('EditorialBoard', editorialBoardSchema);

module.exports = EditorialBoard;
