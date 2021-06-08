import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import { publish, MessageContext } from 'lightning/messageService';
import quizFinPageSelected from '@salesforce/messageChannel/quizFinPageSelected__c';

export default class QuizHome extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext;

    navigateToAttendQuiz(event) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": "/"+event.target.name
            },
        });
        this.handlePageSelect(event.target.name);
    }

    handlePageSelect(pageName) {
        const payload = {selected: pageName};
        publish(this.messageContext, quizFinPageSelected, payload);
    }
}