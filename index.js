import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

const aspectRatio = { columns: 64, rows: 36 }

let padding = 10
let {width, height, radius, step, translate} = getStage()
let video = document.querySelector('video')
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')


class Counter extends React.Component {
  componentDidMount () { setInterval(this.props.emitTick, 200) }
  render () {
    let {columns, rows} = aspectRatio
    const { pixels } = this.props
    let dots = []

    if (this.props.pixels.data.length) {
      let px = 0
      for (var i = 0; i < rows; i++) {
        let row = []
        for (var j = 0; j < columns ; j++) {
          row.push(<circle
            key={i + '-' + j}
            cx={j * step + radius + padding}
            cy={i * step + radius + padding}
            r={radius}
            fill={`rgb(${pixels.data[px * 4]},${pixels.data[px * 4 + 1]},${pixels.data[px * 4 + 2]})`}></circle>)
          px++
        }
        dots.push(<g  transform={`scale(-1, 1) translate(-${width}, 0)`} key={i}>{row}</g>)
      }
    }
    return (
      <svg height={height} width={width}>{dots}</svg>
    )
  }
}

const tickAction = { type: 'tick' }

function counter(state={ pixels: { width: aspectRatio.columns, height: aspectRatio.rows, data: [] } }, action) {
  let {rows, columns} = aspectRatio
  switch(action.type){
    case 'tick':
      ctx.drawImage(video, 0, 0, columns, rows)
      return { pixels: ctx.getImageData(0, 0, columns, rows) }
    default:
      return state
  }
}

let store = createStore(counter)

function mapStateToProps(state)  { return { pixels: state.pixels } }
function mapDispatchToProps(dispatch) { return { emitTick: () => dispatch(tickAction) } }
function getStage () {
  let dimensions = document.querySelector('body').getBoundingClientRect()
  let {columns, rows} = aspectRatio
  let { width, height } = dimensions

  let widthRatio = (width - padding * 2) / columns
  let heightRatio = (height - padding * 2) / rows

  let diameter = widthRatio > heightRatio ? heightRatio : widthRatio
  let radius = diameter / 2

  let isLandscape = widthRatio > heightRatio
  let step = isLandscape ? widthRatio : heightRatio

  return { width, height, radius, step}
}

let App = connect(mapStateToProps, mapDispatchToProps)(Counter)

navigator.webkitGetUserMedia({ audio: false, video: true }, function (mediaStream) {
  video.src = window.URL.createObjectURL(mediaStream)
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#dots')
  )
}, function () {})

