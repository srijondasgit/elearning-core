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
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    const classInstance= boardInstance.class.id(req.params.classId)
        
    return res.json(classInstance);
});

//add subject to board, class
router.patch('/boardId/:boardId/classId/:classId/addSubject', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { 
                "_id": req.params.boardId, 
                "class._id": req.params.classId
            },
            {$push: 
                {"class.$.subjects": 
                    {
                        indx: req.body.indx,
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

//modify subject associated with board, class
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/modifySubject', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const findSubject= await board.findById({"_id": req.params.boardId});
        const result= findSubject.class.id(req.params.classId).subjects.id(req.params.subjectId);
        const curr_chapter = result.chapter

        const updateBoard = await board.findOneAndUpdate(
            { "_id": req.params.boardId}, 
            {$set: 
                {"class.$[e1].subjects.$[e2]": 
                    {
                        "indx": req.body.indx,
                        "subjectName": req.body.subjectName,
                        "chapter": curr_chapter
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId}
                            ]}
        ); 
 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})


//add chapter to board, class, subject
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/addChapter', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$push: 
                {"class.$[e1].subjects.$[e2].chapter": 
                    {
                        indx: req.body.indx,
                        chapterName: req.body.chapterName,
                        chapterDesc: req.body.chapterDesc,
                        questions: [],
                        media:[]
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId}
                            ]}
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//modify chapter details associated with chapterid
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/modifyChapter', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const findBoard= await board.findById({"_id": req.params.boardId});
        const result= findBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId);

        const curr_media = result.media
        const curr_questions = result.questions

        const updateBoard = await board.findOneAndUpdate(
            { "_id": req.params.boardId}, 
            {$set: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3]": 
                    {
                        "indx": req.body.indx,
                        "chapterName": req.body.chapterName,
                        "chapterDesc": req.body.chapterDesc,
                        "media": curr_media,
                        "questions" : curr_questions
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId}
                            ]}
        ); 
 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//add media to board, class, subject, chapter
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/addMedia', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$push: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].media": 
                    {
                        indx: req.body.indx,
                        name: req.body.name,
                        author: req.body.author,
                        aboutAuthor: req.body.aboutAuthor,
                        language: req.body.language,
                        url: req.body.url,
                        mediaType: req.body.mediaType
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId}
                            ]}
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//modify media associated with board, class, subject, chapter
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/mediaId/:mediaId/modifyMedia', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$set: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].media.$[e4]": 
                    {
                        indx: req.body.indx,
                        name: req.body.name,
                        author: req.body.author,
                        aboutAuthor: req.body.aboutAuthor,
                        language: req.body.language,
                        url: req.body.url,
                        mediaType: req.body.mediaType
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId},
                            {"e4._id": req.params.mediaId}
                            ]}
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//add questions to board, class, subject, chapter
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/addQuestion', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$push: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].questions": 
                    {
                        indx: req.body.indx,
                        description: req.body.description,
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId}
                            ]}
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//remove questions to board, class, subject, chapter
router.delete('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/questionId/:questionId', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$pull: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].questions": 
                    {
                        _id: req.params.questionId
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId},
                            {"e4._id": req.params.questionId}]
            }
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
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