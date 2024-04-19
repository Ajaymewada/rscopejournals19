const ProcessingCharge = require('../Modals/processingchargeModel'); // Adjust the path as needed

async function saveProcessingCharge(req, res) {
    try {
        const processingChargeData = req.body;
        const processingCharge = await ProcessingCharge.findOneAndUpdate(
            {},
            processingChargeData,
            { upsert: true, new: true }
        )
        res.status(201).json({ message: 'Processing charge saved successfully', processingCharge });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the processing charge' });
    }
}

async function getProcessingCharge(req, res) {
    try {
        ProcessingCharge.findOne({}, (err, doc) => {
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
    saveProcessingCharge,
    getProcessingCharge
};
