window.addEventListener('load', () => {
  console.log('And when Trout looked through them to see what was going on in the other universe, he saw a red-eyed, filthy old creature who was barefoot, who had his pants rolled up to his knees.')
  let raf = requestAnimationFrame
  let columns = +window.__cols
  let rows = +window.__rows

  const padding = 20
  const pixelGap = 5

  let video = document.querySelector('video')
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')
  let svg = document.querySelector('svg')

  let dotRefs = []
  let rowRefs = []
  let props

  let px = 0

  window.addEventListener('resize', getStage)

  function initialize () {
    raf(tick)
    for (var i = 0; i < rows; i++) {
      let row = []
      rowRefs.push(document.querySelector(`.row-${i}`))
      for (var j = 0; j < columns ; j++) {
        row.push(document.querySelector(`.dot-${i}-${j}`))
      }
      dotRefs.push(row)
    }
    getStage()
  }

  function tick () {
      let rowStart = randomBetween(0, pixelGap)
      ctx.drawImage(video, 0, 0, columns, rows)
      let {data} = ctx.getImageData(0, 0, columns, rows)
      for (var i = rowStart; i < rows; i += pixelGap) {
        for (var j = px; j < columns ; j += pixelGap) {
          let position = i * dotRefs[0].length + j
          let fill = `rgb(${data[position * 4]},${data[position * 4 + 1]},${data[position * 4 + 2]})`

          dotRefs[i][j].setAttribute('fill', fill)
        }
      }
      px === pixelGap ? px = 0 : px++
    raf(tick)
  }

  function getStage () {
    let height = window.innerHeight
    let width = window.innerWidth
    let step = (height - padding * 2) / rows
    let radius = step / 2 * 0.9
    let centerOffset = (width - columns * step) / 2

    svg.setAttribute('height', height)
    svg.setAttribute('width', width)

    for (var i = 0; i < rows; i++) {
      let row = rowRefs[i]
      row.setAttribute('transform', `scale(-1, 1) translate(-${width}, 0)`)
      for (var j = 0; j < columns ; j++) {
        let dot = dotRefs[i][j]
        dot.setAttribute('cx', j * step + radius + padding + centerOffset)
        dot.setAttribute('cy', i * step + radius + padding)
        dot.setAttribute('r', radius)
      }
    }
    props = { width, height, radius, step}
  }

  navigator.webkitGetUserMedia({ audio: false, video: true }, (mediaStream) => {
    video.src = window.URL.createObjectURL(mediaStream)
    initialize()
  }, (e) => console.log(e))
})

function randomBetween (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
