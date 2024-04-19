const { default: mongoose } = require("mongoose");
const AimAndScope = require("../Modals/AimAndScopeModel"); // Replace with the correct path to your Mongoose model

async function saveAimAndScope(req, res) {
  try {
    const { aimsandscope, description, keywords, metatitle, journalid } =
      req.body;

    let aimAndScope = await AimAndScope.findOne({
      journalid: new mongoose.Types.ObjectId(journalid),
    });

    if (aimAndScope) {
      aimAndScope.aimsandscope = aimsandscope;
      aimAndScope.description = description;
      aimAndScope.keywords = keywords;
      aimAndScope.metatitle = metatitle;
    } else {
      aimAndScope = new AimAndScope({
        aimsandscope,
        description,
        keywords,
        metatitle,
        journalid,
      });
    }

    const savedAimAndScope = await aimAndScope.save();

    res.status(200).json({
      status: true,
      message: "Aim and Scope saved successfully",
      data: savedAimAndScope,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      error: "Error saving Aim and Scope",
      message: error.message,
    });
  }
}

async function getAimsAndScope(req, res) {
  try {
    AimAndScope.findOne({}, (err, doc) => {
      if (err) {
        res.status(500).json({
          msg: "Data not found!",
          status: false,
        });
      } else {
        res.status(200).json({
          msg: "Data found!",
          data: doc,
          status: true,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      msg: "Data not found!",
      status: false,
    });
  }
}

async function findAimAndScopeByJournalId(req, res) {
  try {
    const journalId = req.params.journalid;
    const aimAndScopes = await AimAndScope.find({
      journalid: new mongoose.Types.ObjectId(journalId),
    });
    if (aimAndScopes.length === 0) {
      return res.status(200).json({ status: false });
    }
    res.status(200).json({
      status: true,
      message: "Aim and Scope found",
      data: aimAndScopes,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      error: "Error finding Aim and Scope",
      message: error.message,
    });
  }
}

module.exports = {
  saveAimAndScope,
  getAimsAndScope,
  findAimAndScopeByJournalId,
};
