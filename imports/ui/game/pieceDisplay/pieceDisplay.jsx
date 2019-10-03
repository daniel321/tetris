import React, { Component } from 'react';
import PieceService from '../services/pieceService.jsx';
import PieceDrawService from '../services/pieceDrawService.jsx';
import './pieceDisplay.css';

const Wrapper = ({children}) => children;

export default class PieceDisplay extends Component {

  constructor(attr) {
    super(attr);
  }

  onRotatePiece = (piece) => {
    let orig = this.props.pieces.find((elem) => {
      return elem._id == piece._id;
    });
    PieceService.rotatePiece(orig);
    this.forceUpdate();
  };

  render() {
    return (
      <div key="pieceDisplay" className="pieceDisplayGroup">
        {this.renderPieces(this.props.pieces)}
      </div>
    );
  };

  renderPieces = (pieces) => {
    return pieces.map((piece) => (
      <div key={"appPiece " + piece._id} className="pieceDisplay">
        name: {piece.name}
        {PieceDrawService.drawPiece(piece, ()=>{} )}
        <div className="displayButtons">
          {this.drawButtons(piece)}
        </div>
      </div>
    ));
  };

  drawButtons = (piece) => {
    let onRotatePiece = this.onRotatePiece;
    let onDeletePiece = this.props.onDeletePiece;
    let userId = this.props.userId;
    return (
      <Wrapper>
        <div className="button rotateButton"
             key={"appRotateButton " + piece._id}
             onClick={onRotatePiece.bind(null, piece)} >
          Rotate
        </div>
        {
          userId == piece.owner &&
          <div className="button deleteButton"
               key={"appDeleteButton " + piece._id}
               onClick={onDeletePiece.bind(null, piece)} >
            Delete
          </div>
        }
      </Wrapper>
     );
  };
}
