import Viz from './viz'

const stringThickness = 32
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
const greeting = () => {
  const frameEl = document.querySelector('.carousel')
  const frameDuration = 2000
  const frames = [
    'I\'m Joe.',
    'I make things on the Internet.',
    'I do other stuff too.',
    'But this is what I did to this site.',
    'It\'s randomly generating braids.',
    'Neat, huh?',
    'Learn more at the links below.',
    'Refresh the page for new colors.',
    'Have a nice day.',
  ]
  frames.forEach((frameMsg, i) => {
    console.log(`preparing frame ${i}`)
    setTimeout(() => {
      console.log(`executing frame ${i}`)

      frameEl.textContent = frameMsg

    }, frameDuration * i + frameDuration)
  })
  setTimeout(() => {
    document.querySelector('.static').textContent = 'Thanks for visiting.'
  }, frameDuration * frames.length)
}

window.addEventListener('load', greeting)
window.addEventListener('load', viz.render)
window.addEventListener('resize', viz.render)
