const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: '',
    password: '',
    database: 'employees_db',
}); 

connection.connect(err => {
    if (err) throw err;
    employees();
});

function employees() {
    inquirer.prompt ({
        name: '',
        type: 'list',
        message: 'What would like to view?',
        choices: [
            'View all employees',
            'View all roles',
            'View all departments',
            'Add an employee',
            'Add a role',
            'Add a department',
            'Update an employee role',
            'Exit'
        ],
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'Veiw all roles':
                veiwRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
        }
    });
};

function viewEmployees() {};

function veiwRoles() {};

function viewDepartments() {};