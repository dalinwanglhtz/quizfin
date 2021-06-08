import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import quizFinPageSelected from '@salesforce/messageChannel/quizFinPageSelected__c';

export default class QuizMenu extends NavigationMixin(LightningElement) {
    subscription = null;
    selectedPage;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                quizFinPageSelected,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        this.selectedPage = message.selected;
    }

    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            "type": "standard__namedPage",
            "attributes": {
                "pageName": 'home'
            },
        });
    }

    handleSelect(event) {
        if(event.detail.name == 'home') {
            this.selectedPage = 'home'; // allows next select updates shade to correct item
            this.navigateToHomePage();
        } else {
            this[NavigationMixin.Navigate]({
                "type": "standard__webPage",
                "attributes": {
                    "url": "/"+event.detail.name
                },
            });
        }
    }
}