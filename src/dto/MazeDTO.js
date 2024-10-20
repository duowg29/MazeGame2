export class MazeDTO {
    constructor(key, name, levelKey, goalX, goalY, duration) {
        this.key = key;
        this.name = name;
        this.levelKey = levelKey;  
        this.goalX = goalX;   
        this.goalY = goalY;   
        this.duration = duration;
    }
}