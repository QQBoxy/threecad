var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example15');
});

module.exports = router;