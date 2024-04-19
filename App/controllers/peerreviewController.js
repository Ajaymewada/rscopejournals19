const PeerReviewCollection = require('../Modals/peerreviewModel'); // Adjust the path as needed

async function savePeerreview(req, res) {
    try {
        const peerreviewData = req.body;
        const peerreviewinstance = await PeerReviewCollection.findOneAndUpdate(
            {},
            peerreviewData,
            { upsert: true, new: true }
        )
        res.status(201).json({ message: 'Processing charge saved successfully', peerreviewinstance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the processing charge' });
    }
}

async function getPeerReview(req, res) {
    try {
        PeerReviewCollection.findOne({}, (err, doc) => {
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
    savePeerreview,
    getPeerReview
};
