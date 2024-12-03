const {Router} = require("express")

const router = Router()

const Assignment = require('../models/assignment')
const User = require('../models/user')



router.get("/upload", (req,res)=>{
    return res.render("addassignment",{
        user: req.user
    })
})

router.get("/assignments",async (req,res)=>{
    try {
        // Ensure the user is an admin
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).send("Unauthorized Access");
        }

        // Fetch assignments where the logged-in admin is tagged
        const adminAssignments = await Assignment.find({ AdminId: req.user._id });

        // Render the new page to show all assignments for this admin
        res.render("allassignments", {
            user: req.user,
            assignments: adminAssignments,
        });
    } catch (error) {
        console.error("Error fetching admin assignments:", error);
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req,res)=>{
    console.log(req.body);

    const {Username, body : task, Adminname} = req.body

    try{
        const user = await User.findOne({Username});
        const admin = await User.findOne({Username: Adminname});

        if(!user || !admin){
            return res.status(400).render("addassignment",{
                error: "Incorrect User name or Admin name",
                user: req.user
            });
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

router.post("/:id/accept", async (req,res)=>{
    
    try{
        const assignmentId = req.params.id;

        await Assignment.findByIdAndUpdate(assignmentId, {status: "Accepted" })
        return res.redirect("/assignment/assignments")
    }
    catch (error) {
        console.error("Error accepting assignment:", error);
        return res.status(500).send("Server Error");
    }

})

router.post("/:id/reject", async (req,res)=>{
    try{
        const assignmentId = req.params.id;

        await Assignment.findByIdAndUpdate(assignmentId, {status: "Rejected" })
        return res.redirect("/assignment/assignments")
    }
    catch (error) {
        console.error("Error rejecting assignment:", error);
        return res.status(500).send("Server Error");
    }

})

module.exports = router