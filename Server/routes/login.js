const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {TOKEN} = require('../config/keys');
const requiredLogin = require('../middleware/requireLogin');
const {SENDGRIDKEY} = require("../config/keys");

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: SENDGRIDKEY
  }
}))

//Signup Route

router.post('/signup',(req,res)=>{
  const {name,email,password,profilePic} =req.body;
  if(!email || !password || !name){
    return res.status(422).json({error:"Please add required fields"});
  }
  User.findOne({email:email})
  .then((savedUser)=>{
    if(savedUser){
      return res.status(422).json({error:"User already exists with this email address"});
    }

    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user = new User({
          name:name,
          email:email,
          password:hashedpassword,
          profilePic:profilePic
        })
        user.save()
        .then((user)=>{
          transporter.sendMail({
            to: user.email,
            from: "me.chiragjain@gmail.com",
            subject: "Welcome to Instagram Clone by Chirag Jain!",
            html:"<h1>Share your First Post with your Friends!</h1>"
          })
          res.json({message:"Registered Successfully"});
        })
        .catch((err)=>{
          console.log(err);
        })
    })

  })

  .catch((err)=>{
    console.log(err);
  })
})

//Signin Route

router.post('/login',(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    res.status(422).json({error:"Please enter required fields"});
  }
  User.findOne({email:email})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error:"Invalid email or password"});
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
      if(doMatch){
        const token = jwt.sign({_id:savedUser._id},TOKEN);
        const {_id,name,email,followers,following,profilePic} = savedUser;
        res.json({token:token, user:{_id,name,email,followers,following,profilePic}});
      } else{
        return res.status(422).json({error:"Invalid email or password"});
      }
    })
    .catch(err=>{
      console.log(err);
    })
  })
})

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32,(err, buffer)=>{
    if(err){
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({email:req.body.email})
    .then((user)=>{
      if(!user){
        return res.status(422).json({error:"Email Not Found"})
      }
      user.resetToken = token
      user.expiryToken = Date.now() + 3600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"me.chiragjain@gmail.com",
          subject:"Password Reset Request - Instagram Clone Project",
          html:`
            <p>Hi ${user.name}</p>
            <p>You had requested a new password for this account on Instagram Clone Project</p>
            <p>If you didn't make this request, then just ignore this mail</p>
            <p><a href="https://instagram-webapp.herokuapp.com/reset/${token}">Click Here to reset your password</a></p>
            <p>Thanks for reading.</p>
          `
        })
        res.json({message:"Reset Password link sent to your mail"})
      })
    })
  })
})

router.post('/new-password', (req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token

  User.findOne({resetToken: sentToken, expiryToken: {$gt:Date.now()}})
  .then(user => {
    if(!user){
      return res.status(422).json({error:"Session Expired. Please Try Again!"})
    }
    bcrypt.hash(newPassword, 12)
    .then(hashedPassword => {
      user.password = hashedPassword
      user.resetToken = undefined
      user.expiryToken = undefined
      user.save().then(savedUser => {
        transporter.sendMail({
          to:user.email,
          from:"me.chiragjain@gmail.com",
          subject:"Password Changed Successfully - Instagram Clone Project",
          html:`
            <p>Hi ${user.name}</p>
            <p>Your password has been updated</p>
            <p>Thanks for reading.</p>
          `
        })
        res.json({message:"Password Updated Successfully"})
      })
    })
  }) .catch(err=>{
    console.log(err);
  })
})

module.exports = router;
