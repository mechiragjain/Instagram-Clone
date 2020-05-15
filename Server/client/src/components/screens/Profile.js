import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';

function Profile(){
  const [mypics,setMypics]=useState([])
  const {state, dispatch}=useContext(UserContext)
  const [image,setImage]=useState("");

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

  useEffect(()=>{
    if(image){
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

        fetch('/updatepic',{
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({profilePic:data.url})
        }).then(res=>res.json())
        .then(result=>{
          console.log(result)
          localStorage.setItem("user",JSON.stringify({...state,profilePic:data.profilePic}))
          dispatch({type:"UPDATEPIC",payload:result.profilePic})
        })
        window.location.reload()
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },[image])

  const updatePhoto = (file)=>{
    setImage(file)

  }


  return(
    <div style={{maxWidth:"900px", margin:"0px auto"}}>
      <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid rgba(var(--b38,219,219,219))"}}>
        <div>
          <img style={{width:"160px",height:"160px",borderRadius:"180px"}}
          src={state?state.profilePic:"https://res.cloudinary.com/chiragjain/image/upload/v1589529418/543600_64d1_4_vqgyf4.jpg"}
          alt="profile"
          />
          <div class="file-field input-field" style={{marginLeft:"-80px"}}>
          <div class="btn btn-small #64b5f6 blue lighten-2">
            <span>Update Profile Image</span>
            <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
          </div>
          <div class="file-path-wrapper">
            <input class="input-box file-path validate" type="text"/>
          </div>
          </div>
        </div>
        <div style={{marginLeft:"-250px",marginTop:"30px"}}>
          <h5 className="bold">{state?state.name:"Loading"}</h5>
          <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h6><b>{mypics.length}</b> Posts</h6>
              <h6><b>{state?state.followers.length:"0"}</b> Followers</h6>
              <h6><b>{state?state.following.length:"0"}</b> Following</h6>
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

      <div style={{margin:"50px", color:"grey", textAlign:"center"}}>
        <p> © 2020 INSTAGRAM FROM FACEBOOK </p>
      </div>

    </div>
  )
}

export default Profile;
