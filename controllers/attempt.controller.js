const Attempt = require('../models/attempt.model')
const Quiz = require('../models/quiz.model')
const Course = require('../models/course.model')
const Certificate = require('../models/certificate.model')
const User = require('../models/user.model')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

exports.createAttempt = function (req, res, next) {
    //TODO: Use Joi to validate
    if (!mongoose.isValidObjectId(req.body.course)) {
        return res.status(200).json({ message: "Provided quiz is not a valid ObjectId" });
    }
    const attempt = new Attempt(req.body);

    attempt.user = res.locals.user.sub;

    Course.findById(req.body.course)
        .populate('sections')
        .exec(function (err, course) {
            if (err) {
                next(err);
            }
            else {
                if (!course) {
                    return res.status(200).json({ message: "Provided course is not a valid" });
                }
                course.sections.forEach(function (section) {
                    if (section.quiz) {
                        attempt.quizzes.push({
                            quiz: ObjectId(section.quiz)
                        })
                    }
                });
                User.updateOne({ _id: res.locals.user.sub }, { $push: { attempts: attempt._id } }, function (err) {
                    if (err) {
                        next(err);
                    }
                    else {
                        console.log(attempt);
                        attempt.save(function (err, createdAttempt) {
                            if (err) {
                                next(err)
                            }
                            else {
                                Attempt.findOne({ user: res.locals.user.sub, course: req.body.course })
                                    .populate('course', 'name type')
                                    .populate({
                                        path: 'quizzes.quiz',
                                        model: 'Quiz',
                                        select: ['name', 'limitTime']
                                    })
                                    .exec(function (err, attempt) {
                                        if (err) {
                                            next(err);
                                        }
                                        else {
                                            if (!attempt) {
                                                return res.status(200).json({ message: "Created but no callback result" });
                                            }
                                            res.status(200).json({ message: "success", data: attempt });
                                        }
                                    })
                            }
                        })
                    }
                })

            }
        })
}

exports.getAttempt = function (req, res, next) {
    Attempt.findOne({ user: res.locals.user.sub, course: req.params.id }, function (err, attempt) {
        if (err) {
            next(err);
        }
        else {
            if (!attempt) {
                return res.status(200).json({ message: "No result" });
            }
            res.status(200).json({ message: "success", data: attempt });
        }
    })
}

exports.getAttemptByQuiz = function (req, res, next) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
            if (!quiz) {
                return res.status(200).json({ message: "Provided quiz is not valid" });
            }
            Attempt.findOne({ user: res.locals.user.sub, course: quiz.course })
                .populate('course', 'name type')
                .populate({
                    path: 'quizzes.quiz',
                    model: 'Quiz',
                    select: ['name', 'limitTime', 'isFinal']
                })
                .exec(function (err, attempt) {
                    if (err) {
                        next(err);
                    }
                    else {
                        if (!attempt) {
                            return res.status(200).json({ message: "No result" });
                        }
                        const index = attempt.quizzes.findIndex(function (quizzes) {
                            return quizzes.quiz.equals(quiz._id);
                        });
                        //Check if quiz exist in attempt.quizzes
                        if (index < 0) {
                            attempt.quizzes.push({
                                quiz: ObjectId(quiz._id),
                                attempts: [],
                                highestScore: 0,
                                isPassed: false
                            });
                            attempt.save(function (err, updatedAttempt) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    Attempt.findOne({ user: res.locals.user.sub, course: quiz.course })
                                        .populate('course', 'name type')
                                        .populate({
                                            path: 'quizzes.quiz',
                                            model: 'Quiz',
                                            select: ['name', 'limitTime', 'isFinal']
                                        })
                                        .exec(function (err, attempt) {
                                            if (err) {
                                                next(err);
                                            }
                                            else {
                                                if (!attempt) {
                                                    return res.status(200).json({ message: "Attempt updated but no callback result" })
                                                }
                                                res.status(200).json({ message: "success", data: attempt })
                                            }
                                        })
                                }
                            })
                        }
                        else {
                            res.status(200).json({ message: "success", data: attempt });
                        }
                    }
                })
        }
    })

}

exports.putNewAttempt = function (req, res, next) {
    //TODO: Use Joi to validate
    if (!mongoose.isValidObjectId(req.body.quiz)) {
        return res.status(200).json({ message: "Provided quiz is not a valid ObjectId" });
    }
    Quiz.findById(req.body.quiz, function (err, quiz) {
        if (err) {
            next(err);
        }
        else {
            if (!quiz) {
                return res.status(200).json({ message: "Provided quiz is not valid" });
            }
            Attempt.findById(req.params.id, function (err, attempt) {
                if (!attempt) {
                    return res.status(200).json({ message: "Provided attempt is not valid" });
                }



                //shuffle the questions before sending back to client
                const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
                quiz.questions = shuffledQuestions;
                for (let question of quiz.questions) {
                    const shuffledQuestion = question.answers.sort(() => Math.random() - 0.5);
                    question = shuffledQuestion;
                }

                if (attempt.quizzes.filter(e => e.quiz == req.body.quiz).length > 0) {
                    const index = attempt.quizzes.findIndex(function (quizzes) {
                        return quizzes.quiz.equals(quiz._id);
                    });
                    //Check if all the quiz is passed if quiz is final
                    if (quiz.isFinal) {
                        for (let i = 0; i < attempt.quizzes.length; i++) {
                            if (i != index) {
                                if (attempt.quizzes[i].isPassed == false) {
                                    return res.status(200).json({ message: "Please pass all the quizzes before starting final quiz." });
                                }
                            }
                        }
                    }
                    if (attempt.quizzes[index].attempts.length > 1) {
                        return res.status(200).json({ message: "You can only have 2 attempts each quiz." });
                    }
                    attempt.quizzes[index].attempts.push({
                        questions: quiz.questions,
                        attemptDate: Date.now(),
                        attemptEndTime: Date.now() + quiz.limitTime * 1000
                    });
                }
                else {
                    //In case Attemp doesn't have this quiz in quizzes 
                    //Check if all the quiz is passed if quiz is final
                    if (quiz.isFinal) {
                        for (let i = 0; i < attempt.quizzes.length; i++) {
                            if (attempt.quizzes[i].isPassed == false) {
                                return res.status(200).json({ message: "Please pass all the quizzes before starting final quiz." });
                            }
                        }
                    }
                    attempt.quizzes.push({
                        quiz: ObjectId(quiz._id),
                        attempts: [{
                            questions: quiz.questions,
                            attemptDate: Date.now(),
                            attemptEndTime: Date.now() + quiz.limitTime * 1000
                        }],
                    })
                }

                attempt.save(function (err, updatedAttempt) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.status(200).json({ message: "success", data: updatedAttempt })
                    }
                });
            })
        }
    })
}

exports.updateUserAnswers = function (req, res, next) {
    if (!mongoose.isValidObjectId(req.body.quiz)) {
        return res.status(200).json({ message: "Provided quiz is not a valid ObjectId" });
    }
    Attempt.findById(req.params.id, function (err, attempt) {
        if (!attempt) {
            return res.status(200).json({ message: "Provided attempt is not valid" });
        }
        let index = attempt.quizzes.findIndex(function (quizzes) {
            //return quizzes.quiz == req.body.quiz;
            return quizzes.quiz.equals(req.body.quiz);
        });
        if (index == -1) {
            return res.status(200).json({ message: "Provided quiz is not valid" });
        }
        if (attempt.quizzes[index].attempts.length - 1 < 0) {
            return res.status(200).json({ message: "Please start the quiz attempt before updating user answers" });
        }
        if (attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].attemptEndTime < Date.now()) {
            return res.status(200).json({ message: "Submission time has expired" });
        }
        attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].questions = req.body.questions;

        attempt.save(function (err, updatedAttempt) {
            if (err) {
                next(err);
            }
            else {
                res.status(200).json({ message: "success", data: updatedAttempt })
            }
        });
    })
}

exports.submitAttempt = function (req, res, next) {
    //TODO: Count attempts, Check valid date
    if (!mongoose.isValidObjectId(req.body.quiz)) {
        return res.status(200).json({ message: "Provided quiz is not a valid ObjectId" });
    }
    Quiz.findById({ _id: req.body.quiz },
        ['questions.question', 'questions.correctAnswer'],
        function (err, quiz) {
            if (err) {
                next(err);
            }
            else {
                if (!quiz) {
                    return res.status(200).json({ message: "Provided quiz is not valid" });
                }

                Attempt.findById(req.params.id, function (err, attempt) {
                    if (!attempt) {
                        return res.status(200).json({ message: "Provided attempt is not valid" });
                    }
                    let index = attempt.quizzes.findIndex(function (quizzes) {
                        //return quizzes.quiz == quiz._id;
                        return quizzes.quiz.equals(quiz._id);
                    });
                    if (attempt.quizzes[index].attempts.length - 1 < 0) {
                        return res.status(200).json({ message: "Please start the quiz attempt before submitting" });
                    }
                    //Actual endtime will be endtime plus 30 seconds
                    if ((attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].attemptEndTime + 30 * 1000) < Date.now()) {
                        return res.status(200).json({ message: "Submission time has expired" });
                    }

                    if (attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].attemptSubmittedTime) {
                        return res.status(200).json({ message: "You have already subbmited this attemp" });
                    }
                    attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].attemptSubmittedTime = Date.now();
                    totalQuestions = quiz.questions.length;
                    let submittedQuestions = attempt.quizzes[index].attempts[attempt.quizzes[index].attempts.length - 1].questions;
                    let correctAnswer = 0;
                    quiz.questions.forEach(function (quizQuestion) {
                        if (submittedQuestions.length > 0) {
                            const i = submittedQuestions.findIndex(function (submittedQuestion) {
                                return submittedQuestion.question == quizQuestion.question;
                            });
                            if (i != -1) {
                                if (submittedQuestions[i].userAnswer == quizQuestion.correctAnswer) {
                                    correctAnswer += 1;
                                }
                            }
                        }
                    })

                    totalScore = ((correctAnswer / totalQuestions) * 10).toFixed(2)


                    //Method 1:
                    // let attempsArray = attemp.quizzes[index].attemps;
                    // let latestAttempIndex = attempsArray.length - 1;
                    // attempsArray[latestAttempIndex].questions = req.body.questions;
                    // attempsArray[latestAttempIndex].score = totalScore;
                    //attemp.quizzes[index].attemps = attempsArray;

                    //Method 2:
                    let attempNo = attempt.quizzes[index].attempts.length - 1;
                    // attempt.quizzes[index].attempts[attempNo].questions = req.body.questions;
                    attempt.quizzes[index].attempts[attempNo].score = totalScore;
                    attempt.quizzes[index].attempts[attempNo].correctAnswers = correctAnswer;

                    if ((attempt.quizzes[index].isPassed == false) && (totalScore >= 5)) {
                        attempt.quizzes[index].isPassed = true;
                    }

                    if (attempt.quizzes[index].highestScore < totalScore) {
                        attempt.quizzes[index].highestScore = totalScore;
                    }
                    attempt.save(function (err, updatedAttempt) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({ message: "success", data: updatedAttempt })
                        }
                    });
                })
            }
        })
}


