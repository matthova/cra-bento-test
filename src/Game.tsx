import React from 'react';
import styled from 'styled-components';

import { Dot } from './Dot';

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
};

export class Game extends React.Component<Props, State> {
    nWaypoints = 10;
    waypointSize = 50;
    timerInterval: number | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            waypoints: this.generateWaypoints(),
            startTime: new Date(),
            timer: 0
        }
    }

    componentDidMount() {
        this.timerInterval = setInterval(() => {
            this.setState({ timer: new Date().getTime() - this.state.startTime.getTime() })
        }, 10);
    }

    componentDidUpdate() {
        if (this.timerInterval && !this.state.waypoints.find(w => !w.checked)) {
            this.stopTimer();
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    generateWaypoints = () => {
        const waypoints = [];
        for (let i = 0; i < this.nWaypoints; i++) {
            waypoints.push({
                x: Math.random() * (window.innerWidth - this.waypointSize) + this.waypointSize / 2,
                y: Math.random() * (window.innerHeight - this.waypointSize) + this.waypointSize / 2,
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
            <>
                <div>{Number(this.state.timer / 1000).toFixed(3)}</div>
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
                <Dot onUpdate={this.updateDot} />
            </>
        );
    }
}