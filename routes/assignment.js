const {Router} = require("express")

const router = Router()

const Assignment = require('../models/assignment')
const User = require('../models/user')



router.get("/add-assignment", (req,res)=>{
    return res.render("addassignment",{
        user: req.user
    })
})

router.post("/", async (req,res)=>{
    console.log(req.body);

    const {Username, body : task, Adminname} = req.body

    try{
        const user = await User.findOne({Username});
        const admin = await User.findOne({Username: Adminname});

        if(!user || !admin){
            return res.status(400).send("Invalid user or admin names");
        }

        const newAssignment = await Assignment.create({
            UserId: user._id,
            Username: user.Username,
            AdminId: admin._id,
            Adminname: admin.Username,  
            task
        });
        console.log(newAssignment)
        return res.redirect('/')
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }

    
})

module.exports = router