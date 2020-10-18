import { LightningElement } from 'lwc';

export default class QuizHome extends LightningElement {
    userName;

    handleEnter(event) {
        this.userName = this.template.querySelector('lightning-input').value;
    }
}