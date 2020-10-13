import { LightningElement, api } from 'lwc';

export default class QuizPageProgressBar extends LightningElement {
    @api total;
    @api completed;

    get progress() {
        return `${this.completed}/${this.total}`;
    }

    get getStyle() {
        return `width: ${Math.floor((this.completed * 100) / this.total)}%`;
    }
}