import Viz from './viz'

const stringThickness = 64
const stringSpacing = stringThickness * 1.75
const spacerGap = stringThickness / 4
const rowHeight = stringSpacing * 2 - stringThickness

const viz = new Viz({
  stringSpacing,
  stringThickness,
  spacerGap,
  rowHeight,
  bgColor: '#333',
  crossingProbability: 0.67,
  positiveProbability: 0.5,
  crossingAngle: 42 * Math.PI / 180,
  selector: '.visualization',
})

window.addEventListener('load', () => {
  setInterval(() => viz.render(), 120)
})
window.addEventListener('resize', viz.render)
