const express=require('express');
const passport=require('passport');
var localStrategy=require('passport-local').Strategy;
const userSchema=require('./models/user');
const jwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken');
const config=require('./config');
const FacebookTokenStrategy=require('passport-facebook-token');



exports.local=passport.use(new localStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

exports.getToken=function(user){
	return jwt.sign(user,config.secretkey,{expiresIn:3600});
};
let opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretkey;

exports.jwtPassport=passport.use((new jwtStrategy(opts,(jwt_payload,done)=>{
	console.log('JWT payload: ',jwt_payload);
	userSchema.findOne({_id:jwt_payload._id},(err,user)=>{
		if(err){
			return done(err,false);
		}
		else if(user){
			return done(null,user);
		}
		else{
			return done(null,false)
		}
	})
})));

exports.verifyAdmin=(req,res,next)=>{
	if(req.user.admin){
		return next();
	}
	else{
		err=new Error(`You are not an admin`);
		err.status=403;
		return next(err);
	
	}
}

exports.verifyUser=passport.authenticate('jwt',{session:false});

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        userSchema.findOne({facebookId: profile.id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {
                return done(null, user);
            }
            else {
                user = new userSchema({ username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        });
    }
));