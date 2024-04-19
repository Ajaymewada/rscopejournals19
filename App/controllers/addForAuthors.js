const ForAuthorCollection = require('../Modals/forAuthorModel');

// Function to save or update the first document
const saveOrUpdateForAuthor = async (req, res) => {
    try {
        // Check if there is an existing document
        const existingDocument = await ForAuthorCollection.findOne();

        if (existingDocument) {
            // Update the existing document
            existingDocument.name = req.body.name;
            existingDocument.description = req.body.description;
            existingDocument.keywords = req.body.keywords;
            existingDocument.metatitle = req.body.metatitle;
            existingDocument.timestamp = new Date();

            await existingDocument.save();
            res.json({ status: true, message: 'First document updated successfully' });
        } else {
            // Create a new document
            const newDocument = new ForAuthorCollection({
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords,
                metatitle: req.body.metatitle,
            });

            await newDocument.save();
            res.json({ status: true, message: 'New document created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Function to get the first document
const getDocumentForAuthor = async (req, res) => {
    try {
        const firstDocument = await ForAuthorCollection.findOne();
        if (firstDocument) {
            res.json(firstDocument);
        } else {
            res.json({ message: 'No document found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    saveOrUpdateForAuthor,
    getDocumentForAuthor,
};
