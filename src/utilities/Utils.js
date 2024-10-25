export default class Utils {
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static getRandomPosition(maze) {
        if (!Array.isArray(maze) || maze.length === 0 || !Array.isArray(maze[0])) {
            console.error("Maze không hợp lệ hoặc rỗng.");
            return { x: 1, y: 1 }; // Trả về vị trí mặc định nếu maze không hợp lệ
        }
    
        let x, y;
        do {
            x = Math.floor(Math.random() * (maze[0].length - 2)) + 1;
            y = Math.floor(Math.random() * (maze.length - 2)) + 1;
        } while (!maze[y][x]);
    
        return { x, y };
    }
};
