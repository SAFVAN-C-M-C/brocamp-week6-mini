const express=require("express");
const app=express();
const router=require("./Router");
const path=require("path");


const port=4000;

//style
app.use("/static", express.static(path.join(__dirname, "public")));
//image
app.use("/assets", express.static(path.join(__dirname, "assets")));

//setting view engin as ejs
app.set("view engine", "ejs");




app.use("/", router);


app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}/`);
});



