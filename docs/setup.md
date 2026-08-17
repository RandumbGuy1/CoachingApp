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
  dotnet ef --version
  dotnet tool install --global dotnet-ef
  dotnet build
```

## Go into the /backend folder
```bash
  cd backend
```

8. Initialize User Secrets
- User secrets are used to keep sensitive data out of source control.

```bash
  dotnet user-secrets init
```

9. Setup User Secrets
- Yes the local password is commited because this is literally only used for securing local devs DB's only

```bash
  dotnet user-secrets set "ConnectionStrings:DefaultConnection" 'Server=localhost,1433;Initial Catalog=CoachDb;User ID=SA;Password=R85ae0a06!;Trust Server Certificate=True;MultipleActiveResultSets=True;'
```

- Set the WorkOS API key (get this from the WorkOS Dashboard)
```bash
  dotnet user-secrets set "WorkOS:ApiKey" "<YourWorkOSApiKey>"
```

- Set the Stripe API key and Webhook Secret (get this from the Stripe Dashboard)
```bash
  dotnet user-secrets set "Stripe:ApiKey" "<YourStripeApiKey>"
  dotnet user-secrets set "Stripe:WebhookSecret" "<YourStripeWebhookSecret>"
```

## Daily Development

10. Run the app

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