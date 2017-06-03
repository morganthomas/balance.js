const rigidBox100 = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  optimalLength: 100,
  isRigid: true,
  isBreakpoint: false
};

const rigidBox200 = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  optimalLength: 200,
  isRigid: true,
  isBreakpoint: false
};

const nonBreakingFillBox = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: false
};

const breakingFillBox = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true
};

const breakingFillBoxWithPre = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  preBreakBox: rigidBox100
};

const breakingFillBoxWithPost = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  postBreakBox: rigidBox100
};

const breakingFillBoxWithPreAndPost = {
  velement: makeTestBox(BLACK),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  preBreakBox: rigidBox100,
  postBreakBox: rigidBox100
};

const elasticConstraintField1 =
      makeSoftConstraintField(
        { height: 0, width: 0 }, 
        [[1,['width']]],
        1);

const nonBreakingElasticBox1 = {
  velement: makeTestBox(BLACK, elasticConstraintField1),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: false
};

const breakingElasticBox1 = {
  velement: makeTestBox(BLACK, elasticConstraintField1),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true
};

const breakingElasticBox1WithPreAndPost = {
  velement: makeTestBox(BLACK, elasticConstraintField1),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  preBreakBox: rigidBox100,
  postBreakBox: rigidBox100
};

const elasticConstraintField2 =
      makeSoftConstraintField(
        { height: 0, width: 0 },
        [[1,['width']]],
        10);

const nonBreakingElasticBox2 = {
  velement: makeTestBox(BLACK, elasticConstraintField2),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: false
};

const breakingElasticBox2WithPre = {
  velement: makeTestBox(BLACK, elasticConstraintField2),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  preBreakBox: rigidBox100
};

const breakingElasticBox2WithPost = {
  velement: makeTestBox(BLACK, elasticConstraintField2),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true,
  postBreakBox: rigidBox100
};

const elasticConstraintField3 =
      makeSoftConstraintField(
        { height: 0, width: 0 },
        [[1,['width']]],
        100);

const breakingElasticConstraintBox3 = {
  velement: makeTestBox(BLACK, elasticConstraintField3),
  lengthParameter: ['width'],
  isRigid: false,
  isBreakpoint: true
};
