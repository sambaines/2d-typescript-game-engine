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

let state = {
    previousTime: performance.now(),
    accumulator: 0,
    character: [0, 0],
}

//Set up game loop
function render() {
    if (!context) {
        return;
    }

    context.strokeStyle = 'white';
  
    requestAnimationFrame((timestamp) => {
        const deltaTime = timestamp - state.previousTime;
        state.accumulator += deltaTime;

        while (state.accumulator >= FPS) {
            // do updates
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