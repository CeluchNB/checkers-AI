import React, { Component } from 'react';

class Piece extends Component  {

  constructor(props) {
    super(props);

  }

  render() {
    return <div style={{width: 50, height: 50, borderRadius: 25, backgroundColor: this.props.color, margin: "auto"}}></div>
  }
}

export default Piece;
