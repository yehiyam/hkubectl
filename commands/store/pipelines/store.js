const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const yaml = require('js-yaml');
var FormData = require('form-data');
const { post, postFile } = require('../../../helpers/request-helper');
const path = 'store/pipelines';

const handleAdd = async ({ endpoint, rejectUnauthorized, file, readmeFile }) => {
  const result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
  const body = {
    ...result
  }
  const res = await post({
    endpoint,
    rejectUnauthorized,
    body,
    path
  });
  if (readmeFile) {
    await readmeAdd(readmeFile, endpoint, rejectUnauthorized, result.name);
  }
  return res;
};

const readmeAdd = async (readmeFile, endpoint, rejectUnauthorized, name) => {
  const path = `readme/pipelines/${name}`;
  let stream = fse.createReadStream(readmeFile);
  const formData = new FormData();
  formData.append('README.md', {
    value: stream,
    options: {
      filename: "README.md"
    }
  })
  await postFile({
    endpoint,
    rejectUnauthorized,
    formData,
    path
  });
};

module.exports = {
  command: "store",
  description: "Store pipeline",
  options: {},
  builder: {
    file: {
      demandOption: true,
      describe: 'path for descriptor file',
      type: 'string',
      alias: ['f']
    },
    readmeFile: {
      describe: 'path for readme file. example: --readmeFile="./readme.md',
      type: "string"
    }
  },
  handler: async argv => {
    const ret = await handleAdd(argv);
    console.log(prettyjson.render(ret));
  }
};
