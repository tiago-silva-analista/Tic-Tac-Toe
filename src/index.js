import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className='button'
            onClick={props.onClick}> {/*Applying arrou functions concepts */}
            {props.value}
        </button>
    );
}


class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    test() {

    }

    render() {

        return (
            <>
                {
                    this.props.squares.map((currElement, index) => (

                        <div key={index} className={this.props.winners && this.props.winners.includes(index) ? 'box-green' : 'box'}>
                            {this.renderSquare(index)}</div>
                    ))
                }
            </>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            winnerPositions: Array(3).fill(null),
        };
        this.onReset = this.onReset.bind(this);
    }

    onReset() {

        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            winnerPositions: Array(3).fill(null),
        });

    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        console.log('this.state.stepNumber - ' + this.state.stepNumber);
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];

        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <>
            <div className="column">
                <div className="game-board">
                <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winners={winner}                        
                    />
                </div>
            </div>
            <div className="column">
                <div className="game-info">
                    <div>{status}</div>
                    <ol className="moves">{moves}</ol>
                    <ol><button onClick={this.onReset}>Reset</button></ol>
                </div>
            </div>
           </>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0, len = lines.length; i < len; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            
            return [a,b,c]; //return the positions winners
        }
    }
    return null;
}