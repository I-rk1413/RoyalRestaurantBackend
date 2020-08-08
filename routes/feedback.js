const express=require('express');
const feedbackRouter=express.Router();
const mongoose=require('mongoose');
const Feedback=require('../models/feedback');
feedbackRouter.use(express.json());
const authenticate=require('../authenticate');
const cors=require('./cors');

feedbackRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Feedback.find({})
     .then((feedback)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(feedback)
     })
     .catch(console.log)
})
.post(cors.cors,(req, res, next) => {
      if(req.body !== null){

       Feedback.create(req.body)
        .then((feedback)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json('Feedback submitted')

            })
        .catch((err)=>{
          res.statusCode=401;
          res.setHeader('Content-type','application/json');
          res.json(err);
        })
      }
      else{
          err =new Error('Feedback Incomplete');
          err.status=401;
          res.json(err)
          
      }
 
  })

      
  
  
  





module.exports=feedbackRouter;