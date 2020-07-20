var express = require('express');
var router = express.Router();
const userSchema=require('../models/user');
var router=express.Router();
const passport=require('passport');
router.use(express.json());
let authenticate=require('../authenticate');
const cors=require('./cors')

/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res)=>{res.statusCode=200})
router.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
    userSchema.findOne({firstname:req.body.name})
    .then((user)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(user);

    })
   
});
 
 router.route('/signUp')
 .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
 .post(cors.corsWithOptions,(req,res,next)=>{
    userSchema.register(new userSchema({username:req.body.username}),
    	req.body.password,(err,user)=>{
    		if(err){
    			res.statusCode=500;
    	        res.setHeader('Content-type','application/json');
    	        res.json({err: err});
    		}
    		else{
                if(req.body.firstname){
                    user.firstname=req.body.firstname;
                    user.lastname=req.body.lastname;
                    user.save((err,user)=>{
                        if(err){
                            res.statusCode=500;
                            res.setHeader('Content-type','application/json');
                            res.json({err: err});
                            return;
                        }
                        passport.authenticate('local')(req,res,()=>{
                        res.statusCode=200;
                        res.setHeader('Content-type','application/json');
                        res.json({success:true,status:'Registration successful'});
                    })
                })
    			
    		}
    		}
    	})
 })
 router.route('/login')
 .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
 .post(cors.corsWithOptions,(req,res,next)=>{
                    passport.authenticate('local',(err,user,info)=>{
                       if(err){
                           return next(err);
                       }
                       if(!user){
                        res.statusCode=401;
                        res.setHeader('Content-type','application/json');
                        res.json({success:false,status:'Login unsuccessful' ,err:info});

                       }
                       req.logIn(user,(err)=>{
                           if(err){
                            res.statusCode=401;
                            res.setHeader('Content-type','application/json');
                            res.json({success:false,status:'Login unsuccessful' ,err:"Could not logIn the user"});
                               
                           }
                           let token=authenticate.getToken({_id:req.user._id});
                           res.statusCode=200;
                           res.setHeader('Content-type','application/json');
                           res.json({success:true,status:'Login successful' ,token:token});

                       });
                    })(req,res,next);
                   
                    
 })
 router.get('/logout',(req,res,next)=>{
	if(req.session){
		req.session.destroy();
		res.clearCookie('Rahul-session');
		res.redirect('/')
	}
	else{
	    let err =new Error('You are not logged in');
        res.setHeader('WWW-Authenticate','Basic');
        err.status=403;
        return next(err)
	}
})

 router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
     console.log("Im in the route")
     if(req.user){
          let token=authenticate.getToken({_id:req.user._id});
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
          res.json({success:true,status:'You are successfully logged in'
               ,token:token});
     }
 })

 router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
      if (err)
        return next(err);
      
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT invalid!', success: false, err: info});
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT valid!', success: true, user: user});
  
      }
    }) (req, res);
  });
module.exports = router;



