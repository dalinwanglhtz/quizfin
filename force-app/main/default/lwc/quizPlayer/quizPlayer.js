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
        let inputCmp = this.template.querySelector('lightning-input');
        this.inputValue = inputCmp.value;

        if(!this.validateInput(inputCmp)) return;

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

    validateInput(cmp) {
        let proceedFurther = false;
        if(!this.inputValue) {
            cmp.setCustomValidity('Please enter a nickname.');
            cmp.reportValidity();
        } else if(/\s/.test(this.inputValue)) {
            cmp.setCustomValidity('Name should not contain spaces.');
            cmp.reportValidity();
        } else {
            proceedFurther = true;
        }

        return proceedFurther;
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
        const contactData = {
            Id: contactId,
            Name: this.inputValue
        }
        const conEvent = new CustomEvent('conevent', {detail: contactData});
        this.dispatchEvent(conEvent);
    }
}