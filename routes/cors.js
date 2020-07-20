const express=require('express');
const cors=require('cors');
const app=express();

const whiteList=['https://localhost:3443',"http://localhost:3000"];

let corsOptionsDelegate=(req,cb)=>{
	let corsOptions;
	if(whiteList.indexOf(req.header('Origin'))!==-1){
		corsOptions={origin:true};
	}
	else{
		corsOptions={origin:false};
	}
	cb(null,corsOptions)
}

exports.cors=cors();
exports.corsWithOptions=cors(corsOptionsDelegate);