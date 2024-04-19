const mongoose = require('mongoose');

// Define the schema for your third model
const forReviewerSchema = new mongoose.Schema({
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

// Create the 'forReviewerCollection' model
const forReviewerCollection = mongoose.model('forReviewerCollection', forReviewerSchema);

// Export the model for use in your application
module.exports = forReviewerCollection;
