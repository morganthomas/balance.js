import { expect } from 'chai';
import {
  expandDomainOfDifferentiableScalarField,
  composeDifferentiableScalarFields,
  sumDifferentiableScalarFields
} from '../src/compose-differentiable-scalar-fields.js'

describe('expandDomainOfDifferentiableScalarField', function() {
  it('works on a typical case', function() {
    let littleField = {
      domainRepresentative: { x: 0, y: 0 },
      valueAt: (a) => a.x + a.y,
      gradientAt: (a) => ({ x: 1, y: 1 })
    };

    let bigField = expandDomainOfDifferentiableScalarField(littleField, [0, { x: 0, y: 0 }], [1]);

    expect(bigField.domainRepresentative).to.eql([0, { x : 0, y: 0 }]);
    expect(bigField.valueAt([4, { x: 13, y: -7 }])).to.equal(6);
    expect(bigField.gradientAt([4, { x: 13, y: -7 }])).to.eql([0, { x: 1, y: 1 }]);
  });
});

describe('composeDifferentiableScalarFields', function() {

});

describe('sumDifferentiableScalarFields', function() {
  
});
