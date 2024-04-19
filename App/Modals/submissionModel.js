const mongoose = require('mongoose');

// Define the schema for the "aimsandscope" collection
const submissionSchema = new mongoose.Schema({
    submissionDetails: {
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

// Create the AimAndScope model
const submissioninfo = mongoose.model('submissioninfo', submissionSchema);

module.exports = submissioninfo;