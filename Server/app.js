const express = require("express");
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require("./config/keys");

const PORT = process.env.PORT || 4000

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
app.use(require('./routes/user'));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, function(){
  console.log("Server is running on Port 4000");
})
