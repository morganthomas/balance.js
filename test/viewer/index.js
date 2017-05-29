import Vue from 'vue';
import lineFixedSize from './cases/line-fixed-size.js';
import lineVariableSize from './cases/line-variable-size.js';
import testBox from './cases/test-box.js';
import hbox from './cases/hbox.js';
import paddingBox from './cases/padding-box.js';
import { drawToCanvas } from '../../src/graphics.js';
import { renderBoxVElement } from '../../src/velement.js';

const cases = {
  lineFixedSize,
  lineVariableSize,
  testBox,
  paddingBox,
  hbox
};

const app = new Vue({
  el: '#app',
  data: {
    cases,
    selectedCaseName: 'lineFixedSize',
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
