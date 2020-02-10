
USE employeetracker;

INSERT INTO department (dept_name)
VALUES ("Head Office");

INSERT INTO department (dept_name)
VALUES ("IT");

INSERT INTO department (dept_name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Head Manager", 400000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("IT Manager", 150000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 225000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("IT Technician", 70000, 2);

INSERT INTO role (title, salary, department_id)
VALUES("Sales Assistant", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Douglas", "Reynholm", 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jen", "Barber", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Roy", "Trenneman", 4, 2), ("Maurice", "Moss", 4, 2), ("Richmond", "Avenal", 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alice", "Murphy", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Anders", "Holmvik", 5, 6), ("Adam", "DeMamp", 5, 6), ("Blake", "Henderson", 5, 6), ("Jillian", "Belk", 5, 6);