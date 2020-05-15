const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  profilePic:{
    type:String,
    default:"https://res.cloudinary.com/chiragjain/image/upload/v1589529418/543600_64d1_4_vqgyf4.jpg"
  },
  followers:[{type:ObjectId,ref:"User"}],
  following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema);
