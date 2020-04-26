USE employee_mgmtDB;


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