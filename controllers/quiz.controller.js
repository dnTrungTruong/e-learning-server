const Quiz = require('../models/quiz.model')
const Section = require('../models/section.model')


exports.createQuiz = function (req, res, next) {
    const quiz = new Quiz(req.body);

    Section.findById(quiz.section, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            if(!result) {
                return res.status(200).json({ message: "Provided section is not valid"}); 
            }
            //Check if section have a quiz
            if (result.quiz) {
                return res.status(200).json({ message: "Already have a quiz in section." })
            }
            else {
                result.quiz = quiz._id;

                result.save(function (err) {
                    if (err) {
                        next(err);
                    }
                    else {
                        quiz.save(function (err, createdQuiz) {
                            if (err) {
                                next(err)
                            }
                            else {
                                res.status(200).json({ message: "success", data: createdQuiz })
                            }
                        })
                    }
                })
            }
        }

    })
}

exports.getQuiz = function (req, res, next) {
    Quiz.findById({ _id: req.params.id })
    .populate('course', 'name type')
    .select('name section course limitTime')
    .exec(function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
            if(!quiz) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({ message: "success", data: quiz });
        }
    });
}
        


// exports.submitQuiz = function (req, res, next) {
//     Quiz.findById({ _id: req.params.id },
//         ['questions.question', 'questions.correctAnswer'],
//         function (err, quiz) {
//             if (err) {
//                 next(err);
//             }
//             else {
//                 if(!quiz) {
//                     return res.status(200).json({ message: "Provided quiz is not valid"}); 
//                 }
//                 totalQuestions = quiz.questions.length;
//                 correctAnswer = 0;
//                 quiz.questions.forEach(function (quizQuestion) {
//                     if (!req.body.questions) {
//                         return res.status(200).json({message: "Please provide answer for the quiz."})
//                     }
//                     const i = req.body.questions.findIndex(function (submittedQuestion) {
//                         return submittedQuestion.question == quizQuestion.question;
//                     });
//                     if (i != -1) {
//                         if (req.body.questions[i].userAnswer == quizQuestion.correctAnswer) {
//                             correctAnswer += 1;
//                         }
//                     }
//                 })
//                 totalScore = (correctAnswer / totalQuestions) * 10;
//                 res.status(200).json({
//                     message: "success",
//                     data: {
//                         'questions': quiz.questions,
//                         'correctAnswers': correctAnswer,
//                         'totalScore': totalScore.toFixed(2)
//                     }
//                 });
//             }
//         })
// }

exports.editQuiz = function (req, res, next) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
            if(!quiz) {
                return res.status(200).json({ message: "Provided quiz is not valid"}); 
            }
            quiz.name = req.body.name || quiz.name;
            quiz.questions = req.body.questions || quiz.questions;

            quiz.save(function (err, updatedQuiz) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({ message: "success", data: updatedQuiz })
                }
            })
        }
    })
}

exports.deleteQuiz = function (req, res, next) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
            if(!quiz) {
                return res.status(200).json({ message: "Provided quiz is not valid"}); 
            }
            Section.findById(quiz.section, function (err, result) {
                if (err) {
                    next(err);
                }
                else { 
                    if(!result) {
                        return res.status(200).json({ message: "Provided quiz is not valid"}); 
                    }
                    //Delete quiz in the section first
                    result.quiz = undefined;
                    result.save(function (err) {
                        if (err) {
                            next(err);
                        }
                        else { //then remove it from database
                            quiz.remove(function (err, deletedQuiz) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    res.status(200).json({ message: "success", data: deletedQuiz })
                                }
                            })
                        }
                    })

                }
            })

        }
    })
}