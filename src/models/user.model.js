const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required to created a User!"],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    unique: [true,"Email already exist"]
  },
  name: {
    type: String,
    required: [true, "Name is required for create an account"]
  },
  password: {
    type: String,
    required: [true, "password is required for create an account"],
    minlength: [6, "Atleast 6 digit are required to create a password"],
    select: false,
  },
  systemUser:{
    type: Boolean,
    default: false,
    immutable: true,
    select: false   
  }
},
{
    timestamps: true,
});

userSchema.pre("save", async function (next){   // pre=> password ko hash m convert krke save kr rhi h
    if(!this.isModified("password")){
        return 
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    return 
    
})

userSchema.methods.comparePassword = async function(password){  // database m jo save h hash-password usko password s campare krna
    return bcrypt.compare(password, this.password)
}



const userModel = mongoose.model("user", userSchema)

module.exports = userModel;