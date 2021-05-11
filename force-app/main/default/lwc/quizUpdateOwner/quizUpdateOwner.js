import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import OWNER_ID_FIELD from '@salesforce/schema/Quiz__c.OwnerId';
import QUIZ_ID_FIELD from '@salesforce/schema/Quiz__c.Id';

export default class QuizUpdateOwner extends LightningElement {
    @track error;
    @api recordId;
    defaultUserId = '0052w000006t99qAAA';

    updateQuiz() {
        const fields = {};
        fields[QUIZ_ID_FIELD.fieldApiName] = this.recordId;
        fields[OWNER_ID_FIELD.fieldApiName] = this.defaultUserId;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Quiz released!',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    connectedCallback() {
        this.updateQuiz();
        this.dispatchEvent(new CustomEvent('closeQuickAction'));
    }
}