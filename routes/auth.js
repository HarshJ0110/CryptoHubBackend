const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser");
const JWT_SECRET = process.env.JWT_SECRET;

// Route:1 Create a user signup: POST "/api/auth/createuser".
router.post("/createuser", async (req,res)=>{
    try{
        let sucess = false;
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({ error: "Sorry user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data ={
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        sucess = true;
        res.json({sucess, authtoken});
    }catch(error){
        res.status(500).json("Internal server error");
    }
})

// Route:2 Create a user login: POST "/api/auth/".
router.post("/login", async (req,res)=>{
    try{
        let sucess = false;
        const {email, password} = req.body;
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password,user.password)
        if (!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials" })
        }
        const data ={
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        sucess = true;
        const name = user.name;
        res.json({name, sucess, authtoken});
        
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports = router