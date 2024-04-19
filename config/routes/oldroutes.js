var express = require('express');
var router = express.Router();
var adminauth = require('../../App/controllers/adminauth')
var addjournal = require('../../App/controllers/addjournal')
var addarticle = require('../../App/controllers/artcleController')
var aimsandscope = require('../../App/controllers/aimsandscope')
var editorialboard = require('../../App/controllers/editorialboard')
var instructions = require('../../App/controllers/instructions')
var processingcharge = require('../../App/controllers/processingcharge')
var whysubmit = require('../../App/controllers/whySubmitController')
var articletypes = require('../../App/controllers/articleTypesController.js')
var peerreview = require('../../App/controllers/peerreviewController.js')

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
var authMiddleware = require('../../App/middleware/auth')
const BlacklistedToken = require("../../App/Modals/blacklistedToken");
const addForAuthors = require("../../App/controllers/addForAuthors");
const addForEditors = require("../../App/controllers/addForEditors");
const addForReviewers = require("../../App/controllers/addForReviewers");
const volumeController = require("../../App/controllers/volumeController");
const IssueController = require("../../App/controllers/issuesController");
const contactUsController = require('../../App/controllers/contactUsController');
const submissionController = require('../../App/controllers/submissionController');
const JournalSlugController = require('../../App/controllers/JournalSlug.js');
// const JournalManagement = require("../../App/controllers/journalmanage")
const generateXMLfile = require('../../App/controllers/generatexmlfile.js');
//

router.get('/admin', authMiddleware, function (req, res) {
    res.render('AddJournal');
});



router.get('/article', authMiddleware, function (req, res) {
    res.render('Article');
})
router.get('/journal-management', authMiddleware, function (req, res) {
    res.render('Journal-Management');
})
router.get('/manage-article', authMiddleware, function (req, res) {
    res.render('ArticleManage');
})

router.get('/coverbanner', authMiddleware, function (req, res) {
    res.render('coverBanner');
})

router.get('/aimsscope', authMiddleware, function (req, res) {
    res.render('AimsAndScope');
})

router.get('/editorialboard', authMiddleware, function (req, res) {
    res.render('EditorialBoard', { title: 'Rscope' });
})

router.get('/instructions', authMiddleware, function (req, res) {
    res.render('Instructions');
})

router.get('/proccessing-charge', authMiddleware, function (req, res) {
    res.render('Charge');
})
// router.get('/contact-us', authMiddleware, function (req, res) {
//     res.render('contactus');
// })
router.get('/submission-checklist', authMiddleware, function (req, res) {
    res.render('submission');
})
router.get('/peerreview', authMiddleware, function (req, res) {
    res.render('PeerReview');
})
router.get('/editorialoffice', authMiddleware, function (req, res) {
    res.render('Editorialoffice');
})
router.get('/usefull-links', authMiddleware, function (req, res) {
    res.render('ForEditor');
})

router.get('/whysubmit', authMiddleware, function (req, res) {
    res.render('WhySubmit');
})

router.get('/articletypes', authMiddleware, function (req, res) {
    res.render('ArticleTypes');
})

// router.get('/aims-and-scope', function (req, res) {
//     res.render('Main-AimsScope');
// })

// router.get('/current-issue', function (req, res) {
//     res.render('mainCurrentIssue');
// })

// router.get('/all-issues', function (req, res) {
//     res.render('MainAllIssues');
// })

router.get('/articlepage', function (req, res) {
    res.render('MainArticlePage');
})

// router.get('/SubmissionChecklist', function (req, res) {
//     res.render('MainSubmission');
// })

// router.get('/editorial-board', function (req, res) {
//     res.render('MainEditorialBoard');
// })

router.get('/editors-management', authMiddleware, function (req, res) {
    res.render('EditorsManagement');
})

router.get('/create-volume', authMiddleware, function (req, res) {
    res.render('Volume');
})

router.get('/manage-issues', authMiddleware, function (req, res) {
    res.render('Issues');
})

router.get('/in-press-management', authMiddleware, function (req, res) {
    res.render('InPressView');
})

router.get('/xml-generator', function (req, res) {
    res.render('xmlgenerator');
})

// router.get('/author-guide', function (req, res) {
//     res.render('MainAuthorGuide');
// })

// router.get('/article-processing-fee', function (req, res) {
//     res.render('MainProcessingFee');
// })

router.get('/editorial-office', function (req, res) {
    res.render('MainEditorialOffice');
})


// router.get('/why-submit?', function (req, res) {
//     res.render('MainForEditors');
// })

// router.get('/for-authors', function (req, res) {
//     res.render('MainForAuthor');
// })

router.get('/for-reviewers', function (req, res) {
    res.render('MainForReviewers');
})

// LOADS ADMIN LOGIN PAGE
router.get('/authlogin', function (req, res) {
    res.render('Auth-Login');
})

// footer 

router.get('/terms-condition', function (req, res) {
    res.render('terms-condition');
})

router.get('/use-terms', function (req, res) {
    res.render('use-terms');
})

router.get('/privacy-policy', function (req, res) {
    res.render('privacy-policy');
})
router.get("/contact-us",  function (req, res) {
    res.render('Home-contact-us');
});

// footer end


// router.get('/:journalslug', JournalSlugController.findJournalBySlug);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Public/coverbannerImage/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Public/editorsImages/')
    },
    filename: function (req, file, cb) {
        const uniqueIdentifier = uuidv4();
        const filename = 'Editorial-Board-Rscope-' + uniqueIdentifier + '-' + file.originalname;
        req.uniqueIdentifier = uniqueIdentifier;
        cb(null, filename)
    }
})

const upload2 = multer({
    storage: storage2
})

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Public/artcilePDFFile/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload3 = multer({
    storage: storage3
})

router.post('/adminregister', adminauth.registerAdmin);
router.post('/adminlogin', adminauth.loginAdmin);
router.post('/addjournal', addjournal.saveJournal);
router.post('/aimsandscope', aimsandscope.saveAimAndScope);
router.get('/getaimsscopebyjournalid/:journalid', aimsandscope.findAimAndScopeByJournalId);
router.post('/addForAuthors', addForAuthors.saveOrUpdateForAuthor);
router.post('/processingcharge', processingcharge.saveProcessingCharge);
router.post('/savewhysubmit', whysubmit.savewhysubmit);
router.post('/saveArticleTypes', articletypes.saveArticleTypes);
router.post('/peerreview', peerreview.savePeerreview);


router.post('/editorialboard', upload2.single("files"), editorialboard.saveEditorialBoard);
router.post('/editorialboardupdate', editorialboard.updateEditorialBoard);
router.post('/searcheditorialboard', editorialboard.searcheditorialboard);
router.get('/geteditorialbyjournalid/:journalid', editorialboard.findEditorialByJournalId);
router.post('/instructionsforauthor', instructions.saveInstructionsForAuthor);
router.post('/uploadCoverBanner', upload.single("files"), addjournal.savecoverbanner);
router.get('/getcoverbanner', addjournal.getcoverbanner)
router.get('/getjournal', addjournal.getJournal);
// deleted related 196
router.post('/deleteEditor', editorialboard.deleteEditor);
router.get('/getaims-and-scope', aimsandscope.getAimsAndScope);
router.get('/getEditorialBoard', editorialboard.getEditorialBoard);
router.get('/getInstructionsForAuthor', instructions.getInstructionsForAuthor);
router.get('/getProcessingCharge', processingcharge.getProcessingCharge);
router.get('/getWhySubmit', whysubmit.getWhySubmit);
router.get('/getArticleTypes', articletypes.getArticleTypes);
router.get('/getpeerreview', peerreview.getPeerReview);

// Article Related Link Start
router.post('/addsaveArticle', upload3.single("files"), addarticle.saveArticle);
router.post('/addupdateArticle', addarticle.updateArticle);
router.get('/getAllArticle', addarticle.getAticles);
router.post('/getArticlesPaginationWise', addarticle.getArticlesPaginationWise);
router.post('/searchArticle', addarticle.searchArticle);
router.post('/movearticletoIssue', addarticle.movearticletoIssue);
router.get('/getInPressArticles/:journalid', addarticle.getInPressArticles);
router.get('/getAllInPressArticles', addarticle.getAllInPressArticles);
router.post("/getArticleByID", addarticle.getArticleByID);
router.post("/getArticlesByJournalID", addarticle.getArticlesByJournalID);
router.post("/updateArticleViews", addarticle.updateArticleViews);
// Article Related Link End

// For Author Editor Reviewer Links
// Author
router.post('/saveOrUpdateForAuthor', addForAuthors.saveOrUpdateForAuthor);
router.get('/getDocumentForAuthor', addForAuthors.getDocumentForAuthor);
// Editor
router.post('/saveOrUpdateFirstEditorDocument', addForEditors.saveOrUpdateFirstEditorDocument);
router.get('/getFirstEditorDocument', addForEditors.getFirstEditorDocument);
// Reviewer
router.post('/saveOrUpdateFirstReviewerDocument', addForReviewers.saveOrUpdateFirstReviewerDocument);
router.get('/getFirstReviewerDocument', addForReviewers.getFirstReviewerDocument);

// VOLUME ROUTES
router.post("/createVolume", volumeController.createVolume);
router.post("/updateVolumeById", volumeController.updateVolumeById);
router.get("/getAllVolumes", volumeController.getAllVolumes);
router.get("/getVolumesByJournal/:journalid", volumeController.getVolumesByJournal);
router.post("/getVolumesWithPagination", volumeController.getVolumesWithPagination);
router.post("/searchVolumesByTitleOrID", volumeController.searchVolumesByTitleOrID);


// ISSUE ROUTES
router.post("/createIssue", IssueController.createIssue);
router.post("/updateIssueById", IssueController.updateIssueById);
router.post("/getAllIssues", IssueController.getAllIssues);
router.post("/getIssuesWithPagination", IssueController.getIssuesWithPagination);
router.post("/searchIssuesByTitleOrID", IssueController.searchIssuesByTitleOrID);
router.post("/getIssuesByVolumeId", IssueController.getIssuesByVolumeId);
router.post("/getArticlesByIssueId", IssueController.getArticlesByIssueId);

// Contact Us Routes
router.post('/addContactInformation', contactUsController.savecontact);
router.get('/getContactInformation', contactUsController.getsavecontact);
router.get('/getEditorialOfficeByJournalId/:journalid', contactUsController.findEditorialOfficeByJournalId);
// Submission ChecList routes
router.post('/addsubmissionchecklist', submissionController.submissionCheckList);
router.get('/getSubmissionCheckList', submissionController.getsaveSubmissionCheckList);

// XML ROUTE
router.post('/generatexmlfile', generateXMLfile.createurlxmlfile); 

// Logout route
router.post('/logout', async (req, res) => {
    try {
        const { token } = req.body;

        // Clear previous blacklisted tokens
        await BlacklistedToken.deleteMany({});

        // Add the token to the blacklist
        const blacklistedToken = new BlacklistedToken({ token });
        await blacklistedToken.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/journals', function (req, res) {
    res.render('JournalsList');
});

router.get('/:journalslug/:subpage', JournalSlugController.findJournalBySlugSubpage);
router.get('/:journalslug', JournalSlugController.findJournalBySlug);

// const { MongoClient } = require('mongodb');
// let username = "ajay";
// let password = "fg1egReBjVIUfWyY";
// let dbname = "ResearchCatalyst";
// router.get('/getjournal',(req,res) => {
//     console.log("csdvcjhdsgcsdvh");

// })

module.exports = router


// aewmkdc