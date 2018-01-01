var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example9');
});

module.exports = router;