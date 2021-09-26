const express = require('express');
const router = express.Router();
const verify = require('./verifyToken') 
const board = require('../models/board.js') 
//const { charityValidation } = require('../validation')
const User = require('../models/User');
const sendmail = require('../config/sendmail')
const school = require('../models/school.js') 

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

//get one board by description
router.post('/getOneBoardByDescription', async (req, res) => {
    try{
        const boardInstance = await board.findOne({  boardName: req.body.boardName })
        return res.json(boardInstance._id);
    } catch (err){
    return res.json("No boardId found")
    }
});

//get all boards
router.get('/getAllBoards', async (req, res) => {
    const boardInstance = await board.find()
    const result = boardInstance.map(a => ({"_id": a._id,"boardName": a.boardName}))
    return res.json(result);
});

//get board details
router.get('/boardId/:boardId/getBoard', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const boardInstance = await board.findOne({  _id: req.params.boardId })
        return res.json(boardInstance);
    } catch (err){
    return res.json({ message: err})
    }
});

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

//modify board 
router.patch('/boardId/:boardId/modifyBoard', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const findBoard= await board.findById({"_id": req.params.boardId});
        const curr_class = findBoard.class

        const updateBoard = await board.findOneAndUpdate(
            { "_id": req.params.boardId}, 
            {$set: 
                {
                    boardName: req.body.boardName,
                    boardDescription: req.body.boardDescription,
                    boardVersion: req.body.boardVersion,
                    governmentId: req.body.governmentId,
                    status: req.body.status,
                    class: curr_class
                }
            }
        ); 
 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

// delete board
router.delete('/boardId/:boardId/', verify, checkRole(['Admin']), async (req, res) => {
    try{  
        const updateBoard = await board.deleteOne(
            { _id: req.params.boardId}, 
        );
        return res.json(updateBoard)
      } catch (err){
        return res.json({ message: err})
      }  
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

        const newBoard = await board.findOne({ _id: req.params.boardId})
        
        return res.json(newBoard.class[newBoard.class.length - 1]._id)
    } catch (err){
      return res.json({ message: err})
    }
})

//modify class associated with board
router.patch('/boardId/:boardId/classId/:classId/modifyClass', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const findSubject= await board.findById({"_id": req.params.boardId});
        const result= findSubject.class.id(req.params.classId);
        const curr_subjects = result.subjects

        //return res.json(result )
        const updateBoard = await board.findOneAndUpdate(
            { "_id": req.params.boardId, "class._id": req.params.classId}, 
            {$set: 
                {"class.$[e1]": 
                    {
                        "indx": req.body.indx,
                        "description": req.body.description,
                        "subjects": curr_subjects
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId}
                            ]}
            ); 
        return res.json(updateBoard)
    } catch (err){
        return res.json({ message: err})
    }
})

//remove class from board
router.delete('/boardId/:boardId/classId/:classId/', verify, checkRole(['Admin']), async (req, res) => {
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

//get class details by boardId and class description
router.post('/boardId/:boardId/getClassByDesc', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    //const classInstance= boardInstance.class[0]
    boardInstance.class.forEach(element => { 
        if(element.description === req.body.classDescription) {
            return res.json(element)} 
        
    });
        
    return res.json("Description not found");
});

//get classId details by boardId and class description
router.post('/boardId/:boardId/getClassIdByDesc', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    //const classInstance= boardInstance.class[0]
    boardInstance.class.forEach(element => { 
        if(element.description === req.body.classDescription) {
            return res.json(element._id)} 
        
    });
        
    return res.json("Description not found");
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
        const updateBoard = await board.updateOne(
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

        const newBoard = await board.findOne({ _id: req.params.boardId})
        const result = newBoard.class.id(req.params.classId).subjects[newBoard.class.id(req.params.classId).subjects.length -1]._id

        return res.json(result)

    } catch (err){
      return res.json({ message: err})
    }
});

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
});

//remove subject from board, class
router.delete('/boardId/:boardId/classId/:classId/subjectId/:subjectId', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$pull: 
                {"class.$[e1].subjects": 
                    {
                        _id: req.params.subjectId
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId}]
            }
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
});

//get subject details using boardid, classid, subject
router.get('/boardId/:boardId/classId/:classId/subjectId/:subjectId/getSubject', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    const subjectInstance= boardInstance.class.id(req.params.classId).subjects.id(req.params.subjectId)
        
    return res.json(subjectInstance);
});

//get subject details by boardId, classId and subject name
router.post('/boardId/:boardId/classId/:classId/getSubjectByName', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    boardInstance.class.id(req.params.classId).subjects.forEach(element => { 
        if(element.subjectName === req.body.subjectName) {
            return res.json(element)} 
        
    });
        
    return res.json("Subject name not found");
});

//get subjectId by boardId, classId and subject name
router.post('/boardId/:boardId/classId/:classId/getSubjectIdByName', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    boardInstance.class.id(req.params.classId).subjects.forEach(element => { 
        if(element.subjectName === req.body.subjectName) {
            return res.json(element._id)} 
        
    });
        
    return res.json("Subject name not found");
});

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

        const newBoard = await board.findOne({ _id: req.params.boardId})
        leng = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.length
        const result = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter[leng -1]._id

        return res.json(result)
    } catch (err){
      return res.json({ message: err})
    }
});

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

//remove chapter from board, class, subject
router.delete('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$pull: 
                {"class.$[e1].subjects.$[e2].chapter": 
                    {
                        _id: req.params.chapterId
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId}]
            }
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//get chapter details using boardid, classid, subject, chapter
router.get('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/getChapter', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    const chapterInstance= boardInstance.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId)
        
    return res.json(chapterInstance);
});

//get media details using boardid, classid, subject, chapter, media
router.get('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/mediaId/:mediaId/getMedia', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    const mediaInstance= boardInstance.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).media.id(req.params.mediaId)
        
    return res.json(mediaInstance);
});

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

        const newBoard = await board.findOne({ _id: req.params.boardId})
        leng = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).media.length
        const result = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).media[leng - 1]._id

        return res.json(result)
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

//remove media from board, class, subject, chapter
router.delete('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/mediaId/:mediaId', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$pull: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].media": 
                    {
                        _id: req.params.mediaId
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId},
                            {"e4._id": req.params.mediaId}]
            }
        ); 

        return res.json(updateBoard)
    } catch (err){
      return res.json({ message: err})
    }
})

//get questions using boardid, classid, subject, chapter, questions
router.get('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/questionId/:questionId/getQuestion', verify, checkRole(['Admin']), async (req, res) => {
    const boardInstance = await board.findById({ "_id": req.params.boardId})
    const questionInstance= boardInstance.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).questions.id(req.params.questionId)
        
    return res.json(questionInstance);
});

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
                            {"e3._id": req.params.chapterId}]}
        ); 

        const newBoard = await board.findOne({ _id: req.params.boardId})
        leng = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).questions.length
        const result = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).questions[leng - 1]._id

        return res.json(result)
    } catch (err){
      return res.json({ message: err})
    }
})

//add bulk questions to board, class, subject, chapter
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/addBulkQuestions', verify, checkRole(['Admin']), async (req, res) => {
    try{
        req.body.bulkQuestions.forEach(async element => { 
            await board.update(
                { "_id": req.params.boardId}, 
                {$push: 
                    {"class.$[e1].subjects.$[e2].chapter.$[e3].questions": 
                        {
                            indx: element.indx,
                            description: element.description,
                        }
                    }
                },
                {arrayFilters: [{"e1._id": req.params.classId},
                                {"e2._id": req.params.subjectId},
                                {"e3._id": req.params.chapterId}]}
            ); 
        });

        const newBoard = await board.findOne({ _id: req.params.boardId})
        leng = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).questions.length
        const result = newBoard.class.id(req.params.classId).subjects.id(req.params.subjectId).chapter.id(req.params.chapterId).questions[leng - 1]._id

        return res.json(result)
    } catch (err){
      return res.json({ message: err})
    }
})

//modify questions associated with board, class, subject, chapter
router.patch('/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/questionId/:questionId/modifyQuestion', verify, checkRole(['Admin']), async (req, res) => {
    try{
        const updateBoard = await board.update(
            { "_id": req.params.boardId}, 
            {$set: 
                {"class.$[e1].subjects.$[e2].chapter.$[e3].questions.$[e4]": 
                    {
                        indx: req.body.indx,
                        description: req.body.description
                    }
                }
            },
            {arrayFilters: [{"e1._id": req.params.classId},
                            {"e2._id": req.params.subjectId},
                            {"e3._id": req.params.chapterId},
                            {"e4._id": req.params.questionId}
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
