const mongoose = require("mongoose");
const { Schema } = mongoose;
// Define the schema with timestamps option
const IssueSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    IssueID: String,
    volumeuid: {
      type: Schema.ObjectId,
      ref: "Volume",
      required: true,
    },
    journalid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journal",
    },
  },
  { timestamps: true }
);

// Define the model with the specified collection name
const Issue = mongoose.model("Issue", IssueSchema, "Issues");

module.exports = Issue;
