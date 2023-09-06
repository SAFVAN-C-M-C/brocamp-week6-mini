const mongoose=require("mongoose");
const dotenv=require("dotenv")
dotenv.config({path:'config.env'})



mongoose.connect(process.env.MongoUri, { useNewUrlParser: true, useUnifiedTopology: false })
.then(()=>{
    console.log("DB connected......");
})
.catch(err=>{
    console.log("Not connected....",err);
})

const loginSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const login = new mongoose.model("Login",loginSchema);

module.exports=login;