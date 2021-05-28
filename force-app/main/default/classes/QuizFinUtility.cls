public class QuizFinUtility {

    public static ID getSiteDefaultOwnerUserId() { 
        Profile admin = [SELECT Id, Name FROM Profile WHERE Name = 'System Administrator' LIMIT 1];
        UserRole uRole = [SELECT Id, Name FROM UserRole WHERE Name = 'QuizFin Manager'];
        User user = [SELECT Id, Name, UserRoleId FROM User WHERE UserRoleId = :uRole.Id AND ProfileId = :admin.Id LIMIT 1];
        return user.Id;
    }
}