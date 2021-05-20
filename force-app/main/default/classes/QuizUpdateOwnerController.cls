public without sharing class QuizUpdateOwnerController {
    @TestVisible private static Integer MAX_QUIZLINEITEMS = 12;
    @TestVisible private static Integer MAX_QUIZANSWERS = 4;
    
	@AuraEnabled(cacheable=false)
    public static void updateQuizOwner(ID quizRecordId, ID newOwnerId) {
        checkQuizLineItemsHaveCorrectAnswer(quizRecordId);
        checkQuizNumberOfLineItemsAndAnswers(quizRecordId);
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
    
    private static void checkQuizNumberOfLineItemsAndAnswers(ID quizRecId) {
        List<Quiz_Line_Item__c> qLineItems = [SELECT Id, Question__c FROM Quiz_Line_Item__c WHERE Quiz__c = :quizRecId];
        if(qLineItems.size() > MAX_QUIZLINEITEMS) {
            throw new ValidationException('You cannot create more than '+MAX_QUIZLINEITEMS+' Quiz Line Items.');
        }
        for(Quiz_Line_Item__c qli : qLineItems) {
            List<Quiz_Answer__c> qas = [SELECT Id FROM Quiz_Answer__c WHERE Quiz_Line_Item__c = :qli.Id];
            if(qas.size() > MAX_QUIZANSWERS) {
                throw new ValidationException('You cannot create more than '+MAX_QUIZANSWERS+' quiz answers for line item: '+qli.Question__c);
            }
        }
    }
    
    private class ValidationException extends Exception {}
}