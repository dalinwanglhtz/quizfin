import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';

export default class QuizSession extends LightningElement {
    loggedOut;
    userId = Id;

    connectedCallback() {
        if(this.userId != null) {
            this.loggedOut = false;
        } else {
            this.loggedOut = true;
        }
    }

    handleLogout() {
        this.loggedOut = true;
        window.location.replace("https://dalewang-developer-edition.ap16.force.com/quizfin/secur/logout.jsp");
    }
}