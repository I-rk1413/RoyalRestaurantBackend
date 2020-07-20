const express=require('express');
const leaderRouter=express.Router();
const mongoose=require('mongoose');
const leaders=require('../models/leaders');
leaderRouter.use(express.json());
const authenticate=require('../authenticate');
const cors=require('./cors');

//Rest API for http://localhost:3000/leaders support

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
  .get(cors.cors,(req,res,next) => {
     leaders.find(req.query)
     .then((leader)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(leader)
     })
     .catch(console.log)
  })

  .post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
   leaders.create(req.body)
   .then((leader)=>{
     console.log("leader created");
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(leader)
   })
   .catch(console.log)  })
  .put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
   .delete( cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
      leaders.deleteMany({})
      .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response)
      })
      .catch(console.log)
  });
  


//Rest API for http://localhost:3000/leaders/:leaderId support

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
  leaders.findById(req.params.leaderId)
  .then((leader)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(leader)
   })
   .catch(console.log)
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
res.statusCode = 403;
res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
leaders.findByIdAndUpdate(req.params.leaderId,{
  $set:req.body
},{new:true})
.then((leader)=>{
   console.log("leader created",leader);
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(leader)
 })
 .catch(console.log)
})
.delete( cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  leaders.findByIdAndDelete(req.params.leaderId)
  .then((response)=>{
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(response)
    })
    .catch(console.log)

});
 

module.exports=leaderRouter;