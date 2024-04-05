/********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Nate Joshua Student ID: njoshua2 Date: 4/3/2024
*
*  Online (Cyclic) Link: null
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var exphbs = require("express-handlebars");
var app = express();

const collegedata = require('./modules/collegeData'); // imports the collegedata module
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: (url, options) => {
            return '<li' +((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +'><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

collegedata.initialize().then(() => { // initializes collegedata before starting the server
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/about', (req, res) => {
        res.render('about');
    });

    app.get('/htmldemo', (req, res) => {
        res.render('htmlDemo');
    });

    app.get('/students/add', (req, res) => {
        collegedata.getCourses().then((data => {
            res.render('addStudent', {courses: data});
        })).catch(() => {
            res.render('addStudent', {courses: []});
        });
    });

    app.get('/courses/add', (req, res) => {
        res.render('addCourse');
    });

    app.post('/students/add', (req, res) => {
        collegedata.addStudent(req.body).then(() => {
            res.redirect('/students');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.post('/courses/add', (req, res) => {
        collegedata.addCourse(req.body).then(() => {
            res.redirect('/courses');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.get('/students', (req, res) => {
        const course = req.query.course;
        if (course) {
            collegedata.getStudentsByCourse(course).then((data) => { // calls this function if there is a query
                res.render('students', {students: data});
            }).catch((err) => {
                res.status(500).send(err);
            });
        } else {
            collegedata.getAllStudents().then((data) => { // otherwise calls this function
                if (data.length > 0) {
                    res.render('students', {students: data});
                } else {
                    res.render('students', {message: "no results"});
                }
            }).catch((err) => {
                res.status(500).send(err);
            });
        }
    });

    app.get('/courses', (req, res) => {
        collegedata.getCourses().then((data) => {
            if (data.length > 0) {
                res.render('courses', {courses: data});
            } else {
                res.render('courses', {message: "no results"});
            }
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.get('/student/:num', (req, res) => {
        let viewData = {};

        collegedata.getStudentByNum(req.params.num).then((data) => {
            if (data) {
                viewData.student = data; //store student data in the "viewData" object as "student"
            } else {
                viewData.student = null; // set student to null if none were returned
            }
        }).catch(() => {
            viewData.student = null; // set student to null if there was an error
        }).then(() => collegedata.getCourses()).then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {
            if (viewData.student == null) {
                res.status(404).send('student not found'); // if no student - return an error
            } else {
                res.render('student', {viewData: viewData}); // render the "student" view
            }
        });
    });
    
    app.get('/student/:num', (req, res) => {
        collegedata.getStudentByNum(req.params.num).then((data) => {
            res.render('student', {student: data});
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.get('/course/:id', (req, res) => {
        collegedata.getCourseById(req.params.id).then((data) => {
            if (data) {
                res.render('course', {course: data});
            } else {
                res.status(404).send('course not found')
            }
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.post('/student/update', (req, res) => {
        collegedata.updateStudent(req.body).then(() => {
            res.redirect('/students');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.post('/course/update', (req, res) => {
        collegedata.updateCourse(req.body).then(() => {
            res.redirect('/courses');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.get('/course/delete/:id', (req, res) => {
        collegedata.deleteCourseById(req.params.id).then(() => {
            res.redirect('/courses');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.get('/student/delete/:num', (req, res) => {
        collegedata.deleteStudentByNum(req.params.num).then(() => {
            res.redirect('/students');
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    app.use((req, res) => { // shows a 404 page if an invalid page is entered
        res.status(404).render('errorpage');
    });
}).then(() => {
    app.listen(HTTP_PORT, () => {console.log(`Server listening on port ${HTTP_PORT}`)}); // starts the server
}).catch((err) => {
    console.error(`Error importing data, server not started: ${err}`);
});