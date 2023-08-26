const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/Mini")
.then(()=>{
    console.log("DB connected......");
})
.catch(()=>{
    console.log("Not connected....");
})

const loginSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const login = new mongoose.model("Login",loginSchema);

module.exports=login;