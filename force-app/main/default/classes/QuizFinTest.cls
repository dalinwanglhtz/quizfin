@isTest
public class QuizFinTest {
    
    @testSetup static void setup() {
        Quiz__c testQuizA = new Quiz__c();
        testQuizA.Name = 'Test Quiz A';
        testQuizA.Quiz_Category__c = 'General';
        testQuizA.Published__c = true;
        insert testQuizA;
        
        Quiz_Line_Item__c quizLineItemA = new Quiz_Line_Item__c();
        quizLineItemA.Question__c = 'What is opposite of dark?';
        quizLineItemA.Quiz__c = testQuizA.Id;
        insert quizLineItemA;
        
        Quiz_Line_Item__c quizLineItemB = new Quiz_Line_Item__c();
        quizLineItemB.Question__c = 'What is your favourite color?';
        quizLineItemB.Quiz__c = testQuizA.Id;
        insert quizLineItemB;
        
        Quiz_Answer__c quizAnswerA = new Quiz_Answer__c();
        quizAnswerA.Answer_Text__c = 'blue';
        quizAnswerA.Quiz_Line_Item__c = quizLineItemA.Id;
        insert quizAnswerA;
        
        Quiz_Answer__c quizAnswerB = new Quiz_Answer__c();
        quizAnswerB.Answer_Text__c = 'Red';
        quizAnswerB.Quiz_Line_Item__c = quizLineItemA.Id;
        insert quizAnswerB;
        
        Quiz_Answer__c quizAnswerC = new Quiz_Answer__c();
        quizAnswerC.Answer_Text__c = 'Light';
        quizAnswerC.Quiz_Line_Item__c = quizLineItemA.Id;
        insert quizAnswerC;
        
        Quiz_Answer__c quizAnswerD = new Quiz_Answer__c();
        quizAnswerD.Answer_Text__c = 'White';
        quizAnswerD.Quiz_Line_Item__c = quizLineItemA.Id;
        insert quizAnswerD;
        
        quizLineItemA.Correct_Answer__c = quizAnswerC.Id;
        update quizLineItemA;
        
        Quiz_Answer__c quizAnswerE = new Quiz_Answer__c();
        quizAnswerE.Answer_Text__c = 'Violet';
        quizAnswerE.Quiz_Line_Item__c = quizLineItemB.Id;
        insert quizAnswerE;
        
        Quiz_Answer__c quizAnswerF = new Quiz_Answer__c();
        quizAnswerF.Answer_Text__c = 'Green';
        quizAnswerF.Quiz_Line_Item__c = quizLineItemB.Id;
        insert quizAnswerF;
        
        Quiz_Answer__c quizAnswerG = new Quiz_Answer__c();
        quizAnswerG.Answer_Text__c = 'Yellow';
        quizAnswerG.Quiz_Line_Item__c = quizLineItemB.Id;
        insert quizAnswerG;
        
        Quiz_Answer__c quizAnswerH = new Quiz_Answer__c();
        quizAnswerH.Answer_Text__c = 'Pink';
        quizAnswerH.Quiz_Line_Item__c = quizLineItemB.Id;
        insert quizAnswerH;
        
        quizLineItemB.Correct_Answer__c = quizAnswerF.Id;
        update quizLineItemB;
    }
    
    @isTest static void should_contain_quiz_data() {
        String lastname = 'Test1';
        List<QuizFin.QuizWrapper> resultQuizzes;
        
        Test.startTest();
        resultQuizzes = QuizFin.getQuizData(lastname);
        Test.stopTest();

        for(QuizFin.QuizWrapper quiz: resultQuizzes) {
            System.assertEquals('Test Quiz A', quiz.name, 'Quiz name should exist');
            for(QuizFin.QuizLineItem qli : quiz.quizli) {
				List<QuizFin.QuizAnswer> qas = qli.quizAnswer;
                System.assertEquals(4, qas.size(), 'Number of quiz answers should be 4');
                System.assertNotEquals(null, qli.correctAnswer, 'Correct Answer should not be null');
        	}
        }
    }
    
    @isTest static void should_get_list_of_attended_quizzes() {
        String lastname = 'Test1';
        Contact con1 = new Contact(LastName=lastname);
        insert con1;
        
        Quiz__c testQuizB = new Quiz__c();
        testQuizB.Name = 'Test Quiz B';
        testQuizB.Quiz_Category__c = 'General';
        testQuizB.Published__c = true;
        insert testQuizB;
        
        Quiz__c testQuizC = new Quiz__c();
        testQuizC.Name = 'Test Quiz C';
        testQuizC.Quiz_Category__c = 'General';
        testQuizC.Published__c = true;
        insert testQuizC;
        
        Quiz_Attendee__c qaB = new Quiz_Attendee__c(
        	Player__c = con1.Id,
            Quiz__c = testQuizB.Id,
            Correct_Responses__c = 1,
            Number_of_Questions__c = 2
        );
        insert qaB;
        
        Quiz_Attendee__c qaC = new Quiz_Attendee__c(
        	Player__c = con1.Id,
            Quiz__c = testQuizC.Id,
            Correct_Responses__c = 1,
            Number_of_Questions__c = 2
        );
        insert qaC;
        
        Set<ID> quizIds;
        Test.startTest();
        quizIds = QuizFin.attendedQuizzes(lastname);
        Test.stopTest();
        
        System.assertEquals(2, quizIds.size(), 'should have two quizzes attended');
        
    }
}