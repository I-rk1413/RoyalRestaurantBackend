const mongoose=require('mongoose');
const schema=mongoose.Schema;

const commentSchema=new schema({
	rating:{
		type:Number,
		min:1,
		max:5,
		required:true
	},
	comment:{
		type:String,
		required:true
    },
    dish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dish'

    },
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user'
	}
},{
	timestamps:true
});

let Comments=mongoose.model('Comment',commentSchema);

module.exports=Comments;