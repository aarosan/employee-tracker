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

                    console.log('View All Employees clicked!');

                    pressEnter(startProgram);
                })


            } else if (answers.what === 'View All Roles') {
                
                db.query('SELECT * FROM role', (error, results, fields) => {
                    if(error) {
                        console.error('Error executing role query:', error);
                        return;
                    }
                    console.table(results);

                    console.log('View All Roles clicked!');

                    pressEnter(startProgram);
                })

                
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

                    db.query('SELECT CONCAT(first_name, " ", last_name) AS manager_name FROM employee', (managerError, managerResults, managerFields) => {
                        if (managerError) {
                            console.error('Error fetching employees from the employee table:', managerError);
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
                            },
                            {
                                type: 'list',
                                name: 'employee_manager',
                                message: "Who is the employee's manager?",
                                choices: managerResults.map(employee => employee.manager_name)
                            }
                        ])
                        .then((answers) => {
                            //NEED TO ADD TO THE DATABASE
                            console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);    

                            pressEnter(startProgram);
                        })
                        .catch((error) => {

                        });

                    });

                });
    
            } else if (answers.what === 'Update Employee Role') {
                console.log('Update Employee Role clicked!');

                db.query('SELECT CONCAT(first_name, " ", last_name) AS employee_name FROM employee', (error, results, fields) => {
                    if (error) {
                        console.error('Error fetching employees from the employee table:', error);
                        return;
                    }

                    db.query('SELECT title FROM role', (roleError, roleResults, roleFields) => {
                        if(roleError) {
                            console.error('Error fetching roles from the role table:', roleError);
                            return;
                        }

                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeList',
                                message: "Which employee's role do you want to update?",
                                choices: results.map(employee => employee.employee_name)
                            },
                            {
                                type: 'list',
                                name: 'roleList',
                                message: 'Which role do you want to assign the selected employee?',
                                choices: roleResults.map(role => role.title)
                            }
                        ])
                        .then((answers) => {
                            //NEED TO UPDATE THE DATABASE
                            console.log(`Updated employee's role.`);    

                            pressEnter(startProgram);
                        })
                        .catch((error) => {

                        });
                    });
                });


            } else if (answers.what === 'Add Role') {

                console.log('Add Role clicked!');

                db.query('SELECT name FROM department', (error, results, fields) => {
                    if (error) {
                        console.error('Error fetch department names from the department table:', error);
                        return;
                    }

                    inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'roleName',
                            message: 'What is the name of the role?'
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'What is the salary of the role?'
                        },
                        {
                            type: 'list',
                            name: 'roleDepartment',
                            message: 'Which department does the role belong to?',
                            choices: results.map(department => department.name)
                        }
                    ])
                    .then((answers) => {
                        //NEED TO ADD TO THE DATABASE
                        console.log(`Added ${answers.roleName} to the database`);
                        pressEnter(startProgram);
                    })
                    .catch((error) => {

                    });
                });


            } else if (answers.what === 'Add Department') {
                console.log('Add Department clicked!');

                inquirer
                .prompt ([
                    {
                        type: 'input',
                        name: 'databaseName',
                        message: 'What is the name of the department?',
                        validate: function (input) {
                            if (input.trim() === '') {
                                return 'Please enter a name for the department.';
                            }
                            return true; 
                        } 
                    }
                ])
                .then((answers) => {
                    //NEED TO ADD TO THE DATABASE
                    console.log(`Added ${answers.databaseName} to the database.`);
                    pressEnter(startProgram);
                })
                .catch((error) => {

                });

            } else if (answers.what === 'Quit') {
                console.log('Quit Clicked');
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

function pressEnter(callback) {
    process.stdin.setRawMode(true);

    console.log('Press Enter to continue...');

    process.stdin.on('keypress', function listener(key,data) {
        if (data && data.name === 'return') {
            process.stdin.removeListener('keypress', listener);
            process.stdin.pause();
            process.stdin.setRawMode(false);
            console.log('\nContinuing...\n');
            callback();
        }
    });
    process.stdin.resume();
};