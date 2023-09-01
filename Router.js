const express=require("express");
const router = express.Router();
const register=require("./mongoose");
const { render } = require("ejs");
const { ObjectId } = require('mongodb')
const session = require("express-session");





router.get('/',(req,res)=>{


    if(req.session.logged){
        res.redirect("/User");
    }
    else if(req.session.adminlog){
        res.redirect("/admin_home");
    }else{
        res.render('index',{title:'login',errmsg:req.session.errmsg}); 
    }
 
});


//User Signup
router.get('/Signup',(req,res)=>{
    res.render('Signup',{title:'Sign Up',errmsg:req.session.errmsgsign});
});
router.post('/Signup',async (req,res)=>{
   const check= await register.findOne({email:req.body.email});
   console.log(check);
   if(check==null){
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    console.log(data);
    await register.insertMany([data]);
    res.redirect("/");



   }else{
    req.session.errmsgsign="user already exist"
    res.redirect('/Signup')
     console.log("user already exist");
}
});





//user login
router.post("/login",async(req,res)=>{
try{
    const check=await register.findOne({email:req.body.email})

    console.log(check);
    console.log(req.body);
    
    if(check.password===req.body.password){
        req.session.name=check.name;
        req.session.logged=true;
        console.log("Login success");
        res.redirect("/User");
    }
    else{
        req.session.errmsg="invalid password"
        res.redirect('/')
        console.log("invalid password");

    }
}catch{
    req.session.errmsg="user not found"
res.redirect('/')
console.log("user not found");

}
});



//User home page
router.get('/User',(req,res)=>{
    if(req.session.logged){
        res.render('Userhome',{title:'Home',user:req.session.name});
    }
    else{
        res.redirect('/');
    }
});





//Signout
router.get('/signout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.send('Error');
        }else{
            res.redirect('/');
        }
    });
});


module.exports=router;

