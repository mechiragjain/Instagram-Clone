import React,{useState} from 'react';
import loginLogo from '../../images/loginLogo.png'
import "../../App.css";
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

function Signup(){
  const history = useHistory();
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");

  const PostData = ()=>{
    if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email
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

  return(
    <div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <img className="imgLoginLogo" src={loginLogo} alt="login logo" />
        <h6 className="signup-text"> Sign up to see photos and videos from your friends. </h6>
        <input className="input-box" type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input-box" type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input-box" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action" onClick={()=>PostData()} >
          Sign Up
        </button>
      </div>
    </div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <h6> Have an account? <Link to="/login">Log in</Link></h6>
      </div>
    </div>
    </div>
  )
}

export default Signup;
