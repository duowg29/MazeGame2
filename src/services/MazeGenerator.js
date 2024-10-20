import { WallDTO}  from '../dto/WallDTO';

export class MazeGenerator {
    static generateMaze(rows, cols) {
        const maze = new Array(rows + 2).fill(0).map(() => new Array(cols + 2).fill(false));

        const directions = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },  
            { x: 0, y: 1 },  
            { x: -1, y: 0 }  
        ];

        function isValid(x, y) {
            return x > 0 && y > 0 && x < cols + 1 && y < rows + 1; 
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function carve(x, y) {
            maze[y][x] = true;
            shuffle(directions);

            directions.forEach(dir => {
                const newX = x + dir.x * 2;
                const newY = y + dir.y * 2;
                if (isValid(newX, newY) && !maze[newY][newX]) {
                    maze[y + dir.y][x + dir.x] = true;
                    carve(newX, newY);
                }
            });
        }

        for (let i = 0; i < cols + 2; i++) {
            maze[0][i] = false; 
            maze[rows + 1][i] = false;
        }
        for (let i = 0; i < rows + 2; i++) {
            maze[i][0] = false;
            maze[i][cols + 1] = false;
        }

        carve(1, 1);

        return maze;
    }

    static drawMaze(scene) {
        scene.children.list.forEach(child => {
            if (child && child.name === 'wall') {
                child.destroy();
            }
        });

        for (let y = 0; y < scene.mazeArray.length; y++) {
            for (let x = 0; x < scene.mazeArray[y].length; x++) {
                if (!scene.mazeArray[y][x]) {
                    const wall = new WallDTO('wall', x, y);
                    scene.add.image(wall.wallX * 30, wall.wallY * 30, 'wall')
                        .setOrigin(0, 0)
                        .setDisplaySize(30, 30)
                        .setName(wall.key);
                }
            }
        }
    }
}
