public class QuizFin {
	@AuraEnabled(cacheable=true)
    public static List<QuizWrapper> getQuizData() {
        List<Quiz__c> quizs = [SELECT Id, Name, Quiz_Category__c, Published__c,
                               (SELECT Id, Question__c, Correct_Answer__c FROM Quiz_Line_Items__r)
                              FROM Quiz__c];
        for(Quiz__c q : quizs) {
            System.debug('Quiz: '+q.Name);
            for(Quiz_Line_Item__c qli : q.Quiz_Line_Items__r) {
                System.debug('Quiz Line Item: '+qli.Question__c);
                List<Quiz_Answer__c> qas = [SELECT Id, Answer_Text__c 
                                           FROM Quiz_Answer__c
                                           WHERE Quiz_Line_Item__c = :qli.Id];
                for(Quiz_Answer__c qa : qas) {
                    System.debug('Quiz Answer: '+qa.Answer_Text__c);
                }
            }
        }
        return null;
    }
    
    public class QuizWrapper {
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
    }
}