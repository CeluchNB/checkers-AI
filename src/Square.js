import React , { Component } from 'react';
import Piece from './Piece';

class Square extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: { black: [], red: [] }
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.position);
  }

  blackContains(position) {
    for (var i = 0; i < this.state.board.black.length; i++) {
      if (this.state.board.black[i].row === position.row && this.state.board.black[i].column === position.column) {
        return true;
      }
    }
    return false;
  }

  redContains(position) {
    for (var i = 0; i < this.state.board.red.length; i++) {
      if (this.state.board.red[i].row === position.row && this.state.board.red[i].column === position.column) {
        return true;
      }
    }
    return false;
  }

  componentDidMount() {
    this.setState({board: this.props.board});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({board: nextProps.board});
  }

  isValidMove() {
    for(var i = 0; i < this.props.validSpaces.length; i++) {
      if(this.props.validSpaces[i].column === this.props.position.column
        && this.props.validSpaces[i].row === this.props.position.row) {
          return true;
        }
    }
    return false;
  }

  render() {

    return (
      <div style={{width: 60, height: 60,
        backgroundColor: this.isValidMove() ? "green" : this.props.color,
        display: "inline-flex"}}
        onClick={this.handleClick}>
          {(this.blackContains(this.props.position) && <Piece color="black"/>)
          || (this.redContains(this.props.position) && <Piece color="red"/>)}
      </div>
    );
  }

}

export default Square;
