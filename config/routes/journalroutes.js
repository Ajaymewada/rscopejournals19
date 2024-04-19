var express = require('express');
var router = express.Router();
const multer = require('multer');
var JournalController = require("../../App/controllers/Journal");

router.post('/saveJournal', JournalController.saveJournal);
router.post('/App/controllers/Journal/updateJournal', JournalController.updateJournal);
router.post('/App/controllers/Journal/updateJournalStatus', JournalController.updateJournalStatus);
router.post('/App/controllers/Journal/searchJournal', JournalController.searchJournal);
router.get('/App/controllers/Journal/getAllJournals', JournalController.getAllJournals);
router.get('/App/controllers/Journal/getAllJournalsWithOutStatus', JournalController.getAllJournalsWithOutStatus);
router.get('/App/controllers/Journal/:JournalId', JournalController.findJournalById);

module.exports = router;