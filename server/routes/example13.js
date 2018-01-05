var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('example13');
});

module.exports = router;