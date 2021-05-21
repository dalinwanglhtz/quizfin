import { LightningElement } from 'lwc';
import QUIZ_DECOR from '@salesforce/resourceUrl/quiz_decor';
import { NavigationMixin } from 'lightning/navigation';

export default class QuizDecor extends NavigationMixin(LightningElement) {
    quizFinLogo = QUIZ_DECOR+'/quizfin_logo.png';

    navigateToHelpPage() {
        this[NavigationMixin.Navigate]({
            "type":"standard__namedPage",
            "attributes": {
                "pageName": "help"
            },
        });
    }
}