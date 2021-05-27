public with sharing class QuizFinRecordManager {
	@AuraEnabled(cacheable=false)
    public static Contact createContact(String lastname) {
        Contact newCont = new Contact(LastName=lastname);
        insert newCont;
        
        List<Contact> cons = getContactRecord(lastname);
        
        return !cons.isEmpty() ? cons[0] : null;
    }
    
    @AuraEnabled(cacheable=true)
    public static Contact getContact(String lastname) {
        List<Contact> cons = getContactRecord(lastname);
        return !cons.isEmpty() ? cons[0] : null;
    }
    
    @AuraEnabled(cacheable=false)
    public static void createAttendee(Integer correctResponses, Integer numQuestions, ID contactId, ID quizId) {
        List<Quiz_Attendee__c> qaExists = [SELECT Id FROM Quiz_Attendee__c WHERE Quiz__c = :quizId AND Player__c = :contactId];
        if(!qaExists.isEmpty()) return;
        
        Quiz_Attendee__c qa = new Quiz_Attendee__c(
        	Player__c = contactId,
            Quiz__c = quizId,
            Correct_Responses__c = correctResponses,
            Number_of_Questions__c = numQuestions
        );
        
        insert qa;
    }
    
    private static List<Contact> getContactRecord(String lastname) {
        return [SELECT Id, Name, Overall_Quiz_Score__c FROM Contact WHERE LastName = :lastname];
    }
}