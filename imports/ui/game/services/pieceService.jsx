
export default class PieceService {

  static rotatePiece = (piece) => {
    let result = [];
    _PieceService.squarePiece(piece);

    piece.value.forEach((row,i) => {
      result.push([]);
      row.forEach((elem) => {
        result[i].push(elem);
      });
    });

    _PieceService.rotatePieceDer(piece, result);

    piece.value = result;
    PieceService.squashPiece(piece);
  }

  static squashPiece = (piece) => {
    _PieceService.squashTop(piece);
    _PieceService.squashBottom(piece);
    _PieceService.squashLeft(piece);
    _PieceService.squashRight(piece);
  };
}

class _PieceService {

  static rotatePieceIzq = (piece, result) => {
    piece.value.forEach((row,i) => {
      row.forEach((elem,j) => {
        result[row.length-1-j][i] = elem
      });
    });
  }

  static rotatePieceDer = (piece, result) => {
    piece.value.forEach((row,i) => {
      row.forEach((elem,j) => {
        result[j][row.length-1-i] = elem
      });
    });
  }

  static squarePiece = (piece) => {
    let height = piece.value.length;
    let width = piece.value[0].length;

    while (height != width) {
      if (height < width) {
        SizeService.increaseSizeX(piece);
      } else {
        SizeService.increaseSizeY(piece);
      }

      height = piece.value.length;
      width = piece.value[0].length;
    }
  };

  static squashTop = function(piece) {
    let emptyRow = true;
    while (emptyRow && piece.value[0]) {
      let row = piece.value[0];
      row.forEach((elem) => {
        if (elem) {
          emptyRow = false;
        }
      });

      if (emptyRow) {
        if (piece.value.length > 1) {
          SizeService.decreaseSizeX(piece, true);
        } else {
          emptyRow = false;
        }
      }
    }
  };

  static squashBottom = function(piece) {
    let emptyRow = true;
    while (emptyRow && piece.value.length > 1) {
      let row = piece.value[piece.value.length-1];
      row.forEach((elem) => {
        if (elem) {
          emptyRow = false;
        }
      });

      if (emptyRow) {
        if (piece.value.length > 1) {
          SizeService.decreaseSizeX(piece);
        } else {
          emptyRow = false;
        }
      }
    }
  };

  static squashRight = function(piece) {
    let emptyCol = true;
    for (let i=0 ; i < piece.value[0].length ; i++) {
      for (let j=0 ; j < piece.value.length ; j++) {
        let elem =  piece.value[j][i];
        if(elem) {
          emptyCol = false;
        }
      }
      if (emptyCol) {
        if (piece.value[0].length > 1) {
          SizeService.decreaseSizeY(piece, true);
          i--;
        } else {
          emptyCol = false;
        }
      }
    }
  };

  static squashLeft = function(piece) {
    let emptyCol = true;
    for (let i=piece.value[0].length ; i > 0 ; i--) {
      for (let j=0 ; j < piece.value.length ; j++) {
        let elem =  piece.value[j][i-1];
        if(elem) {
          emptyCol = false;
        }
      }
      if (emptyCol) {
        if (piece.value[0].length > 1) {
          SizeService.decreaseSizeY(piece);
        } else {
          emptyCol = false;
        }
      }
    }
  };
}

export class SizeService {

  static increaseSizeY = (piece, MAX_SIZE_Y=6) => {
    let size = piece.value[0].length;

    if (size < MAX_SIZE_Y) {
      piece.value.forEach((row) => {
        row.push(0);
      });
      return true;
    }
    return false;
  };

  static increaseSizeX = (piece, MAX_SIZE_X=6) => {
    let size = piece.value.length;

    if (size < MAX_SIZE_X) {
      let value = piece.value;
      let newRow = [];
      value[0].forEach((elem) => {
        newRow.push(0);
      });
      value.push(newRow);
      return true;
    }
    return false;
  };

  static decreaseSizeX = (piece, left=false, MIN_SIZE_X=1) => {
    let size = piece.value.length;

    if (size > MIN_SIZE_X) {
      left ? piece.value.shift() : piece.value.pop();
      return true;
    }
    return false;
  };

  static decreaseSizeY = (piece, left=false, MIN_SIZE_Y=1) => {
    let size = piece.value[0].length;

    if (size > MIN_SIZE_Y) {
      piece.value.forEach((row) => {
        left ? row.shift() : row.pop();
      });
      return true;
    }
    return false;
  };

}
