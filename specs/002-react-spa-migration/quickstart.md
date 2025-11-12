# Quickstart Guide: React SPA Migration

**Feature**: React SPA Migration with REST API Backend  
**Branch**: `002-react-spa-migration`  
**Date**: 2025-11-12

## Prerequisites

### Backend Requirements

- **.NET 9.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Docker** or **Podman** - For SQL Server container
- **SQL Server** running in container (see Database Setup below)

### Frontend Requirements

- **Node.js 20+ LTS** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** / **pnpm** as alternative

### Verification Commands

```bash
# Verify .NET version
dotnet --version  # Should show 9.0.x

# Verify Node.js version
node --version    # Should show v20.x or higher

# Verify Docker/Podman
docker --version  # or podman --version
```

---

## Database Setup

### Option 1: Using Docker (macOS/Windows/Linux)

```bash
# Navigate to project root
cd /path/to/ContosoUniversity

# Start SQL Server container
./run-sqlserver.sh

# Or manually with docker:
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" \
  -p 1433:1433 --name contoso-sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### Option 2: Using Podman (macOS recommended)

```bash
# Start SQL Server container
podman run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" \
  -p 1433:1433 --name contoso-sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### Verify Database Connection

```bash
# Check container is running
docker ps  # or: podman ps
# You should see: contoso-sqlserver container running

# Test connection (optional - requires sqlcmd)
sqlcmd -S localhost,1433 -U sa -P "YourStrong@Passw0rd123" -Q "SELECT @@VERSION"
```

---

## Backend Setup

### 1. Navigate to Backend Project

```bash
cd ContosoUniversity
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Apply Database Migrations

```bash
# Create/update database schema
dotnet ef database update

# You should see: "Done." after migrations complete
```

**Troubleshooting**:

- If `dotnet ef` is not recognized: `dotnet tool install --global dotnet-ef`
- If connection fails: Verify SQL Server container is running on port 1433

### 4. Build the Backend

```bash
dotnet build
```

### 5. Run the Backend API

```bash
dotnet run
```

**Expected Output**:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 6. Verify Backend is Running

Open browser to:

- **Swagger UI**: https://localhost:7001/swagger
- **API Base URL**: https://localhost:7001/api

Test endpoint:

```bash
curl https://localhost:7001/api/students?pageNumber=1&pageSize=10
```

**Expected Response**: JSON with paginated student data

---

## Frontend Setup

### 1. Navigate to Frontend Project

```bash
# From repository root
cd contoso-university-ui
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Duration**: ~2-3 minutes for first install

### 3. Configure API URL

Create `.env` file in `contoso-university-ui/` directory:

```bash
# .env
VITE_API_URL=https://localhost:7001/api
```

**For production**: Update `VITE_API_URL` to production API domain

### 4. Run Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

**Expected Output**:

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Open Application

Open browser to: **http://localhost:5173**

You should see the Contoso University homepage with navigation to:

- Students
- Courses
- Departments
- Instructors
- Statistics

---

## Testing the Integration

### 1. Backend Health Check

```bash
# Test Students endpoint
curl -k https://localhost:7001/api/students?pageNumber=1&pageSize=5

# Test Courses endpoint
curl -k https://localhost:7001/api/courses?pageNumber=1&pageSize=5

# Test Statistics endpoint
curl -k https://localhost:7001/api/statistics/enrollment-by-date
```

**Note**: `-k` flag ignores self-signed certificate warnings in development

### 2. Frontend Manual Testing

#### Students CRUD Flow:

1. Navigate to **Students** page
2. Click **"Create New Student"**
3. Fill form:
   - First Name: "Test"
   - Last Name: "Student"
   - Enrollment Date: Today's date
4. Click **"Save"** → Should redirect to Students list with success message
5. Click on the new student → Should show details page
6. Click **"Edit"** → Modify first name → Save → Verify changes
7. Click **"Delete"** → Confirm → Student removed from list

#### Courses CRUD Flow:

1. Navigate to **Courses** page
2. Click **"Create New Course"**
3. Fill form:
   - Course Number: 1234
   - Title: "Test Course"
   - Credits: 3
   - Department: Select from dropdown
4. Click **"Save"** → Course appears in list
5. Verify course details, edit, and delete functionality

#### Enrollments Flow:

1. Navigate to a **Student Details** page
2. Click **"Enroll in Course"**
3. Select a course from dropdown
4. Click **"Enroll"** → Enrollment appears in student's enrollment list
5. Click **"Assign Grade"** → Select grade (A-F) → Save
6. Verify grade appears next to enrollment

### 3. Pagination Testing

1. Navigate to Students page
2. Verify pagination controls appear at bottom
3. Click **"Next"** → Page 2 loads with different students
4. Click **"Previous"** → Returns to Page 1
5. Click **"Last"** → Jumps to final page
6. Click **"First"** → Returns to Page 1

### 4. Error Handling Testing

#### Validation Errors:

1. Try creating a student with empty first name
2. Should see error: "First name is required" (appears immediately on blur)

#### Not Found Errors:

1. Manually navigate to: http://localhost:5173/students/999999
2. Should see error: "Student not found with ID 999999"

#### Concurrency Conflict:

1. Open student edit page in two browser windows
2. Edit and save in first window
3. Edit and save in second window
4. Should see error: "Record was modified by another user. Please refresh and try again."

---

## Development Workflow

### Running Both Backend and Frontend

**Terminal 1** (Backend):

```bash
cd ContosoUniversity
dotnet run
# Leave running - listens on https://localhost:7001
```

**Terminal 2** (Frontend):

```bash
cd contoso-university-ui
npm run dev
# Leave running - listens on http://localhost:5173
```

**Terminal 3** (Database - if not already running):

```bash
./run-sqlserver.sh
# Or manually start Docker/Podman container
```

### Hot Reload Development

- **Backend**: Code changes require restart (`Ctrl+C` then `dotnet run`)
- **Frontend**: Changes auto-reload instantly (Vite HMR)

### Stopping Services

```bash
# Stop backend: Ctrl+C in backend terminal

# Stop frontend: Ctrl+C in frontend terminal

# Stop database container:
docker stop contoso-sqlserver  # or: podman stop contoso-sqlserver
```

---

## Build for Production

### Backend

```bash
cd ContosoUniversity
dotnet publish -c Release -o ./publish
```

**Output**: `./publish` directory with compiled binaries

### Frontend

```bash
cd contoso-university-ui
npm run build
```

**Output**: `./dist` directory with static files (HTML, CSS, JS)

**Deploy**: Serve `dist/` folder with any static file server (nginx, Apache, Azure Static Web Apps, etc.)

---

## Troubleshooting

### Backend Issues

**"Unable to connect to SQL Server"**

- Verify container is running: `docker ps` or `podman ps`
- Check port 1433 is exposed: `docker port contoso-sqlserver`
- Verify connection string in `appsettings.json`

**"Could not execute migration"**

- Ensure database container started successfully
- Try: `dotnet ef database drop` then `dotnet ef database update`

**"Port 7001 already in use"**

- Change port in `launchSettings.json` under `Properties/`
- Update frontend `.env` with new port

### Frontend Issues

**"Network Error" or "Failed to fetch"**

- Verify backend is running: https://localhost:7001/swagger
- Check `.env` file has correct `VITE_API_URL`
- Verify CORS is enabled in backend `Program.cs`

**"Module not found" errors**

- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

**SSL Certificate Errors**

- In development, browser may warn about self-signed cert
- Click "Advanced" → "Proceed to localhost" (safe for local dev)

### CORS Issues

**"CORS policy blocked"**

- Verify backend `Program.cs` has:
  ```csharp
  app.UseCors("AllowReactApp");
  ```
- Verify frontend origin (http://localhost:5173) is in allowed origins list
- CORS middleware must be called AFTER `UseRouting()` and BEFORE `UseAuthorization()`

---

## Next Steps

After verifying the setup works:

1. **Explore Swagger UI**: https://localhost:7001/swagger

   - Test API endpoints directly
   - View request/response schemas

2. **Review Code Structure**:

   - Backend: `ContosoUniversity/Controllers/`, `DTOs/`, `Services/`
   - Frontend: `contoso-university-ui/src/components/`, `pages/`, `services/`

3. **Read Lab Instructions**: See `Labs/02-UI-Modernization-React.md`

4. **Customize Styling**: Edit `contoso-university-ui/src/styles/global.css`

5. **Add Features**: Follow constitutional principles and spec-driven development workflow

---

## Useful Commands Reference

### Backend

```bash
dotnet run                          # Start API
dotnet build                        # Build without running
dotnet test                         # Run tests (when added)
dotnet ef migrations add <Name>     # Create new migration
dotnet ef database update           # Apply migrations
dotnet ef database drop             # Drop database
dotnet watch run                    # Run with auto-restart on file changes
```

### Frontend

```bash
npm run dev                         # Start development server
npm run build                       # Build for production
npm run preview                     # Preview production build
npm run lint                        # Run ESLint (if configured)
npm run type-check                  # Run TypeScript compiler check
```

### Database Container

```bash
docker ps                           # List running containers
docker logs contoso-sqlserver       # View SQL Server logs
docker exec -it contoso-sqlserver bash  # Access container shell
docker restart contoso-sqlserver    # Restart container
docker stop contoso-sqlserver       # Stop container
docker start contoso-sqlserver      # Start stopped container
docker rm contoso-sqlserver         # Remove container (data loss!)
```

---

## Additional Resources

- **ASP.NET Core Web API Docs**: https://learn.microsoft.com/aspnet/core/web-api/
- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Documentation**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **Entity Framework Core**: https://learn.microsoft.com/ef/core/

---

**Setup Complete!** 🎉

You should now have:

- ✅ Backend API running on https://localhost:7001
- ✅ Frontend SPA running on http://localhost:5173
- ✅ SQL Server database with seed data
- ✅ Swagger UI for API testing

Ready to build modern university management features!
