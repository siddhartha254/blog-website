import { formatISO9075, format } from "date-fns";
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, Navigate, useParams} from "react-router-dom"
import { UserContext } from "../components/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'

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

    // const [isButtonDisabled, setButtonDisabled] = useState(false);

    // useEffect(() => {
    //     // Retrieve the disabled state from localStorage
    //     const storedDisabledState = localStorage.getItem('buttonDisabled');
    
    //     // Update the button disabled state if it was previously disabled
    //     if (storedDisabledState === 'true') {
    //       setButtonDisabled(true);
    //     }
    //   }, []);

    async function addToBookmarks(ev){
        
        try{
        
            const userId = userInfo.id;
            ev.preventDefault();

            const response = await fetch(`http://localhost:4000/post/${id}`,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId}),
                credentials: 'include',
            });

            // setButtonDisabled(true);
            // localStorage.setItem('buttonDisabled', 'true');

            if(response.ok){  
                toast.info(
                    <div className="toast-content">Added to Bookmarks</div>,
                    {autoClose: 1200}
                );
            }
        }catch(err){
            console.log(err);
        }
        
    }

    async function checkBookmark(ev){
        
        try{
            const userId = userInfo.id;
            ev.preventDefault();

            const response = await fetch(`http://localhost:4000/post/${id}`,{
                method: 'OPTIONS',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId}),
                credentials: 'include',
            });

            // setButtonDisabled(true);
            // localStorage.setItem('buttonDisabled', 'true');
            
            console.log(response);

            // if(response.ok && !response.isBookmarked){  
            //     toast.info(
            //         <div className="toast-content">Added to Bookmarks</div>,
            //         {autoClose: 1200}
            //     );
            // }
        }catch(err){
            console.log(err);
        }
        
    }



    if(!postInfo) return '';

    return(
        <div className="post-page">
            
            <h1>
                {postInfo.title}

                {userInfo && (
                <div className="bookmark-button">
                
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        height="0.9em" 
                        viewBox="0 0 384 512"
                        onClick={addToBookmarks} 
                        className="icon"
                        cursor={'pointer'}
                    >
                        
                        <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>
                    </svg>

                </div>
            )}
            </h1>
            <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">by @{postInfo.author.username}</div>
            

            {userInfo?.id === postInfo.author._id &&(
                <div className="edit-row">
                    <Link className="edit-button" to={`/edit/${postInfo._id}`}>Edit</Link>
                    <Link className="delete-button" onClick={deletePost}>Delete</Link>
                </div>
            )}
            <hr></hr>
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="image" />
            </div>
            

            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        </div>
        
    )
}