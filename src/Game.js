import React, { Component } from 'react';
import Board from './Board';

class Game extends Component  {

  constructor(props) {
    super(props);
    this.state = { message: "Black's turn", gameType: 1, buttonClick: false };
    this.handleStateChange = this.handleStateChange.bind(this);
    this.startHvH = this.startHvH.bind(this);
    this.startHvAI = this.startHvAI.bind(this);
    this.startAIvAI = this.startAIvAI.bind(this);


  }

  handleStateChange = (blackTurn, isWin) => {
    this.setState({buttonClick: false});
    console.log(this.state.gameType);
    if(blackTurn === true && isWin === false) {
      this.setState({ message: "Black's turn" });
    } else if (blackTurn === false && isWin === false) {
      this.setState({ message: "Red's turn" });
    } else if (blackTurn === true && isWin === true) {
      this.setState({ message: "Black wins" });
    } else {
      this.setState({ message: "Red wins" });
    }
    if(this.state.gameType === 3) {
      if(isWin !== true) {
        this.setState({ message: "Click on board for next move" });
      }
      return;
    }
  }

  startHvH() {
    this.setState({gameType: 1, buttonClick: true, message: "Black's Turn"});
  }

  startHvAI() {
    this.setState({gameType: 2, buttonClick: true, message: "Black's Turn"});
  }

  startAIvAI() {
    this.setState({gameType: 3, buttonClick: true, message: "Black's Turn"})
  }

  render() {
    return (
      <div className="App" >
        <h1 style={{margin: "auto", width: 350, padding: "1rem"}}>Human v. AI Checkers</h1>
        <Board handleChange={this.handleStateChange} gameType={this.state.gameType} buttonClick={this.state.buttonClick}/>
        <h3 id="message" style={{margin: "auto", width: 150}}>{this.state.message}</h3>
        <div id="buttons" style={{width: 350, margin: "auto"}}>
          <button onClick={this.startHvH} style={{margin: "0.5rem"}}>Human vs. Human</button>
          <button onClick={this.startHvAI} style={{margin: "0.5rem"}}>Human vs. AI</button>
          <button onClick={this.startAIvAI} style={{margin: "0.5rem"}}>AI vs. AI</button>
        </div>
      </div>
    );
  }
}

export default Game;
