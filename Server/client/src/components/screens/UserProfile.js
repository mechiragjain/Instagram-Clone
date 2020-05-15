import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom'

function Profile(){
  const [userProfile,setProfile] = useState(null)
  const {state, dispatch}=useContext(UserContext)
  const {userid} = useParams()

  const [showfollow,setShowfollow] = useState(state?!state.following.includes(userid):true)

  useEffect(()=>{
    fetch(`/user/${userid}`,{
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
      setProfile(result)
    })
  },[])

  //follow feature

  function followUser(){
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
          localStorage.setItem("user",JSON.stringify(data))
          setProfile((prevState)=>{
            return{
              ...prevState,
              user:{
                ...prevState.user,
                followers:[...prevState.user.followers,data._id]
              }
            }
          })
          setShowfollow(false);
        })
    }

    //unfollow feature

    function unfollowUser(){
          fetch('/unfollow',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem('jwt')
              },
              body:JSON.stringify({
                  unfollowId:userid
              })
          }).then(res=>res.json())
          .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
              const newFollower = prevState.user.followers.filter(item=>item !== data._id)
              return{
                ...prevState,
                user:{
                  ...prevState.user,
                  followers:newFollower
                }
              }
            })
            setShowfollow(true)
          })
      }

  return(
    <>
    {userProfile ?
      <div style={{maxWidth:"900px", margin:"0px auto"}}>
        <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid rgba(var(--b38,219,219,219))"}}>
          <div style={{marginTop:"30px", marginBottom:"30px"}}>
            <img style={{width:"160px",height:"160px",borderRadius:"180px"}}
            src={userProfile.user.profilePic}
            alt="profile"
            />
          </div>
          <div style={{marginLeft:"-100px",marginTop:"30px"}}>
            <h5>{userProfile.user.name}</h5>
            {showfollow ?
              <button style={{margin:"10px"}}className="btn waves-effect waves-light #64b5f6 blue darken-1"
              onClick={()=>followUser()}
              >
                  Follow
              </button>
            :
            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>unfollowUser()}
            >
              Unfollow
            </button>
          }

            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                <h6><b>{userProfile.posts.length}</b> Posts</h6>
                <h6><b>{userProfile.user.followers.length}</b> Followers</h6>
                <h6><b>{userProfile.user.following.length}</b> Following</h6>
            </div>
          </div>
        </div>

        <div className="gallery">
        {
          userProfile.posts.map((item)=>{
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

      : <h2>Loading ...</h2>}

    < />
  )
}

export default Profile;
