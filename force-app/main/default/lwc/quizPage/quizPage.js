import { LightningElement } from 'lwc';
import * as Data from './quizPage_data';

export default class QuizPage extends LightningElement {
    value = '';
    startIndex = 0;
    endIndex = 1;
    quizData = Data.quizData.slice(this.startIndex, this.endIndex);
}