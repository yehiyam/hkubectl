const commands = require('./algorithm_cmds/index.js');
const algorithm = {
    command: 'algorithm <command>',
    description: 'Manage loaded algorithms',
    builder:  (yargs)=> {
        Object.values(commands).forEach((cmd)=>{
            yargs.command(cmd)
        });
        return yargs;
    },
    handler: ()=>{}
}

module.exports={
    algorithm
}