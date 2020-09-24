const algorithm = (args) => `
from typing import Dict
from hkube_python_wrapper import HKubeApi

def start(args: Dict, hkubeApi: HKubeApi):
  # example ${args.name} algorithm
  # input is an array of algorithm input
  input=args.get('input')
  print(input)
  return 10
`;

module.exports = {
    algorithm
};
