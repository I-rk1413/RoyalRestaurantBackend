const express=require('express');
const commentRouter=express.Router();
const mongoose=require('mongoose');
const Comment=require('../models/comments');
commentRouter.use(express.json());
const authenticate=require('../authenticate');
const cors=require('./cors');

commentRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
  .get(cors.cors,(req,res,next) => {
     Comment.findById(req.query)
     .populate('author')
     .then((comments)=>{
         
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(comments)

     },(err)=>next(err))
     .catch((err)=>next(err))
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
      if(req.body !== null){

        req.body.author=req.user._id;
        Comment.create(req.body)
        .then(comment=>{
            Comment.findById(comment._id)
            .populate('author')
            .then((comment)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(comment)

            })

        })
        

      }
      else{
          err =new Error('Comment not found in request body');
          err.status=404;
          return next(err)
          
      }
 
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
  })
   .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
      Comment.remove({})
      .then((response)=>{
        res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(response);
        
      })
   
      });
      
  
  
  


//Rest API for http://localhost:3000/dishes/:dishid/comments/:commentsId

commentRouter.route('/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Comment.findById(req.params.commentId)
     .populate('author')
     .then((comment)=>{
        
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(comment)
    
     },(err)=>next(err))
     .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on comments/:commentId'+ req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
 Comment.findById(req.params.commentId)
    .then((comment)=>{
if(comment!=null)
{

                    if(!comment.author.equals(req.user._id)){
                        err =new Error('Not authorized to alter someone else comment');
                        err.status=403;
                        return next(err)

                    }
                    req.body.author=req.user._id;
                    Comment.findByIdAndUpdate(req.params.commentId)
                    .then((comment)=>{
                        $set : req.body
                    },{new: true})
                   .then((comment)=>{
                     Comment.findById(comment._id)
                     .populate('author')
                     .then((comment)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(comment)
                 })
                },(err)=>next(err))
                .catch((err)=>next(err))
 }
    
       else{
         err=new Error(`Dish comment ${req.params.commentId} not found`);
         err.status=404;
         return next(err);
       }
     },(err)=>next(err))
   .catch(console.log)
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Comment.findById(req.params.commentId)
     .then((comment)=>{
        if(comment!=null) {

            if(!comment.author.equals(req.user._id)){
                err =new Error('Not authorized to alter someone else comment');
                err.status=403;
                return next(err)

            }
              Comment.findByIdAndRemove(req.params.commentId)
              .then((response)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(response)

              },(err)=>next(err))
              .catch((err)=>next(err))
       

       }
      
       else{
         err=new Error(`Dish comment ${req.params.commentId} not found`);
         err.status=404;
         return next(err);
       }
     },(err)=>next(err))
     .catch(console.log)
   

});

module.exports=commentRouter;