import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateQuizOwner from '@salesforce/apex/QuizUpdateOwnerController.updateQuizOwner';
import getDefaultOwnerUser from '@salesforce/apex/QuizUpdateOwnerController.getDefaultOwnerUser';
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
            this.quizRecord = data;
            this.createdBy = this.quizRecord.fields.CreatedById.value;
            this.updateQuiz();
            this.dispatchEvent(new CustomEvent('closequickaction'));
        } else if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.showErrorToast('Error loading quiz', message);
        }
    }

    updateQuiz() {

        console.log('Default user: ', this.defaultUserId);

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

        if(this.quickAction == 'release') {
            getDefaultOwnerUser()
            .then(data => {
                console.log('returned data: ', data);
                this.defaultUserId = data;
                this.changeOwner();
            })
            .catch(error => {
                console.log('Error getting default user id.');
            });
        } else {
            this.changeOwner();
        }
    }

    changeOwner() {
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
                this.showErrorToast('Error updating record', error.body.message);
            });
    }

    showErrorToast(title, message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: 'error'
            })
        );
    }

}