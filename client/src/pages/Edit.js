import {useState, useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";
import Quill from "../components/Quill";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Edit(){
    
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    
    const [redirect, setRedirect] = useState(false);


    useEffect(()=>{
        fetch('http://localhost:4000/post/'+id)
        .then(response =>{
            response.json().then(postInfo =>{
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
                
            });
        });
    }, []);

    async function updatePost(ev){

        try{
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            data.set('id', id);
            if(files){
                data.set('file', files?.[0]);
            };

            ev.preventDefault();

            let response=null;
            try{
                response = await fetch('http://localhost:4000/post',{
                    method: 'PUT',
                    body: data,
                    credentials: 'include',
                });
            }catch(err){
                console.log(err);
            } 
            if(response?.ok){
                setRedirect(true);
                toast.info(
                    <div className="toast-content">Blog updated</div>,
                    {autoClose: 1200}
                );
            }
        }catch(err){
            console.log(err);
        }
    }


    if(redirect){
        return <Navigate to={'/post/'+id} />
    }

    return(
        <form onSubmit={updatePost}>

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
            
            <Quill onChange={setContent} value={content}/>

            <button style={{marginTop:'5px'}}>Update</button>
        
        </form>
    )

}