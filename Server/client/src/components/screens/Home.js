import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom'

function Home(){
  const [data,setData] = useState([])
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    fetch('/allpost',{
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
          if(item._id==result._id){
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
              console.log(result)
              const newData = data.map(item=>{
                if(item._id==result._id){
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
        console.log(result);
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
              <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" }>{item.postedBy.name}</Link> {item.postedBy._id == state._id && <i class="material-icons" style={{float:"right", margin:"3px 5px"}} onClick={()=>deletePost(item._id)}>delete</i>}</h5>
              <div className="card-image">
                <img src={item.photo} alt="" />
              </div>
              <div className="card-content">
                {item.likes.includes(state._id)?
                  <i className="material-icons"
                  onClick={()=>{dislikepost(item._id)}}
                  >favorite</i>
                  :
                  <i className="material-icons"
                  onClick={()=>{likepost(item._id)}}
                  >favorite_border</i>
                }
                <h6>Liked by {item.likes.length}</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                  item.comments.map(eachComment=>{
                    return(
                      <h6 key={eachComment._id}><span>{eachComment.postedBy.name}</span> {eachComment.text}</h6>
                    )
                  })
                }
                <form onSubmit={(eve)=>{
                  eve.preventDefault()
                  makeComment(eve.target[0].value,item._id)
                }}>
                  <input type="text" placeholder="Add Comment"/>
                </form>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default Home;
