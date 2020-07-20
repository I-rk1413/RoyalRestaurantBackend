const mongoose=require('mongoose');
const schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


let userSchema=new schema({
	firstname:{
		type:String,
		default:''
	},
	lastname:{
        type:String,
		default:''
	},
	facebookId:String,
	admin:{
		type:Boolean,
		default:false
	}
});
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('user',userSchema);