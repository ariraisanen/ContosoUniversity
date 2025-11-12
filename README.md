# Contoso University - Migrate and Modernize MicroHack

Welcome to the **Migrate and Modernize MicroHack** workshop repository! This hands-on learning experience is designed for technical professionals and decision-makers who want to accelerate their cloud transformation journey.

## About This Workshop

The Migrate and Modernize MicroHack combines practical guidance with real-world scenarios to help you:

- **Strengthen your security posture** and ensure business continuity across hybrid environments
- **Modernize application development** using AI-powered tools for faster innovation

### Track: Modernize Your Applications with GitHub Copilot

Accelerate innovation by transforming how you build and maintain applications. This track covers:

- **AI-powered Development**: Use GitHub Copilot and GitHub Spec-Kit to write code faster and reduce repetitive tasks
- **Modern App Architecture**: Explore best practices for containerization, microservices, and CI/CD pipelines
- **Hands-on Labs**: Experience real-world scenarios where AI assists in coding and debugging

**Outcome**: Empower your teams to deliver modern, scalable applications with speed and confidence.

## About the Application

Contoso University is an ASP.NET Core Razor Pages web application that demonstrates enterprise patterns for managing a university system, including students, courses, instructors, and departments. This sample application serves as a realistic codebase for practicing modernization techniques.

## Prerequisites

### Mac Prerequisites

- [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) or later
- [Podman](https://podman.io/getting-started/installation) or [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads)
- A code editor ([Visual Studio Code](https://code.visualstudio.com/) recommended with GitHub Copilot extension)

### Windows Prerequisites

- [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) or later
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (with WSL2 backend recommended)
- [Git for Windows](https://git-scm.com/download/win)
- A code editor ([Visual Studio Code](https://code.visualstudio.com/) recommended with GitHub Copilot extension)

## Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ContosoUniversity
```

### Step 2: Start SQL Server Database

#### On Mac

**Using Docker:**

```bash
docker run \
  --platform linux/amd64 \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" \
  -p 1433:1433 \
  --name sql2022 \
  --hostname sql2022 \
  -d \
  mcr.microsoft.com/mssql/server:2022-latest
```

**Using Podman:**

```bash
chmod +x run-sqlserver.sh
./run-sqlserver.sh
```

Or manually:

```bash
podman run \
  --platform linux/amd64 \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" \
  -p 1433:1433 \
  --name sql2022 \
  --hostname sql2022 \
  -d \
  mcr.microsoft.com/mssql/server:2022-latest
```

#### On Windows (using Docker)

Create and run a SQL Server container with PowerShell:

```powershell
docker run `
  -e "ACCEPT_EULA=Y" `
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" `
  -p 1433:1433 `
  --name sql2022 `
  --hostname sql2022 `
  -d `
  mcr.microsoft.com/mssql/server:2022-latest
```

Or with CMD:

```cmd
docker run ^
  -e "ACCEPT_EULA=Y" ^
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" ^
  -p 1433:1433 ^
  --name sql2022 ^
  --hostname sql2022 ^
  -d ^
  mcr.microsoft.com/mssql/server:2022-latest
```

**Note**: The default SA password is `YourStrong@Passw0rd123` (as configured in `appsettings.json`)

### Step 3: Initialize the Database

Navigate to the application directory and run the migrations:

```bash
cd ContosoUniversity
dotnet ef database update
```

If Entity Framework tools are not installed, install them first:

```bash
dotnet tool install --global dotnet-ef
```

### Step 4: Run the Application

```bash
dotnet run
```

The application will start and be available at:
- HTTPS: `https://localhost:7054`
- HTTP: `http://localhost:5054`

(Port numbers may vary - check the console output)

### Step 5: Verify the Setup

Open your browser and navigate to the application URL. You should see the Contoso University home page with navigation to Students, Courses, Instructors, and Departments.

## Managing the SQL Server Container

### Stop the container
```bash
docker stop sql2022
# or with Podman: podman stop sql2022
```

### Start the container
```bash
docker start sql2022
# or with Podman: podman start sql2022
```

### Remove the container
```bash
docker rm sql2022
# or with Podman: podman rm sql2022
```

### View logs
```bash
docker logs sql2022
# or with Podman: podman logs sql2022
```

## Workshop Labs

This repository includes hands-on labs in the [`Labs/`](./Labs/) folder:

### Core Labs
1. **Introduction to Spec-Kit** - Learn GitHub's Spec-Driven Development approach by updating the .NET version
2. **UI Modernization** - Move the UI from Razor Pages to a modern React application
3. **Git Worktrees** - Work on multiple features simultaneously using git worktrees

### Optional Feature Labs
4. **Dockerization** - Containerize the entire application
5. **UI Enhancement** - Modernize the look and feel
6. **Course-Instructor Assignment** - Add instructor assignment functionality
7. **Course Scheduling** - Add date/time management to courses
8. **Course Registration** - Enable student course registration
9. **Semester View** - Create a personalized semester course view

Each lab includes detailed instructions, learning objectives, and expected outcomes.

## Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Verify the SQL Server container is running: `docker ps` or `podman ps`
2. Check the connection string in `ContosoUniversity/appsettings.json`
3. Ensure the SA password matches between the container and connection string

### Port Conflicts

If port 1433 is already in use:
1. Stop any existing SQL Server instances
2. Or modify the port mapping in the container startup command and update `appsettings.json`

### Container Management

To check if your SQL Server container is running:
```bash
docker ps
# or with Podman: podman ps
```

### Migration Issues

If migrations fail:
1. Ensure the database container is running
2. Try: `dotnet ef database drop` (WARNING: This deletes all data)
3. Then: `dotnet ef database update`

## Resources

- [GitHub Spec-Kit Documentation](https://github.com/github/spec-kit)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

## Workshop Agenda

- **09:00 – 09:30**: Welcome & Introduction
- **09:30 – 12:30**: Hack Challenges
- **12:30 – 13:30**: Lunch / Networking
- **13:30 – 16:30**: Hack Challenges
- **16:30 – 17:00**: Wrap-up & Q&A

## Support

If you encounter issues during the workshop, please reach out to the facilitators or open an issue in this repository.

Happy hacking! 🚀
