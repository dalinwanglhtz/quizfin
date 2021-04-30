import { LightningElement, wire } from 'lwc';
import getQuizData from '@salesforce/apex/QuizFin.getQuizData';

export default class QuizView extends LightningElement {
    quizData = [];

    @wire(getQuizData)
    processedQuizData({
        error,
        data
    }) {
        if(data) {
            console.log('Data: ', data);
        } else {
            console.log('error: ', error);
        }
    }

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