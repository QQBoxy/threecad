var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example23');
});

module.exports = router;