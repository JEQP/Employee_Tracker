# Employee Tracker CMS
This is a command line interface to allow users to interact with an employee database to view, create and update files.
In the initial screen users choose to add, view, update a file, or leave the system. 

When adding an entry the users will be prompted for the appropriate to fill the columns. For example, to add an employee they input the name and choose from available managers and roles, and these are replaced with the appropriate ID codes. Employees who report to the Head Manager are themselves managers. 

The view options will display a table of the requested data. Employee will display name, title, salary, manager and department. Roles will display the title, the salary, and the number of people employed in that role. Departments displays the name of the department and the number of people employed in that department.

When updating files users are given the choice to update by a specific ID or search for a name. If there are multiple results the user is given a list to choose from. 

The program uses Javascript and mysql. 


![Employee Tracker CLI](https://raw.githubusercontent.com/JEQP/Employee_Tracker/master/employeetrackerdemo.jpg)
