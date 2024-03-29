@isTest
public class QuizUpdateOwnerControllerTest {

    @testSetup static void setup() {
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
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
    }
    
    @isTest static void should_update_quiz_owner() { 
        UserRole userRole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
        adminUser.UserRoleId = userRole.Id;
        update adminUser;
        
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
    
    @isTest static void should_throw_error_during_quiz_validation() {
        // Create new portal user using admin access
        UserRole userrole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
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
            
            Quiz_Line_Item__c qli = new Quiz_Line_Item__c();
            qli.Question__c = 'Test Question 1';
            qli.Quiz__c = testQuizA.Id;
            insert qli;
            
            Quiz_Answer__c qa = new Quiz_Answer__c();
            qa.Answer_Text__c = 'Test Answer';
            qa.Quiz_Line_Item__c = qli.Id;
            insert qa;
            
            Test.startTest();
            try {
            	QuizUpdateOwnerController.updateQuizOwner(testQuizA.Id, adminUser.Id);    
            } catch(Exception e) {
                System.assertEquals('Please specify correct answer for all your quiz line items.', 
                                    e.getMessage(), 
                                    'Quiz should throw message');
                return;
            }
        	Test.stopTest();
            
            System.assert(false, 'Error was not thrown!');
        }
    }
    
    @isTest static void should_throw_error_when_checking_line_items() {
        // Create new portal user using admin access
        UserRole userrole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
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
            
            Quiz_Line_Item__c qli = new Quiz_Line_Item__c();
            qli.Question__c = 'Test Question 1';
            qli.Quiz__c = testQuizA.Id;
            insert qli;
            
            Quiz_Answer__c qa1 = new Quiz_Answer__c();
            qa1.Answer_Text__c = 'Test Answer 1';
            qa1.Quiz_Line_Item__c = qli.Id;
            insert qa1;
            
			Quiz_Answer__c qa2 = new Quiz_Answer__c();
            qa2.Answer_Text__c = 'Test Answer 2';
            qa2.Quiz_Line_Item__c = qli.Id;
            insert qa2;

			qli.Correct_Answer__c = qa2.Id;
			update qli;
            
            Quiz_Line_Item__c qli1 = new Quiz_Line_Item__c();
            qli1.Question__c = 'Test Question 2';
            qli1.Quiz__c = testQuizA.Id;
            insert qli1;
            
            Quiz_Answer__c qa3 = new Quiz_Answer__c();
            qa3.Answer_Text__c = 'Test Answer 3';
            qa3.Quiz_Line_Item__c = qli1.Id;
            insert qa3;
            
			Quiz_Answer__c qa4 = new Quiz_Answer__c();
            qa4.Answer_Text__c = 'Test Answer 4';
            qa4.Quiz_Line_Item__c = qli1.Id;
            insert qa4;

			qli1.Correct_Answer__c = qa4.Id;
			update qli1;
            
            Test.startTest();
            QuizUpdateOwnerController.MAX_QUIZLINEITEMS = 1;
            try {
            	QuizUpdateOwnerController.updateQuizOwner(testQuizA.Id, adminUser.Id);    
            } catch(Exception e) {
                System.assertEquals('You cannot create more than '+QuizUpdateOwnerController.MAX_QUIZLINEITEMS+' Quiz Line Items.', 
                                    e.getMessage(), 
                                    'Quiz should throw message');
                return;
            }
        	Test.stopTest();
            
            System.assert(false, 'Error was not thrown!');
        }
    }
    
    @isTest static void should_throw_error_when_checking_answers() {
        // Create new portal user using admin access
        UserRole userrole = [Select Id, DeveloperName From UserRole Where DeveloperName = 'CEO' Limit 1];
        User adminUser = [Select Id, UserRoleId From User Where Profile.Name='System Administrator' Limit 1];
        
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
            
            Quiz_Line_Item__c qli = new Quiz_Line_Item__c();
            qli.Question__c = 'Test Question 1';
            qli.Quiz__c = testQuizA.Id;
            insert qli;
            
            Quiz_Answer__c qa1 = new Quiz_Answer__c();
            qa1.Answer_Text__c = 'Test Answer 1';
            qa1.Quiz_Line_Item__c = qli.Id;
            insert qa1;
            
			Quiz_Answer__c qa2 = new Quiz_Answer__c();
            qa2.Answer_Text__c = 'Test Answer 2';
            qa2.Quiz_Line_Item__c = qli.Id;
            insert qa2;

			qli.Correct_Answer__c = qa2.Id;
			update qli;
            
            Quiz_Line_Item__c qli1 = new Quiz_Line_Item__c();
            qli1.Question__c = 'Test Question 2';
            qli1.Quiz__c = testQuizA.Id;
            insert qli1;
            
            Quiz_Answer__c qa3 = new Quiz_Answer__c();
            qa3.Answer_Text__c = 'Test Answer 3';
            qa3.Quiz_Line_Item__c = qli1.Id;
            insert qa3;
            
			Quiz_Answer__c qa4 = new Quiz_Answer__c();
            qa4.Answer_Text__c = 'Test Answer 4';
            qa4.Quiz_Line_Item__c = qli1.Id;
            insert qa4;

			qli1.Correct_Answer__c = qa4.Id;
			update qli1;
            
            Test.startTest();
            QuizUpdateOwnerController.MAX_QUIZANSWERS = 1;
            try {
            	QuizUpdateOwnerController.updateQuizOwner(testQuizA.Id, adminUser.Id);    
            } catch(Exception e) {
                System.assertEquals('You cannot create more than '+QuizUpdateOwnerController.MAX_QUIZANSWERS
                                    +' quiz answers for line item: '+qli.Question__c, 
                                    e.getMessage(), 
                                    'Quiz should throw message');
                return;
            }
        	Test.stopTest();
            
            System.assert(false, 'Error was not thrown!');
        }
    }
}