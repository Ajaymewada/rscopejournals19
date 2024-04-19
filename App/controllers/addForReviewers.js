const ForReviewerCollection = require('../Modals/forReviewerModel');

// Function to save or update the first document
const saveOrUpdateFirstReviewerDocument = async (req, res) => {
    try {
        // Check if there is an existing document
        const existingDocument = await ForReviewerCollection.findOne();

        if (existingDocument) {
            // Update the existing document
            existingDocument.name = req.body.name;
            existingDocument.description = req.body.description;
            existingDocument.keywords = req.body.keywords;
            existingDocument.metatitle = req.body.metatitle;
            existingDocument.timestamp = new Date();

            await existingDocument.save();
            res.json({ message: 'First document for reviewer updated successfully' });
        } else {
            // Create a new document
            const newDocument = new ForReviewerCollection({
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords,
                metatitle: req.body.metatitle,
            });

            await newDocument.save();
            res.json({ message: 'New document for reviewer created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Function to get the first document for reviewer
const getFirstReviewerDocument = async (req, res) => {
    try {
        const firstDocument = await ForReviewerCollection.findOne();
        if (firstDocument) {
            res.json(firstDocument);
        } else {
            res.json({ message: 'No document found for reviewer' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    saveOrUpdateFirstReviewerDocument,
    getFirstReviewerDocument,
};
