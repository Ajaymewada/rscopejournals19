const mongoose = require('mongoose');

// Define the schema for the "processingcharge" collection
const peerreviewSchema = new mongoose.Schema({
    peerreview: {
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
const PeerReviewCollection = mongoose.model('PeerReviewCollection', peerreviewSchema);

module.exports = PeerReviewCollection;
