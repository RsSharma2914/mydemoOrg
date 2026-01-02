public with sharing class MaintenanceRequestHelper {
    
    public static void updateWorkOrders(List<Case> newList,Map<Id,Case> oldMap ) {
         List<Case> toCreate = new List<Case>();
        Set<Id> closedRequestIds = new Set<Id>();

        for (Case req : newList) {
            Case old = oldMap.get(req.Id);
            if (req.Status == 'Closed' && old.Status != 'Closed' &&
                (req.Type == 'Repair' || req.Type == 'Routine Maintenance')) {
                closedRequestIds.add(req.Id);
            }
        }

        if (closedRequestIds.isEmpty()) return;

        // Get all Equipment Maintenance Items related to closed Cases
        List<Equipment_Maintenance_Item__c> emiList = [
            SELECT Id, Maintenance_Request__c, Equipment__r.Maintenance_Cycle__c, Equipment__c
            FROM Equipment_Maintenance_Item__c
            WHERE Maintenance_Request__c IN :closedRequestIds
        ];

        // Group EMIs by Case
        Map<Id, List<Equipment_Maintenance_Item__c>> caseToEMIs = new Map<Id, List<Equipment_Maintenance_Item__c>>();
        for (Equipment_Maintenance_Item__c emi : emiList) {
            if (!caseToEMIs.containsKey(emi.Maintenance_Request__c)) {
                caseToEMIs.put(emi.Maintenance_Request__c, new List<Equipment_Maintenance_Item__c>());
            }
            caseToEMIs.get(emi.Maintenance_Request__c).add(emi);
        }

        // Process each closed Case
        for (Case closedCase : newList) {
            if (!closedRequestIds.contains(closedCase.Id)) continue;

            List<Equipment_Maintenance_Item__c> relatedEMIs = caseToEMIs.get(closedCase.Id);
            if (relatedEMIs == null || relatedEMIs.isEmpty()) continue;

            // Calculate next due date based on shortest maintenance cycle
            Integer shortestCycle = 1000000;
            for (Equipment_Maintenance_Item__c emi : relatedEMIs) {
                if (emi.Equipment__r.Maintenance_Cycle__c != null) {
                    shortestCycle = Math.min(shortestCycle, Integer.valueOf(emi.Equipment__r.Maintenance_Cycle__c));
                }
            }

            if (shortestCycle == 1000000) continue; // No cycle found

            // Create new Case (Routine Maintenance)
            Case newCase = new Case(
                Vehicle__c = closedCase.Vehicle__c,
                Type = 'Routine Maintenance',
                Status = 'New',
                Subject = 'Scheduled Routine Maintenance',
                Date_Reported__c = Date.today(),
                Date_Due__c = Date.today().addDays(shortestCycle)
            );
            toCreate.add(newCase);
        }

        if (!toCreate.isEmpty()) {
            insert toCreate;

            // Create new EMIs for each new Case
            List<Equipment_Maintenance_Item__c> newEMIs = new List<Equipment_Maintenance_Item__c>();

            for (Integer i = 0; i < toCreate.size(); i++) {
                Case oldCase = newList[i];
                Case newCase = toCreate[i];
                List<Equipment_Maintenance_Item__c> oldEMIs = caseToEMIs.get(oldCase.Id);
                if (oldEMIs != null) {
                    for (Equipment_Maintenance_Item__c oldEmi : oldEMIs) {
                        newEMIs.add(new Equipment_Maintenance_Item__c(
                            Maintenance_Request__c = newCase.Id,
                            Equipment__c = oldEmi.Equipment__c
                        ));
                    }
                }
            }

            if (!newEMIs.isEmpty()) {
                insert newEMIs;
            }
        }
        
        
    }        
    
}