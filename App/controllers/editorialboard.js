var mongoose = require("mongoose");
const EditorialBoard = require("../Modals/editorialboardModel"); // Replace with the correct path to your Mongoose model

async function saveEditorialBoard(req, res) {
  try {
    let editorialBoardData = req.body;
    if (editorialBoardData && editorialBoardData.keywords) {
      editorialBoardData.keywords = JSON.parse(editorialBoardData.keywords);
    }
    if (editorialBoardData && editorialBoardData.intrest) {
      editorialBoardData.intrest = JSON.parse(editorialBoardData.intrest);
    }
    if (editorialBoardData.journalid) {
      editorialBoardData.journalid = mongoose.Types.ObjectId(editorialBoardData.journalid);
    }
    if (req.file && req.uniqueIdentifier) {
      const filename = 'Editorial-Board-Rscope-' + req.uniqueIdentifier + '-' + req.file.originalname;
      editorialBoardData.image = `editorsImages/${filename}`;
    } else {
      return res
      .status(200)
      .json({
        message: "An error occurred while creating the editorial board",
      });
    }
    const editorialBoard = await new EditorialBoard(editorialBoardData);
    await editorialBoard.save();
    res
      .status(201)
      .json({
        message: "Editorial board created successfully",
        editorialBoard,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while creating the editorial board",
      });
  }
}

async function getEditorialBoard(req, res) {
  try {
    EditorialBoard.find({}, (err, doc) => {
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

async function updateEditorialBoard(req, res) {
  let querytoset = {
    name: req.body.name,
    website: req.body.website,
    affiliation: req.body.affiliation,
    biography: req.body.biography,
    designation: req.body.designation,
    intrest: req.body.intrest,
  };
  EditorialBoard.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId(req.body._id) },
    querytoset,
    (err, doc) => {
      if (err) {
        res.status(500).json({
          msg: "Failed to Update!",
          status: false,
          data: {},
        });
      } else {
        res.status(200).json({
          msg: "Updated Successfully!",
          status: true,
          data: doc,
        });
      }
    }
  );
}

async function searcheditorialboard(req, res) {
  EditorialBoard.find(
    {
      name: { $regex: new RegExp(req.body.name, "i") },
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

async function deleteEditor(req, res) {
  try {
    // const editorID = req.params.editorID;
    const { editorID } = req.body;
    const deletedEditor = await EditorialBoard.findByIdAndDelete(editorID);
    if (!deletedEditor) {
      return res.status(404).json({ message: "Editor not found" });
    }
    res
      .status(200)
      .json({ message: "Editor deleted successfully", deletedEditor });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the editor" });
  }
}

async function findEditorialByJournalId(req, res) {
  try {
    const journalId = req.params.journalid;
    const editorialboards = await EditorialBoard.find({
      journalid: new mongoose.Types.ObjectId(journalId),
    });
    if (editorialboards.length === 0) {
      return res.status(200).json({ status: false });
    }
    res.status(200).json({
      status: true,
      message: "Editorial Board Members found",
      data: editorialboards,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      error: "Error finding Editorial Board Members",
      message: error.message,
    });
  }
}

module.exports = {
  saveEditorialBoard,
  getEditorialBoard,
  updateEditorialBoard,
  searcheditorialboard,
  deleteEditor,
  findEditorialByJournalId
};