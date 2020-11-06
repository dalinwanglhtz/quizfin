import { LightningElement } from 'lwc';

export default class QuizHome extends LightningElement {
    userName;
    noWelcome;
    entryAllowed;
    attemptQuiz;
    createQuiz;

    handleEnter(event) {
        this.userName = this.template.querySelector('lightning-input').value;
        // Based on username entered, check if this person exist, if so pull data
        if(this.userName == 'Dale Wang') {
            this.entryAllowed = true;
            this.noWelcome = true;
        } else {
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

    connectedCallback() {

    }
}