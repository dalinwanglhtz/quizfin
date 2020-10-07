import { LightningElement } from 'lwc';
import * as Data from './quizPage_data';

export default class QuizPage extends LightningElement {
    value = '';
    quizData = Data.quizData;
}