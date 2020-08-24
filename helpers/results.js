const ora = require('ora');
const objectPath = require('object-path');
const { getUntil, get } = require('./request-helper');
const { jobExecEvents } = require('./consts');

const waitForBuild = async ({ endpoint, rejectUnauthorized, execResult, noResult }) => {
    const { jobId } = execResult;
    let jobStatus = jobExecEvents.completed;
    let jobResult;
    if (jobId) {
        // wait for status
        const spinner = ora({ text: `execution ${jobId} in progress.`, spinner: 'line' }).start();
        let lastStatus = '';
        let lastProgress = '';
        const statusResult = await getUntil({ endpoint, rejectUnauthorized, path: `exec/status/${jobId}` }, (res) => {
            const currentStatus = objectPath.get(res, 'result.status', '');
            const currentProgress = objectPath.get(res, 'result.data.details', '');
            if (lastStatus !== currentStatus || lastProgress !== currentProgress) {
                spinner.text = `${currentStatus} - ${currentProgress}`;
            }
            lastStatus = currentStatus;
            lastProgress = currentProgress;
            return (Object.values(jobExecEvents).includes(currentStatus));
        }, 1000 * 60 * 10);
        const { status } = statusResult.result;
        if (status !== jobExecEvents.completed) {
            spinner.fail();
            jobStatus = status;
            console.log(`exec ${jobId} ${status}`);
            return { jobId, jobStatus };
        }
        if (noResult) {
            spinner.succeed();
            return { jobId, jobStatus };
        }
        const executionResult = await get({ endpoint, rejectUnauthorized, path: `exec/results/${jobId}` });
        if (executionResult.error) {
            spinner.fail();
            return { jobStatus, error: executionResult.error, jobId };
        }
        spinner.succeed();
        jobResult = executionResult.result.data;
    }
    return { jobId, jobStatus, jobResult };
};

module.exports = {
    waitForBuild
};
