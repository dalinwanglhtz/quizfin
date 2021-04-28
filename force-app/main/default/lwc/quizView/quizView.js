import { LightningElement } from 'lwc';

export default class QuizView extends LightningElement {
    quizData = [];

    connectedCallback() {
        let newQuestion = {
            question: 'What is the best car',
            answers: [
                {label: 'honda', value:'honda'}
            ],
            correctAnswer: 'honda'
        }

        this.quizData.push(newQuestion);
    }
}