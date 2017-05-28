import Vue from 'vue';
import line from './cases/line.js';

const cases = {
  line,
  line2: line
};

const app = new Vue({
  el: '#app',
  data: {
    cases,
    selectedCaseName: 'line'
  }
});
