const express = require("express");
const app =express();
const cors = require('cors');
const port = process.env.PORT || 9090


const mongoose = require("mongoose");

// models
const User =require("./models/user");
const Blog =require("./models/blog");

const jwt = require('jsonwebtoken');
const bcrypt =require("bcrypt");
const nodemailer = require('nodemailer');

// app use
app.use(cors());
app.use(express.json());

// Connect DB 
require("./db/connection")


//Route
app.get("/", (req,res)=>{
    res.send("welcome to the node js project")
})

app.post("/api/signup",async(req,res)=>{
    try{
    const {name,email,password}=req.body 
    const newPassword = await bcrypt.hash(req.body.password,6)
    if(!name || !email || !password){
        res.status(400).send("please fill all fields")
    }else{
        const isAlreadyExists = await User.findOne({email})
        if(isAlreadyExists){
            res.status(400).send("user already exists")
        }else{
            await User.create({
                name:req.body.name,
                email:req.body.email,
                password:newPassword
            })
            res.status(200).send("user registered successfully")
      }
   }
   }catch(e){
    res.json({status:"error", error:"duplicate email address"})
   }
})

app.post("/api/login", async(req,res)=>{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.json({status:"error", error:"invalid Email"})
        }else{
            const isPasswordValid = await bcrypt.compare(req.body.password,user.password)
            if(isPasswordValid){
            const token=jwt.sign({user:user.name,email:user.email},"secret123")
            res.json({status:"ok",Token:token})
            }else{
                res.json({status:"error", user:false, error:"invalid password"})
            }
        }
})

app.post("/api/forget-password", async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email,})
        if(!user){
        res.json({message:"user not registered"})
        }else{
            const token= jwt.sign({id:user._id,},"secret123")
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'yellapuv23@gmail.com',
                pass: 'fzffonhenvzrlcrk'
                }
            });
      
            const mailOptions = {
                from: 'yellapuv23@gmail.com',
                to: req.body.email,
                subject: 'Reset password',
                text: `http://http://localhost:3000/ResetPassword/${token}`
            };
      
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.json({message:"user not registered"})
                } else {
                    return res.json({ status:"ok", message:"email send"});
                }
            });
        }
    }catch(e){
        console.log(e)
    }
})

app.post("/api/reset-password/:token", async(req,res)=>{
    const token = req.params.token
    const password = req.body.password
    try{
        const decode= jwt.verify(token, "secret123")
        const id = decode.id
        const hashPassword =bcrypt.hash(password,4)
        const result = await User.findByIdAndUpdate({_id:id, password:hashPassword})
        return res.json({status:true, message:"updated password"})
    

    }catch(e){
        return res.json({message:"invalid token"})
    }

})


app.post("/api/blog",async(req,res)=>{
    try{
    const blog= new Blog ({
        title:req.body.title,
        content:req.body.content
    })
    
    const BlogData= await blog.save()
    res.json({status:"ok", message:"post add successfully"})


   }catch(e){
    res.json({status:"error", error:"duplicate email address"})
   }
})


app.post("/api/comments",async(req,res)=>{
    try{
        const post_id =req.body.post_id;
        const username= req.body.title;
        const comment=req.body.comment;

        await Blog.findByIdAndUpdate({_post:post_id},{
            $push:{username:username,comment:comment}
        })
    res.status(200).send({status:"ok", message:"Comment added!"})


   }catch(e){
    res.json({status:"error"})
   }
})





app.listen(port,()=>{
    console.log(`listening on http://localhost:${port}`)
})