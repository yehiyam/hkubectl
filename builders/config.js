const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const commands = require('../commands/config/index.js');
const { writeValues, resolveConfigPath } = require('../helpers/config');
const { get } = require('../helpers/request-helper');
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const handler = async ({ endpoint, rejectUnauthorized, ...rest }) => {
    console.log(chalk.bold('Please answer a few questions to configure Hkube cli'));
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'endpoint',
            message: 'Enter the URL of your Hkube cluster',
            default: endpoint,
            validate: (value) => {
                return urlRegex.test(value) || 'Please enter a valid URL';
            }
        },
        {
            type: 'confirm',
            name: 'rejectUnauthorized',
            message: 'Verify SSL certificates? (enter false for self signed certificates)',
            default: rejectUnauthorized
        }
    ]);
    await writeValues(answers);
    // const answers = { endpoint, rejectUnauthorized };
    console.log(`Values saved in ${await resolveConfigPath()}`);
    const spinner = ora({ text: 'Validating config...', spinner: 'line' }).start();
    const res = await get({ ...answers, path: '/storage/info', timeout: 1000 });
    if (!res || !res.result) {
        spinner.fail();
        console.error(chalk`{red failed} to connect to api-server at ${endpoint}`);
        if (res.error && res.error.message) {
            console.error(chalk`{red Error is}: ${res.error.message}`);
        }
    }
    else {
        spinner.succeed();
        console.log(chalk`{green Successfully} configured to {bold ${endpoint} }`);
    }
    console.log(chalk`Run {bold ${rest.$0} config} to run the configuration wizard again`);
    console.log(chalk`Run {bold ${rest.$0}} without arguments to get help`);
};
const config = {
    command: ['config [command]'],
    description: 'Set configuration options for hkubectl',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });
        return yargs;
    },
    handler
};

module.exports = {
    config
};
