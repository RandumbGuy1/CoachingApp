namespace CoachApi.Application.Configuration;

public static class BundleCatalog
{
    public static readonly Dictionary<string, List<string>> Bundles = new()
    {
        ["build-program"] = ["program-manual", "blueprint", "lite-access"],
        ["nail-nutrition"] = ["hydration-manual", "macro", "lite-access"],
        ["fix-recovery"] = ["sleep-manual", "restore", "lite-access"],
        ["jump-start"] = ["blueprint", "macro", "restore", "setup-call", "lite-access"],
        ["coaching"] = ["coaching-6mo"], 
    };
}