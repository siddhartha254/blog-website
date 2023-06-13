const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://user:admin@cluster0.dptwbfi.mongodb.net/?retryWrites=true&w=majority')

const salt = bcrypt.genSaltSync(10);
const secret = "ewfhiewofuoewbfwevew";

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

app.post('/login', async (req,res)=>{
   
    const {username, password} = req.body;    
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    
    if(passOk){
        jwt.sign({username, id: userDoc._id}, secret, {}, (err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json('ok');
        })
    }
    else{
        res.status(400).json("Wrong Username or Password");
    }
});


app.get('/profile', (req,res) =>{
    const {token} = req.cookies; 
    jwt.verify(token, secret, {}, (err, info)=>{
        if(err) throw err;
        res.json(info);
    })
})

app.listen(4000, () => console.log("server running"));


