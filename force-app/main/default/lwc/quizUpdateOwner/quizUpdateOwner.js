import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import OWNER_ID_FIELD from '@salesforce/schema/Quiz__c.OwnerId';
import QUIZ_ID_FIELD from '@salesforce/schema/Quiz__c.Id';
import USER_ID_FIELD from '@salesforce/schema/User.Id';

export default class QuizUpdateOwner extends LightningElement {
    @track error;
    @track defaultUserId;
    @api recordId;

    @wire(getRecord, {
        recordId: '0052w000006t99qAAA',
        fields: [USER_ID_FIELD]
    })
    getDefaultUser({
        error,
        data
    }) {
        if(data) {
            console.log('Data: ', data);
            this.defaultUserId = data.fields.Id.value;
            this.updateQuiz();
        } else if(error) {
            this.error = error;
        }
    }

    updateQuiz() {
        console.log('User to be updated: ', this.defaultUserId);
        const fields = {};
       // fields[QUIZ_ID_FIELD.fieldApiName] = this.recordId;
        fields[QUIZ_ID_FIELD.fieldApiName] = 'a012w00000jpZxiAAE';
        fields[OWNER_ID_FIELD.fieldApiName] = this.defaultUserId;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                console.log('Sucessful');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Quiz owner updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.log('Error: ', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}