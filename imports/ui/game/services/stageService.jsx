import PieceService from './pieceService.jsx';

export default class StageService {

  static setRandomItem = (stage) => {
      if(Math.floor(Math.random() * 100) < 2) {
            let i = Math.floor(Math.random() * (stage.value.length/2));
            let j = Math.floor(Math.random() * (stage.value[0].length));

            let item = 2 + Math.floor(Math.random()*2);
            stage.value[i][j] = item;
      }
  };

  static getRandomPiece = (pieces, pos) => {
    let index = Math.floor(Math.random() * (pieces.length));
    let piece = pieces[index];
    piece.pos = pos;
    return piece;
  };

  static isValidPos = (piece, stage, dpos) => {
    let pos = piece.pos;
    let endPos = [pos[0] + dpos[0], pos[1] + dpos[1]];

    let found = true;
    piece.value.forEach((row,i) => {
        row.forEach((elem,j) => {
          if (elem) {
            try {
              var value = stage.value[i+endPos[0]][j+endPos[1]];
              if((value && !piece.item) || value == undefined) {
                if(value > 1) {
                  piece.item = value;
                  stage.value[i+endPos[0]][j+endPos[1]] = 0;
                } else {
                    found = false;
                }
              }
            } catch(err){
              found = false;
            }
          }
        });
    });

    return found;
  };

  static movePiece = (piece, stage, dpos) => {
    if (StageService.isValidPos(piece, stage, dpos)) {
      piece.pos[0]+= dpos[0];
      piece.pos[1]+= dpos[1];
      return true;
    }
    return false;
  };

  static rotatePiece = (piece, stage, dpos) => {
    let oldValue = piece.value;
    PieceService.rotatePiece(piece);

    if (StageService.isValidPos(piece, stage, [0,0])) {
      return true;
    } else {
      piece.value = oldValue;
      return false;
    }
  };

  static checkForLines = (stage) => {
    let count = 0;
    for (let i=0; i < stage.value.length ; i++) {
      let row = stage.value[i];

      let line = true;
      for (let j=0; j < row.length ; j++) {
        if(!row[j]){
          line = false;
        }
      }

      if (line) {
        count++;
        let newLine = [];
        for (let k=0; k < row.length ; k++) {
          newLine.push(0);
        }

        stage.value.splice(i, 1);
        stage.value.unshift(newLine);
      }
    }

    return count;
  };

  static pieceReachedEnd = (gameState) => {
    let piece = gameState.currentPiece;
    let stage = gameState.stage;
    let pieces = gameState.pieces;

    StageService.mergeStageAndPiece(piece, stage);
    gameState.currentPiece = StageService.getRandomPiece(pieces, [0,0]);

    let lines = StageService.checkForLines(stage);
    gameState.score += lines;
  };


  static mergeStageAndPiece = (piece, stage) => {
    let pos = piece.pos;
    let invShadow = piece.item == 3;
    piece.value.forEach((row,i) => {
        row.forEach((elem,j) => {
          if (elem) {
            let val = elem;
            if(invShadow) {
              val = 0;
            }
            stage.value[i+pos[0]][j+pos[1]] = val;
          }
        });
    });
    piece.item = undefined;
  };

  static gameStep = (gameState) => {
    let piece = gameState.currentPiece;
    let stage = gameState.stage;
    let pieces = gameState.pieces;

    let oldPos = [piece.pos[0], piece.pos[1]];
    StageService.movePiece(piece, stage, [1,0]);
    let newPos = [piece.pos[0], piece.pos[1]];

    if(oldPos[0] == newPos[0] && oldPos[1] == newPos[1]) {
      StageService.pieceReachedEnd(gameState);
      return true;
    }
    return false;
  };

}
