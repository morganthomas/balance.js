import { expect } from 'chai';
import {
  expandDomainOfDifferentiableScalarField,
  composeDifferentiableScalarFields,
  sumDifferentiableScalarFields
} from '../src/compose-differentiable-scalar-fields.js'

let littleField1 = {
  domainRepresentative: { x: 0, y: 0 },
  valueAt: (a) => a.x + a.y,
  gradientAt: (a) => ({ x: 1, y: 1 })
};

let littleField2 = {
  domainRepresentative: { x: 0, y: 0 },
  valueAt: (a) => a.x * a.y,
  gradientAt: (a) => ({ x: a.y, y: a.x })
};

let littleField3 = {
  domainRepresentative: { x: 0, y: 0 },
  valueAt: (a) => 3 * a.x,
  gradientAt: (a) => ({ x: 3, y: 0 })
};

describe('expandDomainOfDifferentiableScalarField', function() {
  it('works on a typical case', function() {

    let bigField = expandDomainOfDifferentiableScalarField(littleField1, [0, { x: 0, y: 0 }], [1]);

    expect(bigField.domainRepresentative).to.eql([0, { x : 0, y: 0 }]);
    expect(bigField.valueAt([4, { x: 13, y: -7 }])).to.equal(6);
    expect(bigField.gradientAt([4, { x: 13, y: -7 }])).to.eql([0, { x: 1, y: 1 }]);
  });
});

describe('composeDifferentiableScalarFields', function() {
  it('works on a typical case', function() {
    // (x,y) -> x + y + (x * y) + 1.5x + 2y
    let field = composeDifferentiableScalarFields({
      domainRepresentative: { x: 0, y: 0 },
      subfields: [littleField1, littleField2, littleField3],
      valueAt: (a, vs) => vs[0] + vs[1] + 0.5 * vs[2] + 2 * a.y,
      gradientAt: (a, vs, gs) => ({ 
        x: gs[0].x + gs[1].x + 0.5 * gs[2].x,
        y: gs[0].y + gs[1].y + 0.5 * gs[2].y + 2
      })
    });

    expect(field.valueAt({ x: 7, y: 3 })).to.equal(47.5);
    expect(field.gradientAt({ x: 7, y: 3 })).to.eql({ x: 5.5, y: 10 });
  });
});

describe('sumDifferentiableScalarFields', function() {
  it('works on a typical case', function() {
    // (x,y) -> x + y + (x * y) + 3x
    let field = sumDifferentiableScalarFields(littleField1, littleField2, littleField3);

    expect(field.valueAt({ x: 5, y: 2 })).to.equal(32);
    expect(field.gradientAt({ x: 5, y: 2 })).to.eql({ x: 6, y: 6 });
  });
});
