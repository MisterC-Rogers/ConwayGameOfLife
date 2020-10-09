import React from "react";
import { Grid } from "./Grid";
import Buttons from "./Buttons";
import { createRandomBoard, initBoard, hexToRgb, rgbToHex } from "./Helpers";
import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.width = 20;
    this.height = 20;

    this.state = {
      board: initBoard(this.height, this.width),
      isPlaying: false,
      Gen: 0,
      speed: 500,
      color: "74,168,16"
    };
  }

  getNeighborsColors = neighbors => {
    let red = neighbors[0].color.split(/\s*[\s,]\s*/);
    red = parseInt(red, 10);
    let green = neighbors[1].color.split(/\s*[\s,]\s*/);
    green = parseInt(green[1], 10);
    let blue = neighbors[2].color.split(/\s*[\s,]\s*/);
    blue = parseInt(blue[2], 10);
    return `${red},${green},${blue}`;
  };

  countNeighbors = (board, i, j) => {
    const h = board.length;
    const w = board[0].length;
    const nas = [];
    const b = board;

    function circleIndex(length) {
      // great hack from https://stackoverflow.com/a/22412225/105132
      return index => {
        index = index % length;
        index = index + length;
        index = index % length;
        return index;
      };
    }

    const ci = circleIndex(h);
    const cj = circleIndex(w);

    if (b[ci(i)][cj(j - 1)].alive) nas.push(b[ci(i + 0)][cj(j - 1)]); // W
    if (b[ci(i - 1)][cj(j - 1)].alive) nas.push(b[ci(i - 1)][cj(j - 1)]); // NW
    if (b[ci(i - 1)][cj(j)].alive) nas.push(b[ci(i - 1)][cj(j + 0)]); // N
    if (b[ci(i - 1)][cj(j + 1)].alive) nas.push(b[ci(i - 1)][cj(j + 1)]); // NE
    if (b[ci(i)][cj(j + 1)].alive) nas.push(b[ci(i + 0)][cj(j + 1)]); // E
    if (b[ci(i + 1)][cj(j + 1)].alive) nas.push(b[ci(i + 1)][cj(j + 1)]); // SE
    if (b[ci(i + 1)][cj(j)].alive) nas.push(b[ci(i + 1)][cj(j + 0)]); // S
    if (b[ci(i + 1)][cj(j - 1)].alive) nas.push(b[ci(i + 1)][cj(j - 1)]); // SW

    return nas;
  };

  advanceFrame = () => {
    const nb = [];
    const b = this.state.board;
    for (let i = 0; i < b.length; i++) {
      nb.push([]);
      for (let j = 0; j < b[0].length; j++) {
        let neighbors = this.countNeighbors(b, i, j);

        if (b[i][j].alive) {
          if (neighbors.length < 2 || neighbors.length > 3) {
            nb[i].push({
              y: i,
              x: j,
              color: "",
              age: 0,
              alive: false
            });
          } else {
            nb[i].push({
              y: i,
              x: j,
              color: b[i][j].color,
              age: b[i][j].age + 1,
              alive: true
            });
          }
        } else if (neighbors.length === 3) {
          let birthColor = this.getNeighborsColors(neighbors);
          nb[i].push({
            y: i,
            x: j,
            color: birthColor,
            age: 1,
            alive: true
          });
        } else {
          nb[i].push(b[i][j]);
        }
      }
    }
    this.setState({ board: nb });
    this.setState(prevState => ({
      Gen: prevState.Gen + 1
    }));
  };

  playPause = () => {
    if (this.state.isPlaying) {
      clearInterval(this.intervalId);
      this.setState(prevState => ({ isPlaying: !prevState.isPlaying }));
    } else {
      this.intervalId = setInterval(this.advanceFrame, this.state.speed);
      this.setState(prevState => ({ isPlaying: !prevState.isPlaying }));
    }
  };

  randomBoard = () => {
    this.setState({
      board: createRandomBoard(this.width, this.height),
      Gen: 0
    });
  };

  clearBoard = () => {
    const h = this.height;
    const w = this.width;
    const clearBoard = [];
    for (var i = 0; i < h; i++) {
      clearBoard.push([]);
      for (var j = 0; j < w; j++) {
        clearBoard[i].push({ y: i, x: j, color: "", age: 0, alive: false });
      }
    }
    this.setState({ board: clearBoard, Gen: 0 });
  };

  onCellClick = (i, j) => {
    this.setState(prevState => {
      const newBoard = JSON.parse(JSON.stringify(prevState.board));
      newBoard[i][j].alive === false
        ? (newBoard[i][j] = {
            y: i,
            x: j,
            color: this.state.color,
            age: 1,
            alive: true
          })
        : (newBoard[i][j] = { y: i, x: j, color: "", age: 0, alive: false });
      return { board: newBoard };
    });
  };

  setSpeed = event => {
    if (this.state.isPlaying) {
      clearInterval(this.intervalId);
      this.setState(prevState => ({ isPlaying: !prevState.isPlaying }));
    }
    this.setState({
      speed: event.target.value
    });
  };

  setColor = event => {
    let color = hexToRgb(event.target.value);
    this.setState({
      color: color
    });
  };

  getHexValue = color => {
    let colors = color.split(/\s*[\s,]\s*/);
    let r = colors[0],
      g = colors[1],
      b = colors[2];
    return rgbToHex(r, g, b);
  };

  gridSize = size => {
    switch (size) {
      case "2":
        this.width = 30;
        this.height = 20;
        break;
      case "3":
        this.width = 40;
        this.height = 20;
        break;
      default:
        this.width = 20;
        this.height = 20;
    }
    this.clearBoard();
  };

  render() {
    const speed = this.state.speed / 1000;
    return (
      <div className="container">
        <h1>Conway's Game of Life</h1>
        <div className="tooSmall">
          <h3>
            To receive the best experience from this application. Please view it
            on a device with a larger screen. We apologize for the inconvenience
            this my have caused.
          </h3>
        </div>
        <div className="body">
          <div className="colorPicker">
            <p className="colorPickerP">
              Set manual color picker or press the "Random" button to auto
              generate random cells with a random color
            </p>
            <div className="colorPickerInput">
              <p>Current color is {this.state.color}</p>
              <input
                className="colorInputBtn"
                type="color"
                value={this.getHexValue(this.state.color)}
                onChange={this.setColor}
              />
            </div>
            <div className="rangeDiv">
              <h3 className="rangePTag"> Change Speed </h3>
              <p className="currSpeed"> Current Speed {speed} seconds</p>
              <input
                className="range"
                type="range"
                min="100"
                max="2000"
                step="100"
                value={this.state.speed}
                onChange={this.setSpeed}
              />
            </div>
            <div className="gridsize">
              <h3>Change Grid Size</h3>
              <div className="dropdown">
                <button>Grid Size</button>
                <div>
                  <button onClick={() => this.gridSize("1")}>20</button>
                  <button onClick={() => this.gridSize("2")}>30</button>
                  <button onClick={() => this.gridSize("3")}>40</button>
                </div>
              </div>
            </div>
          </div>
          <div className="main">
            <Buttons
              random={this.randomBoard}
              isPlaying={this.state.isPlaying}
              textTable={this.state.isTextTable}
              playPause={this.playPause}
              advanceFrame={this.advanceFrame}
              clearBoard={this.clearBoard}
              faster={this.fasterSpeed}
              slower={this.slowerSpeed}
              speed={this.state.speed}
              setSpeed={this.setSpeed}
              color={this.state.color}
              setColor={this.setColor}
              getHexValue={this.getHexValue}
              Gen={this.state.Gen}
            />
            <Grid grid={this.state.board} onCellClick={this.onCellClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
