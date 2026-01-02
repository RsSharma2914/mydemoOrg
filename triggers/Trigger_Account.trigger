trigger Trigger_Account on Account (after update) {
    
    for(Account acc : Trigger.new){
        if(acc.Phone != NULL){
            //AccountTriggerhelper.verifyPhone(acc.Phone);
        }
    }

}