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
    password: "1pNut7skwirels",
    database: "employeetracker"
});

connection.connect(function (err) {
    if (err) throw err;
    startPage();
});


var roleArray = [];     //Head Manager,IT Manager,Sales Manager,IT Technician,Sales Assistant
var tempRoleArray = []; //[{"title":"Head Manager"},{"title":"IT Manager"},{"title":"Sales Manager"},{"title":"IT Technician"},{"title":"Sales Assistant"}]
var roleID = 0;
var deptArray = [];     // ["Head Office","IT","Sales","Mayntenance"] 
var tempDeptArray = []; // [{"id":1,"dept_name":"Head Office"},{"id":2,"dept_name":"IT"},{"id":3,"dept_name":"Sales"},{"id":4,"dept_name":"Mayntenance"}]
var managerArray = [];  // [{"id":1,"first_name":"Douglas","last_name":"Reynholm"},{"id":2,"first_name":"Jen","last_name":"Barber"},{"id":6,"first_name":"Alice","last_name":"Murphy"}]
var managerNameArray = []; //["Douglas Reynholm","Jen Barber","Alice Murphy"]
var managerID = 0;
var empTable = [];

// The initial page, to which user are returned once they finish their operation

function startPage() {

    // fill arrays 

    var query = "SELECT id, title FROM role";
    connection.query(query, function (err, res) {
        tempRoleArray = [];
        roleArray = [];
        for (var i = 0; i < res.length; i++) {
            tempRoleArray.push(res[i]);
            // creates an array: [{"title":"Head Manager"},{"title":"IT Manager"},{"title":"Sales Manager"},{"title":"IT Technician"},{"title":"Sales Assistant"}]
        }

        // converts to an array of strings

        roleArray = tempRoleArray.map(role => role.title);
    });

    query = "SELECT id, dept_name FROM department";
    connection.query(query, function (err, res) {
        tempDeptArray = [];
        deptArray = [];
        res.forEach(element => tempDeptArray.push(element));
        deptArray = tempDeptArray.map(department => department.dept_name);
    });


    query = connection.query(
        "SELECT id, first_name, last_name FROM employee WHERE ?",
        {
            manager_id: 1
        },
        function (err, res) {
            managerArray = [];
            managerNameArray = [];
            managerArray.push({ "id": 1, "first_name": "Douglas", "last_name": "Reynholm" });
            res.forEach(element => managerArray.push(element));
            for (i = 0; i < managerArray.length; i++) {
                let name = managerArray[i].first_name + " " + managerArray[i].last_name;
                managerNameArray.push(name);
            }

        });



    // initiate question arrays

    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Welcome to the employee database CMS. What would you like to do?",
        choices: [
            "Add a new entry",
            "View a current entry",
            "Update an Entry",
            "Exit Program"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "Add a new entry":
                addEntry();
                break;

            case "View a current entry":
                viewEntry();
                break;

            case "Update an Entry":
                updateEntry();
                break;

            case "Exit Program":
                return process.exit(17);
        }

    });

}



// This function is to choose which entry to add to the database

function addEntry() {
    inq.prompt({
        name: "addChoice",
        type: "rawlist",
        message: "What would you like to add?",
        choices: [
            "employee",
            "role",
            "department",
            "return to start"
        ]
        // switch cases to draw in questions, then answers are pushed to DB rather than array. INSERT command.
    }).then(answer => {
        console.log("You chose: " + JSON.stringify(answer));
        switch (answer.addChoice) {
            case "employee":
                addEmployee();
                break;

            case "role":
                addRole();
                break;

            case "department":
                addDepartment();
                break;

            case "return to start":
                startPage();

        }
    });
}


// Add an employee to the database


function addEmployee() {
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
            pageSize: roleArray.length + 1, // otherwise the default is 6 for choices list
            choices: roleArray
        },
        {

            type: "rawlist",
            name: "managerID",
            message: "To whom will this employee report?",
            pageSize: managerNameArray.length + 1,
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

// Add role to the database

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
            pageSize: deptArray.length + 1,
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

// Add department to the database

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

// choose which type of entry to view

function viewEntry() {

    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Which type of entry would you like to view?",
        choices: [
            "employee",
            "role",
            "department",
            "manager",
            "return to start"
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
                break;

            case "manager":
                viewManager();
                break;

            case "return to start":
                startPage();
        }

    });
}

// choose employee file to view

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

            for (var j = 0; j < tempEmployeeTable.length; j++) {
                let manID = tempEmployeeTable[j].Manager;
                let maname = "";
                if (tempEmployeeTable[j].Manager === null) {
                    tempEmployeeTable[j].Manager = "none";
                }
                else {
                    for (var k = 0; k < tempEmployeeTable.length; k++) {
                        if (manID === tempEmployeeTable[k].ID) {

                            maname = tempEmployeeTable[k].FirstName + " " + tempEmployeeTable[k].Surname;

                        }
                    }
                    tempEmployeeTable[j].Manager = maname;
                }
            }
            console.log("----------------------------------------------------------------------------------");
            console.table(tempEmployeeTable);
            startPage();

        }
    )

}

// choose which role to view

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
                console.log("----------------------------------------------------------------------------------");
                console.table(tempRoleTable);
                startPage();
            }



        )
    }

}

// view all departments, with number of people employed in each department

function viewDepartment() {
    var deptTable = [];
    var tempDeptTable = [];
    var roleNum = [];

    let query = connection.query(
        "SELECT department.id, dept_name FROM department",

        function (err, res) {
            if (err) throw err;
            res.forEach(element => deptTable.push(element));
            tempDeptTable = deptTable.map(function (d) {
                return {
                    ID: d.id,
                    Department: d.dept_name,
                    Num_Employed: 0
                }
            });
            numEmpsD();
        }
    )


    function numEmpsD() {
        let query = connection.query(
            "SELECT employee.id, role_id, department_id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id",
            // "SELECT role_id, department_id FROM employee INNER JOIN role ON employee.role_id = role.id",
            function (err, res) {
                if (err) throw err;
                res.forEach(element => roleNum.push(element));

                for (var i = 0; i < roleNum.length; i++) {
                    var r = roleNum[i].department_id;

                    for (var j = 0; j < tempDeptTable.length; j++) {
                        if (r === tempDeptTable[j].ID) {
                            let tv = tempDeptTable[j].Num_Employed;
                            tv++;
                            tempDeptTable[j].Num_Employed = tv;
                        }

                    }
                }
                console.log("----------------------------------------------------------------------------------");
                console.table(tempDeptTable);
                startPage();
            }

        )

    }
}

function viewManager() {
    console.log("managerNameArray: " + JSON.stringify(managerNameArray));
    inq.prompt({
        name: "manchoice",
        type: "rawlist",
        message: "Which manager would you like to view?",
        choices: managerNameArray
    }).then(answer => {
        for (var i = 0; i < managerArray.length; i++) {
            if (answer.manchoice === managerNameArray[i]) {
                var man_ID = managerArray[i].id;
            }
        }

        query = connection.query("SELECT first_name, last_name FROM employee WHERE ?",
            [
                {
                    manager_id: man_ID
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.manchoice + " is manager of:");
                console.table(res);
                startPage();
            });

    })
}

// choose which type of entry to update

function updateEntry() {

    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Which type of entry would you like to update?",
        choices: [
            "employee",
            "role",
            "department",
            "return to start"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "employee":
                updateEmployee();
                break;

            case "role":
                updateRole();
                break;

            case "department":
                updateDepartment();
                break;

            case "return to start":
                startPage();
        }

    });
}

// choose and update an employee file

function updateEmployee() {

    // prompt for employee's surname
    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Would you like to update by ID or search by Surname?",
        choices: [
            "Update by ID",
            "Search by Surname"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "Update by ID":
                inq.prompt({
                    name: "searchid",
                    tupe: "number",
                    message: "Please enter the ID to update:"
                }).then(answers => {
                    empTable = [];
                    let query = connection.query(
                        "SELECT * FROM employee WHERE ?",
                        [{
                            id: answers.searchid
                        }],
                        function (err, res) {
                            if (err) throw err;
                            if (!res) {
                                console.log("ID is not in database.");
                                updateEmployee();
                            }
                            else {
                                res.forEach(element => empTable.push(element));
                                updateEmpEntry(empTable);
                            }
                        }
                    )
                });
                break;

            case "Search by Surname":
                searchEmp();
                break;
        }

    });

    function searchEmp() {
        // search database for surname
        empTable = [];
        var surname = "";
        var employeeTable = [];
        var tempEmployeeTable = [];
        inq.prompt({
            name: "searchname",
            tupe: "input",
            message: "Please enter the Surname to search:"
        }).then(answers => {
            surname = answers.searchname;
            let query = connection.query(
                "SELECT * FROM employee WHERE ?",
                [{
                    last_name: surname
                }],
                function (err, res) {
                    if (err) throw err;
                    res.forEach(element => empTable.push(element));
                    // if surname does not appear, return to update employee
                    if (empTable.length === 0) {
                        console.log("Surname does not appear in database.");
                        updateEmployee();
                    }
                    // if one entry returned, go to update entry
                    else if (empTable.length === 1) {
                        updateEmpEntry(empTable);
                    }
                    // if multiple entries returned, display them and prompt for ID of desired entry, then go to update entry
                    else {
                        let query = connection.query(
                            "SELECT employee.id, first_name, last_name, manager_id, title, salary, dept_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id WHERE ?",
                            [{
                                last_name: surname
                            }],

                            function (err, res) {
                                if (err) throw err;
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

                                for (var j = 0; j < tempEmployeeTable.length; j++) {
                                    let manID = tempEmployeeTable[j].Manager;
                                    let maname = "";
                                    if (tempEmployeeTable[j].Manager === null) {
                                        tempEmployeeTable[j].Manager = "none";
                                    }
                                    else {
                                        for (var k = 0; k < tempEmployeeTable.length; k++) {
                                            if (manID === tempEmployeeTable[k].ID) {

                                                maname = tempEmployeeTable[k].FirstName + " " + tempEmployeeTable[k].Surname;

                                            }
                                        }
                                        tempEmployeeTable[j].Manager = maname;
                                    }
                                }

                                inq.prompt({
                                    name: "choice",
                                    type: "number",
                                    message: "Enter the ID of the entry to update:",
                                }).then(answers => {
                                    // loop backwards through array so entries don't get skipped after deletions.
                                    for (i = empTable.length - 1; i >= 0; i--) {
                                        if (answers.choice != empTable[i].id) {
                                            empTable.splice(i, 1);

                                        }

                                    }
                                    updateEmpEntry(empTable);
                                })
                            }
                        )
                    }
                }
            )
        });
    }

    function updateEmpEntry() {

        inq.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Update the employee's first name:"
                // validate: validateName
            }, {
                type: "input",
                name: "last_name",
                message: "Update the employee's surname:",
                // validate: validateSalary
            },
            {
                type: "rawlist",
                name: "role_id",
                message: "Update the employee's role:",
                pageSize: roleArray.length + 1, // otherwise the default is 6 for choices list
                choices: roleArray
            },
            {

                type: "rawlist",
                name: "managerID",
                message: "Update the employee's manager:",
                pageSize: managerNameArray.length + 1,
                choices: managerNameArray
            }]).then(answers => {
                updateEmpCall(answers);
            });
    }


    function updateEmpCall(answers) {
        tempRoleArray.forEach(element => {
            if (answers.role_id === element.title) {
                roleID = element.id;

                for (var i = 0; i < managerNameArray.length; i++) {
                    if (answers.managerID === managerNameArray[i]) {
                        managerID = managerArray[i].id;
                    }
                }

                query = connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [{
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: roleID,
                        manager_id: managerID
                    },
                    {
                        id: empTable[0].id
                    }],
                    function (err, res) {
                        if (err) throw err;
                        console.log(query.sql);
                        console.log(res.affectedRows + " employee record updated");
                        startPage();
                    }
                )


            }
        })
    }
}

// select and update a role

function updateRole() {
    var roleToUpdate = [];
    inq.prompt({
        name: "choice",
        type: "rawlist",
        message: "Would you like to update by ID or search by Role name?",
        choices: [
            "Update by ID",
            "Search by Role name"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "Update by ID":
                inq.prompt({
                    name: "searchid",
                    tupe: "number",
                    message: "Please enter the ID to update:"
                }).then(answers => {
                    let query = connection.query(
                        "SELECT * FROM role WHERE ?",
                        [{
                            id: answers.searchid
                        }],
                        function (err, res) {
                            if (err) throw err;
                            if (!res) {
                                console.log("ID is not in database.");
                                updateRole();
                            }
                            else {
                                res.forEach(element => roleToUpdate.push(element));
                                updateRoleEntry();
                            }
                        }
                    )
                });
                break;

            case "Search by Role name":
                searchRole();
                break;
        }

    });

    function searchRole() {
        inq.prompt({
            name: "searchrole",
            type: "input",
            message: "Please enter the Role name to search:"
        }).then(answers => {
            surname = answers.searchname;
            query = connection.query(
                "SELECT * FROM role WHERE ?",
                [{
                    title: answers.searchrole
                }],
                function (err, res) {
                    if (err) throw err;
                    if (!res) {
                        console.log("Role not found.");
                        updateRole();
                    }
                    else {
                        res.forEach(element => roleToUpdate.push(element));
                        updateRoleEntry();
                    }


                }
            )
        });

    }
    function updateRoleEntry() {

        inq.prompt([
            {
                type: "input",
                name: "title",
                message: "Update the role's title:"
                // validate: validateName
            }, {
                type: "number",
                name: "salary",
                message: "Update the role's salary:",
                // validate: validateSalary
            },
            {
                type: "rawlist",
                name: "dept_id",
                message: "Update the role's department:",
                pageSize: deptArray.length + 1, // otherwise the default is 6 for choices list
                choices: deptArray
            }
        ]).then(answers => {
            console.log("roletoupdate: " + JSON.stringify(roleToUpdate));
            updateRoleCall(answers);
        });

    }

    function updateRoleCall(answers) {
        console.log("updateRoleCall starts");
        console.log("tempdeptarray " + JSON.stringify(tempDeptArray));

        for (var i = 0; i < tempDeptArray.length; i++) {
            console.log("for loop starts");
            if (answers.dept_id === tempDeptArray[i].dept_name) {
                console.log("if condition plays");
                deptID = tempDeptArray[i].id;


                console.log("deptID: " + deptID);


                query = connection.query(
                    "UPDATE role SET ? WHERE ?",
                    [{
                        title: answers.title,
                        salary: answers.salary,
                        department_id: deptID
                    },
                    {
                        id: roleToUpdate[0].id
                    }],
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role record updated");
                        startPage();
                    }
                )


            }
        }
    }

}

// select and update a department

function updateDepartment() {

    inq.prompt([
        {
            type: "rawlist",
            name: "dept_id",
            message: "Select Department to update:",
            pageSize: deptArray.length + 1, // otherwise the default is 6 for choices list
            choices: deptArray
        }
    ]).then(answers => {
        var deptToUpdate = 0;

        for (var i = 0; i < tempDeptArray.length; i++) {
            if (answers.dept_id == tempDeptArray[i].dept_name) {
                deptToUpdate = tempDeptArray[i].id
            }
        }

        inq.prompt([
            {
                type: "input",
                name: "department",
                message: "Input Department Name:"
            }
        ]).then(data => {
            query = connection.query(
                "UPDATE department SET ? WHERE ?",
                [{
                    dept_name: data.department
                },
                {
                    id: deptToUpdate
                }],
                function (err, res) {
                    if (err) throw err;
                    console.log("Department " + data.department + " updated.");
                    startPage();
                }
            )

        });


    });

}
