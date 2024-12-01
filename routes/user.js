const {Router} = require("express")
const User = require("../models/user")

const router = Router()

router.get("/login", (req,res)=>{
    res.render("login")
})

router.get("/register", (req,res)=>{
    res.render("register")
})

router.post("/login", async (req,res)=>{
    const {email,password} = req.body

    const user = await User.matchPassword(email,password)
    console.log("User", user)
    return res.redirect("/")

    // try{
    //     const token = await User.matchPassword(email,password)
    //     return res.cookie("token",token).redirect("/");
    // }
    // catch{

    // }
   
})

router.post("/register", async (req,res)=>{
    const {Username ,email, password} = req.body;

    await User.create({
        Username,
        email,
        password
    })

    return res.redirect("/")
})

module.exports = router;