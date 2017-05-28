import Vue from 'vue';
import line from './cases/line.js';
import line2 from './cases/line2.js';
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
    selectedCaseName: 'line',
    canvasWidth: 500,
    canvasHeight: 500
  },

  mounted() {
    this.drawCase();
  },

  updated() {
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
    }
  }
});
