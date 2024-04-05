const Sequelize = require('sequelize');

var sequelize = new Sequelize('web700-assignment-6', 'web700-assignment-6_owner', 'NqyrR8xkLeF3', {
    host: 'ep-polished-hill-a44nfsft.us-east-1.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    },
    query: {raw: true}
});

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, {foreignKey: 'course'});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to sync the database");
        });
    });
};

module.exports.getAllStudents = () => {
    return new Promise((resolve, reject) => {
        Student.findAll().then((students) => {
            resolve(students);
        }).catch(() => {
            reject("No results returned");
        });
    });
};

module.exports.getCourses = () => {
    return new Promise((resolve, reject) => {
        Course.findAll().then((courses) => {
            resolve(courses);
        }).catch(() => {
            reject("No results returned");
        });
    });
};

module.exports.getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: {courseId: id}
        }).then((courses) => {
            resolve(courses[0]);
        }).catch(() => {
            reject("No results found");
        });
    });
};

module.exports.getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {studentNum: num}
        }).then((students) => {
            resolve(students[0]);
        }).catch(() => {
            reject("No results found");
        });
    });
};

module.exports.getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {course: course}
        }).then((students) => {
            resolve(students);
        }).catch(() => {
            reject("No results found");
        });
    });
};

module.exports.addStudent = (studentData) => {
    studentData.TA = (studentData.TA) ? true:false;
    for (const prop in studentData) {
        if (studentData[prop] == "") {
            studentData[prop] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Student.create(studentData).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to create student");
        });
    });
};

module.exports.updateStudent = (studentData) => {
    studentData.TA = (studentData.TA) ? true:false;
    for (const prop in studentData) {
        if (studentData[prop] == "") {
            studentData[prop] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Student.update(studentData, {
            where: {studentNum: studentData.studentNum}
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to update student");
        });
    });
};

module.exports.addCourse = (courseData) => {
    for (const prop in courseData) {
        if (courseData[prop] == "") {
            courseData[prop] = null;
        }
    }

    return new Promise((resolve, reject) => {
                Course.create(courseData).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to add course");
        });
    });
};

module.exports.updateCourse = (courseData) => {
    for (const prop in courseData) {
        if (courseData[prop] == "") {
            courseData[prop] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Course.update(courseData, {
            where: {courseId: courseData.courseId}
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to update course");
        });
    });
};

module.exports.deleteCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: {courseId: id}
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to destroy course");
        });
    });
};

module.exports.deleteStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: {studentNum: num}
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to destroy student");
        });
    });
};