import { expect } from 'chai';
import { makeConstantScalarField } from '../../src/differentiable-scalar-field.js';

describe('makeConstantScalarField', () => {
  it('works on a simple case', () => {
    let f = makeConstantScalarField({ x: 0 }, 5);
    expect(f.domainRepresentative).to.eql({ x: 0 });
    expect(f.valueAt({ x: 0 })).to.equal(5);
    expect(f.valueAt({ x: -149 })).to.equal(5);
    expect(f.gradientAt({ x: 0 })).to.eql({ x: 0 });
    expect(f.gradientAt({ x: -149 })).to.eql({ x: 0 });
  });
});
