const inquirer = require('inquirer');
const mysql = require('mysql2');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

                db.query('SELECT * FROM employee', (error, results, fields) => {
                    if(error) {
                        console.error('Error executing employee query:', error);
                        return;
                    }
                    console.table(results);
                })

                console.log('View All Employees clicked!');

            } else if (answers.what === 'View All Roles') {
                
                db.query('SELECT * FROM role', (error, results, fields) => {
                    if(error) {
                        console.error('Error executing role query:', error);
                        return;
                    }
                    console.table(results);
                })

                console.log('View All Roles clicked!');
                
            } else if (answers.what === 'View All Departments') {

                db.query('SELECT id, name FROM department', (error, results, fields) => {
                    if(error) {
                        console.error('Error executing department query:', error);
                        return;
                    }

                    console.table(results);

                    console.log('View All Departments clicked!');

                    pressEnter(startProgram);


                });

            } else if (answers.what === 'Add Employee') {
                console.log('Add Employee clicked!');        
                
                db.query('SELECT title FROM role', (error, results, fields) => {
                    if (error) {
                        console.error('Error fetching roles from the role table:', error);
                        return;
                    }

                    inquirer
                    .prompt ([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: "What is the employee's first name?",
                            validate: function (input) {
                                if (input.trim() === '') {
                                    return 'Please enter a first name.';
                                }
                                return true; 
                            }
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: "What is the employee's last name?",
                            validate: function (input) {
                                if (input.trim() === '') {
                                    return 'Please enter a last name.';
                                }
                                return true;
                            }
                        },
                        {
                            type: 'list',
                            name: 'employee_role',
                            message: "What is the employee's role?",
                            choices: results.map(role => role.title)
                        }
                    ])
                    .then((answers) => {
                        console.log(answers.first_name, answers.last_name, answers.employee_role);

                    })

                });
                
                
        

            } else if (answers.what === 'Update Employee Role') {
                console.log('Update Employee Role clicked!');


            } else if (answers.what === 'Add Role') {
                console.log('Add Role clicked!');


            } else if (answers.what === 'Add Department') {
                console.log('Add Department clicked!');


            } else if (answers.what === 'Quit') {
                console.log('Quit Clicked');
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

function pressEnter(callback) {
    process.stdin.setRawMode(true);

    console.log('Press Enter to continue...');

    process.stdin.on('keypress', function listener(key,data) {
        if (data && data.name === 'return') {
            process.stdin.removeListener('keypress', listener);
            process.stdin.pause();
            process.stdin.setRawMode(false);
            console.log('\nContinuing...');
            callback();
        }
    });
    process.stdin.resume();
};