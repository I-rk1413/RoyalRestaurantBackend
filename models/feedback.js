const mongoose=require('mongoose');
const schema=mongoose.Schema;



const feedbackSchema=new schema({
	firstname:{
		type:String,
		required:true
	},
	lastname:{
		type:String,
		required:true
	},
	telnum:{
		type:Number,
		required:true,

	},	
	email:{
		type:String,
		required:true

	},
	agree:{
		type:Boolean,
		required:true
	},
	contactType:{
		type:String
		
	},
	message:{
		type:String
	}
    
},{

		timestamps:true
	});
	


var feedback=mongoose.model('feedback',feedbackSchema);

module.exports=feedback;