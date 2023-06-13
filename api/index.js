const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://user:admin@cluster0.dptwbfi.mongodb.net/?retryWrites=true&w=majority')

const salt = bcrypt.genSaltSync(10);

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
    res.json(passOk);
});

app.listen(4000, () => console.log("server running"));


