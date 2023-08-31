const express=require("express");
const router = express.Router();
const register=require("./mongoose");
const { render } = require("ejs");
const { ObjectId } = require('mongodb')
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
        res.render('index',{title:'login',errmsg:req.session.errmsg}); 
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




router.get('/User',(req,res)=>{
    if(req.secure.logged){
        res.render('Userhome',{title:'Home',user:req.session.name});
    }
    else{
        res.redirect('/');
    }
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


router.get('/admin_home',async(req,res)=>{
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
router
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


router.route('/add')
.get((req,res)=>{
    if(req.session.adminlog){
        res.render('add',{title:'add user'})
    }else{
        res.redirect('/admin')

    }
})
.post(async(req,res)=>{
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    console.log(data);
    await register.insertMany([data]);
    res.redirect("/admin_home")
})

router.post('/search',async(req,res)=>{
    var i=0;
    const data=req.body
    console.log(data);
    let userdata = await register.find({name: { $regex: "^" + data.search, $options: 'i' }});
    console.log(`Search Data ${userdata} `);
    res.render('admin',{title:'Home',user:req.session.user,userdata,i})
})


router.get("/delete/:id",async(req,res)=>{
    const id=req.params.id;

    let deleted = await register.deleteOne({ _id: new ObjectId(id) });

    res.redirect('/admin_home')
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

