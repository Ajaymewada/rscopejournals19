// const Editorialoffice = require("../Modals/saveContactModel"); // Replace with the correct path to your Mongoose model
// const mongoose = require('mongoose');
// async function savecontact(req, res) {
//   try {
//     // console.log(req.body);
//     // const savecontactData = req.body;
//     let existingContact = await Editorialoffice.findOne();

//     if (existingContact) {
//       existingContact.contactDetails = req.body.name;
//       existingContact.description = req.body.description;
//       existingContact.keywords = req.body.keywords;
//       existingContact.metatitle = req.body.metatitle;
//       await existingContact.save();
//       res.json({ message: 'Editiorial Office Details Updated Successfully' });
//     } else {
//       const newDocument = new Editorialoffice({
//         contactDetails: req.body.name,
//         description: req.body.description,
//         keywords: req.body.keywords,
//         metatitle: req.body.metatitle,
//         journalid: new mongoose.Types.ObjectId(req.body.journalid)
//       });
//       await newDocument.save();
//       res.json({ message: 'Editiorial Office Details Created Successfully' });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while creating the Editiorial Office" });
//   }
// }

// async function getsavecontact(req, res) {
//   try {
//     Editorialoffice.findOne({}, (err, doc) => {
//       if (err) {
//         res.status(500).json({
//           msg: "Data not found!",
//           status: false,
//         });
//       } else {
//         res.status(200).json({
//           msg: "Data found!",
//           data: doc,
//           status: true,
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "Data not found!",
//       status: false,
//     });
//   }
// }

// async function findEditorialOfficeByJournalId(req, res) {
//   try {
//     const journalId = req.params.journalid;
//     const editorialoffices = await Editorialoffice.find({
//       journalid: new mongoose.Types.ObjectId(journalId),
//     });
//     if (editorialoffices.length === 0) {
//       return res.status(200).json({ status: false });
//     }
//     res.status(200).json({
//       status: true,
//       message: "Data found!",
//       data: editorialoffices,
//     });
//   } catch (error) {
//     res.status(200).json({
//       status: false,
//       error: "Error finding the data..!",
//       message: error.message,
//     });
//   }
// }

// module.exports = {
//   savecontact,
//   getsavecontact,
//   findEditorialOfficeByJournalId
// };



const Editorialoffice = require("../Modals/saveContactModel"); // Replace with the correct path to your Mongoose model
const mongoose = require('mongoose');
async function savecontact(req, res) {
  try {
    const { name, description, keywords, metatitle, journalid } =
      req.body;
    let editorialoffice = await Editorialoffice.findOne({
      journalid: new mongoose.Types.ObjectId(journalid),
    });

    if (editorialoffice) {
      editorialoffice.contactDetails = name;
      editorialoffice.description = description;
      editorialoffice.keywords = keywords;
      editorialoffice.metatitle = metatitle;
    } else {
      editorialoffice = new Editorialoffice({
        contactDetails: name,
        description,
        keywords,
        metatitle,
        journalid: new mongoose.Types.ObjectId(req.body.journalid),
      });
    }

    const savedEditorialoffice = await editorialoffice.save();

    res.status(200).json({
      status: true,
      message: "Editorial Office saved successfully",
      data: savedEditorialoffice,
    });

    // if (existingContact) {
    //   existingContact.contactDetails = req.body.name;
    //   existingContact.description = req.body.description;
    //   existingContact.keywords = req.body.keywords;
    //   existingContact.metatitle = req.body.metatitle;
    //   await existingContact.save();
    //   res.json({ message: 'Editiorial Office Details Updated Successfully' });
    // } else {
    //   const newDocument = new Editorialoffice({
    //     contactDetails: req.body.name,
    //     description: req.body.description,
    //     keywords: req.body.keywords,
    //     metatitle: req.body.metatitle,
    //     journalid: new mongoose.Types.ObjectId(req.body.journalid)
    //   });
    //   await newDocument.save();
    //   res.json({ message: 'Editiorial Office Details Created Successfully' });
    // }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the Editiorial Office" });
  }
}

async function getsavecontact(req, res) {
  try {
    Editorialoffice.findOne({}, (err, doc) => {
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

async function findEditorialOfficeByJournalId(req, res) {
  try {
    const journalId = req.params.journalid;
    const editorialoffices = await Editorialoffice.find({
      journalid: new mongoose.Types.ObjectId(journalId),
    });
    if (editorialoffices.length === 0) {
      return res.status(200).json({ status: false });
    }
    res.status(200).json({
      status: true,
      message: "Data found!",
      data: editorialoffices,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      error: "Error finding the data..!",
      message: error.message,
    });
  }
}

module.exports = {
  savecontact,
  getsavecontact,
  findEditorialOfficeByJournalId
};

