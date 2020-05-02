// REQUIRE Dependencies
// =============================================================
const inquirer = require("inquirer");
const myDB = require("./db");


// Inqurier Prompts
// =============================================================
const starterPrompt = [
    {
        name: "actionitem",
        type: "list",
        message: "What would you like to do?",
        choices: [
            new inquirer.Separator(". . . REPORTING . . ."),
            {
                name: "  View All Employees",
                value: "viewEmp"
            },
            {
                name: "  View Employees by Specific Manager",
                value: "getEmpMgr"
            },
            {
                name: "  View All Roles",
                value: "viewRoles"
            },
            {
                name: "  View All Departments",
                value: "viewDept"
            },
            {
                name: "  View One Department's Budget",
                value: "getOneBudget"
            },
            {
                name: "  View All Department Budgets",
                value: "getAllBudgets"
            },

            new inquirer.Separator(". . . ADD . . ."),
            {
                name: "  Add A Department",
                value: "addDept"
            },
            {
                name: "  Add A Role",
                value: "addRole"
            },
            {
                name: "  Add An Employee",
                value: "addEmp"
            },

            new inquirer.Separator(". . . UPDATE . . ."),
            {
                name: "  Update Employee's Role",
                value: "updateEmpRole"
            },

            new inquirer.Separator(". . . DELETE . . ."),
            {
                name: "  Delete A Department",
                value: "deleteDept"
            },
            {
                name: "  Delete A Role",
                value: "deleteRole"
            },
            {
                name: "  Delete An Employee",
                value: "deleteEmp"
            },

            new inquirer.Separator(". . . OTHER . . ."),
            {
                name: "  Exit\n  . . . . . . . . .\n\n",
                value: "exit"
            }
        ]
    },
]

// Get User Input
// =============================================================
async function getUserInput() {
    try {

        let keepGoing = true;

        while (keepGoing === true) {

            const getAction = await inquirer.prompt(starterPrompt);

            switch (getAction.actionitem) {
                case ("exit"):
                    console.log(getAction.actionitem);
                    keepGoing = false;
                    myDB.closeDB();
                    break;

                case ("addDept"):
                    const newDept = await inquirer.prompt([
                        {
                            name: "name",
                            type: "input",
                            message: "Enter the name of the new department:"
                        }
                    ]);
                    // console.log(newDept);
                    let result = await myDB.insertNewDept(newDept);
                    console.log(result);
                    break;

                case ("viewDept"):
                    const allDepts = await myDB.getAllDepartments();
                    console.table(allDepts);
                    break;

                case ("getAllBudgets"):
                    const allBudgets = await myDB.getAllDeptUtilBudget();
                    console.table(allBudgets);
                    break;

                case ("getOneBudget"):
                    await getOneDeptBudget();
                    break;

                case ("deleteDept"):
                    await deleteDepartment();
                    break;

                case ("addRole"):
                    await addNewRole();
                    break;

                case ("viewRoles"):
                    const allRoles = await myDB.getAllRoles();
                    console.table(allRoles);
                    break;

                case ("deleteRole"):
                    await deleteRole();
                    break;

                case ("addEmp"):
                    await addNewEmployee();
                    break;

                case ("viewEmp"):
                    const allEmps = await myDB.getAllEmployeeData();
                    console.table(allEmps);
                    break;

                case ("updateEmpRole"):
                    await updateEmpRole();
                    break;

                case ("getEmpMgr"):
                    await getEmpByManager();
                    break;

                case ("deleteEmp"):
                    await deleteEmployee();
                    break;

                default:
                    console.log(getAction.actionitem);
                    break;
            }
        }

    } catch (error) {
        console.log(error);

    }
}

// Functions for Switch Cases
// =============================================================
async function addNewRole() {
    try {

        //get department list
        const allDepts = await myDB.getAllDepartments();
        //console.log(allDepts);

        //create temp array for inquirer choices array
        let choicesArr = [];

        //convert department list into inquirer object format, add to array
        for (let i = 0; i < allDepts.length; i++) {
            let tmpObj = {};
            tmpObj.name = allDepts[i].name;
            tmpObj.value = allDepts[i].id;
            choicesArr.push(tmpObj);
        }

        ///console.log(choicesArr);

        const newRole = await inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Enter new employee role: "
            },
            {
                name: "salary",
                type: "input",
                message: "Enter salary for new role: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "department_id",
                type: "list",
                message: "Which department does this role belong to?",
                choices: choicesArr
            }
        ]);

        //console.log(newRole);

        let result = await myDB.insertNewRole(newRole);
        console.log(result);

    } catch (error) {
        console.log(error);

    }
}


async function addNewEmployee() {
    try {

        let roleList = await myDB.getAllRoles();
        //let empList = await myDB.getEmployeeList();

        //create temp array for inquirer choices array
        let roleChoices = [];

        //convert department list into inquirer object format, add to array
        for (let i = 0; i < roleList.length; i++) {
            let tmpObj = {};
            tmpObj.name = roleList[i].title;
            tmpObj.value = roleList[i].id;
            roleChoices.push(tmpObj);
        }

        // console.log(roleChoices);

        let empPartA = await inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter employee's first name: "
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter employee's last name: ",
            },
            {
                name: "role_id",
                type: "list",
                message: "Select employee's role: ",
                choices: roleChoices
            }
        ]);

        // console.log(empPartA);
        // console.log(empPartA.role_id);

        let empPartB = await getEmpManager(empPartA.role_id, roleList);
        //console.log(empPartB);

        let newEmp = { ...empPartA, ...empPartB };
        // console.log(newEmp);

        let result = await myDB.insertNewEmp(newEmp);
        console.log(result);


    } catch (error) {
        console.log(error);

    }
}

async function getEmpManager(empRoleID, roleList, excludeID) {

    let deptId = null;

    //
    for (let i = 0; i < roleList.length; i++) {
        if (roleList[i].id === empRoleID) {
            // console.log(roleList[i].title +" "+  roleList[i].department_id);
            deptId = roleList[i].department_id;
            break;
        }
    }
    //console.log(deptId);
    let managerList = await myDB.getEmployeeByDept(deptId);
    // console.log(managerList);

    let managerChoice = [{ name: "None", value: null }];

    for (let j = 0; j < managerList.length; j++) {
        let tmpObj = {};
        if (managerList[j].id === excludeID) { continue; };
        tmpObj.name = managerList[j].Employee + ", " + managerList[j].title;
        tmpObj.value = managerList[j].id;
        managerChoice.push(tmpObj);
    }

    //console.log(managerChoice);

    let manager = await inquirer.prompt([
        {
            name: "manager_id",
            type: "list",
            message: "Select employee's manager: ",
            choices: managerChoice
        }
    ]);

    //console.log(manager);
    return manager;

}


async function updateEmpRole() {
    try {

        let empList = await myDB.getEmployeeList();
        // console.log(empList);

        let empChoices = [];

        for (let i = 0; i < empList.length; i++) {
            let tmpObj = {};
            tmpObj.name = `${empList[i].Employee} - Current Title: ${empList[i].title}`;
            tmpObj.value = { id: empList[i].id, manager: empList[i].manager_id, role: empList[i].role_id };
            // tmpObj.value = {role_id: empList[i].role_id, id: empList[i].id};
            empChoices.push(tmpObj);
        }

        //console.log(empChoices);

        let roleList = await myDB.getAllRoles();

        //create temp array for inquirer choices array
        let roleChoices = [];

        //convert role list into inquirer object format, add to array
        for (let i = 0; i < roleList.length; i++) {
            let tmpObj = {};
            tmpObj.name = roleList[i].title;
            tmpObj.value = roleList[i].id;
            roleChoices.push(tmpObj);
        }


        let updateParam = await inquirer.prompt([
            {
                name: "currentInfo",
                type: "list",
                message: "Select employee to update: ",
                choices: empChoices
            },
            {
                name: "role_id",
                type: "list",
                message: "Select employee's new role: ",
                choices: roleChoices
            },
            {
                name: "update_mgr",
                type: "list",
                message: "Update employee's manager?",
                choices: [
                    "Yes",
                    "No"
                ]

            }
        ]);

        //  console.log(updateParam);

        if (updateParam.update_mgr === "Yes") {
            let newMgr = await getEmpManager(updateParam.role_id, roleList, updateParam.currentInfo.id);
            updateParam.manager = newMgr.manager_id;
        }

        // console.log(updateParam);

        let updateEmp = {};

        updateEmp.id = updateParam.currentInfo.id;
        updateEmp.role_id = updateParam.role_id;

        if (updateParam.update_mgr === "Yes") {
            updateEmp.manager_id = updateParam.manager;
        }
        else if (updateParam.update_mgr === "No") {
            updateEmp.manager_id = updateParam.currentInfo.manager;
        }

        // console.log(updateEmp);

        let result = await myDB.updateEmpRoleMgr(updateEmp);

        console.log(result);

    } catch (error) {
        console.log(error);

    }
}

async function getOneDeptBudget() {
    try {

        let deptList = await myDB.getAllDepartments();

        let deptChoices = [];

        //convert department list into inquirer object format, add to array
        for (let i = 0; i < deptList.length; i++) {
            let tmpObj = {};
            tmpObj.name = deptList[i].name;
            tmpObj.value = deptList[i].id;
            deptChoices.push(tmpObj);
        }

        let dept = await inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Select department: ",
                choices: deptChoices
            }
        ]);

        console.log(dept.id)

        let deptBudget = await myDB.getOneDeptBudget(dept.id);

        console.table(deptBudget);

    } catch (error) {
        console.log(error);

    }
}

async function deleteEmployee() {
    try {

        let empList = await myDB.getEmployeeList();
        // console.log(empList);

        let empChoices = [];

        for (let i = 0; i < empList.length; i++) {
            let tmpObj = {};
            tmpObj.name = `${empList[i].Employee} - ${empList[i].title}`;
            tmpObj.value = empList[i].id;
            // tmpObj.value = {role_id: empList[i].role_id, id: empList[i].id};
            empChoices.push(tmpObj);
        }

        let deleteEmp = await inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Select employee to delete: ",
                choices: empChoices
            }
        ]);

        console.log(deleteEmp);


        let result = await myDB.deleteEmployee(deleteEmp);

        console.log(result);



    } catch (error) {
        console.log(error);

    }

}

async function getEmpByManager() {
    try {

        let managerList = await myDB.getManagerList();
        // console.log(managerList);

        let mgrChoices = [];

        for (let i = 0; i < managerList.length; i++) {
            let tmpObj = {};
            tmpObj.name = `${managerList[i].Manager} - ${managerList[i].title} - Direct Reports: ${managerList[i].Num_DirectReports} `;
            tmpObj.value = managerList[i].id;
            mgrChoices.push(tmpObj);
        }

        // console.log(mgrChoices);

        let empList = await inquirer.prompt([
            {
                name: "manager_id",
                type: "list",
                message: "Select manager: ",
                choices: mgrChoices
            }
        ]);

        // console.log(empList);
        let results = await myDB.getEmpByMgr(empList);

        console.table(results);

    } catch (error) {
        console.log(error);

    }
}

async function deleteRole() {
    try {

        let roleList = await myDB.getRoleEmpCount();

        //create temp array for inquirer choices array
        let roleChoices = [];

        //convert role list into inquirer object format, add to array
        for (let i = 0; i < roleList.length; i++) {
            let tmpObj = {};
            tmpObj.name = `${roleList[i].title} - # Employees: ${roleList[i].EmployeeCount}`;

            if (roleList[i].EmployeeCount > 0) {
                tmpObj.value = { id: roleList[i].id, canDelete: false };
            }
            else {
                tmpObj.value = { id: roleList[i].id, canDelete: true };
            }
            roleChoices.push(tmpObj);
        }

        let delRole = await inquirer.prompt([
            {
                name: "selected",
                type: "list",
                message: "Select Role to Delete: ",
                choices: roleChoices
            }
        ]);

        // console.log(delRole);

        let result = "";

        if (delRole.selected.canDelete === true) {
            result = await myDB.deleteRole(delRole.selected);
        }
        else if (delRole.selected.canDelete === false) {
            result = "!! WARNING !! \nCannot delete a role that has employees. \nPlease re-assign employees before deleting this role.\n";
        }

        console.log(result);

    } catch (error) {
        console.log(error);

    }
}

async function deleteDepartment(){
    try {

        let deptList = await myDB.getAllDepartments();

        let deptChoices = [];

        for (let i = 0; i < deptList.length; i++) {
            let tmpObj = {};
            tmpObj.name = deptList[i].name;
            tmpObj.value = deptList[i].id;
            deptChoices.push(tmpObj);
        }

        
        let delDept = await inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Select Department to Delete: ",
                choices: deptChoices
            },
            {
                name: "confirm",
                type: "list",
                message: "!! WARNING !! \n  Any roles in this deparment will now have a department of NULL. \n  Proceed with department deletion?: ",
                choices: [
                    "No",
                    "Yes"
                ]
            }
        ]);

        // console.log(delDept);

        let result = "";
        
        if(delDept.confirm === "Yes") {
            result = await myDB.deleteDept(delDept);
        }
        else {
            result = "Canceling 'Delete A Department'";
        }

        console.log(result);
        
    } catch (error) {
        console.log(error);
        
    }
}

// RUN
// =============================================================

getUserInput();