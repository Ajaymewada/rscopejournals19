const mongoose = require('mongoose');

// Define the schema for the "aimsandscope" collection
const aimAndScopeSchema = new mongoose.Schema({
    aimsandscope: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
   keywords: {
        type:[String], // An array of strings
        required: true,
    },
    metatitle: {
        type: String,
        required: true,
    },
    journalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    }
});

// Create the AimAndScope model
const AimAndScope = mongoose.model('AimAndScope', aimAndScopeSchema);

module.exports = AimAndScope;
