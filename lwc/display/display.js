import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import guestNameChannel from '@salesforce/messageChannel/GuestNameEntered__c';
export default class Display extends LightningElement 
{
    subscription = null;
    nameoftheGuest = null;
    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() 
    {
        console.log('Message: Subscribed');
        this.subscription = subscribe(this.messageContext,
            guestNameChannel,
          (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) 
    {
        this.nameoftheGuest = message.guestName;
    }
    connectedCallback() 
    {
        this.subscribeToMessageChannel();
    }
}