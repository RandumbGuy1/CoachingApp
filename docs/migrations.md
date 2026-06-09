# Modifying the Database

1. Safe changes
- New nullable field on an entity
- New table
- Changing default values

```bash
  dotnet ef migrations add migration_name 
  dotnet ef database update
```

2. Unsafe Changes
- Making a nullable field to unnullable
- Changing a relationship from optional to required (nullable FK to non nullable)
- Changing datatypes but with a possible conversion (int to long)
- Removing a column
- Renaming a property

```bash
# You may need a custom migration to clean up data 
  dotnet ef migrations add fix_entries
  dotnet ef database update

  dotnet ef migrations add migration_name
  dotnet ef database update
```

3. Life ruining Changes
- Changing the PK type (Guid to int)
- Changing required navigations
- Changing table names without mapping
- Changing enum storage type (string to int)
- Massive refactors in general

```bash
  docker compose up -d #make sure container is running first
  dotnet ef database drop --force
  rm -rf Migrations
  dotnet ef migrations add Initial
  dotnet ef database update
```