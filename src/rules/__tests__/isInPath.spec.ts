import { isInPath } from "../isInPath";

describe('isInPath', () => {
  it('works', () => {
    isInPath({}, '$.components.schemas..[?(@property !== \'properties\' && @.example && (@.type || @.format || @.$ref))]');
    isInPath({}, '$..parameters[*]');
  });
});
