const Journal = require("../Modals/Journal");

const findJournalBySlug = async (req, res) => {
  const { journalslug } = req.params;
  if (journalslug && journalslug !== "") {
    let JournalDoc = await Journal.findOne({ JournalSlug: journalslug });
    if (JournalDoc && JournalDoc.isActive) {
      res.render("index", { journalDoc: JSON.stringify(JournalDoc._id) });
    } else {
      res.render("pageNotFound");
    }
  } else {
    res.render("pageNotFound");
  }
  // res.render('index');
};

const findJournalBySlugSubpage = async (req, res) => {
  const { journalslug, subpage } = req.params;
  // console.log(journalslug, subpage);
  if (journalslug && journalslug !== "") {
    let JournalDoc = await Journal.findOne({ JournalSlug: journalslug });
    if (JournalDoc && subpage && subpage === "aims-and-scope") {
      res.render("Main-AimsScope", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "editorial-board") {
      res.render("MainEditorialBoard", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "peer-review") {
      res.render("MainPeerReview", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "for-editors") {
      res.render("MainForEditors", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "why-submit") {
      res.render("MainWhySubmit", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "article-types") {
      res.render("MainArticleType", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "submissionchecklist") {
      res.render("MainSubmission", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "author-instructions") {
      res.render("MainAuthorGuide", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "article-processing-fee") {
      res.render("MainProcessingFee", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "editorial-office") {
      res.render("MainEditorialOffice", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "current-issue") {
      res.render("mainCurrentIssue", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && subpage && subpage === "all-issues") {
      res.render("MainAllIssues", {
        journalDoc: JSON.stringify(JournalDoc._id),
      });
    } else if (JournalDoc && JournalDoc.isActive) {
      res.render("index", { journalDoc: JSON.stringify(JournalDoc._id) });
    } else {
      res.render("pageNotFound");
    }
  } else {
    res.render("pageNotFound");
  }
};

module.exports = { findJournalBySlug, findJournalBySlugSubpage };
