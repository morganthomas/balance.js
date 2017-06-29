import { makeNonNegativeConstraintField } from '../../../src/scalar-fields/non-negative-constraint-field.js';
import { expect } from 'chai';

describe('makeNonNegativeConstraintField', () => {
  it('works', () => {
    let field = makeNonNegativeConstraintField(
      { height: 0, width: 0 },
      ['height'],
      10);
    expect(field.valueAt({ height: 10, width: 7 })).to.equal(0);
    expect(field.valueAt({ height: -10, width: 7 })).to.equal(1000);
    expect(field.valueAt({ height: 0, width: 7 })).to.equal(0);
    expect(field.gradientAt({ height: 10, width: 7 })).to.eql({ height: 0, width: 0 });
    expect(field.gradientAt({ height: -10, width: 7 })).to.eql({ height: -200, width: 0 });
    expect(field.gradientAt({ height: 0, width: 7 })).to.eql({ height: 0, width: 0 });
  });
});
