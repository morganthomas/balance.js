import Vue from 'vue';
import line from './cases/line.js';
import line2 from './cases/line2.js';
import { mapScalars } from '../../src/pojo.js';
import { solveOptimizationProblem } from '../../src/optimization-problem.js';
import { drawToCanvas } from '../../src/graphics.js';

const cases = {
  line,
  line2
};

const app = new Vue({
  el: '#app',
  data: {
    cases,
    selectedCaseName: 'line'
  },

  mounted() {
    this.drawCase();
  },

  methods: {
    drawCase() {
      let theCase = this.cases[this.selectedCaseName];
      let problem = theCase.layoutProblem;
      let constraints = mapScalars(() => null, problem.objectiveFunction.domainRepresentative);
      constraints.width = this.$refs.canvas.width;
      constraints.height = this.$refs.canvas.height;
      let solution = solveOptimizationProblem(problem, constraints);
      let graphics = theCase.render(solution);
      drawToCanvas(this.$refs.canvas, graphics);
    },

    setCase(caseName) {
      this.selectedCaseName = caseName;
      this.drawCase();
    }
  }
});
