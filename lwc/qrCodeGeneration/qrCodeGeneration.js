import { LightningElement,track } from 'lwc';
import qrcode from './qrcode.js';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled,
} from 'lightning/empApi';

export default class QrCodeGeneration extends LightningElement {
    @track basePath;
    showSpinner = false;
    @track channelName = '/event/Cloud_News__e';
    @track subscription = {};
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;

    connectedCallback(){
        let pagePath = 'https://rohitbagda-dev-ed.my.site.com/DemoProject/s/demo';
        this.basePath = pagePath;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.generateQRCodeLink();
        },3);
        this.handleSubscribe();
        this.registerErrorListener();
    }
    
    generateQRCodeLink() {
        const qrCodeGenerated = new qrcode(0, 'H');
        let strForGenearationOfQRCode  = this.basePath;
        qrCodeGenerated.addData(strForGenearationOfQRCode);
        qrCodeGenerated.make();
        let element = this.template.querySelector(".qrcode2");
        element.innerHTML = qrCodeGenerated.createSvgTag({});
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            console.log('New message received@@@: ', JSON.stringify(response));
            this.handleEventResponse(response);
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
        });
    }

    handleEventResponse(response){
        this.showSpinner = true;
        console.log('New message received:11 ', JSON.stringify(response));
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    disconnectedCallback(){
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }
}