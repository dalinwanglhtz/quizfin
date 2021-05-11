import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateQuizOwner from '@salesforce/apex/QuizUpdateOwnerController.updateQuizOwner';

export default class QuizUpdateOwner extends LightningElement {
    @track error;
    @api recordId;
    defaultUserId = '0052w000006t99qAAA'; // Dale Wang the default owner user

    updateQuiz() {

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
    }

    // Update quiz with new owner
    // dispatch toast event to enclosing Aura component to close modal
    // refresh page after a delay to display new owner, else it will override the toast message
    connectedCallback() {
        this.updateQuiz();
        this.dispatchEvent(new CustomEvent('closequickaction'));
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}