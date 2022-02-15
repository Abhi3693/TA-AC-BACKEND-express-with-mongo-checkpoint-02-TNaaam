var express = require('express');
var router = express.Router();
let Event = require("../models/Event");
let Remark = require("../models/Remark");
let Category = require("../models/Category");
const { findById } = require('../models/Event');


/* GET home page. */
router.get('/:id', (req, res, next)=> {
  let id = req.params.id
  Category.findById(id, (err, categories)=>{
    if(err) return next(err);
    let events = categories.events;
    res.render
    // events.forEach(element => {
    //   Event.findById(element, (err,event)=>{
    //     if(err) return next(err);
    //     res.render('category', {event});
    //   });
    // });
    // res.render("category", {})
    
  });
});

module.exports = router;