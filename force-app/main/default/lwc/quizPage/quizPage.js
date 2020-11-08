import { LightningElement, api } from 'lwc';
import * as Data from './quizPage_data';

export default class QuizPage extends LightningElement {
    // this variable allQuizData only gets populated when the whole page is loaded, so use connectedCallback
    // instead of using it during variable initialistaion
    @api allQuizData; 
    value = '';
    startIndex = 0;
    endIndex = 1;
    //allQuizes = this.updateIndex(Data.quizData.slice());
    allQuizes;
    quizData;
    results = 0;
    totalQues;
    showResult = false;
    finishButtonLabel = 'Finish';


    getData() {
        let newObj = Object.assign({}, this.allQuizData[0]);
        Data.quizData.push(newObj);
        this.allQuizes = this.updateIndex(Data.quizData.slice());
        this.quizData = this.allQuizes.slice(this.startIndex, this.endIndex);
        this.totalQues = this.allQuizes.length;
    }

    connectedCallback() {
        this.getData();
    }

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