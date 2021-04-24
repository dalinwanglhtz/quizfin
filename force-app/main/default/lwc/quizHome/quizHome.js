import { LightningElement } from 'lwc';

export default class QuizHome extends LightningElement {

    handleClick(event) {
        const buttonClickLabel = event.target.label;
        console.log('Button Label: ', buttonClickLabel);
    }
}