import { makeTestBox } from '../make-test-box.js';

export default makeTestBox(
  {
    domainRepresentative: { width: 0, height: 0 },
    valueAt: () => 0.0,
    gradientAt: () => ({ width: 0, height: 0 })
  }, 
  { r: 0, g: 0, b: 0 });
