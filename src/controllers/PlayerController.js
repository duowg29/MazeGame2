
export default class PlayerController {
    constructor(scene, playerDTO, playerSprite, mazeArray) {
        this.scene = scene;
        this.player = playerDTO;
        this.playerSprite = playerSprite;
        this.mazeArray = mazeArray;
        this.currentDirection = null;
        this.isSpacePressed = false;
        this.isMoving = false;
    }

    handleKeyDown(event) {
        if (this.isMoving && !this.isSpacePressed) return;

        const key = event.keyCode;
        if (key === Phaser.Input.Keyboard.KeyCodes.LEFT) {
            this.currentDirection = { x: -1, y: 0 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
            this.currentDirection = { x: 1, y: 0 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.UP) {
            this.currentDirection = { x: 0, y: -1 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.DOWN) {
            this.currentDirection = { x: 0, y: 1 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.SPACE) {
            this.isSpacePressed = true;
        }

        if (this.currentDirection && !this.isMoving) {
            this.movePlayer(this.currentDirection.x, this.currentDirection.y);
            this.isMoving = true;
        }
    }

    handleKeyUp(event) {
        const key = event.keyCode;

        if (key >= Phaser.Input.Keyboard.KeyCodes.LEFT && key <= Phaser.Input.Keyboard.KeyCodes.DOWN) {
            this.isMoving = false;
        }

        if (key === Phaser.Input.Keyboard.KeyCodes.SPACE) {
            this.isSpacePressed = false;
        }
    }

    movePlayer(deltaX, deltaY) {
        const newX = this.player.positionX + deltaX;
        const newY = this.player.positionY + deltaY;

        if (this.mazeArray[newY] && this.mazeArray[newY][newX]) {
            this.player.positionX = newX;
            this.player.positionY = newY;
            this.playerSprite.setPosition(newX * 30, newY * 30);
            this.scene.checkWin();  
        }

        this.scene.powerUps.collectPowerUp(this.player);

    }

    update() {
            if (this.isSpacePressed && this.currentDirection) {
            this.movePlayer(this.currentDirection.x, this.currentDirection.y);
        }
    }
}