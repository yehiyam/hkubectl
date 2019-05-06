const prettyjson = require("prettyjson");
const fse = require("fs-extra");
const { post, postFile } = require("../../helpers/request-helper");

const handleAdd = async ({
  endpoint,
  rejectUnauthorized,
  descriptor,
  readmeFile,
  name
 
}) => {
  const path = "api/v1/store/pipelines";
  const  buffer = fse.readFileSync(descriptor).toString()
  const body = {
     ...JSON.parse(buffer)
}
  if (readmeFile) {
    const res = await post({
      endpoint,
      rejectUnauthorized,
      body,
      path
    });
   const readmeRes =  await readmeAdd(readmeFile, endpoint, rejectUnauthorized, name);

    return {...res,...readmeRes};
  } else {
    return post({
      endpoint,
      rejectUnauthorized,
      body,
      path
    });
  }
};

const readmeAdd = async (readmeFile, endpoint, rejectUnauthorized, name) => {
  const path = `api/v1/readme/pipelines/${name}`;
  let stream = fse.createReadStream(readmeFile);
  const formData = {
    "README.md": {
      value: stream,
      options: {
        filename: "README.md"
      }
    }
  };
  const result = await postFile({
    endpoint,
    rejectUnauthorized,
    formData,
    path
  });
};

module.exports = {
  command: "store <name>",
  description: "Store pipeline",
  options: {},
  builder: {
    descriptor: {
      demandOption: true,
      describe: `path for descriptor json file.  example: --descriptor="./readme.md"`,
      type: "string"
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
