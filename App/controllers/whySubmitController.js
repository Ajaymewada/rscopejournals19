const WhySubmitModel  = require('../Modals/whySubmitModel'); // Adjust the path as needed

async function savewhysubmit(req, res) {
    try {
        const whysubmitData = req.body;
        const updatedWhySubmit  = await WhySubmitModel .findOneAndUpdate(
            {},
            whysubmitData,
            { upsert: true, new: true }
        )
        res.status(201).json({ message: 'whysubmit Data saved successfully', updatedWhySubmit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the whysubmit Data' });
    }
}

async function getWhySubmit(req, res) {
    try {
        WhySubmitModel .findOne({}, (err, doc) => {
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
    savewhysubmit,
    getWhySubmit
};