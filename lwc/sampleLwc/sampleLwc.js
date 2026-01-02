import { LightningElement,track } from 'lwc';
import publishScanQRCodeEvent from "@salesforce/apex/PlatformEventsCls.publishScanQRCodeEvent";

export default class SampleLwc extends LightningElement {

    @track showSpinner = true;
    connectedCallback(){
        publishScanQRCodeEvent()
        .then(result => {
            this.showSpinner = false;
        })
        .catch(error => {
            this.showSpinner = false;
            console.log('@@Error=',JSON.stringify(error));
        })
    }
}