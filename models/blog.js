const mongoose = require("mongoose")

const blog= new mongoose.Schema(
    {
    title:{type:String, required:true},
    content:{type:String, required:true,unique:true},
    comment:{type:Object, default:{}}
    },
    {collection :"post"}
)

const model = mongoose.model("Post",blog)

module.exports=model