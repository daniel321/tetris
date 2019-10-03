import React, { Component } from 'react';
import './piece.css';

export default class PieceDrawService {
  static drawPiece = (piece, onClick) => {
      return draw(null, piece, onClick);
  };

  static drawStage = (stage, piece) => {
      return draw(stage, piece, ()=>{});
  };
}

const draw = (stage, piece, onClick) => {
  const drawSquare = (toDraw, piece, i, j, onClick) => {
    let square = toDraw.value[i][j];

    if(piece && toDraw != piece ) {
      let x = piece.pos[0];
      let y = piece.pos[1];
      if (i >= x && i < x + piece.value.length &&
          j >= y && j < y + piece.value[0].length ) {
            let sqr = piece.value[i-x][j-y];
            if (sqr) {
              square = sqr;
              toDraw = piece;
            }
      }
    }

    const getStyle = (stage, square) => {
      if(!square) {
        return {};
      }

      switch (toDraw.item) {
        case 2:
        return {
          'color': toDraw.color,
          'backgroundColor': toDraw.color,
          'borderColor': toDraw.color,
          'opacity': 0.1
        };
        break;
        case 3:
          return {
            'color': 'black',
            'backgroundColor': 'black',
            'borderColor': toDraw.color,
            'borderStyle': 'outset',
            'opacity': 1
          };
        break;
        default:
          return {
            'color': toDraw.color,
            'backgroundColor': toDraw.color,
            'borderColor': toDraw.color,
            'opacity': square == 2 ?  0.1 : 1
          };
      }
    };

    return(
      <th className={square ? "pieceSquare":"pieceBackground"}
        style={getStyle(toDraw, square)}
        key={'square: {' + i + ',' + j + '}'}
        onClick={onClick.bind(null, {x:i,y:j})}>
        {square}
        </th>
      );
  };

  let toDraw = stage ? stage : piece;
  return (
      <table className="pieceDisplaytable">
        <tbody>
          {
            toDraw.value.map((row, i) => (
                <tr className="pieceRow" key={i}>
                  {
                    row.map((square,j) => (
                      drawSquare(toDraw,piece,i,j,onClick)
                    ))
                  }
                </tr>
              )
            )
          }
      </tbody>
    </table>
  );
};
