const express=require("express");
const router = express.Router();
const register=require("./mongoose");
const { render } = require("ejs");
const session = require("express-session");


const admin={
    Name:"Safvan",
    userID:"BCK129",
    password:"1234",
}



router.get('/',(req,res)=>{


    if(req.session.logged){
        res.redirect("/User");
    }
    else if(req.session.adminlog){
        res.redirect("/admin_home");
    }else{
        res.render('index',{title:'login',errmsg:null}); 
    }
 
});



router.get('/Signup',(req,res)=>{
    res.render('Signup',{title:'Sign Up'});
});


router.post('/Signup',async (req,res)=>{
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    console.log(data);
    await register.insertMany([data]);
    res.redirect("/");
//     const newUser = new register(data);
//     newUser.save()
//   .then(user => {
//     console.log('User saved:', user);

//   })
//   .catch(err => {
//     console.error('Error saving user:', err);
//     res.render('Signup')
//   });
});



router.post("/login",async(req,res)=>{
try{
    const check=await register.findOne({email:req.body.email})

    req.session.name=check.name;
    req.session.logged=true;
    console.log(check);
    console.log(req.body);

    if(check.password===req.body.password){

        console.log("Login success");
        return res.redirect("/User");
    }
    else{
        res.render('index',{title:'login',errmsg:"invalid password"});
        console.log("invalid password");

    }
}catch{
res.render("index",{title:'login',errmsg:"user not found"})
console.log("user not found");

}
});




router.get('/User',(req,res)=>{
    res.render('Userhome',{title:'Home',user:req.session.name});
});









router.get("/admin",(req,res)=>{
    if(req.session.adminlog){
        res.redirect("/admin_home");
    }else{
        res.render("adminlogin",{title:'login',errmsg:null})
    }
})
router.post("/adminlog",(req,res)=>{
    if(req.body.userID===admin.userID && req.body.password === admin.password){
        req.session.user=admin.Name;
        req.session.adminlog=true;
        res.redirect('/admin_home');
    }else{
        if(req.body.email!=credential.email){
            res.render('adminlogin',{title:'login',errmsg:'user not exist'});
        }
        else if(req.body.password != credential.password){
            res.render('adminlogin',{title:'login',errmsg:'incorrect password'});
        }
        else{
            res.render('adminlogin',{title:'login',errmsg:'wrong credential'});
        }
    }
});


router.get('/admin_home',(req,res)=>{
    res.render('admin',{title:'Home',user:req.session.user})
})


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

