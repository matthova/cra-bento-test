import React from 'react';

const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};

type State = {
    speedX: number,
    speedY: number,
    positionX: number,
    positionY: number,
    keysPressed: Array<any>,
}

export class Game extends React.Component<any, State> {
    animationInterval: number | null = null;
    acceleration: number = 0.1;
    deceleration: number = 0.3;
    decay: number = 0.05;
    size: number = 20;

    constructor(props: any) {
        super(props);

        this.animationInterval = null;
        this.state = {
            speedX: 0,
            speedY: 0,
            positionX: window.innerWidth / 2,
            positionY: window.innerHeight / 2,
            keysPressed: []
        }
    }
    handleKeyDown = (e: KeyboardEvent) => {
        if (Object.values(KEYS).includes(e.keyCode)) {
            this.setState(prevState => ({ keysPressed: [...prevState.keysPressed, e.keyCode] }))
        }
    }

    handleKeyUp = (e: KeyboardEvent) => {
        this.setState(prevState => ({ keysPressed: prevState.keysPressed.filter(key => key !== e.keyCode) }));
    }

    updatePosition = () => {
        const newState = { ...this.state };

        if (this.state.keysPressed.includes(KEYS.UP)) {
            newState.speedY -= this.state.speedY < 0 ? this.acceleration : this.deceleration;
        }
        if (this.state.keysPressed.includes(KEYS.DOWN)) {
            newState.speedY += this.state.speedY > 0 ? this.acceleration : this.deceleration;
        }
        if (this.state.keysPressed.includes(KEYS.LEFT)) {
            newState.speedX -= this.state.speedX < 0 ? this.acceleration : this.deceleration;
        }
        if (this.state.keysPressed.includes(KEYS.RIGHT)) {
            newState.speedX += this.state.speedX > 0 ? this.acceleration : this.deceleration;
        }

        // Slow down Y axis if not being pressed
        if (
            !this.state.keysPressed.includes(KEYS.UP) &&
            !this.state.keysPressed.includes(KEYS.DOWN) &&
            this.state.speedY !== 0
        ) {
            if (this.state.speedY > 0) {
                newState.speedY -= this.acceleration;
            } else {
                newState.speedY += this.acceleration;
            }
        }

        // Slow down X axis if not being pressed
        if (
            !this.state.keysPressed.includes(KEYS.LEFT) &&
            !this.state.keysPressed.includes(KEYS.RIGHT) &&
            this.state.speedX !== 0
        ) {
            if (this.state.speedX > 0) {
                newState.speedX -= this.acceleration;
            } else {
                newState.speedX += this.acceleration;
            }
        }

        newState.positionX = this.state.positionX + this.state.speedX;
        newState.positionY = this.state.positionY + this.state.speedY;

        // lock in the speeds
        if (Math.abs(newState.speedX) < this.decay) {
            newState.speedX = 0;
        }
        if (Math.abs(newState.speedY) < this.decay) {
            newState.speedY = 0;
        }

        // build in the walls
        // left wall
        if (newState.positionX < this.size / 2) {
            newState.positionX = this.size / 2;
            newState.speedX = 0;
        }
        // right wall
        if (newState.positionX > window.innerWidth - this.size / 2) {
            newState.positionX = window.innerWidth - this.size / 2;
            newState.speedX = 0;
        }
        // top wall
        if (newState.positionY < this.size / 2) {
            newState.positionY = this.size / 2;
            newState.speedY = 0;
        }

        // bottom wall
        if (newState.positionY > window.innerHeight - this.size / 2) {
            newState.positionY = window.innerHeight - this.size / 2;
            newState.speedY = 0;
        }

        this.setState(newState);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        this.animationInterval = setInterval(this.updatePosition, 20);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        clearInterval(Number(this.animationInterval));
    }

    render() {
        const { positionX, positionY } = this.state;
        return (
            <div style={{ position: 'absolute', top: positionY, left: positionX }}>
                <div style={{ background: 'red', position: 'absolute', top: -this.size / 2, left: -this.size / 2, width: this.size, height: this.size }} />
            </div>
        );
    }
}