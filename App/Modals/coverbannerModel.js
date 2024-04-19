const mongoose = require('mongoose');

// Define the schema for the "coverbanner" collection
const coverBannerSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

// Create the CoverBanner model
const CoverBanner = mongoose.model('CoverBanner', coverBannerSchema);

module.exports = CoverBanner;
