export class ButtonDTO {
    constructor(key, text, positionX, positionY, onClick) {
        this.key = key;
        this.text = text;
        this.positionX = positionX;
        this.positionY = positionY;
        this.onClick = onClick; 
    }
}