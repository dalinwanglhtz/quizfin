public without sharing class QuizUpdateOwnerController {
	@AuraEnabled(cacheable=false)
    public static void updateQuizOwner(ID quizRecordId, ID newOwnerId) {
        checkQuizLineItemsHaveCorrectAnswer(quizRecordId);
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
    
    private static void checkQuizLineItemsHaveCorrectAnswer(ID quizRecId) {
        List<Quiz_Line_Item__c> qLineItems = [SELECT Id, Correct_Answer__c FROM Quiz_Line_Item__c WHERE Quiz__c = :quizRecId];
        for(Quiz_Line_Item__c qLineItem : qLineItems) {
            if(qLineItem.Correct_Answer__c == null) {
                throw new ValidationException('Please specify correct answer for all your quiz line items.');
            }
        }
    }
    
    public class ValidationException extends Exception {}
}