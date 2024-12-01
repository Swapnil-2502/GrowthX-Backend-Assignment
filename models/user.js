const { createHmac } = require('crypto');
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    UserName : {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER"
    }
},{timestamps: true})

//Middleware to hash password 
userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("Password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
                            .update(user.password)
                            .digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

const User = mongoose.model(userSchema)

module.exports = User