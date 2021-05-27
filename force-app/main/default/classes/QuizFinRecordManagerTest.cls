@isTest public class QuizFinRecordManagerTest {

    @isTest static void should_create_contact() {
        String lastname = 'Test1';
        
        Contact newCon;
        Test.startTest();
        newCon = QuizFinRecordManager.createContact(lastname);
        Test.stopTest();
        
        System.assertEquals(lastname, newCon.Name, 'Last name should now be Name of the created contact');
        
    }
    
    @isTest static void should_get_contact() {
        Contact testCon = new Contact(LastName = 'Test1');
        insert testCon;
        
        Contact newCon;
        Test.startTest();
        newCon = QuizFinRecordManager.getContact(testCon.LastName);
        Test.stopTest();
        
        System.assertEquals(testCon.LastName, newCon.Name, 'should get the same contact');
    }
    
    @isTest static void should_create_attendee() {
        Contact con1 = new Contact(LastName = 'Test1');
        insert con1;
        Quiz__c q = new Quiz__c(Name = 'Test Quiz', Quiz_Category__c = 'Movie');
        insert q;
        
        Test.startTest();
        QuizFinRecordManager.createAttendee(1, 2, con1.Id, q.Id);
        Test.stopTest();
        
        List<Quiz_Attendee__c> qas = [SELECT Id FROM Quiz_Attendee__c WHERE Quiz__c = :q.Id AND Player__c = :con1.Id];
        System.assertEquals(1, qas.size(), 'should have one quiz attendee record');
    }
}