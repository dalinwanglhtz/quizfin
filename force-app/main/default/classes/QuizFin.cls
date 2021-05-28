public without sharing class QuizFin {
	@AuraEnabled(cacheable=true)
    public static List<QuizWrapper> getQuizData(String lastname) {
        List<QuizWrapper> qWrappers = new List<QuizWrapper>();
        Set<ID> quizIds = attendedQuizzes(lastname);
        ID siteDefaultUser = QuizUpdateOwnerController.getDefaultOwnerUser();
        for(Quiz__c q : [SELECT Id, Name, Quiz_Category__c, Published__c,
                        (SELECT Id, Question__c, Correct_Answer__c FROM Quiz_Line_Items__r)
                        FROM Quiz__c
                        WHERE Published__c = true AND OwnerId = :siteDefaultUser AND Id NOT IN :quizIds]) {
            QuizWrapper qw = new QuizWrapper();
            qw.Id = q.Id;
            qw.name = q.Name;
            qw.category = q.Quiz_Category__c;
            qw.published = q.Published__c;
            qw.quizli = getQuizLineItems(q.Quiz_Line_Items__r);
            qWrappers.add(qw);
        }

        return qWrappers;
    }

    private static List<QuizLineItem> getQuizLineItems(List<Quiz_Line_Item__c> quizlis) {
        List<QuizLineItem> quizLineItems = new List<QuizLineItem>();
        for(Quiz_Line_Item__c qli: quizlis) {
            QuizLineItem qLineItem = new QuizLineItem();
            qLineItem.question = qli.Question__c;
            qLineItem.correctAnswer = qli.Correct_Answer__c;
            qLineItem.quizAnswer = getQuizAnswers(qli.Id);
            quizLineItems.add(qLineItem);
        }

        return quizLineItems;
    }

    private static List<QuizAnswer> getQuizAnswers(ID quizLineItemId) {
        List<QuizAnswer> quizAnswers = new List<QuizAnswer>();
        for(Quiz_Answer__c qa: [SELECT Id, Answer_Text__c 
                                FROM Quiz_Answer__c
                                WHERE Quiz_Line_Item__c = :quizLineItemId]) {
            QuizAnswer qAnswer = new QuizAnswer();
            qAnswer.answerText = qa.Answer_Text__c;
            qAnswer.Id = qa.Id;
            quizAnswers.add(qAnswer);
        }

        return quizAnswers;
    }
    
    @TestVisible
    private static Set<ID> attendedQuizzes(String lastname) {
        Set<ID> quizIds = new Set<ID>();
        List<Contact> cons = [SELECT Id FROM Contact WHERE LastName = :lastname AND FirstName = null];
        if(!cons.isEmpty()) {
            Contact con = cons[0];
        	List<Quiz_Attendee__c> qas = [SELECT Id, Quiz__c FROM Quiz_Attendee__c WHERE Player__c = :con.Id]; 
            for(Quiz_Attendee__c qa : qas) {
                quizIds.add(qa.Quiz__c);
            }
        }
        
        return quizIds;
    }
    
    public class QuizWrapper {
        @AuraEnabled
        public ID Id {get;set;}
        @AuraEnabled
        public String name {get;set;}
        @AuraEnabled
        public String category {get;set;}
        @AuraEnabled
        public Boolean published {get;set;}
        @AuraEnabled
        public List<QuizLineItem> quizli {get;set;}
    }
    
    public class QuizLineItem {
        @AuraEnabled
        public String question {get;set;}
        @AuraEnabled
        public ID correctAnswer {get;set;}
        @AuraEnabled
        public List<QuizAnswer> quizAnswer {get;set;}
    }
    
    public class QuizAnswer {
        @AuraEnabled
        public String answerText {get;set;}
        @AuraEnabled
        public ID Id {get;set;}
    }
}