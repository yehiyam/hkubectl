const prettyjson = require("prettyjson");
const fse = require("fs-extra");
const { post, postFile } = require("../../helpers/request-helper");

const handleAdd = async ({ endpoint, rejectUnauthorized, name, image, cpu, mem, workerEnv, algorithmEnv, readmeFile }) => {
  const path = "store/algorithms";
  const body = {
    name,
    algorithmImage: image,
    cpu,
    mem,
    workerEnv,
    algorithmEnv
  };
  if (readmeFile) {
    const res = await post({
      endpoint,
      rejectUnauthorized,
      body,
      path
    });
    await readmeAdd(readmeFile, endpoint, rejectUnauthorized, name);

    return res;
  }
  else {
    return post({
      endpoint,
      rejectUnauthorized,
      body,
      path
    });
  }
};

const readmeAdd = async (readmeFile, endpoint, rejectUnauthorized, name) => {
  const path = `readme/algorithms/${name}`;
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
  command: "add <name>",
  description: "Adds an algorithm",
  options: {},
  builder: {
    image: {
      demandOption: true,
      describe: "the docker image for the algorithm",
      type: "string"
    },
    cpu: {
      demandOption: true,
      describe: "CPU requirements of the algorithm in cores",
      type: "number"
    },
    mem: {
      demandOption: false,
      describe:
        "memory requirements of the algorithm. Possibel units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
      type: "string"
    },
    workerEnv: {
      describe:
        "key-value of environment variables for the worker containers. You can specify more than one. example: --workerEnv.foo=bar --workerEnv.baz=bar",
      type: "object"
    },
    algorithmEnv: {
      describe:
        "key-value of environment variables for the algorithm containers. You can specify more than one. example: --algorithmEnv.foo=bar --algorithmEnv.baz=bar",
      type: "object"
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
