const mongoose=require("mongoose");


mongoose.connect("mongodb://0.0.0.0:27017/Mini", { useNewUrlParser: true, useUnifiedTopology: false })
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
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const login = new mongoose.model("Login",loginSchema);

module.exports=login;