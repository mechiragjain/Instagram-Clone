import React,{useState,useContext} from 'react';
import loginLogo from '../../images/loginLogo.png'
import "../../App.css";
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

function ResetPassword(){

  const history = useHistory();
  const [email,setEmail]=useState("");

  const PostData = ()=>{
    if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    fetch("/reset-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
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
        <input className="input-box" type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action"
          onClick={()=>PostData()}>
          Reset Password
        </button>
      </div>
    </div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <h6> Remember your password? <Link to="/login"><b>Login</b></Link></h6>
      </div>
    </div>
    </div>
  )
}

export default ResetPassword;
