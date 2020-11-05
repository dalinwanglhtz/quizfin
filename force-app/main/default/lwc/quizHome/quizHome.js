import { LightningElement } from 'lwc';

export default class QuizHome extends LightningElement {
    userName;
    entryAllowed;

    handleEnter(event) {
        this.userName = this.template.querySelector('lightning-input').value;
        // Based on username entered, check if this person exist, if so pull data
        if(this.userName == 'Dale Wang') {
            this.entryAllowed = true;
        } else {
            this.entryAllowed = false;
        }
        // If not, create new user data
    }

    connectedCallback() {

    }
}