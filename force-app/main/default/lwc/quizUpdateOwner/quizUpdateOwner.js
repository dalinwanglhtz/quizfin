import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateQuizOwner from '@salesforce/apex/QuizUpdateOwnerController.updateQuizOwner';
import { getRecord } from 'lightning/uiRecordApi';
import CREATED_BY_ID_FIELD from '@salesforce/schema/Quiz__c.CreatedById';

export default class QuizUpdateOwner extends LightningElement {
    @track error;
    @api recordId;
    @api defaultUserId;
    @api quickAction;
    quizRecord;
    createdBy;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [CREATED_BY_ID_FIELD]
    })
    getQuizRecord({
        error,
        data
    }) {
        if(data) {
            console.log('data: ', data);
            this.quizRecord = data;
            this.createdBy = this.quizRecord.fields.CreatedById.value;
            this.updateQuiz();
        } else if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading quiz',
                    message,
                    variant: 'error',
                }),
            );
        }
    }

    updateQuiz() {

        console.log('Created by: ', this.createdBy);

        if(this.quickAction == 'author' && this.createdBy != this.defaultUserId) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error authoring quiz',
                    message: 'You are not the creator of this quiz! Therefore you cannot author it.',
                    variant: 'error',
                }),
            );
            return;
        }

        updateQuizOwner({
            quizRecordId: this.recordId,
            newOwnerId: this.defaultUserId
        }).then(() => {
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
        this.dispatchEvent(new CustomEvent('closequickaction'));
    }

    // Update quiz with new owner
    // dispatch toast event to enclosing Aura component to close modal
    // refresh page after a delay to display new owner, else it will override the toast message
    // connectedCallback() {
    //     this.updateQuiz();
    //     this.dispatchEvent(new CustomEvent('closequickaction'));
    // }
}