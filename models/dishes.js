const mongoose=require('mongoose');
const schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;


const dishSchema=new schema({
	name:{
		type:String,
		required:true,
		unique:true

	},
	description:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true,

	},
	category:{
		type:String,
		required:true,

	},
	label:{
		type:String,
		default:''

	},
	price:{
		type:Currency,
		required:true,
		min:0
	},
	featured:{
		type:Boolean,
		default:false
	}
	

},{

		timestamps:true
	});
	


var dishes=mongoose.model('dish',dishSchema);

module.exports=dishes;

