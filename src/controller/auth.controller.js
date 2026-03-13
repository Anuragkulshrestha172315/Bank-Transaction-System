const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require("../Services/email.service")
async function userRegisterController(req,res){
   const {email, password, name} = req.body;
   
   const isExist = await userModel.findOne({
    email:email
   })

   if(isExist){
    return res.status(422).json({
        message : "User already exist",
        status: "failed"
    })
   }

   const user = await userModel.create({
        email,password, name
   })

   const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"3d"})

   res.cookie("token", token)

   res.status(201).json({
    message: "User Register Successfully",

    user: {
        _id: user._id,
        email: user.email,
        name: user.name
    },
    token
   })

}

async function userLoginController(req,res){
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select("password")

    if(!user){
        res.status(401).json({
            message: "Email or password Invalid"
        })
    }
    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword){
        res.status(401).json({
            message: "Email or password Invalid"
        })
    }
    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"3d"})

   res.cookie("token", token)

   res.status(200).json({
    message: "User Login Successfully",

    user: {
        _id: user._id,
        email: user.email,
        name: user.name
    },
    token
   })

   await emailService.sendRegistrationEmail(user.email, user.name)
}   


module.exports = {userRegisterController, userLoginController}