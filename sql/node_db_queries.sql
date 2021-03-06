USE employee_mgmtDB;

/*
	Department SQL Queries
*/
-- Get all Departments
SELECT * FROM department;

-- Add department
INSERT INTO department SET ? ;



;

WITH emp_salaries (dpt_id, dpt_name, role, employee, salary) AS (
SELECT DISTINCT
	dpt.id
    ,dpt.name as Department
    ,er.title
    , concat(emp.first_name," ",emp.last_name) as "Employee"
    ,er.salary
FROM department dpt
	INNER JOIN emp_role er on er.department_id =  dpt.id
	INNER JOIN employee emp on emp.role_id = er.id
ORDER BY dpt.id,er.id,emp.id )
SELECT 
	dpt_id
    ,dpt_name
    ,FORMAT(SUM(salary),2) as "Total"
FROM emp_salaries
GROUP BY dpt_id, dpt_name
UNION
SELECT 
	"Grand Total"
    , ""
	,FORMAT(SUM(salary),2) as "Total"
FROM emp_salaries;


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
	LEFT JOIN department d ON d.id = er.department_id
ORDER BY er.department_id, er.id ASC;

/*
	Employee SQL Queries
*/
SELECT DISTINCT
	emp.id
    ,emp.first_name
    ,emp.last_name
	,er.title  
    ,dpt.name as Department
    ,FORMAT(er.salary,2) as Salary
    , emp.manager_id
    ,IFNULL(concat(mngr.first_name," ",mngr.last_name),"") as Manager
FROM employee emp
	LEFT JOIN emp_role er on er.id = emp.role_id
    LEFT JOIN department dpt on dpt.id = er.department_id
	LEFT JOIN employee mngr on mngr.id = emp.manager_id
ORDER BY er.department_id,er.id,emp.id;

SELECT DISTINCT emp.id, concat(emp.first_name, " ", emp.last_name) as Employee, emp.role_id, er.title, emp.manager_id
FROM employee emp INNER JOIN emp_role er on er.id = emp.role_id
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
;
-- Get Manager, Count of Direct Reports
WITH emp_list (id,fname,lname,role,manager,title) AS (
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
    , COUNT(emp.id) as "# Direct Reports"
FROM emp_list emp
	INNER JOIN emp_list mgr ON mgr.id = emp.manager
GROUP BY mgr.id,  CONCAT(mgr.fname," ",mgr.lname);


-- Get Employee by Manager
SELECT 
	emp.id
    ,concat(first_name, " ", last_name) as Employee
    ,er.title
FROM employee emp
	INNER JOIN emp_role er on er.id = emp.role_id
WHERE emp.manager_id = 11
ORDER BY emp.id;

-- Roles, Count of Employees
SELECT 
	er.id
	, er. title 
    ,COUNT(emp.id) as EmployeeCount
FROM emp_role er
	LEFT JOIN employee emp on emp.role_id = er.id
GROUP BY er.id, er.title
ORDER BY EmployeeCount,er.id;

SELECT * FROM emp_role;

DELETE FROM emp_role WHERE ID = 3;

DELETE FROM deptartment WHERE ID = ?;

UPDATE emp_role SET department_id = ? WHERE id = ?

UPDATE emp_role SET salary = ? WHERE id = ?