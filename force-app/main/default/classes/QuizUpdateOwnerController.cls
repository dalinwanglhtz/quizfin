public without sharing class QuizUpdateOwnerController {
	@AuraEnabled(cacheable=false)
    public static void updateQuizOwner(ID quizRecordId, ID newOwnerId) {
        Quiz__c q = [SELECT Id, OwnerId FROM Quiz__c WHERE Id = :quizRecordId];
        q.OwnerId = newOwnerId;
        update q;
    }
    
    @AuraEnabled(cacheable=false)
    public static ID getDefaultOwnerUser() { 
        Profile admin = [SELECT Id, Name FROM Profile WHERE Name = 'System Administrator' LIMIT 1];
        UserRole uRole = [SELECT Id, Name FROM UserRole WHERE Name = 'QuizFin Manager'];
        User user = [SELECT Id, Name, UserRoleId FROM User WHERE UserRoleId = :uRole.Id AND ProfileId = :admin.Id LIMIT 1];
        return user.Id;
    }
}