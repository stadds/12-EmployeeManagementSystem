DROP DATABASE IF EXISTS employee_mgmtDB;

CREATE DATABASE employee_mgmtDB;

USE employee_mgmtDB;

CREATE TABLE department(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE emp_role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABlE employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NOT NULL ,
    manager_id INT ,    
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES emp_role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)    
);


