const FPS = 1000 / 60;

const tileSize = 16;
const columns = 64;
const rows = 48;
const mapWidth = columns * tileSize;
const mapHeight = rows * tileSize;

const canvas = document.createElement('canvas') as HTMLCanvasElement;

canvas.width = mapWidth;
canvas.height = mapHeight;

const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const app = document.getElementById('app') as HTMLDivElement;
app?.appendChild(canvas);

type GameEvent = {
    type: 'playerMove',
    direction: 'up' | 'down' | 'left' | 'right',
};

let state: {
    previousTime: number,
    accumulator: number,
    character: [number, number],
    eventQueue: GameEvent[],
} = {
    previousTime: performance.now(),
    accumulator: 0,
    character: [0, 0],
    eventQueue: [],
}

type Message = {
    type: 'playerQueueEvent',
    event: GameEvent,
};

const messageQueue: Message[] = [];

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            messageQueue.push({
                type: 'playerQueueEvent',
                event: { type: 'playerMove', direction: 'up'}
            })
            break;
        case 'ArrowDown':
            messageQueue.push({
                type: 'playerQueueEvent',
                event: { type: 'playerMove', direction: 'down'}
            })
            break;
        case 'ArrowLeft':
            messageQueue.push({
                type: 'playerQueueEvent',
                event: { type: 'playerMove', direction: 'left'}
            })
            break;
        case 'ArrowRight':
            messageQueue.push({
                type: 'playerQueueEvent',
                event: { type: 'playerMove', direction: 'right'}
            })
            break;
    }
})

//Set up game loop
function render() {
    if (!context) {
        return;
    }

    context.strokeStyle = 'white';
  
    requestAnimationFrame((timestamp) => {
        //pull message queue
        const messages = messageQueue.splice(0, messageQueue.length);
        messages.forEach((msg) => {
            switch (msg.type) {
                case 'playerQueueEvent':
                    state.eventQueue.push(msg.event);
                break;
            }
        })

        const deltaTime = timestamp - state.previousTime;
        state.accumulator += deltaTime;

        while (state.accumulator >= FPS) {
            //pull event queue
            const events = state.eventQueue.splice(0, state.eventQueue.length);
            events.forEach((event) => {
                switch (event.type) {
                    case 'playerMove':
                        let newX = state.character[0];
                        let newY = state.character[1];

                        if (event.direction === 'up') {
                            newY = Math.max(0, state.character[1] - 1);
                        } else if (event.direction === 'down') {
                            newY = Math.min(rows - 1, state.character[1] + 1);
                        }

                        state.character = [newX, newY];
                    break;
                }
            })

            // renders map and characters
            for (let tileColNum = 0; tileColNum < columns; tileColNum++) {
                for (let tileRowNum = 0; tileRowNum < rows; tileRowNum++) {
                    //CANVAS ALWAYS DRAWS BACK TO FRONT (TRY REORDERING IF SOMETHNG IS HIDDEN)
                    //draws individual tiles
                    context.fillStyle = '#f5e1e2';
                    context.fillRect(
                        tileColNum * tileSize,
                        tileRowNum * tileSize,
                        tileSize,
                        tileSize
                    );
                    //draws stroke for individual tiles
                    context.strokeRect(
                        tileColNum * tileSize,
                        tileRowNum * tileSize,
                        tileSize,
                        tileSize
                    );

                    //renders character marker
                    if (
                        state.character.at(0) === tileColNum && 
                        state.character.at(1) === tileRowNum
                    ) {
                        context.fillStyle = '#bd1434';
                        context.fillRect(
                            tileColNum * tileSize,
                            tileRowNum * tileSize,
                            tileSize,
                            tileSize
                        );
                    }
                }
            }

            // decrement accumulator by FPS to end loop
            state.accumulator -= FPS;
        }

        state.previousTime = timestamp;
        render();
  });
}

render();