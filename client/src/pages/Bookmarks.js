import React, {useState, useEffect, useContext} from "react";
import Post from "../components/Post";
import { UserContext } from "../components/UserContext";
import { useParams } from "react-router-dom";

export default function Bookmarks(){

    const [posts, setPosts] = useState([]);
    const {userInfo} = useContext(UserContext);

    const {id} = useParams();

    useEffect(() => {
        fetch(`http://localhost:4000/bookmarks/${userInfo.id}`).then(response =>{
            response.json().then(posts =>{
                setPosts(posts);
            })
        })
    }, []);

    

    return(

        <>
            {posts.length==0 && (
                <h1 id="empty">Your bookmarks are empty</h1>
            )}
            {posts.length > 0 && posts.map(post =>(
                <Post {...post}/>
            ))}
        </>
    )
}
