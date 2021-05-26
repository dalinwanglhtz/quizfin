public with sharing class QuizFinRecordManager {
	@AuraEnabled(cacheable=false)
    public static void createContact(String lastname) {
        Contact newCont = new Contact(LastName=lastname);
        insert newCont;
    }
    
    @AuraEnabled(cacheable=true)
    public static Boolean IsContactExist(String lastname) {
        List<Contact> cons = [SELECT Id FROM Contact WHERE LastName = :lastname];
        return !cons.isEmpty();
    }
}