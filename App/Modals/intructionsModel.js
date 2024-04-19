const mongoose = require('mongoose');

// Define the schema for the "instructionsforauthor" collection
const instructionsForAuthorSchema = new mongoose.Schema({
    instructions: {
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
    }
});

// Create the InstructionsForAuthor model
const InstructionsForAuthor = mongoose.model('InstructionsForAuthor', instructionsForAuthorSchema);

module.exports = InstructionsForAuthor;
