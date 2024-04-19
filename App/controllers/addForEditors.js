const ForEditorCollection = require('../Modals/forEditorModel');

// Function to save or update the first document
const saveOrUpdateFirstEditorDocument = async (req, res) => {
    try {
        // Check if there is an existing document
        const existingDocument = await ForEditorCollection.findOne();

        if (existingDocument) {
            // Update the existing document
            existingDocument.name = req.body.name;
            existingDocument.description = req.body.description;
            existingDocument.keywords = req.body.keywords;
            existingDocument.metatitle = req.body.metatitle;
            existingDocument.timestamp = new Date();

            await existingDocument.save();
            res.json({ message: 'First document for editor updated successfully' });
        } else {
            // Create a new document
            const newDocument = new ForEditorCollection({
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords,
                metatitle: req.body.metatitle,
            });

            await newDocument.save();
            res.json({ message: 'New document for editor created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Function to get the first document for editor
const getFirstEditorDocument = async (req, res) => {
    try {
        const firstDocument = await ForEditorCollection.findOne();
        if (firstDocument) {
            res.json(firstDocument);
        } else {
            res.json({ message: 'No document found for editor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    saveOrUpdateFirstEditorDocument,
    getFirstEditorDocument,
};
