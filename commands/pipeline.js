const commands = require('./pipeline_cmds/index.js');
const pipeline = {
    command: 'pipeline <command>',
    description: 'Manage loaded algorithms',
    builder:  (yargs)=> {
        Object.values(commands).forEach((cmd)=>{
            yargs.command(cmd)
        });
        yargs.options('endpoint', {
            description: 'url of hkube api endpoint',
            type: "string",
            default: 'https://10.32.10.11/hkube/api-server/'
          })
          .options('rejectUnauthorized', {
            description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
            type: "boolean",
            default: "true"
          }).strict()
        return yargs;
    },
    handler: ()=>{}
}

module.exports={
    pipeline
}