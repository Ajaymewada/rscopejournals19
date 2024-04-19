const mongoose = require('mongoose');

// Define the schema for the "processingcharge" collection
const whysubmitSchema = new mongoose.Schema({
    whysubmit: {
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
const whysubmit = mongoose.model('whysubmitSchema', whysubmitSchema);

module.exports = whysubmit;
