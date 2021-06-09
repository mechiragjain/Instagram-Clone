import React,{useState} from 'react';
import loginLogo from '../../images/loginLogo.png'
import "../../App.css";
import {useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css';

function ResetLink(){


  const history = useHistory();
  const [password,setPassword]=useState("");

  const {token} = useParams()
  console.log(token);

  const PostData = ()=>{
    fetch("/new-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        token
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.error){
        M.toast({html: data.error, classes: 'rounded #64b5f6 blue lighten-2'});
      } else {
        M.toast({html: data.message, classes: 'rounded #64b5f6 blue lighten-2'});
        history.push('/login');
      }
    })
  }

  return(
    <div>
    <div className="mycard">
      <div className="card auth-card input-field">
        <img className="imgLoginLogo" src={loginLogo} alt="login logo" />
        <input className="input-box" type="password" placeholder="Enter New Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action"
          onClick={()=>PostData()}>
          Update Password
        </button>
      </div>
    </div>
    </div>
  )
}

export default ResetLink;
