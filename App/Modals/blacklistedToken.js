const mongoose = require('mongoose');

// Define the schema for the blacklisted tokens
const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the BlacklistedToken model
const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

module.exports = BlacklistedToken;
