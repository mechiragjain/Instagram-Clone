import React,{useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import logo from '../images/logo.png';
import profileIcon from '../images/profile.png';
import discover from '../images/discover.png';
import addPost from '../images/addpost.png';
import {UserContext} from '../App';

function NavBar(){

  //For Hide some of the links if the user is not logined
  //state contains the details of user. If not logined then it is null
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/createpost"><img className="imgLogo" style={{marginTop:"17px", marginRight:"22px",width:"30px",height:"30px"}}  src={addPost} alt="profile" /></Link></li>,
        <li><Link to="/feed"><img className="imgLogo" style={{marginTop:"15px"}}  src={discover} alt="profile" /></Link></li>,
        <li><Link to="/profile"><img className="imgLogo" style={{marginTop:"15px"}}  src={profileIcon} alt="profile" /></Link></li>,
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

      ]
    }
  }

  return(
    <div className="navbar-fixed">
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} class="brand-logo left"><img className="imgLogo" src={logo} alt="logo" /></Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        {renderList()};
      </ul>
    </div>
  </nav>
  </div>
  )
}

export default NavBar;
