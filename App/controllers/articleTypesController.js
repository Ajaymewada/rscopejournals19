const ArticleTypesModel  = require('../Modals/articleTypesModel'); // Adjust the path as needed

async function saveArticleTypes(req, res) {
    try {
        const articleTypesData = req.body;
        const updatedArticleTypes   = await ArticleTypesModel .findOneAndUpdate(
            {},
            articleTypesData,
            { upsert: true, new: true }
        )
        res.status(201).json({ message: 'ArticleTypes Data saved successfully', updatedArticleTypes  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the ArticleTypes Data' });
    }
}

async function getArticleTypes(req, res) {
    try {
        ArticleTypesModel.findOne({}, (err, doc) => {
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
    saveArticleTypes,
    getArticleTypes
};