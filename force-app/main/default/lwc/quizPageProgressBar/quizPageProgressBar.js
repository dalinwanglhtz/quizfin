import { LightningElement, api } from 'lwc';

export default class QuizPageProgressBar extends LightningElement {
    @api total;
    @api completed;

    get progress() {
        return (this.completed * 100) / this.total;
    }

    get getStyle() {
        return `width: ${this.progress}%`;
    }
}