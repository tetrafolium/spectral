import { JsonPath } from '@stoplight/types/dist';

export const shouldBailOut = (path: JsonPath) => {
  if (path.length === 0 || path[0] !== '$') {
    return true;
  }

  const deepNestingIndex = path.indexOf('..');
  if (deepNestingIndex !== path.lastIndexOf('..')) {
    return true;
  }

  if (deepNestingIndex + 2 >= path.length) {
    return true;
  }

  if (path.includes('~') || path.includes('^')) {
    return true;
  }

  return false;
};
