import { LightningElement } from 'lwc';

export default class QuizHome extends LightningElement {
    userName;
    noWelcome;
    entryAllowed;
    attemptQuiz;
    createQuiz;
    quizData = [];

    handleEnter(event) {
        this.userName = this.template.querySelector('lightning-input').value;
        // Based on username entered, check if this person exist, if so pull data
        if(this.userName == 'Dale Wang') {
            this.entryAllowed = true;
            this.noWelcome = true;
        } else {
            this.userName = 'Welcome to QuizFin '+this.userName;
            this.entryAllowed = false;
            this.noWelcome = false;
        }
        // If not, create new user data
    }

    handleButtonClick(event) {
        const buttonLabel = event.detail.label;
        if(buttonLabel == 'Attend Quiz') {
            this.attemptQuiz = true;
        } else if(buttonLabel == 'Create New Quiz Set') {
            this.createQuiz = true;
        }
        this.entryAllowed = false;
    }

    handleCreate(event) {

        let newQuestion = {
            question: event.detail.question,
            answers: [],
            correctAnswer: event.detail.correct
        }

        event.detail.options.forEach(elem => {
            newQuestion.answers.push({label: elem, value: elem});
        });

        this.quizData.push(newQuestion);

        this.attemptQuiz = true;
        this.createQuiz = false;

    }

    connectedCallback() {
        this.userName = 'Welcome to QuizFin';
    }
}