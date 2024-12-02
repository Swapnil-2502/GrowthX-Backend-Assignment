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

    try{
        const token = await User.matchPasswordAndGenerateToken(email,password)
        return res.cookie("token",token).redirect("/");

    }catch(error){
        return res.render("login",{
            error: "Incorrect credentials",
        })
    }   
})

router.get("/admins", async (req,res)=>{
    try {
        // Fetch assignments where the logged-in admin is tagged
        const adminNames = await User.find({ role: "ADMIN" }, "Username email" );

        // Render the new page to show all assignments for this admin
        res.render("allAdmins", {
            user: req.user,
            admins: adminNames
        });
    } catch (error) {
        console.error("Error fetching admin assignments:", error);
        res.status(500).send("Server Error");
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect("/user/login")
})

router.post("/register", async (req,res)=>{
    const {Username ,email, password, role} = req.body;

    //console.log(req.body)

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    await User.create({
        Username,
        email,
        password,
        role: userRole
    })

    return res.redirect("/user/login")
})

module.exports = router;