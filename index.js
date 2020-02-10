var mysql = require("mysql");
var inq = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "AggleRock",
    database: "employeetracker"
});

connection.connect(function (err) {
    if (err) throw err;
    startPage();
});

// offer intial screen
// inq add, view

const roleArray = [];
const deptArray = [];


function startPage() {
    // initiate question arrays
    var query = "SELECT title FROM role";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i]);
            // creates and array: [{"title":"Head Manager"},{"title":"IT Manager"},{"title":"Sales Manager"},{"title":"IT Technician"},{"title":"Sales Assistant"}]
    }



    // inq.prompt({
    //     name: "choice",
    //     type: "rawlist",
    //     message: "Welcome to the employee database CMS. What would you like to do?",
    //     choices: [
    //         "Add a new entry",
    //         "View a current entry"
    //     ]
    // }).then(answer => {
    //     switch (answer.choice) {
    //         case "Add a new entry":
    //             addEntry();
    //             break;

    //         case "View a current entry":
    //             viewEntry();
    //             break;
    //     }

    // });
});
}



// // add entry
// // inq employee, role, department

// function addEntry() {
//     inq.prompt({
//         name: "addChoice",
//         type: "rawlist",
//         message: "What would you like to add?",
//         choices: [
//             "employee",
//             "role",
//             "department"
//         ]
//         // switch cases to draw in questions, then answers are pushed to DB rather than array. INSERT command.
//     }).then(answer => {
//         switch (answer.addChoice) {
//             case "employee":
//                 employeeQuestions();
//                 break;

//             case "role":
//                 console.log("query to start");
//                 var query = "SELECT id, dept_name FROM department";
//                 console.log("Query conducted");
//                 connection.query(query, function(err, res) {
//                     for (var i = 0; i < res.length; i++) {
//                       console.log(res[i].id + " -- " + res[i].dept_name);
//                     }
//                 });
//                 inq.prompt(roleQuestions).then(answers => {
//                     const manager = new Manager(answers.name1, answers.id1, answers.email1, answers.officeNumber);
//                     teamMembers.push(manager);
//                 roleQuestions();
//                 break;

//             case "department":
//                 departmentQuestions;
//                 break;
//         }

//     });
// }

// // ==> employee, inq first name, surname, role id, manager id

// // ==> role, inq title, salary, department

// // ==> department, inq dept name

// // view entry
// // inq employee, role, department

// // ==> print entry, inq update, delete, search for other

// // --==-- INQUIRER QUESTIONS FOR DATA ENTRY --==-- //

// const departmentQuestions = [{
//     type: "input",
//     name: "dept_name",
//     message: "What is the name of the department?",
//     // validate: validateName
// }]

// const roleQuestions = [{
//     type: "input",
//     name: "title",
//     message: "What is the title of the role?"
//     // validate: validateName
// }, {
//     type: "number",
//     name: "salary",
//     message: "What is the salary?",
//     // validate: validateSalary
// }, {
    
//     // type: "rawlist",
//     // name: "departmentID",
//     // message: "In which department will the role operate?",
//     // choices: 
//     // While a list is the best way to ask this question (since it is a foregin key), 
//     // if a new department is added it would require recoding to add it to the list. 
//     // type: "input",
//     // name: "departmentID",
//     // message: "In which department will the role operate?"
//     validate: validateName 
//     // this way also sucks. the name will have to be converted to lowercase and match exactly. Bum.
//     //filter: (Function) Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.
// }]

// const employeeQuestions = [{
//     type: "input",
//     name: "firstName",
//     message: "What is the first name of the employee?"
//     // validate: validateName
// }, {
//     type: "input",
//     name: "surname",
//     message: "What is the surname of the employee?"
//     // validate: validateName
// }, {
//     // role
// }, {
//     // manager
// }]

// // how do I pass the parameter when it has different names?
// function validateName(name) {
//     const inputName = name;
//     const nameRegex = /^(?=.*?[a-zA-Z\s])[a-zA-Z\s]+$/
//     const nameResult = nameRegex.test(inputName);
//     if (nameResult) {
//         return true;
//     }
//     else {
//         console.log("Names require letters.");
//     }
// }

// function validateSalary(salary) {
//     // find how to check max digits, and no more than two digits after decimal point.
// }
