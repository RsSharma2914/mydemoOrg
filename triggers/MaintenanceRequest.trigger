trigger MaintenanceRequest on Case (before update, after update) {
    // ToDo: Call MaintenanceRequestHelper.updateWorkOrders
    if(trigger.isAfter){
        if(trigger.isUpdate){
            MaintenanceRequestHelper.updateWorkOrders(Trigger.New,trigger.OldMap);
        }
    }
}