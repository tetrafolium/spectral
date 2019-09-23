import { JsonPath } from '@stoplight/types/dist';
import { IRunRule } from '../types';
import { shouldBailOut } from './utils';

const { JSONPath } = require('jsonpath-plus');

export class Rule implements IRunRule {
  public readonly name: string;
  // public

  private readonly query: JsonPath;
  private _bailedOut = false;
  public finished = false;

  constructor(private _rule: IRunRule) {
    this.query = JSONPath.toPathArray(_rule.given);
    this._bailedOut = shouldBailOut(this.query);
  }

  private _end() {
    this.finished = true;
    this.query.length = 0;
  }

  // this is spaghetti, just trying things out
  private _tryReducing(value: unknown) {
    this.query.shift();

    while (this.query.length > 0) {
      const segment = String(this.query[0]);
      if (segment.length === 0) {
        // very unlikely to be ever empty, but you never know
        this.query.shift();
        continue;
      }

      if (segment[0] === '?') {
        const result = Function('__curObj', `return (${segment.slice(1).replace('@', '__curObj')})`)(value);
        if (result) {
          this.query.shift();
        } else {
          this._end();
        }
      } else {
        return false;
      }
    }

    return true;
  }

  public tick(path: JsonPath, key: string, value: unknown) {
    if (this._bailedOut) {
      // this.run();
      // regular jsonpath-based query
      this.finished = true;
      return;
    }

    if (this.query[0] === key) {
      // todo: next tick should fail if no match, ya know, perhaps store level on tick
      const shouldCall = this._tryReducing(value);

      if (shouldCall) {
        this._run(path.slice(), value);
      }
    }
  }
}

export const isInPath = (obj: object, path: string) => {
  switch (path) {
    case '*':
      // yes, child, easy peasy.
      break;
    case '~':
    case '^':
      // what now?
      break;
    case '..':
  }
};
