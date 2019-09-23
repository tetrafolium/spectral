import { JsonPath } from '@stoplight/types/dist';
import { Rule } from './rule';

function _traverse(curObj: object, rules: Rule[], path: JsonPath) {
  for (const key in curObj) {
    if (!Object.hasOwnProperty.call(curObj, key)) continue;

    const value = curObj[key];
    const length = path.push(key);
    for (const rule of rules) {
      rule.tick(path, key, value);
    }

    if (typeof value === 'object' && value !== null) {
      _traverse(value, rules, path);
    }

    path.length = length;
  }
}

export function traverse(obj: object, rules: Rule[]) {
  _traverse({ $: obj }, rules, []);
}
