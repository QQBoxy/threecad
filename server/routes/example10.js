var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example10');
});

module.exports = router;