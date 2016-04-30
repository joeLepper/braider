const generatorsInLastRow = []

export default class Viz {
  constructor (config) {
    const displayCanvas = document.querySelector(config.selector)

    displayCanvas.height = window.innerHeight
    displayCanvas.width = window.innerWidth

    this.displayWidth = displayCanvas.width
    this.displayHeight = displayCanvas.height

    this.context = displayCanvas.getContext('2d')

    this.rowHeight = config.rowHeight
    this.stringSpacing = config.stringSpacing
    this.stringThickness = config.stringThickness
    this.bgColor = config.bgColor
    this.crossingProbability = config.crossingProbability
    this.positiveProbability = config.positiveSwitch
    this.crossingAngle = config.crossingAngle
    this.spacerGap = config.spacerGap

    this.controlYFactor = (1 - this.stringSpacing / this.rowHeight * Math.tan(this.crossingAngle))
    this.margin = this.stringThickness + 1
    this.numStrings = 1 + Math.floor((this.displayWidth - this.stringThickness) / this.stringSpacing)

    this.colors = this.initialColors(this.numStrings)
  }

  initialColors = (numStrings) => {
    let i,r,g,b
    const result = []
    for (i = 0; i < numStrings; i++) {

      r = 64 + Math.floor(Math.random() * 192)
      g = 64 + Math.floor(Math.random() * 192)
      b = 64 + Math.floor(Math.random() * 192)

      result.push(`rgb(${r},${g},${b})`)
    }
    return result;
  }

  fillRow = (y) => {
    const {
      numStrings,
      margin,
      stringSpacing,
      crossingProbability,
      colors,
      positiveProbability,
      drawString,
      drawCrossing,
    } = this

    let stringNumber = 0
    let temp

    const nextColors = []

    while (stringNumber < numStrings - 1) {
      const x = margin + stringNumber * stringSpacing
      if (Math.random() < crossingProbability) {
        const positiveSwitch = (Math.random() < positiveProbability)
        const positive = (positiveSwitch && (generatorsInLastRow[stringNumber] != -1)) ||
                ((!positiveSwitch) && (generatorsInLastRow[stringNumber] == 1))

        const config = {
          x,
          y,
          color0: colors[stringNumber],
          color1: colors[stringNumber+1],
          positive,
        }
        drawCrossing(config)
        generatorsInLastRow[stringNumber] = positive ? 1 : -1
        generatorsInLastRow[stringNumber+1] = 0

        // set colors
        nextColors[stringNumber] = colors[stringNumber + 1]
        nextColors[stringNumber + 1] = colors[stringNumber]

        //advance
        stringNumber += 2
      }
      else {
        drawString({
          x,
          y,
          color: colors[stringNumber],
        })
        nextColors[stringNumber] = colors[stringNumber]
        stringNumber += 1
      }
    }

    if (stringNumber == numStrings - 1) drawString({
      x: margin + stringNumber * stringSpacing,
      y,
      color: colors[stringNumber],
    })
    nextColors[stringNumber] = colors[stringNumber]

    return nextColors
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
    const { context } = this
    const {
      rowHeight,
      stringSpacing,
      controlYFactor,
      drawLeftCross,
      drawRightCross,
    } = this
    const {
      x,
      y,
      color0,
      color1,
      positive,
    } = config
    context.lineCap = "butt"

    const left = {
      beginX: x + stringSpacing,
      beginY: y,
      cp0X: x + stringSpacing,
      cp0Y: y + rowHeight * controlYFactor,
      cp1X: x,
      cp1Y: y + rowHeight * (1 - controlYFactor),
      endX: x,
      endY: y + rowHeight,
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
      endY: y + rowHeight,
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
    context.lineTo(x, y + rowHeight)
    context.stroke()
  }

  render = () => {
    for (let k = 0; k < this.numStrings - 1; k++) { generatorsInLastRow.push(0) }

    let i = Math.floor(this.displayHeight / this.rowHeight)
    while (--i > -1) { this.colors = this.fillRow(i * this.rowHeight) }
  }
}
