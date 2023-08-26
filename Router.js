const express=require("express");
const router = express.Router();



router.get('/',(req,res)=>{
    res.render('index',{title:'login'});
});
router.get('/Signup',(req,res)=>{
    res.render('Signup',{title:'Sign Up'});
});
router.get('/User',(req,res)=>{
    res.render('Userhome',{title:'Home'});
});

module.exports=router;

