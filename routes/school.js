const express = require('express');
const router = express.Router();
const verify = require('./verifyToken') 
const board = require('../models/board.js') 
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
        customboard: req.body.customboard,
        governmentId: req.body.governmentId,
        status: "Created"
    });

    try{
        const savedSchool = await schoolInstance.save().then(result => {
            School
               .populate(schoolInstance, { path: "boardassigned customboard"})
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

//get school by schoolId
router.get('/schoolId/:schoolId/', async (req, res) => {
    try{
        const schoolInstance = await School.findOne({  _id: req.params.schoolId }).populate('boardassigned customboard')
        return res.json(schoolInstance);
    } catch (err){
    return res.json({ message: err})
    }
});

//update school
router.patch('/schoolId/:schoolId/', verify, checkRole(['SchoolAdmin']), async (req, res) => {
    try{
        const findSchool= await School.findById({"_id": req.params.schoolId});
        const curr_schoolstatus = findSchool.status

        const updateSchool = await School.findOneAndUpdate(
            { "_id": req.params.schoolId}, 
            {$set: 
                {
                    indx: req.body.indx,
                    schoolName: req.body.schoolName,
                    schoolDescription: req.body.schoolDescription,
                    boardassigned: req.body.boardassigned,
                    customboard: req.body.customboard,
                    governmentId: req.body.governmentId,
                    status: curr_schoolstatus
                }
            }
        ); 
 

        return res.json(updateSchool)
    } catch (err){
      return res.json({ message: err})
    }
})

//update school status
router.patch('/schoolId/:schoolId/updateStatus', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const findSchool= await School.findById({"_id": req.params.schoolId});
        const curr_indx = findSchool.indx
        const curr_schoolName = findSchool.schoolName
        const curr_schoolDescription = findSchool.schoolDescription
        const curr_boardassigned = findSchool.boardassigned
        const curr_customboard = findSchool.customboard
        const curr_governmentId = findSchool.governmentId


        const updateSchool = await School.findOneAndUpdate(
            { "_id": req.params.schoolId}, 
            {$set: 
                {
                    indx: curr_indx,
                    schoolName: curr_schoolName,
                    schoolDescription: curr_schoolDescription,
                    boardassigned: curr_boardassigned,
                    customboard: curr_customboard,
                    governmentId: curr_governmentId,
                    status: req.body.status
                }
            }
        );
        return res.json(updateSchool)
    } catch (err){
      return res.json({ message: err})
    }
})


//delete school
router.delete('/schoolId/:schoolId/', verify, checkRole(['SchoolAdmin','Admin']), async (req, res) => {
    try{
        const deleteSchool= await School.findByIdAndDelete({"_id": req.params.schoolId});
        return res.json(deleteSchool)
    } catch (err){
      return res.json({ message: err})
    }
})


module.exports = router;



