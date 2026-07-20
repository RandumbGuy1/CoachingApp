# Setting up Local Development

NOTE: If a command is not recognized after installation, ensure it is added to your system PATH. Then restart your terminal or VS Code.

## One Time Setup

Open a new Terminal Window

1. Clone repository from Git into directory -> https://git-scm.com/install/
```bash
  git --version
  git clone https://github.com/RandumbGuy1/CoachingApp.git
```

2. Install VS Code or IDE of choice -> https://code.visualstudio.com/download

## Open up root project folder in VS Code

3. Install .NET -> https://dotnet.microsoft.com/en-us/download
```bash
  dotnet --version
```

4. Install Node.js -> https://nodejs.org
```bash
  node --version
  npm --version
```

5. Install Angular CLI
```bash
  npm install -g @angular/cli@latest
  ng version
```

6. Install Docker -> https://www.docker.com/products/docker-desktop/
```bash
  docker --version
  docker compose version
```

7. Install EF Core Tools & run initial build
```bash
  dotnet tool install --global dotnet-ef
  dotnet ef --version
  dotnet build
```

8. Create a .env file from the following template
```bash
  cp .env.example .env
```

Make sure to set the following values:
- SA_PASSWORD: Password used by SQL Server container (must match connection string)

## Go into the /api folder
```bash
  cd api
```

11. Initialize User Secrets and Setup the connection string
- User secrets are used to keep sensitive data (like database passwords) out of source control.
- NOTE: Replace <YourPassword> with the SA_PASSWORD you wrote in .env
```bash
  dotnet user-secrets init
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" 'Server=localhost,1433;Initial Catalog=CoachDb;User ID=SA;Password=<YourPassword>;Trust Server Certificate=True;MultipleActiveResultSets=True;'
```

- Also make sure to create an atleast 32 character long jwt key
```bash
  dotnet user-secrets set "Jwt:Key" "<YourJwtKey>"
```

- Set the Auth0 client secret (get this from the Auth0 dashboard under Applications → your app)
```bash
  dotnet user-secrets set "Auth0:ClientSecret" "<YourAuth0ClientSecret>"
```

## Daily Development

12. Run the app

Make sure Docker Desktop is open and running before hitting F5.

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