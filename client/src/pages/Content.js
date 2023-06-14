import { formatISO9075, format } from "date-fns";
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { UserContext } from "../UserContext";

export default function Content(){
    
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
          .then(response => {
            response.json().then(postInfo => {
              setPostInfo(postInfo);
            });
          });
      }, []);
    
    if(!postInfo) return '';

    return(
        <div className="post-page">
            
            <h1>{postInfo.title}</h1>
            <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id &&(
                <div className="edit-row">
                    <Link className="edit-button" to={`/edit/${postInfo._id}`}>Edit</Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="image" />
            </div>
            

            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        </div>
        
    )
}