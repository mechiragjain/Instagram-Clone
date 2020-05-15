import React,{useState,useContext} from 'react';
import loginLogo from '../../images/loginLogo.png'
import "../../App.css";
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App'

function Login(){

  const {state,dispatch}=useContext(UserContext);

  const history = useHistory();
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");

  const PostData = ()=>{
    if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    fetch("/login",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.error){
        M.toast({html: data.error, classes: 'rounded #64b5f6 blue lighten-2'});
      } else {
        localStorage.setItem("jwt",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        dispatch({type:"USER",payload:data.user})
        M.toast({html: "Login Successfully", classes: 'rounded #64b5f6 blue lighten-2'});
        history.push('/');
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
        <input className="input-box" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action"
          onClick={()=>PostData()}>
          Log In
        </button>
      </div>
    </div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <h6> Don't have an account? <Link to="/signup">Sign up</Link></h6>
      </div>
    </div>
    </div>
  )
}

export default Login;
