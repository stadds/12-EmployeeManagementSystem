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

const DB_USER = {}

async function setDBUser(user) {
    try {

        DB_USER.created_by = user.username;
        DB_USER.updated_by = user.username;

        console.log(DB_USER);

        return "\nlogin succesful!\n"


    } catch (error) {
        console.log(error);

    }
}

// DEPARTMENT QUERIES
// =============================================================
async function getAllDepartments() {
    try {

        let query = 'SELECT id, name FROM department';
        let results = await promisePool.query(query);
        return results[0];

    } catch (error) {
        console.log(error);

    }
}


async function insertNewDept(newDept) {
    try {

        let query = `INSERT INTO department SET ?`;
        await promisePool.query(query, { ...DB_USER, ...newDept });

        return "\nNew deptartment successfully created. . . .\n";

    } catch (error) {
        console.log(error);
    }
}

async function getAllDeptUtilBudget() {
    try {

        let query = `WITH emp_salaries (dpt_id, dpt_name, role, employee, salary) AS (
            SELECT DISTINCT dpt.id, dpt.name as Department,er.title , concat(emp.first_name," ",emp.last_name) as "Employee",er.salary 
             FROM department dpt INNER JOIN emp_role er on er.department_id =  dpt.id INNER JOIN employee emp on emp.role_id = er.id 
             ORDER BY dpt.id,er.id,emp.id) 
             SELECT dpt_id ,dpt_name,FORMAT(SUM(salary),2) as "Total" 
             FROM emp_salaries GROUP BY dpt_id, dpt_name 
             UNION SELECT "Grand Total", "",FORMAT(SUM(salary),2) as "Total" FROM emp_salaries;`;

        let results = await promisePool.query(query);

        return results[0];


    } catch (error) {
        console.log(error);

    }
}

async function getOneDeptBudget(dept) {
    try {

        let query = `WITH emp_salaries (dpt_id, dpt_name, role, employee, salary) AS (
            SELECT DISTINCT dpt.id, dpt.name as Department,er.title , concat(emp.first_name," ",emp.last_name) as "Employee",er.salary
            FROM department dpt INNER JOIN emp_role er on er.department_id =  dpt.id INNER JOIN employee emp on emp.role_id = er.id
            ORDER BY dpt.id,er.id,emp.id)  
            SELECT dpt_id ,dpt_name,FORMAT(SUM(salary),2) as "Total"  
            FROM emp_salaries WHERE dpt_id = ? GROUP BY dpt_id, dpt_name;`;

        let results = await promisePool.query(query, dept);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}


async function deleteDept(delDept) {
    try {

        let query = 'DELETE FROM department WHERE ID = ?';

        await promisePool.query(query, delDept.id);

        return "\ndepartment successfully deleted. . . .\n";

    } catch (error) {
        console.log(error);

    }
}


// EMP ROLE QUERIES
// =============================================================

async function getAllRoles() {
    try {

        let query = 'SELECT er.id, d.name as department, er.department_id, er.title, FORMAT(er.salary,2) as salary ';
        query += ' FROM emp_role er LEFT JOIN department d ON d.id = er.department_id ';
        query += ' ORDER BY er.department_id, er.id ASC ';

        let results = await promisePool.query(query);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}

async function insertNewRole(roleParams) {
    try {

        let query = `INSERT INTO emp_role SET ?`;

        await promisePool.query(query, { ...DB_USER, ...roleParams });

        return "\nNew role successfully created. . . .\n";

    } catch (error) {
        console.log(error);

    }
}


async function getManagerList() {
    try {

        let query = `WITH emp_list (id,fname,lname,role,manager,title) AS (
            SELECT
                emp.id
                , emp.first_name
                , emp.last_name
                , emp.role_id 
                , emp.manager_id
                , er.title
            FROM employee emp
                LEFT JOIN emp_role er on er.id = emp.role_id
        )
        SELECT DISTINCT
            mgr.id
            , CONCAT(mgr.fname," ",mgr.lname) AS "Manager"
            , mgr.title
            , COUNT(emp.id) as "Num_DirectReports"
        FROM emp_list emp
            INNER JOIN emp_list mgr ON mgr.id = emp.manager
        GROUP BY mgr.id,  CONCAT(mgr.fname," ",mgr.lname);`

        let results = await promisePool.query(query);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}


async function deleteRole(delRole) {
    try {

        let query = 'DELETE FROM emp_role WHERE ID = ?';

        await promisePool.query(query, delRole.id);
        // console.log(result);
        // console.log(result[0]);

        let message = "\nrole successfully deleted. . . .\n";

        return message;

    } catch (error) {
        console.log(error.message);

    }
}


async function getRoleEmpCount() {
    try {

        let query = `SELECT er.id, er. title, COUNT(emp.id) as EmployeeCount`;
        query += ` FROM emp_role er LEFT JOIN employee emp on emp.role_id = er.id`;
        query += ` GROUP BY er.id, er.title ORDER BY EmployeeCount,er.id;`;

        // console.log(query);

        let results = await promisePool.query(query);
        // console.log(results);
        // console.log(results[0]);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}

async function updateRoleDept(roleDept) {
    try {

        let query = "UPDATE emp_role SET ? WHERE id = ?";

        await promisePool.query(query, [
            {
                department_id: roleDept.department_id,
                updated_by: DB_USER.updated_by
            }
            , roleDept.id
        ]);

        return "\nrole's department successfully updated. . . .\n";

    } catch (error) {
        console.log(error);
    }

}


async function updateRoleSalary(roleSal) {
    try {

        let query = "UPDATE emp_role SET ? WHERE id = ?";

        await promisePool.query(query,
            [
                {
                    salary: roleSal.salary,
                    updated_by: DB_USER.updated_by
                }
                , roleSal.id
            ]);

        return "\nrole's salary successfully updated. . . .\n"

    } catch (error) {
        console.log(error);

    }

}


// EMPLOYEE QUERIES
// =============================================================
async function getAllEmployeeData() {
    try {

        let query = 'SELECT DISTINCT emp.id, emp.first_name, emp.last_name, er.title, dpt.name as Department, FORMAT(er.salary,2) as Salary , emp.manager_id, IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager ';
        query += 'FROM employee emp LEFT JOIN emp_role er on er.id = emp.role_id LEFT JOIN department dpt on dpt.id = er.department_id LEFT JOIN employee mngr on mngr.id = emp.manager_id ';
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
        query += ' FROM employee emp LEFT JOIN emp_role er on er.id = emp.role_id ORDER BY emp.id';

        let results = await promisePool.query(query);

        return results[0];

    } catch (error) {
        console.log(error);

    }
}

async function getEmployeeByDept(deptID) {
    try {
        let query = 'SELECT emp.id, concat(first_name, " ", last_name) as Employee, emp.role_id, er.title';
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
        await promisePool.query(query, { ...DB_USER, ...newEmp });

        return "\nNew employee successfully created. . . .\n";

    } catch (error) {
        console.log(error);

    }
}

async function updateEmpRoleMgr(empRole) {
    try {

        let query = 'UPDATE employee SET ? WHERE ?';
        await promisePool.query(query,
            [
                {
                    role_id: empRole.role_id,
                    manager_id: empRole.manager_id,
                    updated_by: DB_USER.updated_by
                },
                {
                    id: empRole.id
                }
            ]);

        return "\nemployee successfully updated. . . .\n";

    } catch (error) {
        console.log(error);
    }
}

async function deleteEmployee(deleteEmp) {
    try {

        let query = "DELETE FROM employee WHERE id = ?";
        await promisePool.query(query, deleteEmp.id);

        return "\nemployee successfully deleted. . . .\n"

    } catch (error) {
        console.log(error);

    }
}


async function getEmpByMgr(empManager) {
    try {

        let query = 'SELECT emp.id, concat(first_name, " ", last_name) as Employee, er.title';
        query += ' FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id';
        query += ' WHERE emp.manager_id = ? ORDER BY emp.id';

        let results = await await promisePool.query(query, empManager.manager_id);

        return results[0];


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
    setDBUser,
    getAllEmployeeData,
    getEmployeeList,
    getEmployeeByDept,
    getAllDepartments,
    getAllRoles,
    insertNewDept,
    insertNewRole,
    insertNewEmp,
    updateEmpRoleMgr,
    getAllDeptUtilBudget,
    getOneDeptBudget,
    deleteEmployee,
    getManagerList,
    getEmpByMgr,
    deleteRole,
    deleteDept,
    getRoleEmpCount,
    updateRoleSalary,
    updateRoleDept,
    closeDB
};