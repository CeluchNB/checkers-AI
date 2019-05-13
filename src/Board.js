import React, { Component } from 'react';
import Row from './Row';
import { redContains, minimax, copyBoard } from './MiniMax';

const initialState = {
  board: {
    black: [
            {row: 0, column: 1}, {row: 0, column: 3}, {row: 0, column: 5}, {row: 0, column: 7},
            {row: 1, column: 0}, {row: 1, column: 2}, {row: 1, column: 4}, {row: 1, column: 6},
            {row: 2, column: 1}, {row: 2, column: 3}, {row: 2, column: 5}, {row: 2, column: 7}
    ],
    red: [
            {row: 5, column: 0}, {row: 5, column: 2}, {row: 5, column: 4}, {row: 5, column: 6},
            {row: 6, column: 1}, {row: 6, column: 3}, {row: 6, column: 5}, {row: 6, column: 7},
            {row: 7, column: 0}, {row: 7, column: 2}, {row: 7, column: 4}, {row: 7, column: 6}
    ]
  },
  validSpaces: [],
  movingPiece: {row: -1, column: -1},
  blackTurn: true,
  waitingForMove: false,
  validPositionClicked: false,
  blackHuman: true,
  redHuman: false,
  gameActive: false
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: {
        black: [
                {row: 0, column: 1}, {row: 0, column: 3}, {row: 0, column: 5}, {row: 0, column: 7},
                {row: 1, column: 0}, {row: 1, column: 2}, {row: 1, column: 4}, {row: 1, column: 6},
                {row: 2, column: 1}, {row: 2, column: 3}, {row: 2, column: 5}, {row: 2, column: 7}
        ],
        red: [
                {row: 5, column: 0}, {row: 5, column: 2}, {row: 5, column: 4}, {row: 5, column: 6},
                {row: 6, column: 1}, {row: 6, column: 3}, {row: 6, column: 5}, {row: 6, column: 7},
                {row: 7, column: 0}, {row: 7, column: 2}, {row: 7, column: 4}, {row: 7, column: 6}
        ]
      },
      validSpaces: [],
      movingPiece: {row: -1, column: -1},
      blackTurn: true,
      waitingForMove: false,
      validPositionClicked: false,
      blackHuman: true,
      redHuman: false,
      gameActive: false
    };
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  //perform human move
  handleSquareClick = (position) => {
    if(!this.state.blackHuman && !this.state.redHuman) { this.aiMove(); }
    if(this.state.waitingForMove === true) {
      if(this.isValidMove(position)) {

        if (this.isJump(position) === true) {
          var removingPiece = this.getJumpedPiece(position);
          this.removePiece(removingPiece, !this.state.blackTurn);
          this.removePiece(this.state.movingPiece, this.state.blackTurn);
          this.addPiece(position, this.state.blackTurn);
          if (this.checkWin(this.state.blackTurn)) {
            this.props.handleChange(this.state.blackTurn, true);
            return;
          }
        } else {
          this.removePiece(this.state.movingPiece, this.state.blackTurn);
          this.addPiece(position, this.state.blackTurn);
        }

        this.setState({ movingPiece: { row: -1, column: -1 } });
        this.setState({ validSpaces: [] });
        this.setState({ waitingForMove: false });
        this.setState({ blackTurn: !this.state.blackTurn }, () => { this.props.handleChange(this.state.blackTurn, false); this.aiMove(); });

      } else {
        if((this.state.blackTurn && this.blackContains(position)) || (!this.state.blackTurn && this.redContains(position))) {
          var moves = this.getValidMoves(position);
          if(moves.length > 0) {
            this.setState({ validSpaces: moves });
            this.setState({ movingPiece: position});
          }
        }
      }
    } else {
      this.setState({gameActive: true});
      if((this.state.blackTurn && this.blackContains(position)) || (!this.state.blackTurn && this.redContains(position))) {
        if((this.state.blackTurn && this.state.blackHuman) || (!this.state.blackTurn && this.state.redHuman)) {
          var moves = this.getValidMoves(position);
          if(moves.length > 0) {
            this.setState({ validSpaces: moves });
            this.setState({ movingPiece: position});
            this.setState({ waitingForMove: true });
          }
        }
      }
    }
  }

  //perfrom ai move
  aiMove() {
    if(this.state.gameActive) {
      if((this.state.blackTurn && !this.state.blackHuman) || (!this.state.blackTurn && !this.state.redHuman)) {
        var newBoard = minimax(copyBoard(this.state.board), true, 0, -10000, 10000, this.state.blackTurn );
        this.setState(prevState => ({
          board: {
            ...prevState.board,
            black: [],
            red: []
          }
        }),() => {
          for(var i = 0; i < newBoard.red.length; i++) {
            this.addPiece(newBoard.red[i], false);
          }
          for(i = 0; i < newBoard.black.length; i++) {
            this.addPiece(newBoard.black[i], true);
          }
          if(this.checkWin(this.state.blackTurn)) {
            this.props.handleChange(this.state.blackTurn, true);
          } else {
            this.setState({ blackTurn: !this.state.blackTurn }, () => {
              this.props.handleChange(this.state.blackTurn, false);
            });

          }
        });
      }
    }
  }

  //check if position is a valid move
  isValidMove(position) {
    for(var i = 0; i < this.state.validSpaces.length; i++) {
      if(this.state.validSpaces[i].column === position.column
        && this.state.validSpaces[i].row === position.row) {
          return true;
        }
    }
    return false;
  }

  //check if position is a jump
  isJump(position) {
    for(var i = 0; i < this.state.validSpaces.length; i++) {
      if(this.state.validSpaces[i].column === position.column
        && this.state.validSpaces[i].row === position.row && this.state.validSpaces[i].jump === true) {
          return true;
        }
    }
    return false;
  }

  //get position of a jumped piece
  getJumpedPiece(position) {
    for(var i = 0; i < this.state.validSpaces.length; i++) {
      if(this.state.validSpaces[i].column === position.column
        && this.state.validSpaces[i].row === position.row && this.state.validSpaces[i].jump === true) {
          return this.state.validSpaces[i].jumpedPiece;
        }
    }
    return {row: -1, column: -1};
  }

  //check if position has black piece
  blackContains(position) {
    for (var i = 0; i < this.state.board.black.length; i++) {
      if (this.state.board.black[i].row === position.row && this.state.board.black[i].column === position.column) {
        return true;
      }
    }
    return false;
  }

  //check if position has red piece
  redContains(position) {
    for (var i = 0; i < this.state.board.red.length; i++) {
      if (this.state.board.red[i].row === position.row && this.state.board.red[i].column === position.column) {
        return true;
      }
    }
    return false;
  }

  //get all valid moves from a position
  getValidMoves(position) {
    var moves = [];
    if(this.blackContains(position) || this.redContains(position)) {
      for(var i = -1; i < 2; i++) {
        for(var j = -1; j < 2; j++) {
          if(i !== 0 && j !== 0) {
            var pos = {row: position.row + i, column: position.column + j, jump: false};
            if(!this.blackContains(pos) && !this.redContains(pos)) {
              moves.push(pos);
            }
            var jumpPos = this.getValidJump(position, i, j);
            moves.push(jumpPos);
          }
        }
      }
    }
    return moves;
  }

  //remove piece from board
  removePiece(position, black) {

    if(black === true) {
      for(var i = 0; i < this.state.board.black.length; i++) {
        if(this.state.board.black[i].row === position.row && this.state.board.black[i].column === position.column) {
          this.state.board.black.splice(i, 1);
        }
      }
    } else {
      for(var i = 0; i < this.state.board.red.length; i++) {
        if(this.state.board.red[i].row === position.row && this.state.board.red[i].column === position.column) {
          this.state.board.red.splice(i, 1);
        }
      }
    }
  }

  //add piece to board at position
  addPiece(position, black) {

    if(black === true) {
      this.state.board.black.push(position);
    } else {
      this.state.board.red.push(position);
    }
  }

  //determine if move is valid jump
  getValidJump(curPos, i, j) {
    var newPos = {row: curPos.row + i, column: curPos.column + j};
    var jumpPos = {row: newPos.row + i, column: newPos.column + j, jump: true, jumpedPiece: newPos};
    if(this.blackContains(curPos)) {
      if(this.redContains(newPos) && !this.blackContains(jumpPos) && !this.redContains(jumpPos)) {
        return jumpPos;
      }
    }
    if(this.redContains(curPos)) {
      if(this.blackContains(newPos) && !this.blackContains(jumpPos) && !this.redContains(jumpPos)) {
        return jumpPos;
      }
    }
    return [];
  }

  //determine if either side has won
  checkWin(blackTurn) {
    if (blackTurn === true) {
      return this.state.board.red.length === 0;
    } else {
      return this.state.board.black.length === 0;
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.buttonClick === true) {
      if (nextProps.gameType === 1) {
        this.restart(false);
        this.setState({blackHuman: true, redHuman: true, gameActive: true});
      } else if (nextProps.gameType === 2) {
        this.restart(false);
        this.setState({blackHuman: true, redHuman: false, gameActive: true});
      } else {
        this.restart(true);
        this.setState({blackHuman: false, redHuman: false, gameActive: true});
      }
    }
  }

  restart(aiGame) {
    this.setState(this.copyInitialState(), () => { if(aiGame === true) { this.aiMove(); }});
  }

  //get initial board state
  copyInitialState() {
    var tempState = {
      board: {
        black: [
                {row: 0, column: 1}, {row: 0, column: 3}, {row: 0, column: 5}, {row: 0, column: 7},
                {row: 1, column: 0}, {row: 1, column: 2}, {row: 1, column: 4}, {row: 1, column: 6},
                {row: 2, column: 1}, {row: 2, column: 3}, {row: 2, column: 5}, {row: 2, column: 7}
        ],
        red: [
                {row: 5, column: 0}, {row: 5, column: 2}, {row: 5, column: 4}, {row: 5, column: 6},
                {row: 6, column: 1}, {row: 6, column: 3}, {row: 6, column: 5}, {row: 6, column: 7},
                {row: 7, column: 0}, {row: 7, column: 2}, {row: 7, column: 4}, {row: 7, column: 6}
        ]
      },
      validSpaces: [],
      movingPiece: {row: -1, column: -1},
      blackTurn: true,
      waitingForMove: false,
      validPositionClicked: false,
      blackHuman: true,
      redHuman: false,
      gameActive: false
    }
    return tempState;
  }

  render() {
    var rows = [];
    for(var i = 0; i < 8; i++) {
      rows.push(<Row row={i} key={i}
        board={this.state.board}
        handleSquareClick={this.handleSquareClick}
        validSpaces={this.state.validSpaces} />);
    }
    return <div style={{border: "1px solid black", width: 480, margin:"auto"}}>{rows}</div>;
  }

}

export default Board;
