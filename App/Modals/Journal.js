const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalSchema = new Schema({
    JournalName: {
        type: String,
        required: true
    },
    MainCategory: {
        type: String,
        required: true
    },
    ISSNNumber: {
        type: String,
        required: true,
    },
    ImpactFactorValue: {
        type: Number,
        required: true
    },
    NLMCode: {
        type: String
    },
    JournalSlug: {
        type: String,
        required: true,
    },
    About: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        type: {
            title: String,
            keywords: [String],
            description: String
        }
    }
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
