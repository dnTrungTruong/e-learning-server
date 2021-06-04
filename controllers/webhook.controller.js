const dfff = require('dialogflow-fulfillment');
const Subject = require('../models/subject.model')
const Course = require('../models/course.model')

exports.chatbotWebhookCall = function (req, res, next) {
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });


    function demoFunction(agent) {
        agent.add("Demo response from webhook");
    }
    var intentMap = new Map();
    intentMap.set('listAvailableSubjects', listSubjects);
    intentMap.set('suggestCoursesBySubject', suggestCoursesBySubject);

    agent.handleRequest(intentMap);
}

function coursesListToResponse(coursesList) {
    let response = [];
    const courseDetailsPage = "http://localhost:4200/course/";
    for (let i = 0; i < coursesList.length; i++) {
        if (i > 0) {
            response.push({ type: "divider" });
        }
        let course = {};
        course.type = "info";
        course.title = coursesList[i].name;
        course.subtitle = "Instructor: " + coursesList[i].instructor.firstname + " " + coursesList[i].instructor.lastname;
        course.image = {
            src: {
                rawUrl: coursesList[i].img_url
            }
        };
        course.actionLink = courseDetailsPage + coursesList[i]._id;
        response.push(course);
    }

    return response;
}

function listSubjects(agent) {
    return Subject.find()
        .then((result) => {
            if (!result.length) {
                return agent.add("I'm sorry, but I couldn't find any available subjects.");
            }

            let descriptionText = [];
            descriptionText.push(`Currently we have ${result.length} available subjects. Which are:`);
            // agent.add(`Currently we have ${result.length} available subjects. Which are:`);
            let subjectsString = "";
            for (let i = 0; i < result.length; i++) {
                if (i == 0) {
                    subjectsString += result[i].name;
                }
                else {
                    subjectsString += (", " + result[i].name);
                }
            }
            // agent.add(subjectsString);
            descriptionText.push(subjectsString);

            let payload = {
                "richContent": [
                    [
                        {
                            "type": "description",
                            "title": "Check out our available subjects",
                            "text": descriptionText
                        },
                    ]
                ]
            };
            agent.add(new dfff.Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }));
        })
        .catch((err) => {
            agent.add("Something went wrong. ", err);
        })
}

function suggestCoursesBySubject(agent) {
    var subjectName = agent.context.get("awaiting_subjectoptional").parameters.Subject_Name;

    // return Subject.findOne({ name: { "$regex": subjectName, "$options": "i" } })
     return Subject.findOne({ $text: { $search: subjectName } })
        .then((subject) => {
            if (!subject) {
                if (subjectName) {
                    //User give subject but no match in DB
                    agent.add("Sorry I didn't get that subject.");
                }
                else {
                    //User didn't give subject
                    agent.add("Okay... I see");
                }
                //
                return Course.find({ tags: "hot" })
                    .and([{ status: "approved" }])
                    .populate('instructor', 'firstname lastname')
                    .then((result) => {
                        if (!result.length) {
                            return agent.add("Please try again.");
                        }

                        agent.add("Why don't you take a look at our hot courses?");

                        let response = coursesListToResponse(result);

                        const payload = {
                            "richContent": [
                                response
                            ]
                        };

                        agent.add(new dfff.Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }));
                    })
                    .catch((err) => {
                        agent.add("Something went wrong. " + err);
                    })
                //
            }
            //Found a match subject, suggesting courses in this subject
            return Course.find({ subject: subject._id })
                .and([{ status: "approved" }])
                .populate('instructor', 'firstname lastname')
                .then((result) => {
                    if (!result.length) {
                        return agent.add("I'm sorry, but I couldn't find any match courses.");
                    }

                    agent.add("Check out what I found");

                    let response = coursesListToResponse(result);

                    const payload = {
                        "richContent": [
                            response
                        ]
                    };

                    agent.add(new dfff.Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }));
                })
                .catch((err) => {
                    agent.add("Something went wrong. " + err);
                })
        })
        .catch((err) => {
            agent.add("Something went wrong. " + err);
        })
}

