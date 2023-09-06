const express=require("express");
const adminrouter = express.Router();
const register=require("./mongoose");
const { render } = require("ejs");
const { ObjectId } = require('mongodb')
const session = require("express-session");

//admin
const admin={
    Name:"Safvan",
    userID:"BCK129",
    password:"1234",
}

//admin login
adminrouter.get("/admin",(req,res)=>{
    if(req.session.adminlog){
        res.redirect("/admin_home");
    }else{
        res.render("adminlogin",{title:'login',errmsg:null})
    }
})
//admin login process
adminrouter.post("/adminlog",(req,res)=>{
    if(req.body.userID===admin.userID && req.body.password === admin.password){
        req.session.user=admin.Name;
        req.session.adminlog=true;
        res.redirect('/admin_home');
    }else{
        if(req.body.userID!=admin.userID){
            res.render('adminlogin',{title:'login',errmsg:'user not exist'});
        }
        else if(req.body.password != admin.password){
            res.render('adminlogin',{title:'login',errmsg:'incorrect password'});
        }
        else{
            res.render('adminlogin',{title:'login',errmsg:'wrong credential'});
        }
    }
});

//admin home
adminrouter.get('/admin_home',async(req,res)=>{
    if(req.session.adminlog){
        var i=0;
    const userdata=await register.find({},{__v:0})
    res.render('admin',{title:'Home',user:req.session.user,userdata,i})
    }
    else{
        res.redirect('/admin')
    }
})


//edit
adminrouter
.route("/edit/:id")
.get(async(req,res)=>{
    if(req.session.adminlog){
        const id=req.params.id;
    const data = await register.findOne({ _id: new ObjectId(id) });
    res.render('edit',{title:'update',data});
    }else{
        res.redirect('/admin')
    }
})
.post(async(req,res)=>{
    const id=req.params.id;
    const data=req.body
    await register.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: data.name, email: data.email } }
      );
    res.redirect("/admin_home")

})


//add
adminrouter.route('/add')
.get((req,res)=>{
    if(req.session.adminlog){
        res.render('add',{title:'add user',errmsg:req.session.errmsgsign})
    }else{
        res.redirect('/admin')

    }
})
.post(async(req,res)=>{

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
    res.redirect("/admin_home")


   }else{

    req.session.errmsgsign="user already exist"
    res.redirect('/add')
     console.log("user already exist");
}
});



//search
adminrouter.post('/search',async(req,res)=>{
    var i=0;
    const data=req.body
    console.log(data);
    let userdata = await register.find({name: { $regex: "^" + data.search, $options: 'i' }});
    console.log(`Search Data ${userdata} `);
    res.render('admin',{title:'Home',user:req.session.user,userdata,i})
})




//delete
adminrouter.get("/delete/:id",async(req,res)=>{
    const id=req.params.id;

    let deleted = await register.deleteOne({ _id: new ObjectId(id) });

    res.redirect('/admin_home')
})



module.exports=adminrouter;
