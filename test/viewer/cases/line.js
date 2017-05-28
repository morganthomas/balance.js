export default {
  layoutProblem: {
    objectiveFunction: {
      domainRepresentative: { x: 0 },
      valueAt: () => 0,
      gradientAt: () => { x: 0 }
    },
    initialGuessFunction: (c) => ({ x: c.x || 0 })
  },
  render: () => (
    { stroke: { 
      start: { x: 0, y: 0 },
      motions: [{ lineTo: { x: 100, y: 100 } }],
      color: { r: 0, g: 1, b: 0 },
      width: 2,
      lineCap: 'butt'
    } } )
};
