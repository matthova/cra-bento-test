import React from 'react';
import { Dot } from './Dot';

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
                    <div key={waypoint.x} style={{ position: 'absolute', top: waypoint.y, left: waypoint.x }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'absolute', top: -this.waypointSize / 2, left: -this.waypointSize / 2, width: this.waypointSize, height: this.waypointSize, borderRadius: '50%', background: currentWaypoint && currentWaypoint.x === waypoint.x ? 'cyan' : waypoint.checked ? 'grey' : 'blue' }}>
                            {index + 1}
                        </div>
                    </div>
                ))}
                <Dot onUpdate={this.updateDot} />
            </>
        );
    }
}