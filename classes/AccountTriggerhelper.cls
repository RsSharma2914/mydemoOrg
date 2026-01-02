public class AccountTriggerhelper {
    public static List<Account> newAcc = new List<Account>();
    public static List<Account> updateAcc = new List<Account>();
    public static Set<Id> acIds = new Set<Id>();
    public static void getAcc(){
        for(Account ac : newAcc){
            acIds.add(ac.id);
        }
        if(System.IsBatch() == false && System.isFuture() == false){ 
            verifyPhone(acIds);
        }
        
    }
    @future (callout=true)
    public static void verifyPhone(Set<Id> accId){
        try{
            for(Account acc : [Select Phone,isPhoneValid__c from Account Where id In : accId]){
                string apikey='7341142FF37442A890A0A572159A154F';
                String endpoint = 'https://api.veriphone.io/v2/verify?phone=+91'+acc.Phone+'&key='+apikey;
                Http h = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint(endpoint);
                request.setMethod('GET');
                request.setTimeout(60000);
                HttpResponse res = h.send(request);
                verifyPhoneNumber vnumber = (verifyPhoneNumber)JSON.deserialize(res.getBody(), verifyPhoneNumber.class);
                if(vnumber.phone_valid){
                    acc.isPhoneValid__c = true;
                }
                else
                 acc.isPhoneValid__c = false;  
                
                updateAcc.add(acc);
            }    
        }
        catch(System.CalloutException e){
            System.debug('Error-' + e.getMessage());   
        }
        update updateAcc;
    }
 
    
    public class verifyPhoneNumber{
        public string status;
        public string phone;
        public Boolean phone_valid;
        public string phone_type;
        public string phone_region;
        public string country;
        public string country_code;
        public string country_prefix;
        public string international_number;
        public string local_number;
        public string e164;
        public string carrier;
        
    }
    
    

}