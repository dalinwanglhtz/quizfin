import { LightningElement } from 'lwc';
import createContactRecord from '@salesforce/apex/QuizFinRecordManager.createContact';
import getContact from '@salesforce/apex/QuizFinRecordManager.getContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuizPlayer extends LightningElement {
    inputValue;
    contactExist;
    contactRecord;
    error;

    handleClick(event) {
        this.inputValue = this.template.querySelector('lightning-input').value;

        getContact({lastname: this.inputValue})
            .then(result => {
                if(result) {
                    this.contactRecord = result;
                    this.contactExist = true;
                    this.exposeContactId(result.Id);
                } else {
                    this.createContact();
                }
            })
            .catch(err => {
                this.error = err;
            })
    }

    createContact() {
        createContactRecord({lastname: this.inputValue})
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: 'Success',
                    message: 'Player Created',
                    variant: 'success',
                    })
                );
                console.log('Contact record: ', result);
                this.contactRecord = result;
                this.contactExist = true;
                this.exposeContactId(result.Id);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    exposeContactId(contactId) {
        const conEvent = new CustomEvent('conevent', {detail: contactId});
        this.dispatchEvent(conEvent);
    }
}