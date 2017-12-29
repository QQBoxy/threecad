var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example7');
});

module.exports = router;