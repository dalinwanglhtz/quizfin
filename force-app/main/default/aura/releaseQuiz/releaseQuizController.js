({
    doInit : function(component, event, helper) {
        var p = new Promise($A.getCallback((resolve, reject) => {
            let action = component.get("c.getDefaultOwnerUser");

            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    console.log('returned value: ', response.getReturnValue());
                    component.set("v.defaultUser", response.getReturnValue());
                    resolve('Resolved');
                } else {
                    console.log("Failed with state: ", state);
                    reject('Rejected');
                }
            });
            $A.enqueueAction(action);
        }));

        return p;
    },

    closeAction : function(component, event, helper) {
        console.log('get default user: ', component.get("v.defaultUser"));
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