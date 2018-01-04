var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example12');
});

module.exports = router;