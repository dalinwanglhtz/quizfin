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
            qw.quizli = getQuizLineItems(q.Quiz_Line_Items__r);
            qWrapper.add(qw);
        }

        return qWrapper;
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