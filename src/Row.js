import React, { Component } from 'react';
import Square from './Square';

class Row extends Component {
  constructor(props) {
    super(props);
     this.state = {
       row: 0
     }
  }

  render() {
    var squares = [];
    var colorMod = 1;
    if(this.props.row % 2 === 0) {
      colorMod = 0;
    }

    for(var i = 0; i < 8; i++) {
      squares.push(
        <Square key={i} color={i % 2 === colorMod ? "white" : "gray"}
          hasPiece={false}
          position={{row: this.props.row, column: i}}
          board={this.props.board}
          handleClick={this.props.handleSquareClick}
          validSpaces={this.props.validSpaces}/>
      );
    }

    return <div>{squares}</div>;
  }

}

export default Row;
