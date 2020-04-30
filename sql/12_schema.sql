DROP DATABASE IF EXISTS employee_mgmtDB;

CREATE DATABASE employee_mgmtDB;

USE employee_mgmtDB;

CREATE TABLE department(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE emp_role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,2) NULL,
    department_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
		 ON UPDATE CASCADE ON DELETE SET NULL 
);

CREATE TABlE employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NULL ,
    manager_id INT NULL,    
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES emp_role(id)  ON UPDATE CASCADE ON DELETE SET NULL ,
    FOREIGN KEY (manager_id) REFERENCES employee(id)  ON UPDATE CASCADE ON DELETE SET NULL 
);


