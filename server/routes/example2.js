var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example2');
});

module.exports = router;