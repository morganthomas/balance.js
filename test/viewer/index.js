import Vue from 'vue';
import line from './cases/line.js';
import line2 from './cases/line2.js';
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
      let solution = solveOptimizationProblem(problem);
      let graphics = theCase.render(solution);
      drawToCanvas(this.$refs.canvas, graphics);
    },

    setCase(caseName) {
      this.selectedCaseName = caseName;
      this.drawCase();
    }
  }
});
