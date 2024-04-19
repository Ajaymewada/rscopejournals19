const AddJournal = require('../Modals/addjournalModel');
const CoverBanner = require('../Modals/coverbannerModel');

async function getJournal(req, res) {
    try {
        AddJournal.findOne({}, (err, doc) => {
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

async function saveJournal(req, res) {
    try {
        const journalData = req.body;

        // const journal = new AddJournal(journalData);

        // await journal.save();
        // issn: journalData.issn
        journal = await AddJournal.findOneAndUpdate(
            {},
            journalData,
            { upsert: true, new: true }
        )

        res.status(200).json({ message: 'Journal created successfully', journal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the journal' });
    }
}

async function savecoverbanner(req, res) {
    coverbannerObj = {
        filename: req.file.filename,
        path: 'coverbannerImage/' + req.file.filename,
        uploadDate: Date.now()
    }
    journal = await CoverBanner.findOneAndUpdate(
        {},
        coverbannerObj,
        { upsert: true, new: true }
    )
    if (journal) {
        res.status(200).json({
            filename: req.file.originalname,
            msg: "file uploaded successfully to the firebase!",
            status: true
        })
    } else {
        res.status(500).json({
            msg: "Error in upload!",
            status: false
        })
    }
    
}

async function getcoverbanner(req, res) {
    CoverBanner.findOne({}, (err, doc) => {
        if(err) {
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
    })
}
module.exports = {
    saveJournal,
    savecoverbanner,
    getJournal,
    getcoverbanner
};
