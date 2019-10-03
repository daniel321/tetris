import React, { Component } from 'react';
import { SizeService } from '../services/pieceService.jsx';
import PieceDrawService from '../services/pieceDrawService.jsx';
import GameControlsService from '../services/gameControlsService.jsx';
import StageService from '../services/stageService.jsx';
import './stage.css';

const Wrapper = ({children}) => children;

export default class Stage extends Component {

  constructor(props) {
    super(props);
    let pieces = this.props.pieces;

    this.state = {
      gameInProgress: false,
      score: 0,
      level: 1,
      speed: 1000,
      stage: {
        name: '',
        color: "#dadada",
        value: [
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0]
        ]
      },
      currentPiece: StageService.getRandomPiece(pieces, [0,0]),
      pieces: pieces
    };

    let controlProps = {
      onBack:  () => { this.props.onBack() },
      onSpace: () => { this.onRotatePiece() },
      onEnter: () => {
        if(!this.state.gameInProgress) {
          this.startGame();
        } else {
          if(this.state.currentPiece.item) {
            StageService.pieceReachedEnd(this.state);
            this.forceUpdate();
            if (this.state.score > 10*this.state.level ) {
              this.advanceLevel();
            }
          } else {
            this.onMakeShadow();
          }
        }
      },

      onUp: () => {
        if(this.state.currentPiece.item) {
          this.onMovePiece([-1,0]);
        } else {
          this.onRotatePiece();
        }
      },
      onDown: () => { this.onMovePiece([1,0]) },
      onLeft: () => { this.onMovePiece([0,-1]) },
      onRight: () => { this.onMovePiece([0,1]) }
    };

    this.gameControlsService = new GameControlsService(controlProps);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.gameControlsService.handleKeys, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.gameControlsService.handleKeys, false);
    if(this.state.gameInProgress) {
        clearInterval(this.interval);
    }
  }

  onMovePiece = (dpos) => {
      if (StageService.movePiece(this.state.currentPiece, this.state.stage, dpos)) {
        this.forceUpdate();
      }
  };

  onRotatePiece = () => {
    if (StageService.rotatePiece(this.state.currentPiece, this.state.stage)) {
      this.forceUpdate();
    }
  };

  onSizeIncrease = (orientation) => {
    let success = false;
    if (orientation) {
      success = SizeService.increaseSizeX(this.state.stage, 19);
    } else {
      success = SizeService.increaseSizeY(this.state.stage, 15);
    }
    if (success) {
      this.forceUpdate();
    }
  };

  onSizeDecrease = (orientation) => {
    let success = false;
    if (orientation) {
      success = SizeService.decreaseSizeX(this.state.stage, false, 10);
    } else {
      success = SizeService.decreaseSizeY(this.state.stage, false, 10);
    }
    if (success) {
      this.forceUpdate();
    }
  };

  onMakeShadow = () => {
    this.state.currentPiece.item = 2;
    this.forceUpdate();
  };

  startGame = () => {
    this.state.gameInProgress = true;
    this.interval = setInterval(() => {
      if(!this.state.currentPiece.item) {
        let scoreChanged = StageService.gameStep(this.state);
        StageService.setRandomItem(this.state.stage);
        this.forceUpdate();

        if (scoreChanged && this.state.score > 10*this.state.level ) {
          this.advanceLevel();
        }
      }
    }, this.state.speed);
    this.forceUpdate();
  };

  advanceLevel = () => {
    clearInterval(this.interval);
    this.state.speed *= 0.9;
    this.state.level += 1;
    this.startGame();
  };

  render() {
    let stage = this.state.stage;
    let piece = this.state.currentPiece;
    return (
      <div className="gamePage" key="creation">
        <div className="gameStage">
          {this.drawScore()}
          {this.drawLevel()}
          {this.drawSizeControls(false)}
          {this.drawStage()}
          {this.drawSizeControls(true)}
        </div>
        {this.drawStartButton()}
        {this.drawBackButton()}
      </div>
    );
  }

  drawStage = () => {
    return (
      <Wrapper>
        { !this.state.gameInProgress &&
          PieceDrawService.drawStage(this.state.stage)
        }
        { this.state.gameInProgress &&
          PieceDrawService.drawStage(this.state.stage, this.state.currentPiece)
        }
      </Wrapper>
    );
  };

  getInvTag = (targetState = true) => {
        return this.state.gameInProgress == targetState ? " invisible":"";
  };

  drawScore = () => {
    return (
      <div className={"scoreContainer"+ this.getInvTag(false)}
           key={"scoreContainer"} >
        Score:
        <div className={"score"} key={"score"}>
          {this.state.score}
        </div>
      </div>
    );
  };

  drawLevel = () => {
    return (
      <div className={"levelContainer"+ this.getInvTag(false)}
           key={"levelContainer"} >
        Level:
        <div className={"level"} key={"level"}>
          {this.state.level}
        </div>
      </div>
    );
  };

  drawSizeControls = (orientation) => {
    let orientationTxt = orientation ? "Vert": "Horiz";
    let onSizeDecrease = this.onSizeDecrease;
    let onSizeIncrease = this.onSizeIncrease;
    return (
      <Wrapper>
        <div className={"button sizeButton sizeButtonMinus" + orientationTxt + this.getInvTag()}
             key={"sizeDecreaseButton"}
             onClick={onSizeDecrease.bind(null, orientation)} >
          -
        </div>
        <div className={"button sizeButton sizeButtonPlus" + orientationTxt + this.getInvTag()}
             key={"sizeIncreaseButton"}
             onClick={onSizeIncrease.bind(null, orientation)} >
          +
        </div>
      </Wrapper>
    );
  };

  drawStartButton = () => {
    return (
      <div className={"button startButton"+ this.getInvTag()}
           id={"startButton"}
           key={"startButton"}
           onClick={this.startGame.bind(null)} >
        Start
      </div>
    );
  };

  drawBackButton = () => {
    return (
      <div className={"button sectionButton"+ this.getInvTag()}
           id={"backButton"}
           key={"backButton"}
           onClick={this.props.onBack} >
        Back
      </div>
    );
  };
}
