import { makeSoftConstraintField } from '../../../src/scalar-fields/soft-constraint-field.js';
import { expect } from 'chai';

describe('makeSoftConstraintField', () => {
  it('works with a base constant', () => {
    let field = makeSoftConstraintField(
      [{ height: 0, width: 0 }, { height: 0, width: 0 }],
      [[1,[0,'width'],0],[1,[1,'width'],0]],
      undefined,
      -7);
    expect(field.valueAt([{ height: 0, width: 3.5 }, { height: 0, width: 3.5 }])).to.equal(0);
  });
});
