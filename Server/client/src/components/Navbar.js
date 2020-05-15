import React,{useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import logo from '../images/logo.png';
import {UserContext} from '../App';

function NavBar(){

  //For Hide some of the links if the user is not logined
  //state contains the details of user. If not logined then it is null
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/createpost">Create Post</Link></li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/feed">Feed</Link></li>,
        <li>
        <button className="btn-small #64b5f6 blue lighten-2" type="submit" name="action"
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/login')
          }}>
          Log Out
        </button>
        </li>
      ]
    } else{
      return [
        <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  return(
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} class="brand-logo left"><img className="imgLogo" src={logo} alt="logo" /></Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        {renderList()};
      </ul>
    </div>
  </nav>
  )
}

export default NavBar;
