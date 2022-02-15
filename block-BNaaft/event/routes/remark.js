var express = require('express');
var router = express.Router();
let Event = require("../models/Event");
let Remark = require("../models/Remark");


/* GET home page. */
router.get('/:id/likes', (req, res, next)=> {
  let id = req.params.id;
  Remark.findById(id, (err,remark)=>{
    if(err) return next(err);
    Remark.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err,event)=>{
    if(err) return next(err);
      res.redirect("/events/" + remark.events);
    });
  });
});

router.get("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Remark.findById(id, (err, remark)=>{
    if(err) return next(err);
    res.render("updateRemark", {remark});
  });
});


router.post('/:id/edit', (req, res, next)=> {
  let id = req.params.id;
  Remark.findById(id, (err,remark)=>{
    if(err) return next(err);
    Remark.findByIdAndUpdate(id, req.body, (err,event)=>{
    if(err) return next(err);
      res.redirect("/events/" + remark.events);
    });
  });
});

router.get("/:id/delete", (req,res,next)=>{
  let id = req.params.id;
  Remark.findById(id, (err, remark)=>{
    if(err) return next(err);
    Remark.findByIdAndDelete(id, req.body, (err,event)=>{
      if(err) return next(err);
        res.redirect("/events/" + remark.events);
      });
  });
});

module.exports = router;
