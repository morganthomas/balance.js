import Vue from 'vue';
import line from './cases/line.js';
import line2 from './cases/line2.js';
import { mapScalars } from '../../src/pojo.js';
import { solveOptimizationProblem } from '../../src/optimization-problem.js';
import { drawToCanvas } from '../../src/graphics.js';
import { renderBoxVElement } from '../../src/velement.js';

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
      let canvas = this.$refs.canvas;
      let velement = this.cases[this.selectedCaseName];
      let graphics = renderBoxVElement(velement, canvas.width, canvas.height);
      drawToCanvas(canvas, graphics);
    },

    setCase(caseName) {
      this.selectedCaseName = caseName;
      this.drawCase();
    }
  }
});
