const algorithm = (args) => `
def start(args, hkubeApi):
  # example ${args.name} algorithm
  # input is an array of algorithm input
  input=args.get('input')
  print('input: {input}'.format(input=input))
  return 'Hello from Python algorithm ${args.name}!'
`;

module.exports = algorithm;
