const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');

const User = require('./models/User');
const Post = require('./models/Post');
const { ifError } = require('assert');
const { isError } = require('util');

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser()); 
app.use('/uploads', express.static(__dirname+'/uploads'));
// app.use(multer(config).any());

mongoose.connect('mongodb+srv://user:admin@cluster0.dptwbfi.mongodb.net/?retryWrites=true&w=majority')

const salt = bcrypt.genSaltSync(10);
const secret = "ewfhiewofuoewbfwevew";
 

// sign up
app.post('/register', async (req,res)=>{
   
    try{
        const {username, password} = req.body;
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    }catch(err){
        res.status(400).json(e);
    }
})

// login
app.post('/login', async (req,res)=>{
   
    try{
        const {username, password} = req.body;    
        const userDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password, userDoc.password);
        
        if(passOk){
            jwt.sign({username, id: userDoc._id}, secret, {}, (err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username,
                });
            })
        }
        else{
            res.status(400).json("Wrong Username or Password");
        }
    }catch(err){
        res.status(400).json(err);
    }
});


app.get('/profile', (req,res) =>{
    try{
        const {token} = req.cookies; 
        jwt.verify(token, secret, {}, (err, info)=>{
            if(err) throw err;
            res.json(info);
        })
    }catch(err){
        res.json(err);
    }
})

// logout
app.post('/logout', (req,res) =>{
    
    res.cookie('token','').json('ok');
    
})


// creating a blog
app.post('/post', uploadMiddleware.single('file'), async (req,res) =>{
    try{
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path, newPath);

        const {token} = req.cookies;
        jwt.verify(token, secret, {}, async (err, info)=>{
            if(err) throw err;
            
            const {title,summary,content} = req.body;

            const postDoc = await Post.create({
                title, 
                summary,
                content,
                cover: newPath,
                author: info.id,
            })
            res.json(postDoc);
        })
    }catch(err){
        res.json(err);
    }
})

// updating blog
app.put('/post', uploadMiddleware.single('file'), async(req,res)=>{
    
    try{
        let newPath = null;
        if(req.file){
            const {originalname, path} = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path +'.'+ ext;
            fs.renameSync(path, newPath);
        }

        const {token} = req.cookies;
        jwt.verify(token, secret, {}, async (err, info)=>{
            if(err) throw err;
            
            const {id, title,summary,content} = req.body;
            const postDoc = await Post.findById(id);
            
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            
            if(!isAuthor){
                return res.status(400).json("Only Authors are allowed to edit");
            }

            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = newPath ? newPath : postDoc.cover;
            await postDoc.save();

            res.json(postDoc); 
        });
    }catch(err){
        res.json(err);
    }
});


// deleting blog
app.delete('/post/:id', async(req,res)=>{

    const {id} = req.params;
    try{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        
        const delPostDoc = await Post.findByIdAndDelete(id);
        res.json(delPostDoc); 
    });

    // if(check){
    //     alert('Blog deleted')
    // }
    }catch(err){
        res.json(err);
    }
});



// displaying all posts
app.get('/post', async (req,res)=>{
    try{
        res.json(await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20));
    }catch(err){
        res.json(err);
    }
})


//displaying specific post
app.get('/post/:id', async(req,res)=>{
    
    const {id} = req.params;
    try{
        if(id){
            const postDoc = await Post.findById(id).populate('author', ['username']);
            res.json(postDoc);
        }
    }
    catch(err){
        res.json(err);
    }
})




app.listen(4000, () => console.log("server running"));


