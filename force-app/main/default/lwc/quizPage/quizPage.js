import { LightningElement } from 'lwc';
import * as Data from './quizPage_data';

export default class QuizPage extends LightningElement {
    value = '';
    startIndex = 0;
    endIndex = 1;
    allQuizes = this.updateIndex(Data.quizData.slice());
    quizData = this.allQuizes.slice(this.startIndex, this.endIndex);

    nextHandler() {
        if(Data.quizData.length > this.endIndex) {
            this.startIndex += 1;
            this.endIndex += 1;
            this.quizData = this.allQuizes.slice(this.startIndex, this.endIndex);
        }
    }

    previousHandler() {
        if(0 < this.startIndex) {
            this.startIndex -= 1;
            this.endIndex -= 1;
            this.quizData = this.allQuizes.slice(this.startIndex, this.endIndex);
        }
    }

    updateIndex(data) {
        let newArray = data;
        for(let i=0; i<newArray.length; i++) {
            newArray[i].index = i+1;
        }
        return newArray;
    }

    handleSelectedOption(event) {
        this.allQuizes[event.detail.index].selected = event.detail.value;
    }
}