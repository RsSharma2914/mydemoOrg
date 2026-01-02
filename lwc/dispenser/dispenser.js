import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import GUEST_NAME_CHANNEL from '@salesforce/messageChannel/GuestNameEntered__c';
export default class Dispenser extends LightningElement 
{
    nameoftheGuest = null;
    @wire(MessageContext)
    messageContext;
    
    handleChange(event) 
    {
        this.nameoftheGuest = event.detail.value;
        const payload = { 
            guestName: this.nameoftheGuest
          };
          publish(this.messageContext, GUEST_NAME_CHANNEL, payload);
       
    }
}