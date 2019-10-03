import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Pieces } from '../api/piece.js';

import Accounts from './accounts.js';

import Stage from './game/stage/stage.jsx';
import PieceDisplay from './game/pieceDisplay/pieceDisplay.jsx';
import PieceCreation from './game/pieceCreation/pieceCreation.jsx';

import PieceService from './game/services/pieceService.jsx';

import './main.css';

const SECTIONS = {
    none: 'none',
    menu: 'menu',
    creation: 'creation',
    list: 'list',
    game: 'game'
};

const Wrapper = ({children}) => children;

class App extends Component {

  constructor(attr) {
    super(attr);
    this.state = {
      section: SECTIONS.menu
    };
  }

  setSection = (section) => {
    this.state.section = section;
    this.forceUpdate();
  };

  onCreatePiece = (piece) => {
    piece.owner = this.props.userId;
    if(piece.name && piece.owner) {
        Pieces.insert(piece);
        this.setSection(SECTIONS.list);
    }
  };

  onDeletePiece = (piece) => {
    if(piece.owner == this.props.userId) {
      Pieces.remove({'_id': piece._id});
    }
  };

  getCurrentSection = () => {
    if (this.props.currentUser) {
      if (this.state.section == SECTIONS.none) {
        this.state.section = SECTIONS.menu;
      }
    } else {
        this.state.section = SECTIONS.none;
    }
    return this.state.section;
  };

  render() {
    return (
      <div className="container" key="app">
        <header>
          <h1>Tetris</h1>
          <h5><Accounts /></h5>
        </header>
        {this.drawCurrentSection()}
      </div>
    );
  };

  drawCurrentSection = () => {
    let section = this.getCurrentSection();
    switch (section) {
      case SECTIONS.menu:
        return this.drawMenuSection();
      case SECTIONS.list:
        return this.drawListSection();
      case SECTIONS.creation:
        return this.drawCreationSection();
      case SECTIONS.game:
        return this.drawGameSection();
      default:
      <Wrapper>
        Invalid section
      </Wrapper>
    }
  };

  drawMenuSection = () => {
    return (
      <Wrapper>
        {this.drawToCreateButton()}
        {this.drawToListButton()}
        {this.drawToGameButton()}
      </Wrapper>
    );
  };

  drawListSection = () => {
    return (
      <Wrapper>
        <PieceDisplay pieces={this.props.pieces}
                      userId={this.props.userId}
                      onDeletePiece={this.onDeletePiece} />
        {this.drawBackButton()}
      </Wrapper>
    );
  };

  drawCreationSection = () => {
    return (
      <Wrapper>
        <PieceCreation onCreatePiece={this.onCreatePiece} />
        {this.drawBackButton()}
      </Wrapper>
    );
  };

  drawGameSection = () => {
    return (
      <Wrapper>
        <Stage pieces={this.props.pieces}
               user={this.props.currentUser}
               onBack={() => {this.setSection(SECTIONS.menu)}}/>
      </Wrapper>
    );
  };

  drawSectionButton = (name, section, label) => {
    return (
      <div className="button sectionButton"
           id={name}
           key={name}
           onClick={this.setSection.bind(null, section)} >
        {label}
      </div>
    );
  };

  drawBackButton = () => {
    return this.drawSectionButton("backSectionButton", SECTIONS.menu, 'back');
  };

  drawToCreateButton = () => {
    return this.drawSectionButton("createSectionButton", SECTIONS.creation, 'create');
  };

  drawToListButton = () => {
    return this.drawSectionButton("listSectionButton", SECTIONS.list, 'list');
  };

  drawToGameButton = () => {
    return this.drawSectionButton("gameSectionButton", SECTIONS.game, 'start');
  };
}

export default withTracker(() => {
  let query = {
    "$or" : [
      {
        owner: Meteor.userId()
      },
      {
        owner: "enqCbJKNTDWcJPhCm"
      }
    ]
  };

  let options = {
    sort: { _id: -1 }
  };

  let pieces = Pieces.find(query, options).fetch();
  pieces.forEach((piece)=> {
    PieceService.squashPiece(piece);
  });

  return {
    pieces: pieces,
    currentUser: Meteor.user(),
    userId: Meteor.userId()
  };
})(App);
