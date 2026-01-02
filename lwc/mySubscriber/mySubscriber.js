import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountDetail from '@salesforce/apex/AccountContactController.getAccountDetail';

export default class MySubscriber extends LightningElement {
//Get current page reference, wire it with imported variable.
@wire(CurrentPageReference) pageRef;
@track data = [];
@track error;
@track accountId;

connectedCallback() {
	// subscribe to eventdetails event
	registerListener("eventdetails", this.accDetails, this);
}
 
disconnectedCallback() {
	// unsubscribe from eventdetails event
	unregisterAllListeners(this);
}

accDetails(accountId){
	this.accountId = accountId;
	//call wire method once accoundId is fetched.
	this.Accounts();
}

//Pass accountId to apex & fetch case details 
@wire(getAccountDetail, {accountId: '$accountId'})
    Accounts(result) {
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            console.log('error: '+error);
            this.data = undefined;
        }
    }
}