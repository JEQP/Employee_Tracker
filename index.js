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

var roleArray = [];
var deptArray = [];
var tempDeptArray = [];


function startPage() {
    // initiate question arrays

    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Welcome to the employee database CMS. What would you like to do?",
        choices: [
            "Add a new entry",
            "View a current entry"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "Add a new entry":
                addEntry();
                break;

            case "View a current entry":
                viewEntry();
                break;
        }

    });

}



// add entry
// inq employee, role, department

function addEntry() {
    inq.prompt({
        name: "addChoice",
        type: "rawlist",
        message: "What would you like to add?",
        choices: [
            "employee",
            "role",
            "department"
        ]
        // switch cases to draw in questions, then answers are pushed to DB rather than array. INSERT command.
    }).then(answer => {
        switch (answer.addChoice) {
            case "employee":
                var query = "SELECT title FROM role";
                connection.query(query, function (err, res) {
                    var tempRoleArray = [];
                    for (var i = 0; i < res.length; i++) {
                        tempRoleArray.push(res[i]);
                        // creates and array: [{"title":"Head Manager"},{"title":"IT Manager"},{"title":"Sales Manager"},{"title":"IT Technician"},{"title":"Sales Assistant"}]
                    }

                    // converts to an array of strings
                    roleArray = tempRoleArray.map(role => role.title);
                });
                addEmployee();
                break;

            case "role":
                // console.log("query to start");
                // var query = "SELECT id, dept_name FROM department";
                // console.log("Query conducted");
                // connection.query(query, function (err, res) {
                //     for (var i = 0; i < res.length; i++) {
                //         console.log(res[i].id + " -- " + res[i].dept_name);
                //     }
                // });

                query = "SELECT id, dept_name FROM department";
                connection.query(query, function (err, res) {
                    // tempDeptArray = [];
                    res.forEach(element => tempDeptArray.push(element));
                    console.log(tempDeptArray);
                    deptArray = tempDeptArray.map(department => department.dept_name);
                    console.log(deptArray);
                    // startPage();
                    addRole();
                });
        }
    });


    //             case "department":
    // departmentQuestions;
    // break;
}



// // ==> employee, inq first name, surname, role id, manager id


// function addEmployee() {

//     employeeQuestions().then(answers => {
//         const manager = new Manager(answers.name1, answers.id1, answers.email1, answers.officeNumber);
//         var query = connection.query(
//             "INSERT INTO employee SET ?",
//             {
//                 first_name:
//                     last_name:
//                 role_id:
//                     manager_id:
//             }
//         )
//     });
// }
//         teamMembers.push(manager);;
//         var query = connection.query(
//             "INSERT INTO products SET ?",
//             {
//               flavor: "Rocky Road", // key names correspond to column names, and values are what is being inserted into the column 
//               price: 3.0,
//               quantity: 50
//             },
//             function(err, res) {
//               if (err) throw err;
//               console.log(res.affectedRows + " product inserted!\n");
//               // Call updateProduct AFTER the INSERT completes
//               updateProduct();

// }

// // ==> role, inq title, salary, department

function addRole() {
    console.log("deptArray in addRole: " + deptArray);
    inq.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role?"
            // validate: validateName
        }, {
            type: "number",
            name: "salary",
            message: "What is the salary?",
            // validate: validateSalary
        }, {

            type: "rawlist",
            name: "departmentID",
            message: "In which department will the role operate?",
            choices: deptArray
        }]).then(answers => {
            console.log("tempDeptArray: " + JSON.stringify(tempDeptArray));
            tempDeptArray.forEach(element => {
                console.log("element: " + element);
                if (answers.departmentID === element.dept_name) {
                    const deptID = element.id;
                    console.log("deptID: " + deptID);
                    let query = connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answers.title,
                            salary: answers.salary,
                            department_id: deptID
                        },
                        function (err, res) {
                            if (err) throw err;

                            console.log("Role added");
                            startPage();
                        }
                    );
                }
            })
        });
}

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


// const roleQuestions = [
//     {
//         type: "input",
//         name: "title",
//         message: "What is the title of the role?"
//         // validate: validateName
//     }, {
//         type: "number",
//         name: "salary",
//         message: "What is the salary?",
//         // validate: validateSalary
//     }, {

//         type: "rawlist",
//         name: "departmentID",
//         message: "In which department will the role operate?",
//         choices: deptArray
//     }]

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
