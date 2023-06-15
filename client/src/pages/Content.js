import { formatISO9075, format } from "date-fns";
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, Navigate, useParams} from "react-router-dom"
import { UserContext } from "../components/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Content(){
    
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
          .then(response => {
            response.json().then(postInfo => {
              setPostInfo(postInfo);
            });
          });
      }, []);
    

    
    async function deletePost(ev){

        
        const data = new FormData();
        
        data.set('id', id);
        // data.set('postInfo', postInfo);

        ev.preventDefault();

        const response = await fetch(`http://localhost:4000/post/${id}`,{
            method: 'DELETE',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            navigate('/');  
            toast.info(
                <div className="toast-content">Blog deleted</div>,
                {autoClose: 1200}
            );
        }
    }


    if(!postInfo) return '';

    return(
        <div className="post-page">
            
            <h1>{postInfo.title}</h1>
            <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id &&(
                <div className="edit-row">
                    <Link className="edit-button" to={`/edit/${postInfo._id}`}>Edit</Link>
                    <Link className="delete-button" onClick={deletePost}>Delete</Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="image" />
            </div>
            

            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        </div>
        
    )
}