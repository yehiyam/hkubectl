const algorithm = (args) => `
const start = (args, hkubeApi) => {
  // example ${args.name} algorithm
  // input is an array of algorithm input
  const { input } = args;
  console.log(\`input:\n\${JSON.stringify(input, null, 2)}\`);
  return 10;
}

module.exports = {
  start
}
`;

module.exports = {
    algorithm
};
