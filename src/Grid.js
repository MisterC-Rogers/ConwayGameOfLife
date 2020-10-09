import React from "react";
import "./styles.css";

const Cell = ({ i, j, cell, onCellClick }) => {
  const A = 0.1 * cell.age;
  const id = `${i},${j}`;
  const base = {
    width: "14px",
    height: "14px",
    border: "2px solid #fff"
  };

  const isAlive = {
    backgroundColor: `rgba(${cell.color}, ${A})`
  };
  const isDead = {
    backgroundColor: `rgb(40,40,40)`
  };

  const style = cell.alive
    ? Object.assign({}, base, isAlive)
    : Object.assign({}, base, isDead);
  return (
    <td
      id={id}
      className="cell"
      style={style}
      onClick={() => onCellClick(i, j)}
    />
  );
};

const Row = ({ i, cell, onCellClick }) => {
  const tds = cell.map((cell, j) => (
    <Cell i={i} j={j} key={"c" + j} cell={cell} onCellClick={onCellClick} />
  ));
  return <tr>{tds}</tr>;
};

export const Grid = ({ Gen, grid, onCellClick }) => {
  const trs = grid.map((cells, i) => (
    <Row i={i} key={"r" + i} cell={cells} onCellClick={onCellClick} />
  ));
  const style = {
    borderCollapse: "collapse"
  };
  return (
    <table className="grid" style={style}>
      <tbody>{trs}</tbody>
    </table>
  );
};
