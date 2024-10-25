import { WallDTO } from '../dto/WallDTO';
import  MazeLevels from '../Level/MazeLevels';

export class MazeGenerator {
    static loadMaze(level) {
        if (typeof level === 'number' && level > 0 && level <= MazeLevels.length) {
            console.log(`Loading maze for level ${level}:`, MazeLevels[level - 1]);
            return MazeLevels[level - 1];
        } else {
            console.error(`Level ${level} không tồn tại trong MazeLevels.`);
            return null;
        }
    }

    static drawMaze(scene) {
        if (!Array.isArray(scene.mazeArray) || scene.mazeArray.length === 0) {
            console.error("mazeArray không hợp lệ hoặc rỗng.");
            return;
        }

        scene.children.list.forEach(child => {
            if (child && child.name === 'wall') {
                child.destroy();
            }
        });

        for (let y = 0; y < scene.mazeArray.length; y++) {
            if (!Array.isArray(scene.mazeArray[y])) continue;

            for (let x = 0; x < scene.mazeArray[y].length; x++) {
                if (scene.mazeArray[y][x] === 1) {
                    const wall = new WallDTO('wall', x, y);
                    scene.add.image(wall.wallX * 30, wall.wallY * 30, 'wall')
                        .setOrigin(0, 0)
                        .setDisplaySize(30, 30)
                        .setName(wall.key);
                    console.log(`Wall added at: (${wall.wallX}, ${wall.wallY})`);
                }
            }
        }
    }
}
