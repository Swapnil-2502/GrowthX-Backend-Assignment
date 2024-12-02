const path = require('path');
const express = require('express');
const {connectMongoDB} = require("./connection")
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

connectMongoDB('mongodb://127.0.0.1:27017/Growthx')


const app = express();
const PORT = 8000;

//middlewares
app.use(express.urlencoded({extended: false})) // Middleware to handle form data
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.set('view engine','ejs')
app.set("views", path.resolve("./views"));

const userRoute = require('./routes/user')
const assignmentRoute = require('./routes/assignment')

app.get("/",(req,res)=>{
    res.render('home',{
        user: req.user
    })
})

app.use('/user',userRoute)
app.use('/assignment',assignmentRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})