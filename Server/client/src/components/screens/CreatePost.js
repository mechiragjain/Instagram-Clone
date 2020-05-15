import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

function CreatePost(){
  const history = useHistory();
  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl]=useState("");

  const postDetails = ()=>{
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
      setUrl(data.url);
    })
    .catch(err=>{
      console.log(err);
    })

    fetch("/createpost",{
      method:"post",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        title,
        body,
        pic:url
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes: 'rounded #64b5f6 blue lighten-2'});
      } else {
        M.toast({html: "Posted Successfully", classes: 'rounded #64b5f6 blue lighten-2'});
        history.push('/');
      }
    }).catch(err=>{
      console.log(err);
    })

  }

  return(
    <div className="card input-field auth-card input-field" style={{marginTop:"50px"}}>
      <textarea className="input-box text-area" type="text" cols="5" rows="5" placeholder="Add Caption" value={body} onChange={(e)=>setBody(e.target.value)} />

      <div class="file-field input-field">
      <div class="btn  #64b5f6 btn-small blue lighten-2">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
      </div>
      <div class="file-path-wrapper">
        <input class="input-box file-path validate" type="text"/>
      </div>
      </div>
      <button className="waves-effect waves-light btn-small #64b5f6 blue lighten-2" type="submit" name="action"
      onClick={()=>postDetails()}>
        Post
      </button>

    </div>
  )
}

export default CreatePost;
