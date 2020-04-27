USE employee_mgmtDB;

/*
	Department SQL Queries
*/
-- Get all Departments
SELECT * FROM department;

-- Add department
INSERT INTO department SET ? ;

/*
	Role SQL Queries
*/
-- Get all roles
SELECT 
	er.id
    , d.name as department
    , er.department_id
    , er.title
    , FORMAT(er.salary,2) as salary
FROM emp_role er
	INNER JOIN department d ON d.id = er.department_id
ORDER BY er.department_id, er.id ASC;

/*
	Employee SQL Queries
*/
SELECT 
	emp.id
    ,emp.first_name
    ,emp.last_name
	,er.title  
    ,dpt.name as Department
    ,FORMAT(er.salary,2) as Salary
    ,IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager
FROM employee emp
	INNER JOIN emp_role er on er.id = emp.role_id
    INNER JOIN department dpt on dpt.id = er.department_id
	LEFT JOIN employee mngr on mngr.id = emp.manager_id
ORDER BY er.department_id,er.id,emp.id;

SELECT DISTINCT
	id
    ,concat(first_name, " ", last_name) as Employee
    ,role_id
FROM employee
ORDER BY id;

SELECT 
	emp.id
    ,emp.first_name
    ,emp.last_name
	,er.title  
    ,dpt.name as Department
    ,FORMAT(er.salary,2) as Salary
    ,IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager
FROM employee emp
	INNER JOIN emp_role er on er.id = emp.role_id
    INNER JOIN department dpt on dpt.id = er.department_id
	LEFt JOIN employee mngr on mngr.id = emp.manager_id
ORDER BY emp.id;

-- Get Employee by Department
SELECT 
	emp.id
    ,concat(first_name, " ", last_name) as Employee
    ,er.title
FROM employee emp
	INNER JOIN emp_role er on er.id = emp.role_id
WHERE er.department_id = 3
ORDER BY emp.id;
