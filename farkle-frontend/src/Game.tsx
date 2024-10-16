import React, { useState } from 'react';
import './styles.css';

const initialDice: number[] = [0, 0, 0, 0, 0, 0];
const calculateScore = (keptDice: number[]): number => {
    let points = 0;
    const counts = Array(7).fill(0);
    keptDice.forEach((die) => {
        counts[die]++;
    });

    if (counts[1] === 1) {
        points += 100;
    }
    if (counts[5] === 1) {
        points += 50;
    }

    for (let i = 1; i <= 7; i++) {
        if (counts[i] < 3) {
            continue;
        } else if (counts[i] === 3) {
            points += i === 1 ? 1000 : i * 100;
        } else if (counts[i] === 4) {
            points += i === 1 ? 2000 : i * 200;
        } else if (counts[i] === 5) {
            points += i === 1 ? 4000 : i * 400;
        } else if (counts[i] === 6) {
            points += i === 1 ? 8000 : i * 800;
        }
    }

    return points;
};

const Home: React.FC = () => {
    const [dice, setDice] = useState<number[]>(initialDice);
    const [keptDice, setKeptDice] = useState<boolean[]>([false, false, false, false, false, false]);
    const [turnScore, setTurnScore] = useState<number>(0);
    const [playerScores, setPlayerScores] = useState<number[]>([0, 0]);
    const [currentTurn, setCurrentTurn] = useState<number>(0); // 0 for player 1, 1 for player 2
    const [gameOver, setGameOver] = useState<boolean>(false);

    const rollDice = () => {
        const newDice = dice.map((die, index) =>
            !keptDice[index] ? Math.ceil(Math.random() * 6) : die
        );
        setDice(newDice);
    };

    const keepDice = (index: number) => {
        const newKeptDice = [...keptDice];
        newKeptDice[index] = !newKeptDice[index]; // A kocka kiválasztásának/eltávolításának lehetősége

        setKeptDice(newKeptDice);

        const keptValues = dice.filter((_, i) => newKeptDice[i]);
        const newScore = calculateScore(keptValues);

        setTurnScore(newScore);
    };

    const endTurn = () => {
        const newScores = [...playerScores];
        newScores[currentTurn] += turnScore;

        setPlayerScores(newScores);
        setTurnScore(0);
        setKeptDice([false, false, false, false, false, false]);
        setDice(initialDice);

        if (newScores[currentTurn] >= 5000) {
            setGameOver(true);
        } else {
            setCurrentTurn((currentTurn + 1) % 2); // Switch turn
        }
    };

    const resetGame = () => {
        setPlayerScores([0, 0]);
        setCurrentTurn(0);
        setTurnScore(0);
        setDice(initialDice);
        setKeptDice([false, false, false, false, false, false]);
        setGameOver(false);
    };

    return (
        <div className="game-container">
            <h1 className="game-title">Farkle</h1>
            {gameOver ? (
                <div className="game-over">
                    <h2>Player {currentTurn + 1} wins the kingdom!</h2>
                    <button onClick={resetGame} className="restart-btn btn">Restart Quest</button>
                </div>
            ) : (
                <div className="game-play">
                    <h2>Player {currentTurn + 1}'s Turn</h2>
                    <p>Turn Score: {turnScore}</p>
                    <div className="dice-container">
                        {dice.map((die, index) => (
                            <button
                                key={index}
                                className={`dice-button ${keptDice[index] ? 'held' : ''}`}
                                onClick={() => keepDice(index)}
                            >
                                {die}
                            </button>
                        ))}
                    </div>
                    <button onClick={rollDice} className="roll-btn btn">Roll Dice</button>
                    <button onClick={endTurn} className="turn-btn btn">End Turn</button>
                </div>
            )}
            <div className="scoreboard">
                <div className={`score ${currentTurn === 0 ? 'current-player' : ''}`}>
                    <h3>Player 1</h3>
                    <p>{playerScores[0]}</p>
                </div>
                <div className={`score ${currentTurn === 1 ? 'current-player' : ''}`}>
                    <h3>Player 2</h3>
                    <p>{playerScores[1]}</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
