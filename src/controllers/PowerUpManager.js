import { PowerUpDTO } from '../dto/PowerUpDTO';
import PlayerController from '../controllers/PlayerController'; 
import Utils from '../utilities/Utils'; 


export class PowerUp {
    constructor(scene, mazeArray) {
        this.scene = scene;
        this.mazeArray = mazeArray;

        this.powerUps = [
            new PowerUpDTO('scorePowerUp', 'Score PowerUp', this.increaseScore.bind(this), 1), // Cộng 1 điểm
            new PowerUpDTO('timePowerUp', 'Time PowerUp', this.increaseTime.bind(this), 10) // Cộng thêm 10 giây
        ];

        this.activePowerUps = [];
        this.generateRandomPowerUps();
    }

    generateRandomPowerUps() {
        const usedPositions = new Set();
    
        for (let i = 0; i < 2; i++) {
            let randomPos;
    
            do {
                randomPos = Utils.getRandomPosition(this.mazeArray); 
            } while (usedPositions.has(`${randomPos.x},${randomPos.y}`) || this.mazeArray[randomPos.y][randomPos.x] === 1); // Kiểm tra nếu là tường
    
            usedPositions.add(`${randomPos.x},${randomPos.y}`);
    
            const powerUpType = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
            const powerUpSprite = this.scene.add.image(randomPos.x * 30, randomPos.y * 30, powerUpType.key)
                .setOrigin(0, 0)
                .setDisplaySize(30, 30);
    
                this.activePowerUps.push({
                sprite: powerUpSprite,
                powerUp: powerUpType,
                position: randomPos
            });
        }
    }
    
    collectPowerUp(player) {
        this.activePowerUps.forEach((powerUpObj, index) => {
            if (player.positionX === powerUpObj.position.x && player.positionY === powerUpObj.position.y) {
                powerUpObj.powerUp.effect.call(this.scene);

                powerUpObj.sprite.destroy();
                this.activePowerUps.splice(index, 1);
            }
        });
    }

    increaseScore() {
        this.scene.updateScore(1);
    }

    increaseTime() {
        if (this.scene.timer) {
            this.scene.timer.addTime(10);
        }
    }
}
