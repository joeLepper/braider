import React from 'react'

export class Page extends React.Component {
  render () {
    let {cols, rows} = this.props
    let dots = []
    let brand = []

    for (var i = 0; i < rows; i++) {
      let column = []
      for (var j = 0; j < cols ; j++) {
        column.push(<circle
          className={`dot-${i}-${j}`}
          key={`dot-${i}-${j}`}
          fill="rgba(0,0,0, 0.0)">
        </circle>)
      }
      dots.push(<g key={`row-${i}`} className={`row-${i}`}>{column}</g>)
    }
    if (this.props.brand) brand = (
      <div className="container">
        <h1 className="title">joe lepper</h1>
        <h2 className="subtitle">making stuff on the Internet</h2>
        <ul>
          <li>
            <a href="http://twitter.com/josephlepper">@josephlepper</a>
          </li>
          <li>
            <a href="http://github.com/joeLepper">github</a>
          </li>
          <li>
            <a href="http://github.com/joeLepper/dot-portfolio">source</a>
          </li>
        </ul>
      </div>
    )

    return (<html>
      <head>
        <title>joe lepper: making stuff on the Internet</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
      </head>
      <body>
        {brand}
        <svg height="100" width="100">{dots}</svg>
        <video muted="true" className="invisible" autoPlay="true"></video>
        <canvas className="invisible" width={cols} height={rows}></canvas>
        <script type="text/javascript">window.__cols = {cols};window.__rows = {rows}</script>
        <script type="text/javascript" src="bundle.js"></script>
      </body>
    </html>)
  }
}
