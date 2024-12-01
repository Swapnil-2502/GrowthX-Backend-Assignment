const path = require('path');
const express = require('express');
const {connectMongoDB} = require("./connection")

connectMongoDB('mongodb://127.0.0.1:27017/Growthx')


const app = express();
const PORT = 8000;

//middlewares
app.use(express.urlencoded({extended: false})) // Middleware to handle form data

app.set('view engine','ejs')
app.set("views", path.resolve("./views"));

const userRoute = require('./routes/user')


app.get("/",(req,res)=>{
    res.render('home')
})

app.use('/user',userRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})