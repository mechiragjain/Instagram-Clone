import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom'

function Home(){
  const [data,setData] = useState([])
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    fetch('/feed',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setData(result.posts)
    })
  },[])

  //Like & Dislike Post

  const likepost = (id)=>{
    fetch('/like',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
      }).then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id==result._id){
            return result
          } else{
            return item
          }
        })
        setData(newData)
    })
  }

  const dislikepost = (id)=>{
    fetch('/dislike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
      }).then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id===result._id){
            return result
          } else{
            return item
          }
        })
        setData(newData)
    })
  }

  //Comment
  const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }

    //Delete Posts
    const deletePost = (postId)=>{
      fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
        const newData = data.filter(item=>{
          return item._id !== result._id
        })
        setData(newData)
      })
    }

  return(
    <div className="home">
        {data.map((item)=>{
            return(
              <div className="card home-card" key={item._id}>

              <div role="button" tabindex="0" style={{alignSelf:"center",display: "block" }}>
              <img style={{position: "absolute", top: "6px", left: "6px", width: "35px", height: "35px", borderRadius: "50%"}} alt="" class="_6q-tv" src={item.postedBy.profilePic} />
              </div>
              <p style={{fontWeight:"500",paddingTop:"7px",paddingLeft:"8px"}}><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" } style={{marginLeft:"40px",fontSize:"20px"}}>{item.postedBy.name}</Link> {item.postedBy._id == state._id && <i class="material-icons" style={{float:"right", margin:"3px 5px"}} onClick={()=>deletePost(item._id)}>delete</i>}</p>
              <div className="card-image">
                <img src={item.photo} alt="" />
              </div>
              <div className="card-content" style={{padding:"16px"}}>
                {item.likes.includes(state._id)?
                  <i className="material-icons"
                  onClick={()=>{dislikepost(item._id)}}
                  >favorite</i>
                  :
                  <i className="material-icons"
                  onClick={()=>{likepost(item._id)}}
                  >favorite_border</i>
                }
                <p>Liked by {item.likes.length}</p>
                <p><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" }><b style={{fontWeight:"500"}}>{item.postedBy.name}</b></Link> {item.body}</p>
                <div style={{paddingTop:"20px"}}>
                {
                  item.comments.map(eachComment=>{
                    return(
                      <p key={eachComment._id}><span style={{fontWeight:"500"}}>{eachComment.postedBy.name}</span> {eachComment.text}</p>
                    )
                  })
                }
                <form onSubmit={(eve)=>{
                  eve.preventDefault()
                  makeComment(eve.target[0].value,item._id)
                }}>
                  <input className="input-box" style={{marginTop:"10px", padding:"-15px"}} type="text" placeholder="Add Comment"/>
                </form>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default Home;
