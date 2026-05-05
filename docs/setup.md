# Setting up Local Development

NOTE: If a command is not recognized after installation, ensure it is added to your system PATH.
Then restart your terminal or VS Code.

## One Time Setup

Open a new Terminal Window

1. Install .NET -> https://dotnet.microsoft.com/en-us/download
```bash
    dotnet --version
```
2. Install Node.js -> https://nodejs.org
```bash
    node --version
    npm --version
```

3. Install Angular CLI
```bash
    npm install -g @angular/cli@latest
    ng version
```

4. Install Docker -> https://www.docker.com/products/docker-desktop/
```bash
    docker --version
    docker compose version
```

5. Clone repository from Git into directory -> https://git-scm.com/install/
```bash
    git --version
    git clone <your-repo-url>
```

6. Install VS Code or IDE of choice -> https://code.visualstudio.com/download

## Open up project in VS Code

7. Install EF Core Tools
```bash
    dotnet tool install --global dotnet-ef
    dotnet ef --version
```

8. Create a .env file from the following template
```bash
    cp .env.example .env
```

Make sure to set the following values:
- SA_PASSWORD: Password used by SQL Server container (must match connection string)

//TODO: Figure out why secrets isn't working, maybe find an alternative
11. Initialize User Secrets and Setup the connection string
- User secrets are used to keep sensitive data (like database passwords) out of source control.
- NOTE: Replace <YourPassword> with the SA_PASSWORD you wrote in .env
```bash
    dotnet user-secrets init
    dotnet user-secrets set "ConnectionStrings:DefaultConnection" 'Server=localhost,1433;User ID=SA;Password=<YourPassword>;Trust Server Certificate=True;MultipleActiveResultSets=True;'
```

## Daily Development

12. Run the app

This should be run to ensure the container is running
- NOTE: Don't run this every time you rerun the app
```bash
    docker compose up -d
```

- Hit "F5" and go to http://localhost:4200/

This will automatically:
- Restore .NET packages
- Install npm dependencies
- Start API (Assumes container is running)
- Start Frontend

Do NOT manually run:
- dotnet run
- ng serve
- npm install (after first setup)