const express = require("express");
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require("./keys");

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
  console.log("Connected to Mongo");
})
mongoose.connection.on('error',(err)=>{
  console.log("Error in connecting ",err);
})

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/login'));
app.use(require('./routes/post'));

//GA41zuHRi6iX97kI

app.listen(4000,function(){
  console.log("Server is running on Port 4000");
})
