const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User = require('../models/User');
const { registerValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const sendmail = require('../config/sendmail')


//connect to db
mongoose.connect(process.env.DB_CONNECTION, () => 
console.log('connected to database'))   

router.post('/register', async (req,res) => {

    //Validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if user exists
    const emailExists = await User.findOne({  email: req.body.email })
    if(emailExists) return res.status(400).send('Email already exists')


    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create activation code
    activationcode = Math.floor(Math.random() * (8888) + 1111)

    //Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        status: "Created",
        activationcode: activationcode
    });

    try{
        const savedUserStatus = await user.save();
        res.send({ user: user._id, savedUserStatusDate : savedUserStatus.date});
    } catch(err){
        res.json({ message: err})
    }

    sendmail(req.body.email,"Verify email","Please use this activation code to verify your account : "+activationcode)
})

router.delete('/register', async (req,res) => {

    //Validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if user exists
    const user = await User.findOne({  email: req.body.email })
    if(!user) return res.status(400).send('Email does not exist')

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send('Invalid Password');


    try{  
        const updateUser = await User.deleteOne(
            { email: req.body.email }
        );
        return res.json(updateUser)
      } catch (err){
        return res.json({ message: err})
      }  

})

router.post('/verify', async (req,res) => {

    //Check if email exists
    const user = await User.findOne({  email: req.body.email })
    if(!user) return res.status(400).send('Email does not exists')

    if( user.activationcode == req.body.activationcode){
        updatedUser = await User.updateOne(
            { email: req.body.email }, 
            {$set: {status: "Activated"}});

        sendmail(req.body.email,"Account Verified"," The account has been activated ")
    
        return res.status(200).send('Account has been verified')
    } else {
        return res.status(400).send('Verification code does not match')
    }

    
})

router.post('/login', async (req,res) => {

    //Validation
    //const { error } = loginValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);

    //Check if email exists
    const user = await User.findOne({  email: req.body.email })
    if(!user) return res.status(400).send('Email does not exists')

    //Check if account is activated
    if(user.status != "Activated") return res.status(400).send('Account is not active')

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send('Invalid Password');

    const token = jwt.sign({ _id: user._id,
                              name: user.name,
                              email: user.email,
                              role: user.role
                             }, process.env.TOKEN_SECRET,
                             { expiresIn: "7 days"}
    );
    
    res.header('auth-token', token).send(token);

    
})

module.exports = router;