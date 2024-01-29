const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2san0a2!4',
    database: 'employee_tracker_db'
});

function viewAllEmployees(startProgram) {
    db.query('SELECT * FROM employee', (error, results, fields) => {
        if(error) {
            console.error('Error executing employee query:', error);
            return;
        }
        console.table(results);

        console.log('View All Employees clicked!');
        pressEnter(startProgram);
    });
}

function viewAllRoles(startProgram) {
    db.query('SELECT * FROM role', (error, results, fields) => {
        if(error) {
            console.error('Error executing role query:', error);
            return;
        }
        console.table(results);

        console.log('View All Roles clicked!');

        pressEnter(startProgram);
    });
}

function viewAllDepartments(startProgram) {
    db.query('SELECT id, name FROM department', (error, results, fields) => {
        if(error) {
            console.error('Error executing department query:', error);
            return;
        }

        console.table(results);

        console.log('View All Departments clicked!');

        pressEnter(startProgram);
    });
}

function addEmployee(startProgram) {
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
}

function updateEmployeeRole(startProgram) {
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
}

function addRole(startProgram) {
    console.log('Add Role clicked!');

    db.query('SELECT id, name FROM department', (error, results, fields) => {
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
                choices: results.map(department => {
                    return {
                        name: department.name,
                        value: department.id
                    };
                })
            }
        ])
        .then((answers) => {
            console.log(answers)
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.roleName, answers.roleSalary, answers.roleDepartment])
            const selectedId = answers.roleDepartment;
            console.log(selectedId);

            console.log(`Added ${answers.roleName} to the database`);
            pressEnter(startProgram);
        })
        .catch((error) => {

        });
    });
}

function addDepartment(startProgram) {
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
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.databaseName], (error, result) => {
            if (error) {
                console.error('Error adding department:', error);
                return;
            }

            console.log(`Added ${answers.databaseName} to the database.`);
            pressEnter(startProgram);
        })
    })
    .catch((error) => {

    });
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

module.exports = {
    viewAllEmployees,
    viewAllRoles,
    viewAllDepartments,
    addEmployee,
    updateEmployeeRole,
    addRole,
    addDepartment,
    pressEnter
};