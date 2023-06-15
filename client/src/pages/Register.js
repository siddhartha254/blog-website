import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register(){
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    async function register(ev){
        ev.preventDefault();
    
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        })
        if(response.status === 200){
            toast.info(
                <div className="toast-content">Account created</div>,
                {autoClose: 1200}
            );
            navigate('/login');
        }
        else{
            alert("Registration Failed");
        }
    }

    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input 
                type="text" 
                placeholder="username" 
                value={username} 
                onChange={ev=> setUsername(ev.target.value)}/>
            
            <input 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={ev=> setPassword(ev.target.value)}
                />
            
            <button>Register</button>
        </form>
    )
}

