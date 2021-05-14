({
    doInit : function(component, event, helper) {
        component.set("v.userId", $A.get( "$SObjectType.CurrentUser.Id" ));
    },

    closeAction : function(component, event, helper) {
        var navEvent = $A.get("e.force:navigateToSObject");
        navEvent.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "detail"
        });
        navEvent.fire();

        setTimeout(()=>{
            $A.get("e.force:closeQuickAction").fire();
         },500);
    }
})