import { expect } from 'chai';
import {
  composeDifferentiableScalarFields,
  translateDifferentiableScalarField,
  sumDifferentiableScalarFields
} from '../../src/compose-differentiable-scalar-fields.js'

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

describe('composeDifferentiableScalarFields', function() {
  let id = x => x;
  it('works on a typical case', function() {
    // (x,y) -> x + y + (x * y) + 1.5x + 2y
    let field = composeDifferentiableScalarFields({
      domainRepresentative: { x: 0, y: 0 },
      subfields: [littleField1, littleField2, littleField3],
      inputMappings: [id, id, id],
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

describe('translateDifferentiableScalarField', function() {
  it('works on some typical cases', function() {
    let field = translateDifferentiableScalarField(littleField1, { x: -3, y: 5 });
    expect(field.valueAt({ x: 0, y: 0 })).to.equal(2);
    expect(field.gradientAt({ x: 0, y: 0 })).to.eql({ x: 1, y: 1});
    expect(field.valueAt({ x: 10, y: -4 })).to.equal(8);
    expect(field.gradientAt({ x: 10, y: -4 })).to.eql({ x: 1, y: 1 });

    field = translateDifferentiableScalarField(littleField2, { x: -3, y: 5 });
    expect(field.valueAt({ x: 0, y: 0 })).to.equal(-15);
    expect(field.gradientAt({ x: 0, y: 0 })).to.eql({ x: 5, y: -3 });
    expect(field.valueAt({ x: 3, y: 3 })).to.equal(0);
    expect(field.gradientAt({ x: 3, y: 3 })).to.eql({ x: 8, y: 0 });
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
