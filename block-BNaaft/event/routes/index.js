var express = require('express');
var router = express.Router();
let Event = require("../models/Event");
let Remark = require("../models/Remark");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
