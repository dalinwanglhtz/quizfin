import { LightningElement } from 'lwc';
import * as Data from './quizPage_data';

export default class QuizPage extends LightningElement {
    value = '';
    startIndex = 0;
    endIndex = 1;
    allQuizes = this.updateIndex(Data.quizData.slice());
    quizData = this.allQuizes.slice(this.startIndex, this.endIndex);
    results = 0;
    totalQues = this.allQuizes.length;

    nextHandler() {
        if(Data.quizData.length > this.endIndex) {
            this.quizData = this.allQuizes.slice(++this.startIndex, ++this.endIndex);
        }
    }

    previousHandler() {
        if(0 < this.startIndex) {
            this.quizData = this.allQuizes.slice(--this.startIndex, --this.endIndex);
        }
    }

    updateIndex(data) {
        let newArray = data.slice();
        for(let i=0; i<newArray.length; i++) {
            newArray[i].index = i;
        }
        return newArray;
    }

    handleSelectedOption(event) {
        this.allQuizes[event.detail.index].selected = event.detail.value;
        this.calcResults();
    }

    calcResults() {
        let result = 0;
        for(let item of this.allQuizes) {
            result = item.selected == item.correctAnswer ? ++result : result;
        }
        this.results = result;
    }
}