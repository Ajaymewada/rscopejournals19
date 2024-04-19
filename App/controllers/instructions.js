const InstructionsForAuthor = require('../Modals/intructionsModel'); // Replace with the correct path to your Mongoose model

async function saveInstructionsForAuthor(req, res) {
    try {
        const instructionsData = req.body;
        const instructions = await InstructionsForAuthor.findOneAndUpdate(
            {},
            instructionsData,
            { upsert: true, new: true }
        )
        res.status(201).json({ message: 'Instructions for author created successfully', instructions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the instructions for author' });
    }
}

async function getInstructionsForAuthor(req, res) {
    try {
        InstructionsForAuthor.findOne({}, (err, doc) => {
            if (err) {
                res.status(500).json({
                    msg: "Data not found!",
                    status: false
                })
            } else {
                res.status(200).json({
                    msg: "Data found!",
                    data: doc,
                    status: true
                })
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: "Data not found!",
            status: false
        })
    }
}

module.exports = {
    saveInstructionsForAuthor,
    getInstructionsForAuthor
};
