import assert from 'assert';
import {
  expandDomainOfDifferentiableScalarField, 
  sumDifferentiableScalarFields
} from '../compose-differentiable-scalar-fields.js';
import { constrainOptimizationProblem } from '../constrain-optimization-problem.js';
import { makeSoftConstraintField } from '../scalar-fields/soft-constraint-field.js';

const plus = (x,y) => x+y;

function makeGrid(options) {
  let gridEls = options.children;
  assert(gridEls instanceof Array);
  assert(gridEls.length > 0);
  let numRows = gridEls.length;
  let numCols = gridEls[0].length;
  assert(gridEls.every(row => row.length === numCols));

  let unconstrainedDomainRep = {
    children: gridEls.map(row => row.map(el => el.layoutProblem.objectiveFunction.domainRepresentative)),
    rowHeights: gridEls.map(() => 0),
    colWidths: gridEls[0].map(() => 0),
    height: 0,
    width: 0
  };

  let rowHeightsConstraintField = makeSoftConstraintField(
    unconstrainedDomainRep,
    [[1,['width']]].concat(gridEls[0].map((e,i) => [-1,['colWidths',i]])));

  let colWidthsConstraintField = makeSoftConstraintField(
    unconstrainedDomainRep,
    [[1,['height']]].concat(gridEls.map((e,i) => [-1,['rowHeights',i]])));

  let unconstrainedScalarField = sumDifferentiableScalarFields(
    rowHeightsConstraintField,
    colWidthsConstraintField,
    ...Array.prototype.concat.apply([], gridEls.map(
      (row, i) =>
        row.map(
          (el, j) => expandDomainOfDifferentiableScalarField(
            el.layoutProblem.objectiveFunction,
            unconstrainedDomainRep,
            ['children',i,j])))));

  let unconstrainedOptimizationProblem = {
    objectiveFunction: unconstrainedScalarField,
    initialGuessFunction(c) {
      let childrenGuesses = gridEls.map(
        (row,i) => row.map(
          (e,j) => e.layoutProblem.initialGuessFunction(c.children[i][j])));
      let rowHeightGuesses = childrenGuesses.map(
        (row,i) => c.rowHeights[i] || row.map(el => el.height).reduce(plus, 0) / numRows);
      let colWidthGuesses = gridEls[0].map(
        (_,j) => c.colWidths[j] || childrenGuesses.map(row => row[j].width).reduce(plus, 0) / numCols);
      let heightGuess = c.height || rowHeightGuesses.reduce(plus, 0);
      let widthGuess = c.width || colWidthGuesses.reduce(plus, 0);
      return {
        children: childrenGuesses,
        rowHeights: rowHeightGuesses,
        colWidths: colWidthGuesses,
        height: heightGuess,
        width: widthGuess
      };
    }
  };

  let layoutProblem = constrainOptimizationProblem(
    unconstrainedOptimizationProblem,
    gridEls.map(
      (row,i) => [['rowHeights', i]].concat(
        row.map((e,j) => ['children', i, j, 'height'])))
      .concat(
        gridEls[0].map(
          (_,j) => [['colWidths', j]].concat(
            gridEls.map((_,i) => ['children', i, j, 'width'])))));

  function render(sln) {
    sln = layoutProblem.unconstrainPONuNJO(sln);

    let rowHeights = sln.rowHeights;
    let colWidths = sln.colWidths;
    let rowPositions = [];
    let colPositions = [];

    let pos = 0;
    for (let i = 0; i < rowHeights.length; i++) {
      rowPositions.push(pos);
      pos += rowHeights[i];
    }

    pos = 0;
    for (let j = 0; j < colWidths.length; j++) {
      colPositions.push(pos);
      pos += colWidths[j];
    }

    return gridEls.map(
      (row,i) =>
        row.map((el,j) => {
          return {
            translate: {
              what: el.render(sln.children[i][j]),
              by: { y: rowPositions[i], x: colPositions[j] }
            }
          }
        }));
  };

  return {
    layoutProblem,
    render
  };
}

export { makeGrid }
