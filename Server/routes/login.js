const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {TOKEN} = require('../config/keys');
const requiredLogin = require('../middleware/requireLogin');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: "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"
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

module.exports = router;
