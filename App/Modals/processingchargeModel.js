const mongoose = require('mongoose');

// Define the schema for the "processingcharge" collection
const processingChargeSchema = new mongoose.Schema({
    processingcharge: {
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
const ProcessingCharge = mongoose.model('ProcessingCharge', processingChargeSchema);

module.exports = ProcessingCharge;
