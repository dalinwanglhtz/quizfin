import { LightningElement, api } from 'lwc';

export default class QuizCard extends LightningElement {
    @api cardData;
    value = '';

    handleSelect(event) {
        this.value = event.detail.value;
    }

}