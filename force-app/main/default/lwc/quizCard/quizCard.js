import { LightningElement, api } from 'lwc';

export default class QuizCard extends LightningElement {
    @api cardData;
    @api cardId;
    value = '';

    handleSelect(event) {
        this.value = event.detail.value;
        const optionSelectEvent = new CustomEvent('selectedoption', {detail: {
            value: this.value, 
            index: this.cardId
        }});
        this.dispatchEvent(optionSelectEvent);
    }

}