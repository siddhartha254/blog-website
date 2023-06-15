import {useState} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import {Navigate} from "react-router-dom";
import Quill from "../components/Quill";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Create(){
    
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');

    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev){
        
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        
        ev.preventDefault();
        //console.log(files);
        
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        
        if(response.ok){
            setRedirect(true);
            toast.info(
                <div className="toast-content">Blog created</div>,
                {autoClose: 1200}
            );
            
        }
    }

    if(redirect){
        return (
            <Navigate to={'/'} />
        )
    }

    return(
        <form onSubmit={createNewPost}>

            <input 
                type="title" 
                placeholder={'Title'} 
                value={title}
                onChange={ev=>setTitle(ev.target.value)}
            />
            
            <input 
                type="summary" 
                placeholder={'Summary'} 
                value={summary}
                onChange={ev=>setSummary(ev.target.value)}
            />

            <input 
                type="file" 
                
                onChange={ev => setFiles(ev.target.files)}
            />
            
            <Quill value={content} onChange={setContent} />

            <button style={{marginTop:'5px'}}>Post</button>
        
        </form>
    )
}