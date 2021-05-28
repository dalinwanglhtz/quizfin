@isTest public class QuizFinUtilityTest {

    @isTest static void should_provide_owner_user_id() {
        UserRole userRole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'QuizFin_Manager' Limit 1];
        Profile adminProfile = [Select Id From Profile Where Name='System Administrator'];
        
        ID cmpUserId;
        Test.startTest();
        cmpUserId = QuizFinUtility.getSiteDefaultOwnerUserId();
        Test.stopTest();
        
        User u = [SELECT Id FROM User WHERE ProfileID = :adminProfile.Id AND UserRoleId = :userRole.Id];
        
        System.assertEquals(u.Id, cmpUserId, 'Should equal to user just created');
    }
}