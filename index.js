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
})

//function that starts program