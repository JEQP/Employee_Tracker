var mysql = require("mysql");
var inq = require("inquirer");
const cTable = require('console.table');

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
var tempRoleArray = [];
var roleID = 0;
var deptArray = [];
var tempDeptArray = [];
var managerArray = [];
var managerNameArray = [];
var managerID = 0;



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
        console.log("You chose: " + JSON.stringify(answer));
        switch (answer.addChoice) {
            case "employee":
                var query = "SELECT id, title FROM role";
                connection.query(query, function (err, res) {
                    // var tempRoleArray = [];
                    for (var i = 0; i < res.length; i++) {
                        tempRoleArray.push(res[i]);
                        // creates an array: [{"title":"Head Manager"},{"title":"IT Manager"},{"title":"Sales Manager"},{"title":"IT Technician"},{"title":"Sales Assistant"}]
                    }

                    // converts to an array of strings

                    roleArray = tempRoleArray.map(role => role.title);
                    console.log(roleArray);
                    addEmployee();
                });

                // query = "SELECT id, dept_name FROM department";
                // connection.query(query, function (err, res) {
                //     // tempDeptArray = [];
                //     res.forEach(element => tempDeptArray.push(element));
                //     // console.log(tempDeptArray);
                //     deptArray = tempDeptArray.map(department => department.dept_name);
                //     // console.log(deptArray);


                // });
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
                break;
            case "department":
                addDepartment();

        }
    });


    //             case "department":
    // departmentQuestions;
    // break;
}



// // ==> employee, inq first name, surname, role id, manager id


function addEmployee() {
    // Fill manager array. All managers have as their manager Douglas Reynholm, Head Manager

    managerArray.push({ "id": 1, "first_name": "Douglas", "last_name": "Reynholm" });
    let query = connection.query(
        "SELECT id, first_name, last_name FROM employee WHERE ?",
        {
            manager_id: 1
        },
        function (err, res) {
            res.forEach(element => managerArray.push(element));
            // console.log("managerArray:" + JSON.stringify(managerArray));

            for (i = 0; i < managerArray.length; i++) {
                let name = managerArray[i].first_name + " " + managerArray[i].last_name;
                // console.log(name);
                managerNameArray.push(name);

            }

            // console.log("names: " + JSON.stringify(managerNameArray));
        });

    inq.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
            // validate: validateName
        }, {
            type: "input",
            name: "last_name",
            message: "What is the employee's surname?",
            // validate: validateSalary
        },
        {
            type: "rawlist",
            name: "role_id",
            message: "In which role will the employee work?",
            pageSize: roleArray.length, // otherwise the default is 6 for choices list
            choices: roleArray
        },
        {

            type: "rawlist",
            name: "managerID",
            message: "To whom will this employee report?",
            pageSize: managerNameArray.length,
            choices: managerNameArray
        }]).then(answers => {
            tempRoleArray.forEach(element => {
                if (answers.role_id === element.title) {
                    roleID = element.id;

                    for (var i = 0; i < managerNameArray.length; i++) {
                        if (answers.managerID === managerNameArray[i]) {
                            managerID = managerArray[i].id;
                        }
                    }
                    // managerNameArray.forEach(element => {
                    //     // console.log("element: " + element);
                    //     if (answers.managerID === element) {
                    //         var index = managerNameArray.indexOf(element);
                    //         managerID = managerArray[index].id;

                    //     }
                    // if (answers.departmentID === element.dept_name) {  it's manager, we need to work out the code for finding manager ID
                    //     const deptID = element.id;
                    //     console.log("deptID: " + deptID);
                    let query = connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answers.first_name,
                            last_name: answers.last_name,
                            role_id: roleID,
                            manager_id: managerID
                        },
                        function (err, res) {
                            if (err) throw err;

                            console.log("Role added");
                            startPage();
                        }
                    );
                }
            })
        })
}
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
            pageSize: deptArray.length,
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

function addDepartment() {
    inq.prompt([{
        type: "input",
        name: "dept_name",
        message: "What is the name of the department?"
    }]).then(answers => {

        let query = connection.query(
            "INSERT INTO department SET ?",
            {
                dept_name: answers.dept_name
            },
            function (err, res) {
                if (err) throw err;

                console.log("Department added");
                startPage();
            }
        )
    })
}

// // view entry
// // inq employee, role, department

function viewEntry() {

    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Which type of entry would you like to view?",
        choices: [
            "employee",
            "role",
            "department"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "employee":
                viewEmployee();
                break;

            case "role":
                viewRole();
                break;

            case "department":
                viewDepartment();
        }

    });
}


function viewEmployee() {
    var employeeTable = [];
    var tempEmployeeTable = [];
    let query = connection.query(
        "SELECT employee.id, first_name, last_name, manager_id, title, salary, dept_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id",

        function (err, res) {
            if (err) throw err;
            // console.log(res);
            res.forEach(element => employeeTable.push(element));
            tempEmployeeTable = employeeTable.map(function (d) {
                return {
                    ID: d.id,
                    FirstName: d.first_name,
                    Surname: d.last_name,
                    Manager: d.manager_id,
                    Title: d.title,
                    Salary: d.salary,
                    Department: d.dept_name
                }
            });
            // test initial table is created
            // console.table(employeeTable);

            // test we can get id from initial table
            // for (var i = 0; i < employeeTable.length; i++) {
            //     console.log(employeeTable[i].id);
            // }

            // test second table has different headlines
            // console.table(tempEmployeeTable);

            // try to change manager  column

            for (var j = 0; j < tempEmployeeTable.length; j++) {
                let manID = tempEmployeeTable[j].Manager;
                let maname = "";
                if (tempEmployeeTable[j].Manager === null) {
                    tempEmployeeTable[j].Manager = "none";
                }
                else {
                    for (var k = 0; k < tempEmployeeTable.length; k++) {
                        // console.log("manID: " + manID + " -- tempEmployeeTable.ID: " + tempEmployeeTable[k].ID);
                        if (manID === tempEmployeeTable[k].ID) {

                            maname = tempEmployeeTable[k].FirstName + " " + tempEmployeeTable[k].Surname;
                            // console.log("maname: " + maname);

                        }
                    }
                    tempEmployeeTable[j].Manager = maname;
                }
            }
            console.table(tempEmployeeTable);
            startPage();

        }
    )

}

// Displays a table of role information 
function viewRole() {
    var roleTable = [];
    var tempRoleTable = [];
    var roleNum = [];
    let query = connection.query(
        "SELECT role.id, title, salary, dept_name FROM role INNER JOIN department ON department.id = role.department_id",

        function (err, res) {
            if (err) throw err;
            res.forEach(element => roleTable.push(element));
            tempRoleTable = roleTable.map(function (d) {
                return {
                    ID: d.id,
                    Title: d.title,
                    Salary: d.salary,
                    Department: d.dept_name,
                    Num_Employed: 0
                }
            });
            numEmps();
        },

    )
// Adds the total number of people employed in a role into the Num_Employed column of the table 
    function numEmps() {
        let query = connection.query(
            "SELECT role_id FROM employee",
            function (err, res) {
                if (err) throw err;
                res.forEach(element => roleNum.push(element));
                for (var i = 0; i < roleNum.length; i++) {
                    var r = roleNum[i].role_id;

                    for (var j = 0; j < tempRoleTable.length; j++) {
                        if (r === tempRoleTable[j].ID) {
                            let tv = tempRoleTable[j].Num_Employed;
                            tv++;
                            tempRoleTable[j].Num_Employed = tv;
                        }

                    }
                }
                console.table(tempRoleTable);
                startPage();
            }



        )
    }



}


// connection.query(query, function (err, res) {
//     // tempDeptArray = [];
//     res.forEach(element => tempDeptArray.push(element));
//     // console.log(tempDeptArray);
//     deptArray = tempDeptArray.map(department => department.dept_name);
//     // console.log(deptArray);
//     addEmployee();

// });
// // ==> print entry, inq update, delete, search for other

// // --==-- INQUIRER QUESTIONS FOR DATA ENTRY --==-- //

// const departmentQuestions = [{
//     type: "input",
//     name: "dept_name",
//     message: "What is the name of the department?",
//     // validate: validateName
// }]


// function validateSalary(salary) {
//     // find how to check max digits, and no more than two digits after decimal point.
// }
