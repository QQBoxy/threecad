/**************************************************
 File: example1.js
 Name: Example1
 Explain: Example1
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('example1');
});

module.exports = router;