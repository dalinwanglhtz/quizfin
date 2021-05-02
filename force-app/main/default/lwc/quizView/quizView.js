import { LightningElement, track } from 'lwc';
import getQuizData from '@salesforce/apex/QuizFin.getQuizData';

export default class QuizView extends LightningElement {
    @track quizData = [];
    @track error;
    attemptQuiz;

    handleEnter() {
        if(this.quizData.length > 0) {
            this.attemptQuiz = true;
        }
    }

    connectedCallback() {
        getQuizData()
        .then(result => {
            this.buildQuizData(result[0].quizli);
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.quizData = undefined;
        })
    }

    buildQuizData(data) {
        for(let quizLineItem of data) {
            this.quizData.push(this.buildQuizQuestion(quizLineItem));
        }
    }

    buildQuizQuestion(lineItem) {
        let newQuestion = {
            question: lineItem.question,
            correctAnswer: lineItem.correctAnswer,
            answers: this.buildQuizAnswer(lineItem.quizAnswer)
        }
        return newQuestion;
    }

    buildQuizAnswer(quizAnswers) {
        let answers = [];
        for(let qa of quizAnswers) {
            answers.push({
                label: qa.answerText,
                value: qa.Id
            });
        }
        return answers;
    }
}