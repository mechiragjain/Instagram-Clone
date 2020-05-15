import React,{useState,useEffect} from 'react';
import loginLogo from '../../images/loginLogo.png'
import "../../App.css";
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

function Signup(){
  const history = useHistory();
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [image,setImage]=useState("");
  const [url,setUrl]=useState(undefined);

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])

  const uploadImage = ()=>{
    const data = new FormData();
    data.append("file",image);
    data.append("upload_preset","instagram-clone");
    data.append("cloud_name","chiragjain");
    fetch("https://api.cloudinary.com/v1_1/chiragjain/image/upload",{
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      setUrl(data.url);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const uploadFields = ()=>{
    if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email,
        profilePic:url
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes: 'rounded #64b5f6 blue lighten-2'});
      } else {
        M.toast({html: data.message, classes: 'rounded #64b5f6 blue lighten-2'});
        history.push('/login');
      }
    })
  } else{
    M.toast({html: "Invalid Email Address", classes: 'rounded #64b5f6 blue lighten-2'});
  }
  }

  const PostData = ()=>{
    if(image){
      uploadImage()
    }else{
      uploadFields()
    }

  }

  return(
    <div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <img className="imgLoginLogo" src={loginLogo} alt="login logo" />
        <h6 className="signup-text"> Sign up to see photos and videos from your friends. </h6>
        <input className="input-box" type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input-box" type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input-box" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

        <div class="file-field input-field">
        <div class="btn  #64b5f6 btn-small blue lighten-2">
          <span>Upload Profile Image</span>
          <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div class="file-path-wrapper">
          <input class="input-box file-path validate" type="text"/>
        </div>
        </div>

        <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action" onClick={()=>PostData()} >
          Sign Up
        </button>
      </div>
    </div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <h6> Have an account? <Link to="/login"><b>Log in</b></Link></h6>
      </div>
    </div>
    </div>
  )
}

export default Signup;
