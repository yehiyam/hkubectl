const inquirer = require('inquirer');

const askMissingValues = async (fillMissing, options, currentValues) => {
    const questions = [];
    fillMissing.forEach(n => {
        questions.push({
            ...n,
            message: options[n.name].describe,
            choices: options[n.name].choices,
        });
    });
    if (questions.length) {
        const answers = await inquirer.prompt(questions, currentValues);
        return answers;
    }
    return {};
};

module.exports = {
    askMissingValues
};
