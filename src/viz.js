export default class Viz {
  constructor (config) {
    const displayCanvas = document.querySelector(config.selector)
    displayCanvas.height = window.innerHeight
    displayCanvas.width = window.innerWidth

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
  }

  initialColors = (numStrings) => {
    let i,r,g,b
    const result = []
    for (i = 0; i < numStrings; i++) {

      r = 64 + Math.floor(Math.random() * 192)
      g = 44 + Math.floor(Math.random() * 212)
      b = 192
      // b = 64 + Math.floor(Math.random() * 192)

      result.push(`rgb(${r},${g},${b})`)
    }
    return result;
  }

  fillRow = (y) => {
    const { numStrings, crossingProbability, strings } = this
    const nextStrings = []

    let stringNumber = 0
    while (stringNumber < numStrings / 2) {
      const doCrossing = Math.random() < crossingProbability
      if (doCrossing) {
        nextStrings[stringNumber] = {
          cross: strings[stringNumber].cross,
          color: stringNumber === numStrings / 2 - 1 ?
            strings[stringNumber].color :
            strings[stringNumber + 1].color,
          doCrossing,
        }
        nextStrings[stringNumber + 1] = {
          cross: stringNumber === numStrings / 2 - 1 ?
            strings[stringNumber].cross :
            strings[stringNumber + 1].cross,
          color: strings[stringNumber].color,
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

  drawRow = (y, strings) => {

    const { margin, stringSpacing, drawString, drawCrossing, numStrings } = this
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
    this.displayCanvas.height = window.innerHeight
    this.displayCanvas.width = window.innerWidth
    this.displayWidth = this.displayCanvas.width
    this.displayHeight = this.displayCanvas.height


    const numStrings = (1 + Math.floor((this.displayWidth - this.stringThickness) / this.stringSpacing))

    this.numStrings = numStrings % 2 ? numStrings - 1 : numStrings
    this.strings = this.initialColors(this.numStrings / 2).map((color, i) => {
      return {
        color,
        cross: i % 2,
        doCrossing: false,
      }
    })

    this.context.clearRect(0, 0, this.displayWidth, this.displayHeight)
    let i = Math.floor(this.displayHeight / this.rowHeight) + 1
    while (--i > -1) {
      console.log(i)
      this.strings = this.fillRow()
      console.log(this.strings)
      this.drawRow(i * this.rowHeight, this.strings)
    }
  }
}
