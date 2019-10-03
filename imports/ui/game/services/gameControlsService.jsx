import React, { Component } from 'react';

const KEYCODES = {
  "ESC":27,
  "SPACE":32,
  "ENTER":13,

  "UP":38,
  "DOWN":40,
  "LEFT":37,
  "RIGHT":39,

  "A":65,
  "S":83,
  "D":68,
  "W":87
};

export default class GameControlsService {

  constructor(props) {
    this.props = props;
  }

  handleKeys = (event) => {
    switch (event.keyCode) {
      case KEYCODES.ESC:
        this.props.onBack();
        break;
      case KEYCODES.SPACE:
        this.props.onSpace();
        break;
      case KEYCODES.ENTER:
        this.props.onEnter();
        break;

      case KEYCODES.UP:
        this.props.onUp();
        break;
      case KEYCODES.DOWN:
        this.props.onDown();
        break;
      case KEYCODES.LEFT:
        this.props.onLeft();
        break;
      case KEYCODES.RIGHT:
        this.props.onRight();
        break;

      case KEYCODES.W:
        this.props.onUp();
        break;
      case KEYCODES.S:
        this.props.onDown();
        break;
      case KEYCODES.A:
        this.props.onLeft();
        break;
      case KEYCODES.D:
      this.props.onRight();
        break;
      default:
        console.log(event.keyCode);
    }

  };

}
