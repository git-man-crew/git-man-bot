const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("GIT Man", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
}

const askQuestions = () => {
    const questions = [{
        name: "DIALOGID",
        type: "input",
        message: "What should your new dialog be called?"
    }];
    return inquirer.prompt(questions);
};

const success = (DIALOGID) => {
    console.log(
      chalk.white.bgGreen.bold(`Done! Dialog controller and view for ${DIALOGID} is created!`)
    );
  };

const run = async () => {
    init();

    const {
        DIALOGID
    } = await askQuestions();

    const controllerResult = shell.exec(`nest generate provider ${DIALOGID}-controller dialog/controllers/${DIALOGID}`);
    if (controllerResult.stderr.length) throw new Error(controllerResult.stderr);

    const viewResult = shell.exec(`nest generate provider ${DIALOGID}-view dialog/views/${DIALOGID}`);
    if (viewResult.stderr.length) throw new Error(viewResult.stderr);

    success(DIALOGID);
};

run();