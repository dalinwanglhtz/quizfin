import { LightningElement, track } from 'lwc';
import getQuizData from '@salesforce/apex/QuizFin.getQuizData';

export default class QuizView extends LightningElement {
    @track quizData = [];
    attemptQuiz;

    handleEnter() {
        if(this.quizData.length > 0) {
            this.attemptQuiz = true;
        }
    }

    connectedCallback() {
        getQuizData()
        .then(result => {
            for(let quizLineItem of result[0].quizli) {
                let newQuestion = {
                    question: quizLineItem.question,
                    correctAnswer: quizLineItem.correctAnswer
                }
                newQuestion.answers = [];
                for(let qa of quizLineItem.quizAnswer) {
                    newQuestion.answers.push({
                        label: qa.answerText,
                        value: qa.Id
                    });
                }
                this.quizData.push(newQuestion);
            }
        });
    }
}