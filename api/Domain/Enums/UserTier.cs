namespace CoachApi.Domain.Enums;

public enum UserTier
{
    Pro, //Can create and own unlimited groups, can oversee and modify all relevant data in the group
    Lite, //Can use all app functionality, but cannot create groups.
    Free //Can only view the landing pages and interact with products they paid for.
}
