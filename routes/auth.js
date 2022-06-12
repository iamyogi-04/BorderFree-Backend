const express = require('express');
const User = require('../models/User')
const router= express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require('bcryptjs');
const JWT_SECRET = "iamgood$boy";
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");


router.get('/',(req,res)=>{
    res.send('hello from router')
})


///register a new user


router.post('/register',
[
    // limiting the length and type of users.
    body("name").isLength({ min: 4 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
 async (req,res)=>{

     // validating the errors if present or not.
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }


    const {name,lastname,email,phone,password} = req.body;

    
    //if user skips one of these
    if(!name|| !lastname|| !email || !phone || !password ){
        return res.status(422).json({error:"please fill all details"})
    }

    ///email should be unique
    try {
       let user= await User.findOne({email:email})
       if(user){
        return res.status(422).json({error:"email already exists"})
        }
        const salt = await bcrypt.genSalt(10); 
        const secPass = await bcrypt.hash(req.body.password, salt);
        // creating new user.
        user = await User.create({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            phone:req.body.phone,
            password: secPass,
            
          });
          
          //sending data to response.
          res.json({ message:"user registered sucessfully",user});

        
    }
    catch(error)
    {
        console.error(error.message)
        res.status(500).send("error occured while registration ")
    }



})

//loginroute

router.post('/signin',
    [
    // limiting the length and type of users.
    body("email", "Please enter the valid email").isEmail(),
    body("password", "Please enter a valid password").exists(),
     ],
     async function (req, res) {
        // validating the errors if present or not.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
          let user = await User.findOne({ email });
          if (!user) {
            res
              .status(400)
              .send({ error: "Please try to login using valid credentials" });
          }
          //comparing passwords
          const comparePassword = await bcrypt.compare(password, user.password);
          if (!comparePassword) {
            res
              .status(400)
              .send({ error: "Please try to login using valid credentials" });
          }
          // object
          const data = {
            user: {
              id: user.id,
            },
          };
          // creating auth-token
          const authtoken = jwt.sign(data, JWT_SECRET);
          // send response
          res.json({ message:"user successfully signed",authtoken });
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
        }
      }
)

//get user
router.post("/getuser", fetchuser, async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
// jwt jwt.compare
// 
module.exports = router;