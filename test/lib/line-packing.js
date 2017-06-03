import { BLACK } from './colors.js';
import { makeTestBox } from './test-box.js';
import { makeSoftConstraintField } from '../../src/scalar-fields/soft-constraint-field.js';

const rigidBox100 = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  optimalLength: 100,
  isRigid: true,
  isBreakpoint: false
};

const elasticConstraintField1 =
  makeSoftConstraintField(
    { height: 0, width: 0 }, 
    [[1,['width']]],
    1);

const elasticConstraintField2 =
  makeSoftConstraintField(
    { height: 0, width: 0 },
    [[1,['width']]],
    10);

const elasticConstraintField3 =
  makeSoftConstraintField(
    { height: 0, width: 0 },
    [[1,['width']]],
    100);

const testBoxes = {
  rigidBox100,

  rigidBox200: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    optimalLength: 200,
    isRigid: true,
    isBreakpoint: false
  },

  nonBreakingFillBox: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: false
  },

  breakingFillBox: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true
  },

  breakingFillBoxWithPre: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    preBreakBox: rigidBox100
  },

  breakingFillBoxWithPost: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    postBreakBox: rigidBox100
  },

  breakingFillBoxWithPreAndPost: {
    velement: makeTestBox(BLACK),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    preBreakBox: rigidBox100,
    postBreakBox: rigidBox100
  },

  nonBreakingElasticBox1: {
    velement: makeTestBox(BLACK, elasticConstraintField1),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: false
  },

  breakingElasticBox1: {
    velement: makeTestBox(BLACK, elasticConstraintField1),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true
  },

  breakingElasticBox1WithPreAndPost: {
    velement: makeTestBox(BLACK, elasticConstraintField1),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    preBreakBox: rigidBox100,
    postBreakBox: rigidBox100
  },

  nonBreakingElasticBox2: {
    velement: makeTestBox(BLACK, elasticConstraintField2),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: false
  },

  breakingElasticBox2WithPre: {
    velement: makeTestBox(BLACK, elasticConstraintField2),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    preBreakBox: rigidBox100
  },

  breakingElasticBox2WithPost: {
    velement: makeTestBox(BLACK, elasticConstraintField2),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true,
    postBreakBox: rigidBox100
  },

  breakingElasticConstraintBox3: {
    velement: makeTestBox(BLACK, elasticConstraintField3),
    lengthParameter: ['width'],
    isRigid: false,
    isBreakpoint: true
  }
};

export { testBoxes }
