module.exports = {
    command: 'add <name>',
    description: 'Adds an algorithm',
    options:{
        
    },
    builder:  {
        'image': {
            demandOption: true,
            describe: 'the docker image for the algorithm',
            type: 'string'
        }
    },
    handler: (argv)=> {
        console.log(`Add command called with ${JSON.stringify(argv)}`);
     }
}
