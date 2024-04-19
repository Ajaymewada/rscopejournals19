var express = require('express');
var router = express.Router();
var authMiddleware = require('../../App/middleware/auth')

router.get('/page', authMiddleware, function (req, res) {
    res.render('AddJournal');
});


module.exports = router