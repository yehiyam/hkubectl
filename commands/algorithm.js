const commands = require('./algorithm_cmds/index.js');
const algorithm = {
    command: 'algorithm <command>',
    description: 'Manage loaded algorithms',
    builder:  (yargs)=> {
        Object.values(commands).forEach((cmd)=>{
            yargs.command(cmd)
        });
        yargs.options('endpoint', {
            description: 'url of hkube api endpoint',
            required: true,
            type: "string"
          })
          .options('rejectUnauthorized', {
            description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
            type: "boolean",
            default: "true"
          })
        return yargs;
    },
    handler: ()=>{}
}

module.exports={
    algorithm
}