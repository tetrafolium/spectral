import { Rule } from '../rule';
import { traverse } from '../traverse';

describe('traverse', () => {
  it('$.info[?(@.title)', () => {
    const run = jest.fn();
    const obj = {
      info: {
        description: '',
        title: { a: 'd' },
      },
    };

    traverse(obj, [new Rule('$.info[?(@.title)]', run)]);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(['$', 'info'], obj.info);
  });

  it('$.info.title', () => {
    const run = jest.fn();
    const obj = {
      info: {
        description: '',
        title: { a: 'd' },
      },
    };

    traverse(obj, [new Rule('$.info.title', run)]);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(['$', 'info', 'title'], obj.info.title);
  });

  it('$.info.foo.title', () => {
    const run = jest.fn();
    const obj = {
      info: {
        description: '',
        title: { a: 'd' },
      },
      x: {
        foo: {
          title: 'a',
        },
      },
    };

    traverse(obj, [new Rule('$.info.foo.title', run)]);
    expect(run).not.toHaveBeenCalled();
  });
});
