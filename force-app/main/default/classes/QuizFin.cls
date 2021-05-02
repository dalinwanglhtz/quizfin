public class QuizFin {
	@AuraEnabled(cacheable=true)
    public static List<QuizWrapper> getQuizData() {
        List<QuizWrapper> qWrapper = new List<QuizWrapper>();
        for(Quiz__c q : [SELECT Id, Name, Quiz_Category__c, Published__c,
                        (SELECT Id, Question__c, Correct_Answer__c FROM Quiz_Line_Items__r)
                        FROM Quiz__c
                        WHERE Published__c = true]) {
            QuizWrapper qw = new QuizWrapper();
            qw.Id = q.Id;
            qw.name = q.Name;
            qw.category = q.Quiz_Category__c;
            qw.published = q.Published__c;
            
            List<QuizLineItem> quizli = new List<QuizLineItem>();
            for(Quiz_Line_Item__c qli : q.Quiz_Line_Items__r) {
                QuizLineItem qLineItem = new QuizLineItem();
                qLineItem.question = qli.Question__c;
                qLineItem.correctAnswer = qli.Correct_Answer__c;

                List<QuizAnswer> quiza = new List<QuizAnswer>();
                for(Quiz_Answer__c qa : [SELECT Id, Answer_Text__c 
                                        FROM Quiz_Answer__c
                                        WHERE Quiz_Line_Item__c = :qli.Id]) {
                    QuizAnswer qAnswer = new QuizAnswer();
                    qAnswer.answerText = qa.Answer_Text__c;
                    qAnswer.Id = qa.Id;
                    quiza.add(qAnswer);
                }
                qLineItem.quizAnswer = quiza;
                quizli.add(qLineItem);
            }
            qw.quizli = quizli;
            qWrapper.add(qw);
        }

        return qWrapper;
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