import { textStyle1, textStyle2 } from '../utilities/TextStyle';

export class Timer {
    constructor(scene, timeInSeconds, onComplete) {
        this.scene = scene;
        this.timeInSeconds = timeInSeconds;
        this.remainingTime = timeInSeconds;
        this.onComplete = onComplete;
        this.timerText = this.scene.add.text(10, 620, `Time: ${this.remainingTime}`, textStyle2);
        this.timerEvent = null;
    }

    start() {
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.remainingTime -= 1;
        this.timerText.setText(`Time: ${this.remainingTime}`);
        if (this.remainingTime <= 0) {
            this.timerEvent.remove(false);
            this.onComplete();
        }
    }

    reset(newTimeInSeconds) {
        this.remainingTime = newTimeInSeconds || this.timeInSeconds;
        this.timerText.setText(`Time: ${this.remainingTime}`);
    }

    stop() {
        if (this.timerEvent) {
            this.timerEvent.remove(false);
        }
    }
    addTime(seconds) {
        this.remainingTime += seconds;
        this.timerText.setText(`Time: ${this.remainingTime}`);
    }
}
