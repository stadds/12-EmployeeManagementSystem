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
            new inquirer.Separator("---- Department Items ----"),
            {
                name: "Add a department",
                value: "addDept"
            },
            {
                name: "View all departments",
                value: "viewDept"
            },
            new inquirer.Separator("---- Role Items ----"),
            {
                name: "Add an employee role",
                value: "addRole"
            },
            {
                name: "View all employee roles",
                value: "viewRoles"
            },
            new inquirer.Separator("---- Employee Items ----"),
            {
                name: "Add an employee",
                value: "addEmp"
            },
            {
                name: "View all employees",
                value: "viewEmp"
            },
            new inquirer.Separator(),
            {
                name: "Exit",
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

                case ("addRole"):
                    await addNewRole();
                    break;

                case ("viewRoles"):
                    const allRoles = await myDB.getAllRoles();
                    console.table(allRoles);
                    break;

                case ("viewEmp"):
                    const allEmps = await myDB.getAllEmployeeData();
                    console.table(allEmps);
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

        const allDepts = await myDB.getAllDepartments();
        //console.log(allDepts);

        let choicesArr = [];

        for(let i = 0; i < allDepts.length; i++){
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
                validate: function(value) {
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

// RUN
// =============================================================

getUserInput();