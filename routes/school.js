const express = require('express');
const router = express.Router();
const verify = require('./verifyToken') 
const board = require('../models/board.js') 
const { charityValidation } = require('../validation')
const User = require('../models/User');
const sendmail = require('../config/sendmail')
const School = require('../models/school.js') 

const checkRole = roles => async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (roles.includes(user.role)){
        return next();
    }
    return res.status(401).json({
        message: "Unauthorized",
        success: false
    });
}

//get all schools
router.get('/getAllSchools', async (req, res) => {
    const schoolInstance = await school.find()
    const result = schoolInstance.map(a => ({"_id": a._id,"schoolName": a.schoolName}))
    return res.json(result);
});

//create school
router.post('/createSchool', verify, checkRole(['SchoolAdmin']), async (req, res) => {

    const schoolInstance = new School({
        indx: req.body.indx,
        schoolName: req.body.schoolName,
        schoolDescription: req.body.schoolDescription,
        boardassigned: req.body.boardassigned,
        governmentId: req.body.governmentId,
        status: "Created"
    });

    try{
        const savedSchool = await schoolInstance.save().then(result => {
            School
               .populate(schoolInstance, { path: "boardassigned"})
               .then(school => {
                  res.json({
                     message: "Board added",
                     school
                  });
         
               })
         });
    } catch (err){
       return res.json({ message: err})
    }
});


module.exports = router;