@isTest
public class QuizUpdateOwnerControllerTest {

    @isTest static void should_update_quiz_owner() { 
        // Create new portal user using admin access
        UserRole userrole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
        adminUser.UserRoleId = userRole.Id;
        update adminUser;
        
        System.runAs(adminUser){
			System.debug('Admin User: ' + UserInfo.getUserName());
            System.debug('Admin Profile: ' + UserInfo.getProfileId());
            
            Account a = new Account(Name='Test Account Name');
            insert a;
        
            Contact c = new Contact(LastName = 'Contact Last Name', AccountId = a.id);
            insert c;
        
            User user = new User();
            user.ProfileID = [Select Id From Profile Where Name='QuizFin Manager User'].id;
            user.EmailEncodingKey = 'ISO-8859-1';
            user.LanguageLocaleKey = 'en_US';
            user.TimeZoneSidKey = 'America/New_York';
            user.LocaleSidKey = 'en_US';
            user.FirstName = 'first';
            user.LastName = 'last';
            user.Username = 'test@uniquedomain.com';
            user.CommunityNickname = 'testUser123';
            user.Alias = 't1';
            user.Email = 'no@email.com';
            user.IsActive = true;
            user.ContactId = c.Id;
        
            insert user;
        }
        
        // Now run as portal user
        User u = [SELECT Id FROM User WHERE Username = 'test@uniquedomain.com'];

        System.runAs(u) {
            // The following code runs as user 'u' 
            System.debug('Current User: ' + UserInfo.getUserName());
            System.debug('Current Profile: ' + UserInfo.getProfileId());
            
            Quiz__c testQuizA = new Quiz__c();
            testQuizA.OwnerId = u.Id;
            testQuizA.Name = 'Test Quiz A';
        	testQuizA.Quiz_Category__c = 'General';
        	testQuizA.Published__c = true;
        	insert testQuizA;
            
            Test.startTest();
        	QuizUpdateOwnerController.updateQuizOwner(testQuizA.Id, adminUser.Id);
        	Test.stopTest();
        
            Quiz__c newQuizA = [SELECT Id, OwnerId FROM Quiz__c WHERE Id = :testQuizA.Id];
        	System.assertEquals(adminUser.Id, newQuizA.OwnerId, 'Quiz owner should be the default owner user');
        }
    }
    
    @isTest static void should_get_default_owner_user() { 
        UserRole userRole = [SELECT Id, Name FROM UserRole WHERE Name = 'QuizFin Manager'];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' AND UserRoleId = :userRole.Id Limit 1];
        
		Test.startTest();
        ID receivedId = QuizUpdateOwnerController.getDefaultOwnerUser();
        Test.stopTest();
        
        System.assertEquals(adminUser.Id, receivedId, 'QuizFin Manager with System Admin Profile should be returned');
    }
}