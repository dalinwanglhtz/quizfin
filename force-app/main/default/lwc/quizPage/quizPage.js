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
    showResult = false;
    finishButtonLabel = 'Finish';

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
        for(let key in newArray) {
            newArray[key].index = key;
        }
        return newArray;
    }

    handleSelectedOption(event) {
        this.allQuizes[event.detail.index].selected = event.detail.value;
        this.calcResults();
    }


    handleFinish() {
        if(this.finishButtonLabel === 'Finish') {
            this.showResult = true;
            this.finishButtonLabel = 'Restart';
        } else {
            this.reloadPage();
        }
    }

    calcResults() {
        this.results = this.allQuizes.reduce((acc, curr) => curr.selected == curr.correctAnswer ? ++acc : acc, 0);
    }

    reloadPage() {
        location.reload();
    }
}