const algorithm = (args) => `
const start = async (args, hkubeApi) => {
  // example ${args.name} algorithm
  // input is an array of algorithm input
  const { input } = args;
  console.log(\`input: \${JSON.stringify(input)}\`);
  return 'Hello from Node.js algorithm ${args.name}!';
}

module.exports = {
  start
}
`;

module.exports = algorithm;
