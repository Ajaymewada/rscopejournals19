const Issue = require('../Modals/issuesModel'); // Replace with the actual path to your Issue model file
const mongoose = require('mongoose');
const AddArticle = require('../Modals/addArticleModal');

async function createIssue(req, res) {
    try {
        const { title, body, volumeuid, journalid} = req.body;
        const latestIssue = await Issue.findOne({}, {}, { sort: { IssueID: -1 } });

        let newIssueID = "ISS001";

        if (latestIssue) {
            const latestIssueID = latestIssue.IssueID;
            const latestIssueNumber = parseInt(latestIssueID.slice(3), 10);
            newIssueID = `ISS${(latestIssueNumber + 1).toString().padStart(3, '0')}`;
        }

        const newIssue = new Issue({
            title,
            body,
            IssueID: newIssueID,
            volumeuid: volumeuid,
            journalid: new mongoose.Types.ObjectId(journalid)
        });

        await newIssue.save();
        res.status(201).json(newIssue);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

async function updateIssueById(req, res) {
    try {
        const { title, body, IssueId } = req.body;

        const issue = await Issue.findByIdAndUpdate(
            IssueId,
            {
                title,
                body,
            },
            { new: true }
        );
        if (issue) {
            res.json(issue);
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

async function getAllIssues(req, res) {
    try {
        // const { IssueId } = req.body;
        const Issue = await Issue.find({});

        if (Issue) {
            res.json(Issue);
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

async function searchIssuesByTitleOrID(req, res) {
    try {
        const { searchTerm } = req.body;
        const issues = await Issue.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive title search
                { IssueID: searchTerm },
            ],
        }).populate("volumeuid", 'title');

        if (issues.length > 0) {
            res.json({
                "Issues": issues
            });
        } else {
            res.status(404).json({ error: 'No Issues found with the given search criteria' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

async function getIssuesWithPagination(req, res) {
    try {
        const page = parseInt(req.body.page) || 1; // Default to page 1 if not specified
        const limit = 5; // Default to 10 items per page if not specified

        const skip = (page - 1) * limit;

        const totalIssues = await Issue.countDocuments({});
        const Issues = await Issue.find()
            .skip(skip)
            .limit(limit)
            .populate("volumeuid", 'title');

        const totalPages = Math.ceil(totalIssues / limit);

        if (Issues.length > 0) {
            res.json({
                Issues,
                page,
                totalPages,
                totalIssues,
            });
        } else {
            res.status(200).json({ error: 'No Issues found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

async function getIssuesByVolumeId(req, res) {
    const { volumeuid } = req.body;
    if (volumeuid !== null) {
        try {
            Issue.find({
                volumeuid: mongoose.Types.ObjectId(volumeuid)
            }, (err, docs) => {
                if (err) {
                    res.status(500).json({
                        'msg': "Issues Not Found!",
                        status: false
                    })
                } else {
                    res.status(200).json({
                        'msg': "Issues Found!",
                        status: true,
                        issues: docs
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                'msg': "Issues Not Found!",
                error: error,
                status: false
            })
        }
    }
}

async function getArticlesByIssueId(req, res) {
    const { issueuid } = req.body;
    try {
        AddArticle.find({
            issueuid: mongoose.Types.ObjectId(issueuid),
            statusflag: "In-Issue"
        }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    'msg': "Articles Not Found!",
                    error: error,
                    status: false
                })
            } else {
                res.status(200).json({
                    'msg': "Articles Found!",
                    status: true,
                    articles: docs
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            'msg': "Articles Not Found!",
            error: error,
            status: false
        })
    }
}



module.exports = {
    createIssue,
    updateIssueById,
    getAllIssues,
    searchIssuesByTitleOrID,
    getIssuesWithPagination,
    getIssuesByVolumeId,
    getArticlesByIssueId
};
