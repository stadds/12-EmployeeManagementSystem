// REQUIRE Dependencies
// =============================================================
const inquirer = require("inquirer");
const myDB = require("./db");

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

async function getUserInput() {
    try {

        let keepGoing = true;

        while(keepGoing === true){

            const getAction = await inquirer.prompt(starterPrompt);

            switch(getAction.actionitem){
                case ("exit"):
                    console.log(getAction.actionitem);                    
                    keepGoing = false;
                    myDB.closeDB();
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

getUserInput();