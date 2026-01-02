public class ContactTriggerHelper {
    public static List<Contact> newCase = new List<Contact>();
    public static List<Contact> oldCase = new List<Contact>();
    public static Map<Id,Contact> newMapofCase = new Map<Id,Contact>();
    public static Map<Id,Contact> oldMapofCase = new Map<Id,Contact>();
    
    public static void copyAirtableUserFieldtoCase(){
        Set<Id> AirtableuserId = new Set<Id>();
        String commaSepratedFields = '';
        String query='';
        Map<Id,Account> mopOfIdToUer = new Map<Id,Account>();
        Map<String,String> mapofUserFieldtoCaseFieldmdt = new Map<String,String>();
        
        for(AccountFieldtoContact__mdt mdt : [Select AccField__c,ContactField__c from AccountFieldtoContact__mdt]){
            mapofUserFieldtoCaseFieldmdt.put(mdt.AccField__c,mdt.ContactField__c);
        }
        
        for(String fieldName : mapofUserFieldtoCaseFieldmdt.keyset()){
            if(commaSepratedFields == null || commaSepratedFields == ''){
                commaSepratedFields = fieldName;
            }else{
                commaSepratedFields = commaSepratedFields + ', ' + fieldName;
            } 
        }
        
        for(Contact c : newCase){
            if(c.AccountId != NULL){
                AirtableuserId.add(c.AccountId);
            }
         }
        query = 'select ' + commaSepratedFields + ' from Account where id IN: AirtableuserId';
        //System.assert(false,query);
        List<Account> airtableUser =Database.query(query);
        
        for(Account u : airtableUser){
            mopOfIdToUer.put(u.id, u);
        }
        
        for(Contact c : newCase){
            if(mopOfIdToUer.containsKey(c.AccountId)){
                Account airtUser = mopOfIdToUer.get(c.AccountId);
                for(String fieldName : mapofUserFieldtoCaseFieldmdt.keyset()){
                    String field = mapofUserFieldtoCaseFieldmdt.get(fieldName);
                    
                    c.put(field,airtUser.get(fieldName));
                    //c.mapofUserFieldtoCaseFieldmdt.get(fieldName) =''; //airtUser.fieldName;
                }
            }
        }
    }


}