import {Link} from "react-router-dom"
import {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Header(){

    const {setUserInfo, userInfo} = useContext(UserContext);

    useEffect(() => {
      fetch('http://localhost:4000/profile', {
        credentials: 'include',
      }).then(response=>{
        response.json().then(userInfo =>{
          setUserInfo(userInfo);
        })
      })
    }, []);


    function logout(){
      fetch('http://localhost:4000/logout',{
        credentials:'include',
        method: 'POST',
      });
      setUserInfo(null);
      toast.info(
        <div className="toast-content">You have been logged out</div>,
        {autoClose: 1200}
      );
    }

    const username = userInfo?.username;
    
    return(
        <header>
        <Link to="/" className="logo">BlogFire</Link>
        <nav>
          {username && (
            <>
            <Link to="/create" id="create">Create a blog</Link>
            <a onClick={logout} id="logout">Logout</a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login" id="login">Login</Link>
              <Link to="/register"id="sign up">Register</Link>
            </>
          )}
          
        </nav>
      </header>
    )

}