const inquirer = require('inquirer');
const mysql = require('mysql2');
const functions = require('./functions');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2san0a2!4',
    database: 'employee_tracker_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    //function that starts program
    showTitle();
    startProgram();
})

//function that starts program

var startProgram = function () {
    // console.log('Program Started!')
    inquirer
        .prompt ([
            {
                type: 'list',
                name: 'what',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Update Employee Role', 'Add Role', 'Add Department', 'Quit']
            }
        ])
        .then ((answers) => {

            if (answers.what === 'View All Employees') {
                functions.viewAllEmployees(startProgram);
            } else if (answers.what === 'View All Roles') {
                functions.viewAllRoles(startProgram);
            } else if (answers.what === 'View All Departments') {
                functions.viewAllDepartments(startProgram);
            } else if (answers.what === 'Add Employee') {
                functions.addEmployee(startProgram);
            } else if (answers.what === 'Update Employee Role') {
                functions.updateEmployeeRole(startProgram);
            } else if (answers.what === 'Add Role') {
                functions.addRole(startProgram);
            } else if (answers.what === 'Add Department') {
                functions.addDepartment(startProgram);
            } else if (answers.what === 'Quit') {
                // console.log('Quit Clicked');
                process.exit();
            }
        })
        .catch((error) => {

        })
}

var showTitle = function () {
    const title = 'Employee Tracker';

    const line = '='.repeat(title.length + 4);
    const space = ' '.repeat(title.length + 2);

    console.log(`\x1b[1m${line}\x1b[0m`);
    console.log(`\x1b[1m| ${space} |\x1b[0m`);
    console.log(`\x1b[1m|  ${title}  |\x1b[0m`);
    console.log(`\x1b[1m| ${space} |\x1b[0m`);
    console.log(`\x1b[1m${line}\x1b[0m`);
}

