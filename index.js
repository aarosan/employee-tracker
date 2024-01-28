const inquirer = require('inquirer');
const mysql = require('mysql2');

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
                console.log('View All Employees clicked!');
                startProgram();
            } else if (answers.what === 'View All Roles') {
                console.log('View All Roles clicked!');
                startProgram();
            } else if (answers.what === 'View All Departments') {
                console.log('View All Departments clicked!');
                startProgram();
            } else if (answers.what === 'Add Employee') {
                console.log('Add Employee clicked!');                startProgram();
            } else if (answers.what === 'Update Employee Role') {
                console.log('Update Employee Role clicked!');
                startProgram();
            } else if (answers.what === 'Add Role') {
                console.log('Add Role clicked!');
                startProgram();
            } else if (answers.what === 'Add Department') {
                console.log('Add Department clicked!');
                startProgram();
            } else if (answers.what === 'Quit') {
                console.log('Quit Clicked');
                startProgram();
            }
        })
        .catch((error) => {

        })
}