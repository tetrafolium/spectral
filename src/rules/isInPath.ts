const { JSONPath } = require('jsonpath-plus');

const shouldBailOut = (path: string[]) => {
  if (path.indexOf('..') !== path.lastIndexOf('..')) {
    return true;
  }


  return false;
}

export const isInPath = (obj: object, path: string) => {
  shouldBailOut;
  console.log(JSONPath.toPathArray(path));

  switch (path) {
    case '*':
      // yes, child, easy peasy.
      break;
    case '~':
      // what now?
      break;
    case '..':

  }
}

