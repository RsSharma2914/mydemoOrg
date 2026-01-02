trigger AccountTrigger on Account (before insert,after Insert,after update) {
 AccountTriggerhelper.newAcc = trigger.new;
    
        if(trigger.isafter){
            if(trigger.isInsert || trigger.isUpdate){
                AccountTriggerhelper.getAcc();
            } 
        } 
    
}