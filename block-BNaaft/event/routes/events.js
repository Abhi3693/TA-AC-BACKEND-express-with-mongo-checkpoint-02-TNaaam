var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let Event = require("../models/Event");
let Remark = require("../models/Remark");
let Category = require("../models/Category");


router.get('/', (req, res, next)=> {  
  Event.find(req.query, (err, events)=>{
    if(err) return next(err);
    Category.find({}, (err, categories)=>{

      res.render("events", {events, categories});
    })
  });
});

router.get('/new', (req, res, next)=> {
  res.render("addEvent");
});

router.post('/', (req, res, next)=> {
  // 1. Create event (without category)
  // 2. Loop on category names
  //    1. Find if category is there (add event ID to category)
  //    2. Else create category(with event id)
  // 3. Update event with category ids
  Event.create(req.body, (err, event)=>{
    if(err) return next(err);

    Category.find({event_category:req.body.event_category}, (err, categories)=>{
      if(err) return next(err);

      if (!categories.length) {
        req.body.events = event._id

        Category.create(req.body, (err, createdCategory)=>{
          if(err) return next(err);

          Event.findByIdAndUpdate(event._id, {category: createdCategory._id }, (err, updatedEvent)=>{
          if(err) return next(err);
            res.redirect("/events/"+ updatedEvent._id);
          })
          // console.log(createdCategory, "created category-----");
        });
      } else {

        Category.findByIdAndUpdate(categories[0]._id, { $push: { events: event._id }}, (err, updatedCategory)=>{
          if(err) return next(err);
          // console.log(updatedCategory, "updated category=======");

          Event.findByIdAndUpdate(event._id, { category: updatedCategory._id }, (err, updatedEvent)=>{
            if(err) return next(err);
            res.redirect("/events/"+ updatedEvent._id);
          })
        } )
      }
    })
  })



  // Category.find({event_category:req.body.event_category}, (err,category)=>{
  //   if(err) return next(err);
  //   // category = await Category.findOrCreate(name)
  //   console.log(category);
  //   if (!category.length) {
  //     Category.create(req.body, (err, createdCategory)=>{
  //       if(err) return next(err);
  //       req.body.category = createdCategory._id;
  //       Event.create(req.body, (err, event)=>{
  //       if(err) return next(err);

  //         console.log(event, err, "Event ========");
  //         Category.findByIdAndUpdate(createdCategory._id, { $push: { events:event._id } }, (err, category)=>{
  //           res.redirect("/events/" + event._id);
  //         });
  //       });
  //   });
  //   } else {
  //     req.body.category = category[0]._id;
  //     Event.create(req.body, (err, event)=>{
  //       if(err) return next(err);
  //         console.log(event, err, "Event ========");
  //         Category.findByIdAndUpdate(category._id, { $push: { events: event._id} }, (err, category)=>{
  //           if(err) return next(err);
  //           res.redirect("/events/" + event._id);
  //         });
  //     });
  //   }
  // });
});

router.get('/:id', (req, res, next)=> {
  let id = req.params.id;
  Event.findById(id).populate("remarks").populate("category").exec((err, event)=>{
    if(err) return next(err);
    let start = String(event.start_date).substr(0,15);
    let end = String(event.end_date).substr(0,15);
    console.log(start,"======");
    event.start_date = start;
    event.end_date = end;
    res.render("eventDetails", { event });
  })
});

router.get("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Event.findById(id, (err, event)=>{
    if(err) return next(err);
    res.render("updateEvent", {event});
  });
});

router.post("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, event)=>{
    if(err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.get("/:id/likes", (req,res,next)=>{
  let id = req.params.id;
  Event.findByIdAndUpdate(id, {$inc: {likes:1}}, (err, event)=>{
    if(err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.get("/:id/delete", (req,res,next)=>{
  let id = req.params.id;
  Event.findByIdAndDelete(id ,(err, event)=>{
    if(err) return next(event);

      Category.findByIdAndUpdate(event.category, {$pull : {events: event._id }},{new:true} ,(err, category)=>{
        console.log(category.events.length, "=======inside category========");
        if(err) return next(event);
        if (category.events.length == 0) {
          Category.findByIdAndDelete(category._id, (err, category)=>{})
        }
      });
      Remark.deleteMany({event:id},(err, info)=>{
        res.redirect("/events");
      })
  });
});

router.post("/:id/remark", (req,res,next)=>{
  let id = req.params.id;
  req.body.events = id;
  Remark.create(req.body, (err, remark)=>{
    if(err) return next(err);

    Event.findByIdAndUpdate(id, { $push:{ remarks:remark }}, (err, event)=>{
      if (err) return next(err);
      res.redirect("/events/" + id);
    });
  });
});

module.exports = router;
