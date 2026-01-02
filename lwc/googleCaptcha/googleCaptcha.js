import { LightningElement,track } from 'lwc';
import isVerified from '@salesforce/apex/CaptchaController.isVerified';
import CaptchaHtmlFile from '@salesforce/resourceUrl/GoogleCaptcha';
export default class GoogleCaptcha extends LightningElement {

    @track iframeHeight = 100;
    @track applyBtnClass = 'applyBtn applyDisable';
    @track enabledProceedBtn = false;
    @track CaptchaHtmlFile;
    @track isHuman = false;
    @track iframeStyle = 'border:0px; overflow:hidden;';
    @track showCaptcha = false;
    @track captchaSiteKey = '6Lc-y9opAAAAAOe1vk_S9Rg2weuwoOpJBW1Zjvtt';

    connectedCallback() {
        const component =
        this;
        const template = this.template;
        window.addEventListener('message', function(event) {
            component.listenForMessage(event, template);
        });
        this.showCaptcha = true;
        this.CaptchaHtmlFile = CaptchaHtmlFile+'?sitekey='+this.captchaSiteKey;
    }

    listenForMessage(message,template){
        var eventName = message.data[0];
        var data = message.data[1];
        if(eventName == 'setHeight'){
            this.iframeHeight = data;
        }
        if(eventName === 'success'){
            isVerified({recaptchaResponse:data})
                .then(response=>{
                    if(response == true){
                        this.enabledProceedBtn = true;
                        this.applyBtnClass = 'applyBtn applyEnable';
                        this.isHuman = true;
                    }else{
                        this.applyBtnClass = 'applyBtn applyDisable';
                        this.enabledProceedBtn = false;
                        this.isHuman = false;
                    }
                }).catch(error => {
                    this.applyBtnClass = 'applyBtn applyDisable';
                    this.enabledProceedBtn = false;
                    let message = JSON.stringify(error);
                })
        }else if(eventName === 'failed'){
            this.enabledProceedBtn = false;
            this.isHuman = false;
        }
    }
}