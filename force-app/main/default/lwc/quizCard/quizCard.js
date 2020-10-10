import { LightningElement, api } from 'lwc';

export default class QuizCard extends LightningElement {
    @api cardData;
    @api cardId;
    value = '';

    handleSelect(event) {
        this.value = event.detail.value;
        const optionSelectEvent = new CustomEvent('selectedoption', {detail: {
            value: this.value, 
            index: this.cardId,
            outcome: this.value == this.cardData.correctAnswer,
            correctAnswer: `${this.cardData.correctAnswer}`
        }});
        this.dispatchEvent(optionSelectEvent);
    }

}