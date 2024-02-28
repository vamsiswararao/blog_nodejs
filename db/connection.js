const mongoose = require("mongoose");

const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://Blog_admin:admin123@cluster1.gd9jgyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

mongoose.connect(url,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then(()=>console.log("Connect to DB")).catch(()=>console.log("Error connecting to DB"))

