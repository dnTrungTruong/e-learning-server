const Quiz = require('../models/quiz.model')
const Section = require('../models/section.model')


exports.createQuiz = function (req, res, next) {
    const quiz = new Quiz(req.body);

    Section.findById(quiz.section, function (err, result) {
        if (err) {
            next(err);
        }
        else {
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
    Quiz.findById({ _id: req.params.id },
        ['name', 'section', 'course', 'questions.question', 'questions.answers'],
        function (err, quiz) {
            if (err) {
                next(err);
            }
            else {
                //shuffle the questions before sending back to client
                const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
                quiz.questions = shuffledQuestions;

                res.status(200).json({ message: "success", data: quiz });
            }
        });
}


exports.submitQuiz = function (req, res, next) {
    Quiz.findById({ _id: req.params.id },
        ['questions.question', 'questions.correctAnswer'],
        function (err, quiz) {
            if (err) {
                next(err);
            }
            else {
                totalQuestions = quiz.questions.length;
                correctAnswer = 0;
                quiz.questions.forEach(function (quizQuestion) {
                    const i = req.body.questions.findIndex(function (submittedQuestion) {
                        return submittedQuestion.question == quizQuestion.question;
                    });
                    if (i != -1) {
                        if (req.body.questions[i].answer == quizQuestion.correctAnswer) {
                            correctAnswer += 1;
                        }
                    }
                })
                totalScore = (correctAnswer / totalQuestions) * 10;
                res.status(200).json({
                    message: "success",
                    data: {
                        'questions': quiz.questions,
                        'correctAnswers': correctAnswer,
                        'totalScore': totalScore.toFixed(2)
                    }
                });
            }
        })
}

exports.editQuiz = function (req, res, next) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
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
            Section.findById(quiz.section, function (err, result) {
                if (err) {
                    next(err);
                }
                else { //Delete quiz in the section first
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