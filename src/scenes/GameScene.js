import { MazeGenerator } from '../services/MazeGenerator';
import { Timer } from '../utilities/Timer';
import { PlayerDTO } from '../dto/PlayerDTO';
import { PowerUp } from '../controllers/PowerUpManager';
import SoundManager from '../utilities/SoundManager';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';
import { LevelDTO } from '../dto/LevelDTO'; 
import PlayerController from '../controllers/PlayerController'; 
import Utils from '../utilities/Utils'; 

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.mazeArray = [];
        this.score = 0;
        this.scoreText = null;
        this.soundManager = null;
        this.isSpacePressed = false;
        this.currentDirection = null;
        // Bắt đầu từ Level 1 với kích thước 10x10
        this.level = new LevelDTO('Level', 10, 10, 1);
        this.gameOver = false;
    }

    init(data) {
        this.selectedCharacter = data.character;
        if (!this.selectedCharacter) {
            console.error('selectedCharacter is undefined. Make sure it is passed correctly from the previous scene.');
        }
    }

    preload() {
        this.load.image('wall', 'assets/img/wall.png');
        console.log('Loading wall image...');
        this.load.image(this.selectedCharacter.avatar, 'assets/img/' + this.selectedCharacter.avatar + '.png');
        this.load.image('goal', 'assets/img/earth.png');
        this.load.image('scorePowerUp', 'assets/img/scorePowerUp.png');
        this.load.image('timePowerUp', 'assets/img/timePowerUp.png');
        this.soundManager = new SoundManager(this, ['gameMusic', 'scoreSound']);
        this.soundManager.preload();
    }

    create() {
        this.scoreText = this.add.text(10, 650, `Score: ${this.score}`, textStyle2);
        this.tipsText = this.add.text(150, 650, 'SPACE + MOVE = DASH', textStyle2);
        
        if (!this.soundManager.isPlaying('gameMusic')) {
            this.soundManager.play('gameMusic', true);
        }
        console.log("1");

        this.timer = new Timer(this, 10, this.endGame.bind(this));
        this.timer.start();
        console.log("2");

        this.input.keyboard.on('keydown', function(event) {
            if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.LEFT && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.DOWN) {
                event.preventDefault(); 
            }
        });

        console.log("3");
        this.createNewLevel();
        this.playerController = new PlayerController(this, this.player, this.playerSprite, this.mazeArray);
        console.log("4");
        this.input.keyboard.on('keydown', this.playerController.handleKeyDown.bind(this.playerController), this);
        this.input.keyboard.on('keyup', this.playerController.handleKeyUp.bind(this.playerController), this);
        console.log("5");
    }

    update() {
        if (this.gameOver) return;  
        this.playerController.update();
    }

    checkWin() {
        if (this.player.positionX === this.goal.x / 30 && this.player.positionY === this.goal.y / 30) {
            this.updateScore(1);
            this.soundManager.play('scoreSound', false);
            this.checkLevelUp();
            this.resetGame();
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    createNewLevel() {
        const levelNumber = this.level.levelNumber; 
        console.log("MazeLevels:", levelNumber);
    
        if (levelNumber < 1 || levelNumber > 11) {
            console.error(`Level ${levelNumber} không tồn tại.`);
            return;
        }
    
        this.mazeArray = MazeGenerator.loadMaze(levelNumber);
        console.log("mazeArray after loading:", this.mazeArray);
    
        if (!Array.isArray(this.mazeArray) || this.mazeArray.length === 0 || !this.mazeArray.some(row => row.some(cell => cell !== undefined && cell !== null))) {
            console.error("mazeArray không hợp lệ hoặc rỗng sau khi tải.");
            return;
        }
    
        console.log("6");
        console.log("Before drawing maze");
        MazeGenerator.drawMaze(this);
        console.log("After drawing maze");
        console.log("7");

        this.mazeArray.forEach((row, index) => {
            console.log(`Row ${index}:`, row);
        });

        let playerPos, goalPos;
        do {
            playerPos = Utils.getRandomPosition(this.mazeArray);
        } while (this.mazeArray[playerPos.y][playerPos.x] === 1);
        console.log("Player Position:", playerPos);
    
        do {
            goalPos = Utils.getRandomPosition(this.mazeArray);
        } while ((goalPos.x === playerPos.x && goalPos.y === playerPos.y) || this.mazeArray[goalPos.y][goalPos.x] === 1);
        console.log("Goal Position:", goalPos);

        console.log("8");

        this.goal = this.add.image(goalPos.x * 30, goalPos.y * 30, 'goal').setOrigin(0, 0).setDisplaySize(30, 30);
        
        this.player = new PlayerDTO('player', this.selectedCharacter.name, playerPos.x, playerPos.y, 0);
        this.playerSprite = this.add.sprite(this.player.positionX * 30, this.player.positionY * 30, this.selectedCharacter.avatar)
            .setOrigin(0, 0)
            .setDisplaySize(30, 30);
        console.log("9");

        this.powerUps = new PowerUp(this, this.mazeArray);
        this.powerUps.timer = this.timer;
        console.log("10");

    }

    resetGame() {        
        this.timer.reset(10);
        this.scene.restart({ character: this.selectedCharacter });

        this.children.list.forEach(child => {
            if (child && child.name === 'wall') {
                child.destroy();
            }
        });

        this.powerUps.collectPowerUp(this.player);

        this.powerUps.activePowerUps.forEach(powerUp => {
            if (powerUp && powerUp.sprite) {
                powerUp.sprite.destroy();
            }
        });
        this.powerUps.activePowerUps = [];

        if (this.level.levelNumber < 11) {
            this.checkLevelUp();
        }
        
        this.createNewLevel();
    }

    checkLevelUp() {
        if (this.level.levelNumber < 11) {
            this.level.levelNumber += 1;
            this.level.cols += 1; 
            this.level.rows += 1; 
        }
    }

    endGame() {
        this.gameOver = true;
        this.soundManager.stop('gameMusic');
        this.timer.stop();

        this.scene.start('GameOverScreen', { score: this.score, character: this.selectedCharacter });
    }
}
