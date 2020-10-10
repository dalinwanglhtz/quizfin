import { LightningElement, api } from 'lwc';

export default class QuizResultsPage extends LightningElement {
    @api totalQuestions;
    @api correct;
    
    get incorrect() {
        return this.totalQuestions - this.correct;
    }
}