export default class Viz {
  constructor (config) {
    const displayCanvas = document.querySelector(config.selector)
    displayCanvas.height = window.innerHeight
    displayCanvas.width = window.innerWidth

    this.scrollDelta = 0
    this.scrollIndex = 1
    this.scrollPosition = 0
    this.currentScrollIndex = 0

    this.displayCanvas = displayCanvas
    this.displayWidth = displayCanvas.width
    this.displayHeight = displayCanvas.height
    this.context = displayCanvas.getContext('2d')

    this.rowHeight = config.rowHeight
    this.stringSpacing = config.stringSpacing
    this.stringThickness = config.stringThickness
    this.bgColor = config.bgColor
    this.crossingProbability = config.crossingProbability
    this.crossingAngle = config.crossingAngle
    this.spacerGap = config.spacerGap
    this.controlYFactor = (1 - this.stringSpacing / this.rowHeight * Math.tan(this.crossingAngle))
    this.margin = this.stringThickness + 1
    this.rows = {}
  }

  initialColors = (numStrings) => {
    const result = []
    if (!!window.location.search.match('monochrome')) {
      for (let i = 0; i < numStrings; i++) {
        result.push(i % 2 ? '#dcdcdc' : '#191919')
      }
      return result
    }
    for (let i = 0; i < numStrings; i++) {
      const r = 64 + Math.floor(Math.random() * 192)
      const g = 44 + Math.floor(Math.random() * 212)

      result.push(`rgb(${r},${g},192)`)
    }
    return result;
  }

  tick = () => {
    const { rows, context, drawRow, fillRow, columns, tick } = this
    context.clearRect(0, 0, this.displayWidth, this.displayHeight)

    this.scrollDelta -= 8
    this.scrollIndex = Math.floor(this.scrollDelta / this.rowHeight)
    this.scrollPosition = this.scrollDelta % this.rowHeight

    const sliced = []
    if (this.scrollIndex < 0 && typeof rows[this.scrollIndex - 1] === 'undefined') {
      for (let i = this.currentScrollIndex; i >= this.scrollIndex - 1; i--) {
        if (rows[i] === undefined) rows[i] = fillRow(rows[i + 1])
      }
    }
    const index = !this.scrollPosition ? this.scrollIndex - 1 : this.scrollIndex
    for (let i = index; i < this.scrollIndex + columns + 1; i++) {
      sliced.push(rows[i])
    }
    sliced.forEach(drawRow)
    this.currentScrollIndex = this.scrollIndex

    this.clock = requestAnimationFrame(tick)
  }

  initRows = () => {
    const { columns, initialColors, rows, fillRow } = this
    let i = columns
    rows[i] = initialColors(this.numStrings / 2).map((color, i) => {
      return {
        color,
        cross: i % 2,
        doCrossing: false,
      }
    })
    while (--i > -2) { rows[i] = fillRow(rows[i + 1]) }
  }

  fillRow = (strings) => {
    const { numStrings, crossingProbability, scrollIndex } = this
    const nextStrings = []

    let stringNumber = 0
    while (stringNumber < numStrings / 2) {
      const doCrossing = Math.random() < crossingProbability
      const colorA = stringNumber === numStrings / 2 - 1 ?
          strings[stringNumber].color :
          strings[stringNumber + 1].color
      const colorB = strings[stringNumber].color

      if (doCrossing) {
        nextStrings[stringNumber] = {
          cross: strings[stringNumber].cross,
          color: colorA,
          doCrossing,
        }
        nextStrings[stringNumber + 1] = {
          cross: stringNumber === numStrings / 2 - 1 ?
            strings[stringNumber].cross :
            strings[stringNumber + 1].cross,
          color: colorB,
          doCrossing,
        }
        stringNumber += 2
      }
      else {
        const string = {
          ...strings[stringNumber],
          doCrossing
        }
        nextStrings[stringNumber] = string
        stringNumber += 1
      }
    }
    return nextStrings.slice(0, numStrings / 2)
  }

  drawRow = (strings, i) => {
    const { margin, stringSpacing, drawString, drawCrossing, numStrings, rowHeight, scrollPosition, scrollIndex } = this
    if (strings === undefined) debugger
    const y = ((i - 1) * rowHeight) - scrollPosition
    let stringNumber = 0

    while (stringNumber < strings.length) {
      const x = margin + stringNumber * stringSpacing
      if (strings[stringNumber].doCrossing) {
        const positive = strings[stringNumber].cross
        const crossingConfig = {
          x,
          y,
          color0: stringNumber === numStrings / 2 - 1 ?
            strings[stringNumber].color :
            strings[stringNumber + 1].color,
          color1: strings[stringNumber].color,
          positive,
        }
        const partnerCrossingConfig = {
          x: margin + (numStrings - 2 - stringNumber) * stringSpacing,
          y,
          color0: strings[stringNumber].color,
          color1: stringNumber === numStrings / 2 - 1 ?
            strings[stringNumber].color :
            strings[stringNumber + 1].color,
          positive,
        }
        drawCrossing(crossingConfig)
        drawCrossing(partnerCrossingConfig)
        stringNumber += 2
      }
      else {
        const stringConfig = { x, y, color: strings[stringNumber].color }
        const partnerStringConfig = {
          x: margin + (numStrings - 1 - stringNumber) * stringSpacing,
          y,
          color: strings[stringNumber].color,
        }
        drawString(stringConfig)
        drawString(partnerStringConfig)
        stringNumber += 1
      }
      if (stringNumber === numStrings - 1) drawString({
        x: margin + stringNumber * stringSpacing,
        y,
        color: strings[stringNumber].color,
      })
    }
  }

  drawSpacer = (config) => {
    const { context, stringThickness, bgColor, spacerGap } = this
    const { beginX, beginY, cp0X, cp0Y, cp1X, cp1Y, endX, endY } = config

    context.strokeStyle = bgColor
    context.lineWidth = stringThickness + spacerGap * 2
    context.beginPath()
    context.moveTo(beginX, beginY)
    context.bezierCurveTo(cp0X, cp0Y, cp1X, cp1Y, endX, endY)
    context.stroke()
  }

  drawLine = (config) => {
    const { context, stringThickness } = this
    const { beginX, beginY, cp0X, cp0Y, cp1X, cp1Y, endX, endY, color} = config

    context.strokeStyle = color
    context.lineWidth = stringThickness
    context.beginPath()
    context.moveTo(beginX, beginY)
    context.bezierCurveTo(cp0X, cp0Y, cp1X, cp1Y, endX, endY)
    context.stroke()
  }

  drawRightCross = (left, right) => {
    this.drawLine(right)
    this.drawSpacer(left)
    this.drawLine(left)
  }
  drawLeftCross = (left, right) => {
    this.drawLine(left)
    this.drawSpacer(right)
    this.drawLine(right)
  }

  drawCrossing = (config) => {
    const { rowHeight, stringSpacing, controlYFactor, drawLeftCross, drawRightCross, context } = this
    const { x, y, color0, color1, positive } = config
    context.lineCap = "butt"

    const left = {
      beginX: x + stringSpacing,
      beginY: y,
      cp0X: x + stringSpacing,
      cp0Y: y + rowHeight * controlYFactor,
      cp1X: x,
      cp1Y: y + rowHeight * (1 - controlYFactor),
      endX: x,
      endY: y + 1 + rowHeight,
      color: color0,
    }

    const right = {
      beginX: x,
      beginY: y,
      cp0X: x,
      cp0Y: y + rowHeight * controlYFactor,
      cp1X: x + stringSpacing,
      cp1Y: y + rowHeight * (1 - controlYFactor),
      endX: x + stringSpacing,
      endY: y + rowHeight + 1,
      color: color1,
    }

    if (positive) drawLeftCross(left, right)
    else drawRightCross(left, right)
  }


  drawString = (config) => {
    const { context, stringThickness, rowHeight } = this
    const { x, y, color } = config

    context.strokeStyle = color
    context.lineWidth = stringThickness
    context.lineCap = "butt"
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, y + rowHeight + 1)
    context.stroke()
  }

  render = () => {
    const {
      displayCanvas,
      context,
      stringThickness,
      stringSpacing,
      initRows,
      rows,
      drawRow,
      rowHeight,
      tick,
    } = this

    if (this.clock) clearAnimationFrame(this.clock)

    displayCanvas.height = window.innerHeight
    displayCanvas.width = window.innerWidth

    this.displayWidth = this.displayCanvas.width
    this.displayHeight = this.displayCanvas.height

    this.columns = Math.floor(this.displayHeight / rowHeight) + 1

    context.clearRect(0, 0, this.displayWidth, this.displayHeight)

    const numStrings = (1 + Math.floor((this.displayWidth - stringThickness) / stringSpacing))

    this.numStrings = numStrings % 2 ? numStrings - 1 : numStrings
    initRows()

    const sliced = []
    for (let i = this.scrollIndex - 1; i < this.scrollIndex + this.columns; i++) {
      sliced.push(rows[i])
    }
    sliced.forEach(drawRow)
    this.clock = requestAnimationFrame(tick)
  }
}
