#!/usr/bin/env node
const program = require('commander');
program
    .version('1.1.0')
    .command('add-algorithm <name>','Add an algorithm to hkube')
    .option('--image <imageName>', 'The docker image name for the algorithm')
    .action((name, options)=>{
        console.log(`add-algorithm ${name} using ${options}`);
      });
program.parse(process.argv);

