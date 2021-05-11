public without sharing class QuizUpdateOwnerController {
	@AuraEnabled(cacheable=false)
    public static void updateQuizOwner(ID quizRecordId, ID newOwnerId) {
        Quiz__c q = [SELECT Id, OwnerId FROM Quiz__c WHERE Id = :quizRecordId];
        q.OwnerId = newOwnerId;
        update q;
    }
}