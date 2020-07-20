const mongoose=require('mongoose');
const schema=mongoose.Schema;


const favouriteSchema=new schema({

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
dishes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'dish'
}]
},
    {
    timestamps:true,

})

module.exports=mongoose.model('favourite',favouriteSchema);
