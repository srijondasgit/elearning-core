const express = require('express');
const router = express.Router();
const verify = require('./verifyToken') 
const board = require('../models/board.js') 
const { charityValidation } = require('../validation')
const User = require('../models/User');
const sendmail = require('../config/sendmail')
// const jwt = require('jsonwebtoken');
// const TicketSchema = require('../models/tickets.js')

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

//create board
router.post('/createBoard', verify, checkRole(['Admin']), async (req, res) => {

    const boardInstance = new board({
        boardName : req.body.boardName,
        boardDescription : req.body.boardDescription,
        boardVersion : req.body.boardVersion,
        governmentId : req.body.governmentId,
        status : "Created",
        subjects : []
    });

    try{
        const savedBoard = await boardInstance.save();
        return res.json(savedBoard);
    } catch (err){
        return res.json({ message: err})
    }
});

//get board details
router.get('/boardId/:boardId/getBoard', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findOne({  _id: req.params.boardId })
    return res.json(boardInstance);
});

//add class to board
router.patch('/boardId/:boardId/addClass', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.updateOne(
            { _id: req.params.boardId}, 
            {$push: {class: 
                {
                    description: req.body.description,
                    subjects: []
                }
            }
        });

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//remove class from board
router.delete('/boardId/:boardId/classId/:classId/removeClass', verify, checkRole(['Admin']), async (req, res) => {
    try{  
        const updateBoard = await board.updateOne(
            { _id: req.params.boardId}, 
            {$pull: {class: 
                        {
                            _id: req.params.classId
                        }
            }
        });
        return res.json(updateBoard)
      } catch (err){
        return res.json({ message: err})
      }  
});

//get class details using boardid, classid
router.get('/boardId/:boardId/classId/:classId/getClass', verify, checkRole(['Admin']), async (req, res) => {
    const classInstance = await board.find({ "_id": req.params.boardId, "class._id": req.params.classId})
    return res.json(classInstance);
});

//add/modify subject to board, class
router.patch('/boardId/:boardId/classId/:classId/addSubject', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId, "class._id": req.params.classId},
            {$push: 
                {"class.$.subjects": 
                    {
                        subjectName: req.body.subjectName, 
                        chapter: [] 
                    }
                }
            }
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})



module.exports = router;




//only superadmin allowed to change status of Charity, 
//every Charity needs to be in Approved status before Raffle events can be created for that Charity
router.patch('/:charityId/changeStatus', verify, checkRole(['SuperAdmin']), async (req, res) => {
    try{
        
        const updateCharityStatus = await charities.updateOne(
            { _id: req.params.charityId}, 
            {$set: {status: req.body.status}});

        const findCharity = await charities.findOne({ _id: req.params.charityId})

        //console.log("find charity email: "+findCharity.ownerEmail)
        //send email that charity has been registered
        sendmail(findCharity.ownerEmail,"Your Charity status has changed","Charity status has changed with current status : " +findCharity.status)

        return res.json(updateCharityStatus)
      } catch (err){
        return res.json({ message: err})
      }
      
      //send email that charity has been changed the status
  })

module.exports = router;

//create board
//add/modify class to board
//add/modify subject to board, class
//add/modify chapter to board, class, subject
//add/modify chapter desc to board, class, subject, chapter
//add/modify media to board, class, subject, chapter
//add/modify questions to board, class, subject, chapter

//remove board
//remove class from board
//remove subject to board, class
//remove chapter to board, class, subject
//remove chapter desc to board, class, subject, chapter
//remove media to board, class, subject, chapter
//remove questions to board, class, subject, chapter