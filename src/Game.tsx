import React from 'react';
import styled from 'styled-components';

import { Dot } from './Dot';

const GameContainer = styled.div<any>`
    display: flex;
    flex-direction: column;
    background: whitesmoke;
    height: 100%;
`;

const Countdown = styled.div<any>`
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 80px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const GameControls = styled.div<any>`
    height: 100px;
    background: #dddddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid black;
    box-sizing: border-box;
`;

const GameCanvas = styled.div<any>`
    flex: 1;
`;

const WaypointWrapper = styled.div<any>`
    position: absolute;
    top: ${p => p.waypoint.y}px;
    left: ${p => p.waypoint.x}px;
`;

const Waypoint = styled.div<any>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    position: absolute;
    top: -${p => p.size / 2}px;
    left: -${p => p.size / 2}px;
    width: ${p => p.size}px;
    height: ${p => p.size}px;
    border-radius: 50%;
    background: ${p => p.isCurrentWaypoint ? 'cyan' : p.waypoint.checked ? 'grey' : 'blue'};
`;

type Props = {

};

type Waypoint = {
    x: number,
    y: number,
    checked: boolean
};

type State = {
    waypoints: Array<Waypoint>;
    startTime: Date;
    timer: number;
    gameState: string;
    countdown: string;
    bestTime: number | null;
};

const GAME_STATES = {
    OFF: 'OFF',
    STARTING: 'STARTING',
    ON: 'ON'
};

export class Game extends React.Component<Props, State> {
    nWaypoints = 5;
    waypointSize = 50;
    timerInterval: number | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            waypoints: [],
            startTime: new Date(),
            timer: 0,
            gameState: GAME_STATES.OFF,
            countdown: '',
            bestTime: localStorage.getItem('checkpoint-game-best-time') ? Number(localStorage.getItem('checkpoint-game-best-time')) : null
        }
    }

    componentDidMount() {
        this.timerInterval = setInterval(() => {
            if (this.state.gameState === GAME_STATES.ON) {
                this.setState({ timer: new Date().getTime() - this.state.startTime.getTime() })
            }
        }, 10);
    }

    componentDidUpdate() {
        if (this.timerInterval && !this.state.waypoints.find(w => !w.checked)) {
            this.stopTimer();
            this.updateBestTime();
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    updateBestTime = () => {
        if (!this.state.bestTime || this.state.timer < this.state.bestTime) {
            this.setState({ bestTime: this.state.timer });
            localStorage.setItem('checkpoint-game-best-time', String(this.state.timer));
        }
    }
    startGame = () => {
        const newWaypoints = this.generateWaypoints();
        this.setState({
            waypoints: newWaypoints,
            startTime: new Date(),
            timer: 0,
            gameState: GAME_STATES.STARTING,
            countdown: '3'
        });

        setTimeout(() => {
            this.setState({ countdown: '2' })
        }, 1000);

        setTimeout(() => {
            this.setState({ countdown: '1' })
        }, 2000);

        setTimeout(() => {
            this.setState({
                startTime: new Date(),
                gameState: GAME_STATES.ON,
                countdown: ''
            });
        }, 3000)
    }

    generateWaypoints = () => {
        const waypoints = [];
        for (let i = 0; i < this.nWaypoints; i++) {
            waypoints.push({
                x: Math.random() * (window.innerWidth - this.waypointSize) + this.waypointSize / 2,
                y: 100 + Math.random() * (window.innerHeight - this.waypointSize - 100) + this.waypointSize / 2,
                checked: false
            });
        }
        return waypoints;
    }

    updateDot = (position: { x: number, y: number }) => {
        const currentWaypoint = this.state.waypoints.find(w => !w.checked);
        if (!currentWaypoint) {
            return;
        }
        if (Math.abs(position.x - currentWaypoint.x) < this.waypointSize / 2 && Math.abs(position.y - currentWaypoint.y) < this.waypointSize / 2) {
            this.setState(prevState => ({
                waypoints: prevState.waypoints.map(w => ({
                    ...w,
                    checked: w.x === currentWaypoint.x ? true : w.checked
                }))
            }))
        }
    }

    stopTimer() {
        clearInterval(Number(this.timerInterval));
    }

    render() {
        const currentWaypoint = this.state.waypoints.find(w => !w.checked);

        return (
            <GameContainer>
                <Countdown>{this.state.countdown}</Countdown>
                <GameControls>
                    <button style={{ padding: 10, borderRadius: 8 }} onClick={this.startGame}>Start</button>
                    <h1>🏁 Checkpoint 🏁</h1>
                    <div>
                        <div>Time: {Number(this.state.timer / 1000).toFixed(3)} s</div>
                        <div>Best Time: {this.state.bestTime ? `${Number(this.state.bestTime / 1000).toFixed(3)} s` : 'n/a'}</div>
                    </div>
                </GameControls>
                <GameCanvas>
                    {this.state.waypoints.map((waypoint, index) => (
                        <WaypointWrapper key={waypoint.x} waypoint={waypoint}>
                            <Waypoint
                                size={this.waypointSize}
                                waypoint={waypoint}
                                isCurrentWaypoint={currentWaypoint && waypoint.x === currentWaypoint.x}
                            >
                                {index + 1}
                            </Waypoint>
                        </WaypointWrapper>
                    ))}
                    <Dot frozen={this.state.gameState !== GAME_STATES.ON} onUpdate={this.updateDot} />
                </GameCanvas>
            </GameContainer >
        );
    }
}