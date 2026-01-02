trigger Trigger_contact on Contact (before insert,before update) {

    ContactTriggerHelper.newCase = trigger.new;
    ContactTriggerHelper.oldCase = trigger.old;
    ContactTriggerHelper.newMapofCase = trigger.newMap;
    ContactTriggerHelper.oldMapofCase = trigger.oldMap;
    
    if(trigger.isbefore){
        if(trigger.isInsert || trigger.isUpdate ){
            ContactTriggerHelper.copyAirtableUserFieldtoCase();
        }
    }
}