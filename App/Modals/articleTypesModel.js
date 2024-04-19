const mongoose = require('mongoose');

// Define the schema for the "processingcharge" collection
const articleTypesSchema = new mongoose.Schema({
    articletypes: {
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

// Create the ProcessingCharge model
const articleTypes = mongoose.model('articleTypesSchema', articleTypesSchema);

module.exports = articleTypes;
