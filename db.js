// Dependencies
// =============================================================
const mysql = require("mysql2");

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const promisePool = pool.promise();

async function getAllEmployeeData(){
    try {

        let query = 'SELECT emp.id, emp.first_name, emp.last_name, er.title, dpt.name as Department, FORMAT(er.salary,2) as Salary, IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager ';
        query += 'FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id INNER JOIN department dpt on dpt.id = er.department_id LEFt JOIN employee mngr on mngr.id = emp.manager_id ';
        query += 'ORDER BY emp.id';

        let results = await promisePool.query(query);
        console.table(results[0]);   
        pool.end();
    } catch (error) {
        console.log(error);
    }
}

getAllEmployeeData();