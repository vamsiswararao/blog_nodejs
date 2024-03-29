const mongoose = require("mongoose")

const user= new mongoose.Schema(
    {
    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    quote:{type:String}
    },
    {collection :"user"}
)

const model = mongoose.model("User",user)

module.exports=model