import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';

function Profile(){
  const [mypics,setMypics]=useState([])
  const {state, dispatch}=useContext(UserContext)
  useEffect(()=>{
    fetch('/myposts',{
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
      setMypics(result.mypost)
    })
  },[])

  return(
    <div style={{maxWidth:"900px", margin:"0px auto"}}>
      <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
        <div>
          <img style={{width:"160px",height:"160px",borderRadius:"180px"}}
          src="https://scontent-del1-1.cdninstagram.com/v/t51.2885-19/s320x320/73017417_527211874524831_1414717400728731648_n.jpg?_nc_ht=scontent-del1-1.cdninstagram.com&_nc_ohc=kwR_byMG978AX_cVgRp&oh=1b84248c20129e6db993d5cf37b5d0a5&oe=5ED805A5"
          alt="profile"
          />
        </div>
        <div>
          <h4 className="bold">{state?state.name:"Loading"}</h4>
          <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h6>40 Posts</h6>
              <h6>40 Followers</h6>
              <h6>40 Following</h6>
          </div>
        </div>
      </div>

      <div className="gallery">
      {
        mypics.map((item)=>{
          return(
            <img key={item._id} className="item" src={item.photo}
            alt={item.title} />
          )
        })
      }
      </div>

    </div>
  )
}

export default Profile;
