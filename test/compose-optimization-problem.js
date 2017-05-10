import { expect } from 'chai';
import { F, partialDerivative } from '../src/compose-optimization-problem.js';

describe('F', function() {
  it('constant works', function() {
    expect(F.constant(1)).to.eql(['constant', 1]);
  });
  it('path works', function() {
    expect(F.path(['x',0])).to.eql(['path', ['x',0]]);
  });
  it('sum works', function() {
    expect(F.sum(F.path(['x']), F.constant(1))).to.eql(['sum', [F.path(['x']), F.constant(1)]]);
  });
  it('difference works', function() {
    expect(F.difference(F.path(['x']), F.constant(1))).to.eql(['difference', [F.path(['x']), F.constant(1)]]);
  });
  it('product works', function() {
    expect(F.product(F.path(['x']), F.constant(1))).to.eql(['product', F.path(['x']), F.constant(1)]);
  });
  it('quotient works', function() {
    expect(F.quotient(F.path(['x']), F.constant(1))).to.eql(['quotient', F.path(['x']), F.constant(1)]);
  });
  it('monomial works', function() {
    expect(F.monomial(F.path(['x']), 2)).to.eql(['monomial', [F.path(['x']), 2]]);
  });
  it('power works', function() {
    expect(F.power(F.path(['x']), F.constant(2))).to.eql(['power', F.path(['x']), F.constant(2)]);
  });
  it('logarithm works', function() {
    expect(F.logarithm(F.constant(2), F.path(['x']))).to.eql(['logarithm', F.constant(2), F.path(['x'])]);
  });
  it('sqrt works', function() {
    expect(F.sqrt(F.path(['x']))).to.eql(['sqrt', F.path(['x'])]);
  });
});

describe('partialDerivative', function() {
  it('works on constants', function() {
    expect(partialDerivative(F.constant(3))).to.eql(F.constant(0));
  });
});

describe('composeOptimizationProblem', function() {

});
