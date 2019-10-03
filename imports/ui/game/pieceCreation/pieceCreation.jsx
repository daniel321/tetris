import React, { Component } from 'react';
import { PieceService, SizeService } from '../services/pieceService.jsx';
import PieceDrawService from '../services/pieceDrawService.jsx';
import './pieceCreation.css';

const Wrapper = ({children}) => children;

export default class PieceCreation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      piece: {
        name: '',
        color: "#ffffff",
        value: [
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0]
        ]
      }
    };
  }

  onSizeIncrease = (orientation) => {
    let success = false;
    if (orientation) {
      success = SizeService.increaseSizeX(this.state.piece);
    } else {
      success = SizeService.increaseSizeY(this.state.piece);
    }
    if (success) {
      this.forceUpdate();
    }
  };

  onSizeDecrease = (orientation) => {
    let success = false;
    if (orientation) {
      success = SizeService.decreaseSizeX(this.state.piece);
    } else {
      success = SizeService.decreaseSizeY(this.state.piece);
    }
    if (success) {
      this.forceUpdate();
    }
  };

  onRotatePiece = () => {
    PieceService.rotatePiece(this.state.piece);
    this.forceUpdate();
  };

  onClickSquare = (pos) => {
      let value = this.state.piece.value;
      value[pos.x][pos.y] = value[pos.x][pos.y] ? false : true;
      this.forceUpdate();
  };

  onColorChange = (color) => {
      this.state.piece.color = color.target.value;
      this.forceUpdate();
  };

  onRenamePiece = (event) => {
      this.state.piece.name = event.target.value;
  };

  render() {
    let piece = this.state.piece;
    let onClickSquare = this.onClickSquare;
    return (
      <div className="creationPage"  key="creation">

        <div className="createControls">
          <div className="row">
            {this.drawNameControls()}
          </div>
          <div className="row">
            {this.drawColorControls(piece)}
          </div>
        </div>

        <div className="creationPagePiece">
          {this.drawSizeControls(false)}
          {PieceDrawService.drawPiece(piece, onClickSquare)}
          {this.drawSizeControls(true)}
        </div>
        <div className="createControls">
            <div className="row">
              {this.drawRotationControls()}
              {this.drawSaveControls(piece)}
            </div>
        </div>
      </div>
    );
  }

  drawRotationControls = () => {
    let onRotatePiece = this.onRotatePiece;
    return (
      <Wrapper>
        <div className="button rotateButton"
             key={"appRotateCreatedButton"}
             onClick={onRotatePiece.bind(null)} >
          Rotate
        </div>
      </Wrapper>
    );
  };

  drawSaveControls = (piece) => {
    let onCreatePiece = this.props.onCreatePiece;
    return (
      <Wrapper>
        <div className="button saveButton"
             key={"appSaveButton"}
             onClick={onCreatePiece.bind(null, piece)} >
          Save
        </div>
      </Wrapper>
    );
  };

  drawColorControls = (piece) => {
    let onColorChange = this.onColorChange;
    return (
      <Wrapper>
        Color:
        <input className="colorPicker"
               key={"colorInput"}
               type="color"
               value={piece.color}
               onChange={onColorChange.bind(null)} />
      </Wrapper>
    );
  };

  drawNameControls = () => {
    let onRenamePiece = this.onRenamePiece;
    return (
      <Wrapper>
        Name:
        <input  type="text"
                className="nameInput"
                key={"nameInput"}
                onChange={onRenamePiece.bind(null)} />
      </Wrapper>
    );
  };

  drawSizeControls = (orientation) => {
    let orientationTxt = orientation ? "Vert": "Horiz";
    let onSizeDecrease = this.onSizeDecrease;
    let onSizeIncrease = this.onSizeIncrease;
    return (
      <Wrapper>
        <div className={"button sizeButton sizeButtonMinus" + orientationTxt}
             key={"sizeDecreaseButton"}
             onClick={onSizeDecrease.bind(null, orientation)} >
          -
        </div>
        <div className={"button sizeButton sizeButtonPlus" + orientationTxt}
             key={"sizeIncreaseButton"}
             onClick={onSizeIncrease.bind(null, orientation)} >
          +
        </div>
      </Wrapper>
    );
  };
}
