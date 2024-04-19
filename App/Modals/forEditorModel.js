const mongoose = require('mongoose');

// Define the schema for your second model
const forEditorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    keywords: {
        type: [String], // An array of strings
        required: true,
    },
    metatitle: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create the 'forEditorCollection' model
const forEditorCollection = mongoose.model('forEditorCollection', forEditorSchema);

// Export the model for use in your application
module.exports = forEditorCollection;
