const express=require('express');
const dishRouter=express.Router();
const mongoose=require('mongoose');
const dishes=require('../models/dishes');
dishRouter.use(express.json());
const authenticate=require('../authenticate');
const cors=require('./cors');
//Rest API for http://localhost:3000/dishes support

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
  .get(cors.cors,(req,res,next) => {
     dishes.find(req.query)
     .populate('comments.author')
     .then((dish)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(dish)
     })
     .catch(console.log)
  })

  .post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   dishes.create(req.body)
   .then((dish)=>{
     console.log("Dish created");
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(dish)
   })
   .catch(console.log)
  })
  .put( cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
   .delete( cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
      dishes.deleteMany({})
      .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response)
      })
      .catch(console.log)
  });
  
  


//Rest API for http://localhost:3000/dishes/:dishid support

dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(dish)
     })
     .catch(console.log)
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  dishes.findByIdAndUpdate(req.params.dishId,{
    $set:req.body
  },{new:true})
  .then((dish)=>{
     console.log("Dish created",dish);
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(dish)
   })
   .catch(console.log)
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    dishes.findByIdAndDelete(req.params.dishId)
    .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response)
      })
      .catch(console.log)

});


//Making the rest API for comments 


module.exports=dishRouter;