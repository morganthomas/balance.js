import { expect } from 'chai';
import { F } from '../src/compose-optimization-problem.js';

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
});

describe('composeOptimizationProblem', function() {

});
