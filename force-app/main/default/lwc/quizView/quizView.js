import { LightningElement, track } from 'lwc';
import getQuizData from '@salesforce/apex/QuizFin.getQuizData';

export default class QuizView extends LightningElement {
    @track quizData = [];
    @track error;
    @track selectableQuizs = [];
    resultData;
    attemptQuiz;
    disabled = true;


    get options() {
        if(!this.resultData) return;

        let categoryOptions = [];
        for(let aQuiz of this.resultData) {
            if(categoryOptions.map(e => e.value).indexOf(aQuiz.category) < 0) { // check for unique category
                categoryOptions.push({
                    label: aQuiz.category,
                    value: aQuiz.category
                });
            }
        }
        return categoryOptions;
    }

    handleCategorySelect(event) {
        let filteredQuizs = this.resultData.filter(q => q.category == event.target.value);
        let sQuizs = [];
        for(let fq of filteredQuizs) {
            sQuizs.push({
                label: fq.name,
                value: fq.Id
            });
        }
        this.selectableQuizs = [...sQuizs];
        if(this.selectableQuizs.length > 0) this.disabled = false;
    }

    handleQuizSelect(event) {
        let thisQuiz = this.resultData.filter(q => q.Id == event.target.value);
        this.buildQuizData(thisQuiz[0].quizli);
        if(this.quizData.length > 0) {
            this.attemptQuiz = true;
        }
    }

    connectedCallback() {
        getQuizData()
        .then(result => {
            this.resultData = [...result];
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.resultData = undefined;
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