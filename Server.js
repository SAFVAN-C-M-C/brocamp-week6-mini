const express=require("express");
const app=express();
const router=require("./Router");
const path=require("path");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const nocache=require("nocache");


const port=4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//style
app.use("/static", express.static(path.join(__dirname, "public")));
//image
app.use("/assets", express.static(path.join(__dirname, "assets")));

//setting view engin as ejs
app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: false }));

app.use(nocache());
app.use(
    session({
      secret: uuidv4(),
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use("/", router);


app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}/`);
});



