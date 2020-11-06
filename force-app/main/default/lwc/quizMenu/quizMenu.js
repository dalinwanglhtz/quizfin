import { LightningElement } from 'lwc';

export default class QuizMenu extends LightningElement {

    handleClick(event) {
        const buttonClickLabel = event.target.label;
        const buttonClickEvent = new CustomEvent('buttonclicked', {detail: {
            label: buttonClickLabel,
        }});
        this.dispatchEvent(buttonClickEvent);
    }
}