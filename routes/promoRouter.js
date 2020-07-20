const express=require('express');
const promoRouter=express.Router();
const mongoose=require('mongoose');
const promotions=require('../models/promotions');
promoRouter.use(express.json());
const authenticate=require('../authenticate');
const cors=require('./cors');

//Rest API for http://localhost:3000/promotions support

promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
  .get(cors.cors,authenticate.verifyUser,(req,res,next) => {
     promotions.find(req.query)
     .then((promotion)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promotion)
     })
     .catch(console.log)
  })

  .post( cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   promotions.create(req.body)
   .then((promotion)=>{
     console.log("Promotion created");
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(promotion)
   })
   .catch(console.log)
  })
  .put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
   .delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
      promotions.deleteMany({})
      .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response)
      })
      .catch(console.log)
  });
  


//Rest API for http://localhost:3000/promotions/:promoId support

promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
  promotions.findById(req.params.promoId)
  .then((promotion)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(promotion)
   })
   .catch(console.log)
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
res.statusCode = 403;
res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
promotions.findByIdAndUpdate(req.params.promoId,{
  $set:req.body
},{new:true})
.then((promotion)=>{
   console.log("promotion created",promotion);
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(promotion)
 })
 .catch(console.log)
})
.delete( cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  promotions.findByIdAndDelete(req.params.promoId)
  .then((response)=>{
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(response)
    })
    .catch(console.log)

});
 

module.exports=promoRouter;