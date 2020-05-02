USE employee_mgmtDB;

SET @user = "sys_setup";

INSERT INTO department(name,created_by, updated_by)
VALUES ("Marketing",@user,@user),("Technology",@user,@user),("Finance",@user,@user),("Legal",@user,@user),("Operations",@user,@user);

SELECT * FROM department;

INSERT INTO emp_role(title,salary,department_id,created_by, updated_by)
VALUES 
("Marketing Specialist",50000.00,1,@user,@user),
("Marketing Lead",85000.00,1,@user,@user),
("Product Manager",100000.00,1,@user,@user),
("Software Engineer",60000.00,2,@user,@user),
("Senior Software Engineer",85000.00,2,@user,@user),
("Lead Engineer",110000.00,2,@user,@user),
("Accounts Payable Analyst",55000.00,3,@user,@user),
("Accounts Receivable Analyst",55000.00,3,@user,@user),
("Accounts Lead",80000.00,3,@user,@user),
("Corporate Associate Attorney",80000.00,4,@user,@user),
("Senior Corporate Counsel",180000.00,4,@user,@user),
("Operations Analyst",50000.00,5,@user,@user),
("Operations Manager",90000.00,5,@user,@user);

SELECT * FROM emp_role;

SELECT 
	d.id,
	d.name,
    er.id as ER_ID,
    er.title,
    er.salary
FROM department d
	INNER JOIN emp_role er on er.department_id = d.id
ORDER BY d.id, er.salary ASC;

INSERT INTO employee(first_name, last_name,role_id,created_by, updated_by)
VALUES
("Boyd","Hume",1,@user,@user),
("Elise","Warrick",2,@user,@user),
("Remi","Borde",3,@user,@user),
("Sudarshana","Miyamoto",4,@user,@user),
("Kalyan","Lynton",4,@user,@user),
("Nikolas","Bates",5,@user,@user),
("Mohini","Hatheway",6,@user,@user),
("Tye","Sasaki",7,@user,@user),
("Dillon","Hardwick",8,@user,@user),
("Yuna","Tailor",8,@user,@user),
("Zara","Claesson",9,@user,@user),
("Maya","Barlow",10,@user,@user),
("Hikaru","Bishop",11,@user,@user),
("Sushil","Vemulakonda",12,@user,@user),
("Ayame","Fay",12,@user,@user),
("Lara","Croft",13,@user,@user);

SELECT * FROM employee;

UPDATE employee SET manager_id = 2 WHERE id = 1;
UPDATE employee SET manager_id = 3 WHERE id = 2;
UPDATE employee SET manager_id = 7 WHERE id = 4;
UPDATE employee SET manager_id = 7 WHERE id = 5;
UPDATE employee SET manager_id = 7 WHERE id = 6;
UPDATE employee SET manager_id = 11 WHERE id = 8;
UPDATE employee SET manager_id = 11 WHERE id = 9;
UPDATE employee SET manager_id = 11 WHERE id = 10;
UPDATE employee SET manager_id = 13 WHERE id = 12;
UPDATE employee SET manager_id = 16 WHERE id = 14;
UPDATE employee SET manager_id = 16 WHERE id = 15;

SELECT * FROM employee;

SELECT
	emp.id
	,emp.first_name
    ,emp.last_name
    ,concat(mngr.first_name, " ", mngr.last_name) as Manager
    ,dpt.name as Department
    ,er.title    
FROM employee emp
	LEFT JOIN emp_role er on er.id = emp.role_id
    LEFT JOIN department dpt on dpt.id = er.department_id
	LEFt JOIN employee mngr on mngr.id = emp.manager_id
ORDER BY emp.id;