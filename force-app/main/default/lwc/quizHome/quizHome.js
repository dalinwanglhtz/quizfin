import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class QuizHome extends NavigationMixin(LightningElement) {

    navigateToAttendQuiz(event) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": "/"+event.target.name
            },
        });
    }
}