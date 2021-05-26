import { LightningElement } from 'lwc';
import createContactRecord from '@salesforce/apex/QuizFinRecordManager.createContact';
import isContactExist from '@salesforce/apex/QuizFinRecordManager.IsContactExist';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuizPlayer extends LightningElement {
    inputValue;
    name;
    error;

    handleClick(event) {
        this.inputValue = this.template.querySelector('lightning-input').value;
        console.log('Valid input: ', this.inputValue);
        isContactExist({lastname: this.inputValue})
            .then(result => {
                if(result) {
                    this.name = this.inputValue;
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
                    message: 'Contact Created',
                    variant: 'success',
                    })
                );
                this.name = this.inputValue;
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
}