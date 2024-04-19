const submissioninfo = require("../Modals/submissionModel");

async function submissionCheckList(req, res) {
  console.log(req.body);
  try {
    const existingSubmission = await submissioninfo.findOne(); // Example: Update based on ID

    if (existingSubmission) {
      existingSubmission.submissionDetails = req.body.submissionDetails;
      existingSubmission.description = req.body.description;
      existingSubmission.keywords = req.body.keywords;
      existingSubmission.metatitle = req.body.metatitle;
      await existingSubmission.save();
      res.json({ message: 'Submission CheckList Updated Successfully' });
    } else {
      const newDocument = new submissioninfo({
        submissionDetails: req.body.submissionDetails,
        description: req.body.description,
        keywords: req.body.keywords,
        metatitle: req.body.metatitle,
      });
      await newDocument.save();
      res.json({ message: 'New Submission CheckList Created Successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating/updating the submission CheckList" });
  }
}

async function getsaveSubmissionCheckList(req, res) {
  try {
    const doc = await submissioninfo.findOne(); // Example: Find based on ID

    if (!doc) {
      return res.status(404).json({ msg: "Data not found", status: false });
    }

    res.status(200).json({ msg: "Data found", data: doc, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while retrieving the submission CheckList", status: false });
  }
}

module.exports = {
  submissionCheckList,
  getsaveSubmissionCheckList,
};
