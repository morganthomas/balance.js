export default {
  layoutProblem: {
    objectiveFunction: {
      domainRepresentative: { width: 0, height: 0 },
      valueAt: () => 0,
      gradientAt: () => ({ width: 0, height: 0 })
    },
    initialGuessFunction: (c) => ({ width: c.width || 0, height: c.height || 0 })
  },
  render: (sln) => (
    { stroke: { 
      start: { x: 0, y: 0 },
      motions: [{ lineTo: { x: sln.width, y: sln.height } }],
      color: { r: 0, g: 1, b: 0 },
      width: 2,
      lineCap: 'butt'
    } } )
};
