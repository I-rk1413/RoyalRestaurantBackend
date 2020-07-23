const express=require('express');
const favouriteRouter=express.Router();
const mongoose=require('mongoose');
favouriteRouter.use(express.json());
const favourites=require('../models/favouriteSchema');
const authenticate=require('../authenticate');
const cors=require('./cors');


//Rest API for https://localhost:3444/favourites support

favouriteRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } );

favouriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    favourites.findOne({"user":req.user._id})
    .populate('user')
    .populate('dishes') 
    .then(favourite=>{
             res.statusCode=200;
             res.setHeader('Content-type','application/json');
             res.json(favourite)
        
    })
    .catch((err)=>console.log('First create your document of favourite items',err))
})

.post(cors.cors,authenticate.verifyUser,(req,res,next)=>{
      favourites.findOne({"user":req.user._id})
      .then(favourite=>{
        if(favourite!==null){
                    let favouriteList=[];
                    favouriteList=req.body.dishes;
                    favouriteList.map(id=>{
                       if(favourite.dishes.indexOf(id)===-1){
                           favourite.dishes.push(id)
                          }
        
                       })
                       favourite.save()
                       .then((favourite)=>{
                        favourites.findById(favourite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favourite)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(favourite)

                        })
                       
                       })}
            else{
                      req.body.user=req.user._id;
                      favourites.create(req.body)
                      .then((favourite)=>{
                        favourites.findById(favourite._id)
                        .populate('user')
                        .populate('dishes')
                        .then(favourite=>{
                          res.statusCode=200;
                          res.setHeader('Content-Type','application/json');
                          res.json(favourite)
                      })
                      .catch((err)=>{console.log('Error creating the new document',err)})
               
            })}
    })})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourites.findOne({"user":req.user._id})
    .then((favourite)=>{
        favourite.deleteOne({})

        .then((response)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(response)
             })
             .catch(console.log)

    })
    .catch((err)=>{console.log("error deleting the favourite dishes")})

})

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    favourites.findOne({user:req.user._id})
    .then((favourite)=>{
        if(!favourite){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({"exists":false,'Favourites':favourite})

        }
        else{
            if(favourite.dishes.indexOf(req.params.dishId)<0){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({"exists":false,'Favourites':favourite})

            }
            else{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({"exists":true,'Favourites':favourite})

            }
        }

    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    let dish=req.params.dishId;
    favourites.findOne({"user":req.user._id})
    .then(favourite=>{
        if(favourite!==null){
           
               if(favourite.dishes.indexOf(dish)===-1){
                     favourite.dishes.push(dish)
                     favourite.save()
                    .then((favourite)=>{
                        favourites.findById(favourite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favourite)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(favourite)
                            })
                    })
                    
                     .catch((err)=>{
                         console.log("Error",err)
                     })

                  }
                  else{
                      res.statusCode=200;
                      res.setHeader('Content-Type','application/json');
                      res.json("This dish is already present in your favourite document")

                  }
        }

               
    else{
              req.body.user=req.user._id;
              req.body.dishes=dish;
              favourites.create(req.body)
             .then((favourite)=>{
                  favourites.findById(favourite._id)
                  .populate('user')
                  .populate('dishes')
                  .then(favourite=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite)
                })
                })
             .catch((err)=>{console.log('Error creating the new document',err)})      
}

    })
          .catch((err)=>{console.log("Error adding the new dish",err)})
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourites.findOne({"user":req.user._id})
    .then(favourite=>{
        if(favourite!==null)
       
        {
            let index=favourite.dishes.indexOf(req.params.dishId);
           
                    if(index===-1){
                        res.statusCode=404;
                        res.setHeader('Content-Type','application/json');
                        res.json('This dish is not present in your favourite list');
                    }
                   else{
                           favourite.dishes.splice(index,1);
                           favourite.save()
                           .then((favourite)=>{
                             favourites.findById(favourite._id)
                             .populate('user')
                             .populate('dishes')
                             .then((favourite)=>{
                               res.status(200).json(favourite)
                             })
                           })
                              .catch((err)=>{
                                   console.log("Error",err)
                            })
                         }   
            }   
    
        else{
            res.statusCode=404;
            res.setHeader('Content-Type','application/json');
            res.json('Your list of favourite document is not present');

        }
 })
})

module.exports=favouriteRouter;