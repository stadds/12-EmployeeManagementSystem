// Dependencies
// =============================================================
const mysql = require("mysql2");

require('dotenv').config();

// SET UP POOL CONNECTION
// =============================================================

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const promisePool = pool.promise();

// EMPLOYEE QUERIES
// =============================================================
async function getAllEmployeeData() {
    try {

        let query = 'SELECT DISTINCT emp.id, emp.first_name, emp.last_name, er.title, dpt.name as Department, FORMAT(er.salary,2) as Salary , emp.manager_id, IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager ';
        query += 'FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id INNER JOIN department dpt on dpt.id = er.department_id LEFt JOIN employee mngr on mngr.id = emp.manager_id ';
        query += ' ORDER BY er.department_id,er.id,emp.id';

        let results = await promisePool.query(query);
        // console.table(results[0]);   
        return results[0];
    } catch (error) {
        console.log(error);
    }
}

async function getEmployeeList() {
    try {
        let query = 'SELECT DISTINCT emp.id, concat(emp.first_name, " ", emp.last_name) as Employee, emp.role_id, er.title, emp.manager_id ';
        query += ' FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id ORDER BY emp.id';

        let results = await promisePool.query(query);
        return results[0];
    } catch (error) {
        console.log(error);

    }
}

async function getEmployeeByDept(deptID) {
    try {
        let query = 'SELECT emp.id, concat(first_name, " ", last_name) as Employee, er.title';
        query += ' FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id';
        query += ' WHERE er.department_id = ? ORDER BY er.id,emp.id';

        let results = await promisePool.query(query, deptID);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}

async function insertNewEmp(newEmp) {
    try {

        let query = 'INSERT INTO employee SET ?';
        await promisePool.query(query, newEmp);

        return "New employee created";

    } catch (error) {
        console.log(error);

    }
}

async function updateEmpRole(empRole) {
    try {

        let query = 'UPDATE employee SET ? WHERE ?';
        await promisePool.query(query,
            [
                {
                    role_id: empRole.role_id,
                    manager_id: empRole.manager_id
                }, 
                {
                    id: empRole.id
                }
            ]);

        return "employee updaed successfully";

    } catch (error) {
        console.log(error);

    }
}


// DEPARTMENT QUERIES
// =============================================================
async function getAllDepartments() {
    try {

        let query = 'SELECT * FROM department';
        let results = await promisePool.query(query);
        return results[0];

    } catch (error) {
        console.log(error);

    }
}


async function insertNewDept(newDept) {
    try {

        let query = `INSERT INTO department SET ?`;
        await promisePool.query(query, newDept);

        return "New deptartment successfully created";

    } catch (error) {
        console.log(error);

    }
}

// EMP ROLE QUERIES
// =============================================================

async function getAllRoles() {
    try {

        let query = 'SELECT er.id, d.name as department, er.department_id, er.title, FORMAT(er.salary,2) as salary ';
        query += 'FROM emp_role er INNER JOIN department d ON d.id = er.department_id ';
        query += 'ORDER BY er.department_id, er.id ASC ';
        let results = await promisePool.query(query);
        return results[0];

    } catch (error) {
        console.log(error);

    }
}

async function insertNewRole(roleParams) {
    try {

        let query = `INSERT INTO emp_role SET ?`;
        await promisePool.query(query, roleParams);

        return "New role successfully created";
    } catch (error) {
        console.log(error);

    }
}


// CLOSE POOL
// =============================================================
function closeDB() {
    pool.end();
}



// async function init(){
//     await getAllEmployeeData();
//     closeDB();
// }

// init();

module.exports = {
    getAllEmployeeData,
    getEmployeeList,
    getEmployeeByDept,
    getAllDepartments,
    getAllRoles,
    insertNewDept,
    insertNewRole,
    insertNewEmp,
    updateEmpRole,
    closeDB
};