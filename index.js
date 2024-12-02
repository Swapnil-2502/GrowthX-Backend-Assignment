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

const Assignment = require("./models/assignment");

const userRoute = require('./routes/user')
const assignmentRoute = require('./routes/assignment')

app.get("/", async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.user) {
            return res.redirect("/user/login"); // Redirect to login if not authenticated
        }

        // Fetch assignments submitted by the logged-in user
        const allAssignments = await Assignment.find({ UserId: req.user._id });
            
    
        // Render the home page with filtered assignments
        res.render("home", {
            user: req.user,
            assignments: allAssignments,
        });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).send("Server Error");
    }
});


app.use('/user',userRoute)
app.use('/assignment',assignmentRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})