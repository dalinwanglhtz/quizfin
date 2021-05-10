import { LightningElement, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';

export default class QuizSession extends LightningElement {
    @track error;
    @track currUserName;
    loggedOut = true;

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [NAME_FIELD]
    })
    currUser({err, data}) {
        if(err) {
            this.error = err;
        } else if (data) {
            this.currUserName = data.fields.Name.value;
            this.loggedOut = false;
        }
    }

    handleLogout() {
        this.loggedOut = true;
        window.location.replace("https://dalewang-developer-edition.ap16.force.com/quizfin/secur/logout.jsp");
    }
}