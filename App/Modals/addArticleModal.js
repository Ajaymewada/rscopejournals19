const mongoose = require('mongoose');
const {Schema} = mongoose;
// Define the schema for the "AddArticle" collection
const addArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    authorNames: {
        type: [String],
        required: true,
    },
    articlekeywords: {
        type: [String],
        required: true,
    },
    abstract: {
        type: String,
        required: true,
    },
    publisheddate: {
        type: Date,
        required: true,
    },
    citation: {
        type: String,
        required: true,
    },
    articletype: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    pdffilepath: {
        type: String,
        required: true,
    },
    statusflag: {
        type: String,
        required: true
    },
    articleID: {
        type: String,
        required: true
    },
    volumeuid: {
        type: Schema.ObjectId,
        ref: 'Volume',
    },
    issueuid: {
        type: Schema.ObjectId,
        ref: 'Issue',
    },
    views: { 
        type: Number, 
        default: 0 ,
    },
    journalid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    },
    dio: {
        type: String
    }
}, {
    timestamps: true, // This option adds createdAt and updatedAt fields
});

// Create the AddArticle model
const AddArticle = mongoose.model('AddArticle', addArticleSchema);

module.exports = AddArticle;
