const jwt = require('jsonwebtoken');
const {TOKEN} = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req,res,next)=>{
  const {authorization} = req.headers
  if(!authorization){
    return res.status(401).json({error:"Login again"});
  }
  const token = authorization.replace("Bearer ","")
  jwt.verify(token,TOKEN,(err,payload)=>{
    if(err){
      return res.status(401).json({error:"Login Again"});
    }

    const {_id}  = payload;
    User.findById(_id).then(userdata=>{
      req.user = userdata
      next()
    })
  })
}
