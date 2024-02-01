const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2san0a2!4',
    database: 'employee_tracker_db'
});

function viewAllEmployees(startProgram) {
    db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee AS e
    LEFT JOIN role AS r ON e.role_id = r.id
    LEFT JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id

    `, 
    (error, results, fields) => {
        if(error) {
            console.error('Error executing employee query:', error);
            return;
        }

        console.log('\nAll Employees:\n');
        console.table(results);

        // console.log('\nView All Employees clicked!\n');

        pressEnter(startProgram);
    });
}

function viewAllRoles(startProgram) {
    db.query(`SELECT r.id, r.title, d.name AS department, r.salary 
    FROM role as r
    LEFT JOIN department as d on r.department_id = d.id`, 
    (error, results, fields) => {
        if(error) {
            console.error('Error executing role query:', error);
            return;
        }
        
        console.log('\nAll Roles:\n');
        console.table(results);

        // console.log('\nView All Roles clicked!\n');

        pressEnter(startProgram);
    });
}

function viewAllDepartments(startProgram) {
    db.query('SELECT id, name FROM department', (error, results, fields) => {
        if(error) {
            console.error('Error executing department query:', error);
            return;
        }

        console.log('\nAll Departments:\n');
        console.table(results);

        // console.log('\nView All Departments clicked!\n');

        pressEnter(startProgram);
    });
}

function addEmployee(startProgram) {                
    db.query('SELECT id, title FROM role', (error, results, fields) => {
        if (error) {
            console.error('Error fetching roles from the role table:', error);
            return;
        }

        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee', (managerError, managerResults, managerFields) => {
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
                    choices: ['None', ...managerResults.map(employee => employee.manager_name)]
                }
            ])
            .then((answers) => {
                const selectedRole = results.find(role => role.title === answers.employee_role);

                let managerId = null;

                if (answers.employee_manager !== 'None') {
                    const selectedManager = managerResults.find(manager => manager.manager_name === answers.employee_manager);
                    managerId = selectedManager.id;
                }
                

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.first_name, answers.last_name, selectedRole.id, managerId], (insertError, result) => {
                    if (insertError) {
                        console.error('Error adding employee:', insertError);
                    }
                })
                console.log(`\nAdded ${answers.first_name} ${answers.last_name} to the database.`);    

                // console.log('Add Employee clicked!');        

                pressEnter(startProgram);
            })
            .catch((error) => {

            });

        });

    });
}

function updateEmployeeRole(startProgram) {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee', (error, results, fields) => {
        if (error) {
            console.error('Error fetching employees from the employee table:', error);
            return;
        }

        db.query('SELECT id, title FROM role', (roleError, roleResults, roleFields) => {
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
                const selectedEmployee = results.find(employee => employee.employee_name === answers.employeeList);

                const selectedRole = roleResults.find(role => role.title === answers.roleList);

                db.query(`UPDATE employee SET role_id = (?) WHERE id = (?)`, [selectedRole.id, selectedEmployee.id], (updateError, result) => {
                    if (updateError) {
                        console.error('Error updating role:', updateError);
                        return;
                    }
        
                    console.log(`\nUpdated employee's role.`);    

                    // console.log('Update Employee Role clicked!');
        
                    pressEnter(startProgram);
                })

            })
            .catch((error) => {

            });
        });
    });
}

function addRole(startProgram) {
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
            // console.log(answers)
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.roleName, answers.roleSalary, answers.roleDepartment])

            const selectedId = answers.roleDepartment;
            // console.log(selectedId);

            console.log(`\nAdded ${answers.roleName} to the database
            `);

            // console.log('Add Role clicked!');

            pressEnter(startProgram);
        })
        .catch((error) => {

        });
    });
}

function addDepartment(startProgram) {
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

            console.log(`\nAdded ${answers.databaseName} to the database.`);

            // console.log('Add Department clicked!');

            pressEnter(startProgram);
        })
    })
    .catch((error) => {

    });
}

function pressEnter(callback) {
    process.stdin.setRawMode(true);

    console.log('\nPress Enter to continue...');

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