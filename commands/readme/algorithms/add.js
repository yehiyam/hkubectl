const prettyjson = require("prettyjson");
const fse = require("fs-extra");
var FormData = require('form-data');
const { post, postFile } = require("../../helpers/request-helper");

const handleAdd = async ({ endpoint, rejectUnauthorized, name, readmeFile }) => {
  const path = `readme/algorithms/${name}`;
  let stream = fse.createReadStream(readmeFile);
  const formData = new FormData();
  formData.append('README.md', {
    value: stream,
    options: {
      filename: "README.md"
    }
  })
  const result = await postFile({
    endpoint,
    rejectUnauthorized,
    formData,
    path
  });
};

module.exports = {
  command: "add <name>",
  description: "Adds an algorithm",
  options: {},
  builder: {
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
