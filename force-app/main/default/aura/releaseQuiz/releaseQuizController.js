({
    doInit : function(component, event, helper) {
        var p = new Promise($A.getCallback((resolve, reject) => {
            let action = component.get("c.getDefaultOwnerUser");

            action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.defaultUser", response.getReturnValue());
                    component.find('quizUpdateOwner').updateQuiz();
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