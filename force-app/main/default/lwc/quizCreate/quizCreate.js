import { LightningElement } from 'lwc';

export default class QuizCreate extends LightningElement {
    qQuestion;
    qOptions = [];
    qCorrect;

    handleCreate() {
        let inputs = this.template.querySelectorAll('lightning-input');
        inputs.forEach(elem => {
            if(elem.name == 'question') {
                this.qQuestion = elem.value;
            } else if(elem.name.includes('option')) {
                this.qOptions.push(elem.value);
            } else {
                this.qCorrect = elem.value;
            }
        });
        const quizCreatedEvent = new CustomEvent('quizcreated', {detail: {
            question: this.qQuestion,
            options: this.qOptions,
            correct: this.qCorrect
        }});
        this.dispatchEvent(quizCreatedEvent);
    } 
}