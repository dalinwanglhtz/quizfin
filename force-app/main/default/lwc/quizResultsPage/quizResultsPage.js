import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const MESSAGE_TITLE = 'Passed';
const MESSAGE_CONTENT = "Congratulations you've passed the quizes";
const VARIANT_SUCCESS = 'success';
const PASS_MARK = 0.65;
export default class QuizResultsPage extends LightningElement {
    @api totalQuestions;
    @api correct;
    result;
    
    get incorrect() {
        return this.totalQuestions - this.correct;
    }

    // outcomeIcon gets loaded first so score calculation is done here
    get outcomeIcon() {
        this.result = this.correct / this.totalQuestions;
        return this.result > PASS_MARK ? 'action:approval' : 'action:close';
    }

    get score() {
        if(this.result > PASS_MARK) {
            this.showSuccessMessage();
        }
        return this.result;
    }

    showSuccessMessage() {
        const evt = new ShowToastEvent({
            title: MESSAGE_TITLE,
            message: MESSAGE_CONTENT,
            variant: VARIANT_SUCCESS
        });
        this.dispatchEvent(evt);
    }
}