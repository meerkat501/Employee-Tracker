const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'TheMeeRat501ST!',
    database: 'employees_db',
}); 

connection.connect(err => {
    if (err) throw err;
    employees();
});

function employees() {
    inquirer.prompt ({
        name: 'action',
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
            case 'View all roles':
                viewRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Update an employee role':
            updateRole();
            break;
        }
    });
};

function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table(res);
        employees();
    });
};

function viewRoles() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        employees();
    }); 
};

function viewDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        employees();
    }); 
};

function addDepartment() {
    inquirer.prompt({
        name:'departmentName',
        type:'input',
        message:'What is the name of the department?'
    }).then(answer => {
        connection.query('INSERT INTO departments SET ?', {name: answer.departmentName},
        (err) =>{
            if (err) throw err;
            console.log('Department added!')
            employees();
        })
    })
};

function addRole() {
    connection.query('SELECT * FROM departments', (err, departments) => {
      if (err) throw err;
      inquirer.prompt([
        {
        name:'title',
        type:'input',
        message:'What is the name of the role?'
        },
        {
            name:'salary',
            type:'input',
            message:'What is the salary of the role?',
            validate: value => !isNaN(value)
        },
        {
            name:'departmentId',
            type:'list',
            choices: departments.map(department => ({name: department.name, value: department.id})),
            message:'Which department does this role belong to?'
        }
      ]).then(answers => {
        connection.query('INSERT INTO roles SET?', 
        {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId
        },
        (err) => {
            if (err) throw err;
            console.log('Role added successfully');
            employees();
        }
        );
      });  
    });
};

function addEmployee() {
    connection.query('SELECT * FROM roles', (err, roles) =>{
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the First name of the employee?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the Last name of the employee?'
            },
            {
                name: 'roleId',
                type: 'list',
                choices: roles.map(roles => ({name: roles.title, value: roles.id})),
                message:'What is the role of the employee?'
            },
        ]).then(answers => {
            connection.query('INSERT INTO employees SET ?',
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
            },
            (err) => {
                if (err) throw err;
                console.log('Employee added!')
                employees();
            }
            );
        });
    })
};

function updateRole() {
    connection.query('SELECT * FROM employees',(err,employees) => {
        if (err) throw err;

        inquirer.prompt({
            name: 'selectedEmployee',
            type:'list',
            message: 'Which employee\'s role would like to be updated?',
            choices: employees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        }).then(answer =>{
            const employeeId = answer.selectedEmployee;
            connection.query('SELECT * FROM roles', (err,roles) => {
                if (err) throw err;
                inquirer.prompt({
                    name: 'newRole',
                    type:'list',
                    message:'What is the new role of the employee?',
                    choices: roles.map(role =>({
                        name: role.title,
                        value: role.id
                    }))
                }).then(answer =>{
                    const newRoleId = answer.newRole;
                    connection.query('UPDATE employees SET role_id = ? WHERE id = ?', 
                        [newRoleId, employeeId],
                        (err) => {
                            if (err) throw err;
                            console.log('Employee Role updated!')
                        }
                    );
                });
            });
        });
    });
}