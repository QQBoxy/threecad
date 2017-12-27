var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example5');
});

module.exports = router;