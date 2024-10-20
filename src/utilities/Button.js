export default class Button {
    constructor(scene, buttonDTO) {
        this.scene = scene;
        this.buttonDTO = buttonDTO;

        this.createButton();
    }

    createButton() {
        this.button = this.scene.add.text(this.buttonDTO.positionX, this.buttonDTO.positionY, this.buttonDTO.text, {
            fontSize: '24px',
            fill: '#0f0',
            backgroundColor: '#000', 
            padding: { x: 10, y: 5 },
            borderRadius: 5,
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', this.buttonDTO.onClick);

        this.button.on('pointerover', () => {
            this.button.setStyle({ fill: '#ff0' });
            this.button.setShadow(2, 2, '#333333', 2, true, true);
        });
        
        this.button.on('pointerout', () => {
            this.button.setStyle({ fill: '#0f0' });
            this.button.setShadow(); 
        });
    }
}