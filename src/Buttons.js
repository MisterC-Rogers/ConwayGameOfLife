import React from "react";
import "./styles.css";

const Buttons = ({
  random,
  isPlaying,
  playPause,
  advanceFrame,
  clearBoard,
  Gen
}) => {
  return (
    <div className="controls">
      <button className="button" type="button" onClick={() => clearBoard()}>
        Clear
      </button>
      <button className="button" type="button" onClick={() => random()}>
        Random
      </button>

      <button className="button" type="button" onClick={() => playPause()}>
        {isPlaying ? "Pause" : "Start"}
      </button>

      <button className="button" type="button" onClick={() => advanceFrame()}>
        Next frame
      </button>
      <p className="genTag"> Generation: {Gen}</p>
    </div>
  );
};

export default Buttons;
