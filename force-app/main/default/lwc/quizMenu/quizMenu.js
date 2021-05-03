import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class QuizMenu extends NavigationMixin(LightningElement) {

    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            "type": "standard__namedPage",
            "attributes": {
                "pageName": 'home'
            },
        });
    }
}