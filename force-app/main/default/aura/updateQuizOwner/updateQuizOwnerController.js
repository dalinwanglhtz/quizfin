({
    closeAction : function(component, event, helper) {
        var navEvent = $A.get("e.force:navigateToList");
        navEvent.setParams({
            "listViewName": "Recent",
            "scope": "Quiz__c"
        });
        navEvent.fire();

        setTimeout(()=>{
            $A.get("e.force:closeQuickAction").fire();
         },500);
    }
})
