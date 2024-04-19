const { default: mongoose } = require("mongoose");
const Journal = require("../Modals/Journal");

// Function to save a new journal
async function saveJournal(req, res) {
  let journalData = req.body;
  try {
    const journal = new Journal(journalData);
    const savedJournal = await journal.save();
    console.log("savedJournal : ", savedJournal);
    res.status(201).json({
      message: "Journal created successfully",
      savedJournal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed To Create Journal",
    });
  }
}

function formateObject(journalData, req) {
  return new Promise((resolve, reject) => {
    try {
      if (journalData && journalData.keywords) {
        journalData.metadata = {
          title: journalData.metatitle,
          keywords: JSON.parse(journalData.keywords),
          description: journalData.description,
        };
        journalData.isActive = true;
      }
      // if (req.file) {
      //     journalData.CoverBanner = {
      //         filename: req.file.filename,
      //         path: `Journal/CoverBanner/${req.file.filename}`,
      //         uploadDate: new Date()
      //     };
      // }
      delete journalData.keywords;
      delete journalData.description;
      delete journalData.metatitle;
      resolve(journalData);
    } catch (error) {
      resolve(null);
    }
  });
}

async function findJournalById(req, res) {
  const { JournalId } = req.params;
  if (JournalId) {
    try {
      let journalDoc = await Journal.findById(JournalId);
      if (journalDoc) {
        res.status(200).json({
          status: true,
          msg: "Found Journal!",
          journal: journalDoc,
        });
      } else {
        res.status(500).json({
          status: false,
          msg: "Failed in Finding The Journal!",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Failed in Finding The Journal!",
      });
    }
  }
}

async function getAllJournals(req, res) {
  try {
    let JournalDocs = await Journal.find({
      isActive: true
    });
    if (JournalDocs) {
      res.status(200).json({
        status: true,
        msg: "data found!",
        data: JournalDocs,
      });
    } else {
      res.status(500).json({
        status: false,
        msg: "data not found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "data not found!",
      error,
    });
  }
}

async function getAllJournalsWithOutStatus(req, res) {
  try {
    let JournalDocs = await Journal.find({});
    if (JournalDocs) {
      res.status(200).json({
        status: true,
        msg: "data found!",
        data: JournalDocs,
      });
    } else {
      res.status(500).json({
        status: false,
        msg: "data not found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "data not found!",
      error,
    });
  }
}

async function updateJournal(req, res) {
  try {
    const journalId = req.body.journalId;

    const updateData = {
      MainCategory: req.body.MainCategory,
      ISSNNumber: req.body.ISSNNumber,
      ImpactFactorValue: req.body.ImpactFactorValue,
      NLMCode: req.body.NLMCode,
      About: req.body.About,
      isActive: req.body.isActive,
      metadata: req.body.metadata
    };

    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(journalId) },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Journal updated successfully",
      journal: updatedJournal,
    });
  } catch (error) {
    res.status(200).json({
      message: "An error occurred while updating the journal",
      error: error.message,
    });
  }
}

async function updateJournalStatus(req, res) {
  try {
    const journalId = req.body.journalId;

    const updateData = {
      isActive: req.body.isActive,
    };

    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(journalId) },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Journal updated successfully",
      journal: updatedJournal,
    });
  } catch (error) {
    res.status(200).json({
      message: "An error occurred while updating the journal",
      error: error.message,
    });
  }
}

async function searchJournal(req, res) {
  Journal.find(
    {
      JournalName: { $regex: new RegExp(req.body.JournalName, "i") },
    },
    (err, doc) => {
      if (err) {
        res.status(500).json({
          msg: "No Data",
          status: false,
          data: {},
        });
      } else {
        res.status(200).json({
          msg: "Data Found!",
          status: true,
          data: doc,
        });
      }
    }
  );
}

module.exports = {
  saveJournal,
  findJournalById,
  getAllJournals,
  updateJournal,
  updateJournalStatus,
  searchJournal,
  getAllJournalsWithOutStatus
};
